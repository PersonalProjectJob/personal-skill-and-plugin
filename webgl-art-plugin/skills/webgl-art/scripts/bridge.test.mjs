import assert from 'node:assert/strict';
import test from 'node:test';
import { createBridge } from '../assets/bridge.mjs';

// Simulates event delivery only; browser postMessage integration is a separate check.
function fixture(overrides = {}) {
  const listeners = new Set();
  const received = [];
  const sent = [];
  const localWindow = {
    addEventListener(type, handler) { assert.equal(type, 'message'); listeners.add(handler); },
    removeEventListener(type, handler) { assert.equal(type, 'message'); listeners.delete(handler); },
  };
  const peerWindow = { postMessage(data, origin) { sent.push({ data: structuredClone(data), origin }); } };
  const allowedIds = new Set(['project-a', 'project-b']);
  const navigation = value => value !== null && typeof value === 'object' &&
    !Array.isArray(value) && Object.keys(value).length === 1 && allowedIds.has(value.itemId);
  const snapshot = value => value !== null && typeof value === 'object' &&
    !Array.isArray(value) && Object.keys(value).length === 2 &&
    Number.isSafeInteger(value.revision) && value.revision >= 0 &&
    Array.isArray(value.items) && value.items.every(navigation);
  const config = {
    localWindow, peerWindow, peerOrigin: 'https://art.example', sessionId: 'instance-1',
    incoming: { NAVIGATE: navigation }, outgoing: { CONTENT_SET: snapshot },
    onMessage: message => received.push(message), ...overrides,
  };
  const bridge = createBridge(config);
  const valid = { channel: 'webgl-art', version: 1, sessionId: 'instance-1',
    type: 'NAVIGATE', payload: { itemId: 'project-a' } };
  const deliver = (data = valid, event = {}) => {
    for (const handler of [...listeners]) handler({ origin: config.peerOrigin, source: peerWindow, data, ...event });
  };
  return { bridge, config, listeners, received, sent, valid, deliver, allowedIds };
}

test('accepts a validated semantic event from the configured peer', () => {
  const f = fixture();
  f.deliver();
  assert.deepEqual(f.received, [{ type: 'NAVIGATE', payload: { itemId: 'project-a' } }]);
});

test('rejects wrong origin and another frame at the same origin', () => {
  const f = fixture();
  f.deliver(f.valid, { origin: 'https://other.example' });
  f.deliver(f.valid, { source: {} });
  assert.equal(f.received.length, 0);
});

test('rejects malformed, unknown, wrong-version and stale-session envelopes', () => {
  const f = fixture();
  for (const data of [null, [], 'NAVIGATE', 1, {},
    { ...f.valid, channel: 'other' }, { ...f.valid, version: 2 },
    { ...f.valid, sessionId: 'old' }, { ...f.valid, type: 'DELETE' },
    { ...f.valid, type: 'toString' }, { ...f.valid, type: 'CONTENT_SET' }]) f.deliver(data);
  assert.equal(f.received.length, 0);
});

test('rejects invalid payloads and removed navigation IDs', () => {
  const f = fixture();
  for (const payload of [null, [], {}, { itemId: 'missing' },
    { itemId: 'project-a', href: 'javascript:bad()' }]) f.deliver({ ...f.valid, payload });
  f.allowedIds.delete('project-a');
  f.deliver();
  assert.equal(f.received.length, 0);
  f.allowedIds.add('project-a');
  f.deliver();
  assert.equal(f.received.length, 1);
});

test('sends validated empty snapshots with exact target origin and envelope', () => {
  const f = fixture();
  const payload = { revision: 3, items: [] };
  assert.equal(f.bridge.send('CONTENT_SET', payload), true);
  assert.deepEqual(f.sent, [{ origin: 'https://art.example', data: {
    channel: 'webgl-art', version: 1, sessionId: 'instance-1', type: 'CONTENT_SET', payload,
  } }]);
});

test('outgoing direction and payload errors do not post a message', () => {
  const f = fixture();
  assert.throws(() => f.bridge.send('NAVIGATE', { itemId: 'project-a' }), TypeError);
  assert.throws(() => f.bridge.send('CONTENT_SET', { revision: -1, items: [] }), TypeError);
  assert.equal(f.sent.length, 0);
});

test('destroy is idempotent and prevents even an already captured callback', () => {
  const f = fixture();
  const callback = [...f.listeners][0];
  f.bridge.destroy();
  f.bridge.destroy();
  callback({ origin: f.config.peerOrigin, source: f.config.peerWindow, data: f.valid });
  f.deliver();
  assert.equal(f.listeners.size, 0);
  assert.equal(f.bridge.send('CONTENT_SET', { revision: 4, items: [] }), false);
  assert.equal(f.received.length, 0);
  assert.equal(f.sent.length, 0);
});

test('schema exceptions and non-boolean truthy results are rejected', () => {
  for (const validator of [() => { throw new Error('bad input'); }, () => 'yes']) {
    const f = fixture({ incoming: { NAVIGATE: validator }, outgoing: { NAVIGATE: validator } });
    assert.doesNotThrow(() => f.deliver());
    assert.equal(f.received.length, 0);
    assert.throws(() => f.bridge.send('NAVIGATE', {}), TypeError);
  }
});

test('configuration rejects wildcard/opaque origins and missing protocol identity', () => {
  for (const peerOrigin of ['*', 'null', 'file:///test', 'https://art.example/path', 'https://art.example/']) {
    assert.throws(() => fixture({ peerOrigin }), TypeError);
  }
  for (const override of [{ sessionId: '' }, { channel: '' }, { version: 0 },
    { version: 1.5 }, { incoming: { NAVIGATE: true } }, { onMessage: null }]) {
    assert.throws(() => fixture(override), TypeError);
  }
});

test('postMessage transport failures remain observable', () => {
  const problem = new Error('transport unavailable');
  const f = fixture({ peerWindow: { postMessage() { throw problem; } } });
  assert.throws(() => f.bridge.send('CONTENT_SET', { revision: 0, items: [] }), error => error === problem);
});
