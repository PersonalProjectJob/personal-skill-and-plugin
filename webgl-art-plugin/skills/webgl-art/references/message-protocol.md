# Message bridge contract

Use infrequent semantic events. Rendering time, cursor positions and simulation buffers stay local. Choose names that fit the application; the example vocabulary below is not a public standard.

## Envelope and source checks

The optional [bridge starter](../assets/bridge.mjs) uses this envelope:

```js
{ channel: 'webgl-art', version: 1, sessionId, type, payload }
```

Create a distinct session ID for each mounted experience and replace it when its document intentionally navigates/reloads. IDs correlate a document incarnation; they are not secrets or authentication. Keep this ID and src stable across ordinary host renders. Pass initial configuration through an application-controlled URL fragment or another explicit bootstrap mechanism; never trust an arbitrary parentOrigin from user input. Validate it against deployment configuration.

Check exact origin and window identity before decoding a message. On the host the expected source is the current iframe.contentWindow; on the child it is window.parent. Validate channel, supported version, session, allowed message type and its full payload. Reject unsolicited types, stale sessions and invalid payloads without navigating or mutating state. Send using a configured exact targetOrigin, not `*`. See [postMessage](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage).

The starter deliberately supports only non-opaque HTTP(S) origins. For sandboxed opaque origins, use a separately designed transport such as an explicitly transferred MessagePort with a trusted bootstrap; do not weaken its origin checks or assume `null` identifies a trusted sender. A same-origin scripted iframe with both allow-scripts and allow-same-origin is not a security boundary for untrusted content. See [iframe sandbox](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/iframe).

## Directions and readiness

| Direction | Example | Semantics |
| --- | --- | --- |
| Child to host | BRIDGE_READY | Receiver installed; supported capabilities; not a claim of completed graphics |
| Host to child | CONTENT_SET | Validated full public snapshot with increasing revision and explicit empty values |
| Host to child | HOST_STATE_SET | Current active/occluded state, locale, requested quality and optional manual pause |
| Child to host | CONTENT_APPLIED | Accepted revision; emitted after content and actions agree |
| Child to host | VISUAL_READY / FALLBACK | First successful visual frame or usable fallback, with the content revision when relevant |
| Child to host | NAVIGATE | Stable item ID/navigation intent; host maps only known destinations |
| Child to host | ANALYTICS | Allowlisted event and bounded parameters; host applies consent and deduplicates where required |

Install the host listener before assigning/navigating iframe src. Register child content/bridge code before GPU initialization. BRIDGE_READY starts synchronization: send the latest snapshot and current host state, even if the overlay opened during loading. Coalesce intermediate snapshots rather than queueing every CMS refresh. Compare revisions within the current session; ignore stale or duplicate snapshots and acknowledge accepted ones. Revision/session state is implemented above the starter, not inside it.

Handle an unexpected iframe load as a new incarnation: tear down the old endpoint and re-bootstrap with a fresh session, or fail to the fallback. A WindowProxy can survive navigation, so window identity alone is insufficient. Prefer one bounded handshake timeout and an explicit retry action; do not use iframe load as visual readiness, and do not create infinite BRIDGE_READY/content echo cycles.

Changes to a protocol version require coordinating both ends. Optional capabilities can be additive, but missing essential capabilities should select a fallback rather than sending unsupported commands. Namespace analytic events and content schemas separately from transport version when their evolution differs.

## Optional starter use

The module is browser-side ESM with no module-level window access. Copy it through the project's normal asset/build pipeline when its boundary fits. It is a transport helper, not a complete host component, schema library or render engine.

Supply independent incoming/outgoing validator maps. Validators must be pure, synchronous and return true only for a fully checked payload. Use the project's schema library when available. The following validator is intentionally for navigation only:

```js
const knownIds = new Set(content.items.map(item => item.id));
const isNavigation = value =>
  value !== null && typeof value === 'object' && !Array.isArray(value) &&
  Object.keys(value).length === 1 &&
  typeof value.itemId === 'string' && knownIds.has(value.itemId);
```

Create the endpoint by passing localWindow, peerWindow, peerOrigin, sessionId, incoming, outgoing and onMessage to createBridge. Rebuild validators when their semantic allowlist changes, or have them read the current validated registry without recreating the iframe. The host handles accepted navigation through its router; the child sends navigation intents without knowing React or Angular.

`send(type, payload)` validates outgoing data, posts to the exact configured origin and returns true; invalid messages throw. After `destroy()`, incoming delivery is disabled and send returns false. Underlying postMessage errors, such as non-cloneable data, remain visible. The helper has no automatic retry, serialization size limit, authentication, revision ordering or schema migration. Bound content sizes and emission frequency at the application boundary; never send on every frame.

Behavioral checks: `node --test scripts/bridge.test.mjs` from the skill directory. They exercise the actual helper using simulated Window endpoints; they do not prove browser delivery, iframe readiness, GPU pausing or application navigation. Verify those in the target browser after integrating.
