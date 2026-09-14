# Independent HTML experience and application host

## Select the boundary deliberately

| Mode | Fits | Tradeoff |
| --- | --- | --- |
| Standalone HTML + ES modules | Public artistic site that can function without an application shell | Provide real links, public content and optional application loading; own DOM updates directly |
| Persistent HTML iframe + React/Angular host | Authored full-document experience, strong CSS separation, infrequent semantic messages, detail pages over a preserved scene | Own bridge, focus, history and two loading boundaries; retained GPU resources cost memory |
| Canvas controller inside the component tree | Tight integration with forms, shared layout or frequent semantic UI updates | Deliberately isolate graphics updates from framework rendering and route teardown |

Choose iframe mode readily for a cinematic portfolio with an independent document, but do not impose it on every shader or dashboard widget. The iframe has its own document and JavaScript realm. Same-origin frames can share execution with their parent: heavy host tasks can still delay graphics. Workers are a separate choice for demonstrated CPU pressure. See [JavaScript execution](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Execution_model).

An Angular/React host that creates the iframe still downloads and starts its own code. To defer the framework, make the HTML experience the initial document and load application functionality separately. Measure actual parent and child requests, not only one bundler's chunks. CSS isolation comes from separate documents; sandbox flags govern permissions, not frame rate.

## Four responsibilities

Use four small boundaries as the experience grows. These are responsibilities, not a requirement to create four packages or a generic plugin platform.

| Owner | Owns | Does not own |
| --- | --- | --- |
| Application host adapter | Router/history, CMS normalization, auth, public data projection, consent and analytics | Shader time, camera interpolation, individual frame updates |
| HTML experience | Semantic content, responsive layout, local scroll/filter state, accessibility and standalone links | Backend SDK, application tokens, copied framework stores |
| Scene controller | GPU assets, effects, inputs, quality policy, render and teardown | Business routes or CMS-specific field names |
| Bridge | Validated semantic messages between the two documents | Per-frame vectors, arbitrary commands, raw database entities |

An expandable source tree can separate an HTML entry, styles, a content adapter, bridge schema, runtime controller, scene modules and asset manifest. Resolve paths relative to the deployed entry/module; test a non-root deployment path if supported. A build may package these into one document for portability. Do not maintain separate edited copies of the same renderer in HTML and TSX.

## Content contract and extension points

Define a public `ExperienceContent` model appropriate to the site: schema version, locale, site identity, sections and keyed items with stable IDs, labels, category, media and navigation intent. Normalize backend DTOs in the host adapter. Do not pass complete CMS settings, drafts, credentials or client objects into a public child document.

- Bind each item's title, media, category and action to the **same ID**. Patch by ID; insertion, deletion, reordering and filtering must not leave old click handlers pointing to a different project.
- Build the visible list from data. If the design deliberately limits it, name that limit and give omitted items a usable destination instead of silently truncating to the number of authored cards.
- Distinguish no data yet from an intentionally empty array, and missing fields from explicit clearing. A newer empty snapshot removes stale cards; it must not silently restore an old cache.
- Keep backend caching in the host. The child may persist view position and a versioned public fallback when required, but must have explicit freshness rules and namespaced storage keys. Do not create a second domain source of truth by reading the host's localStorage internals.
- Change theme through bounded CSS variables and semantic scene settings; change content through the content model. These changes should not reload the document or rebuild all GPU resources.
- To add a scene, implement the existing controller lifecycle and register its capabilities/assets. Add abstraction only where at least two real scenes share behavior; keep unique art direction local to the scene.
- Update DOM using text nodes and validated URLs. If rich HTML is a requirement, sanitize it with the project's supported sanitizer; schema validation and a trusted CMS origin do not make interpolated innerHTML safe.

The host resolves navigation intent through its route registry. Do not derive routes or enum values by uppercasing arbitrary IDs. The same content should also carry a usable standalone URL or equivalent route resolver: a top-level HTML document cannot rely exclusively on window.parent messages to navigate.

## Persistent scene lifecycle

Place the iframe owner above temporary detail routes/overlays. Give it stable identity, source and key. Loading data, switching locale or changing a filter must not recreate it. Permanence is bounded to that experience: leaving it, changing tenants or choosing a different site may require teardown.

Use states equivalent to loading, active, paused-warm, fallback and disposed:

1. Install the message listener before navigation; keep fallback content until the child reports real readiness.
2. On opening a detail page, mark the frame inactive and send host visibility/occlusion state. Pause graphics **and auxiliary** animations/media while keeping the scene and GPU allocations available.
3. Make the covered iframe non-interactive for keyboard as well as pointer input. Use a supported inert/focus strategy and move focus to the detail heading. Opacity and aria-hidden alone do not remove keyboard focusability. Restore focus to the originating control on return.
4. On return, remove host occlusion, restore view state and resume only if page visibility, reduced-motion policy and manual pause also permit it. Reset timing and adaptation samples after a pause. Keep resume idempotent and own the scheduled callback ID so a pending callback cannot create a second loop.
5. On final disposal, cancel all callbacks/listeners and release owned GPU resources. If discarding a retained document to save memory, record only the minimal serializable view state and reconstruct explicitly when needed.

A hidden iframe can retain memory and keep running. Its document visibility follows the parent tab rather than overlay occlusion, so it needs the host signal. See [Page Visibility](https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API). Context retention reduces repeated initialization but cannot prevent context loss from device pressure; retain the recovery path.

## Progressive failure

Start the content adapter, navigation and bridge independently of successful WebGL boot. Missing libraries, failed shaders and context loss must not disable language controls or all project links. Distinguish document load, bridge ready, content applied and first successful visual frame. Use a bounded startup timeout that shows a usable fallback; avoid unlimited reconnect/reload loops.

For cross-origin embedding, decide asset/CSP policy, allowed host origins, storage assumptions, resize messages, font delivery and focus behavior explicitly. Do not add permissive iframe capabilities merely because a reference site had them. Keep third-party engine licenses and pin the actual delivered version.
