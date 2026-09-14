// Optional transport starter. See references/message-protocol.md in the skill.
const isRecord = value => value !== null && typeof value === 'object' && !Array.isArray(value);

function validatorMap(value) {
  if (!isRecord(value)) throw new TypeError('Expected a message validator map');
  const entries = Object.entries(value);
  if (entries.some(([type, validate]) => !type || typeof validate !== 'function')) {
    throw new TypeError('Message types require synchronous payload validators');
  }
  return new Map(entries);
}

function accepts(validators, type, payload) {
  if (typeof type !== 'string' || !validators.has(type)) return false;
  try {
    return validators.get(type)(payload) === true;
  } catch {
    // Malformed input must not escape the boundary via a schema exception.
    return false;
  }
}

export function createBridge({
  localWindow,
  peerWindow,
  peerOrigin,
  sessionId,
  channel = 'webgl-art',
  version = 1,
  incoming,
  outgoing,
  onMessage,
}) {
  const url = new URL(peerOrigin);
  if (!['http:', 'https:'].includes(url.protocol) || url.origin !== peerOrigin) {
    throw new TypeError('peerOrigin must be an exact, non-opaque HTTP(S) origin');
  }
  if (typeof sessionId !== 'string' || !sessionId || typeof channel !== 'string' || !channel ||
      !Number.isSafeInteger(version) || version < 1) {
    throw new TypeError('A session ID, channel and positive protocol version are required');
  }
  if (!localWindow || typeof localWindow.addEventListener !== 'function' ||
      typeof localWindow.removeEventListener !== 'function' ||
      !peerWindow || typeof peerWindow.postMessage !== 'function' ||
      typeof onMessage !== 'function') {
    throw new TypeError('Window endpoints and an onMessage callback are required');
  }
  const receivers = validatorMap(incoming);
  const senders = validatorMap(outgoing);
  let closed = false;

  function receive(event) {
    if (closed || event.origin !== peerOrigin || event.source !== peerWindow) return;
    const data = event.data;
    if (!isRecord(data) || data.channel !== channel || data.version !== version ||
        data.sessionId !== sessionId || !accepts(receivers, data.type, data.payload)) return;
    onMessage({ type: data.type, payload: data.payload });
  }

  localWindow.addEventListener('message', receive);
  return Object.freeze({
    send(type, payload) {
      if (closed) return false;
      if (!accepts(senders, type, payload)) throw new TypeError('Invalid outgoing message');
      peerWindow.postMessage({ channel, version, sessionId, type, payload }, peerOrigin);
      return true;
    },
    destroy() {
      if (closed) return;
      closed = true;
      localWindow.removeEventListener('message', receive);
    },
  });
}
