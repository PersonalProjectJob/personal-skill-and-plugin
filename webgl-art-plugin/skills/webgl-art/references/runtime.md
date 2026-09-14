# Runtime and semantic HTML

## Separate the page from the artwork

Use a stable HTML container with a poster or CSS background and a canvas layer. Give the container a deliberate aspect ratio or responsive height. Keep decorative canvas hidden from assistive technology and non-focusable; keep readable content and controls as sibling HTML. Interactive artwork needs an accessible name, instructions and equivalent HTML controls or information appropriate to its purpose.

Render important content without waiting for assets, shader compilation or a successful GPU context. Keep initial server and client markup compatible in SSR applications; browser-only imports and graphics setup belong behind the framework's client lifecycle. A client-rendered application can keep its existing shell; do not claim it provides no-JavaScript content unless verified.

Load only the graphics code/assets needed by the active scene. Prioritize an above-the-fold poster when it is critical content; defer artwork below the fold. Catch import, context creation, shader and asset errors, retain the fallback, and report through the project's logger. Do not leave a loading overlay covering the primary action.

## One owner, one scheduler

For a nontrivial scene, use a small framework-neutral controller with operations equivalent to `resize`, `setInputs`, `setQuality`, `pause`, `resume`, `renderOnce` and `dispose`. Adapt to the existing engine rather than imposing this interface on a tiny effect. The host owns lifecycle and semantic controls; the controller owns GPU state and frame scheduling.

Continuous rendering is permitted only when mounted, visible, on screen, motion permitted and not manually paused. Keep these reasons as separate state so scrolling back on screen cannot override a user's pause. A static scene renders on invalidation instead. Repeated resume calls must not create extra loops. Reset the frame timestamp on resume and bound simulation delta to prevent a jump after backgrounding.

Coalesce resize, pointer and scroll updates; read layout outside the render hot path. Use container dimensions, not only window size. Normalize pointer coordinates against the canvas rectangle, account for zero-sized containers, and keep per-frame values out of framework state. Resize backing storage only when dimensions change; use capped render scale and integer buffer sizes, checking browser zoom and fractional display scaling. Observe the container and clean up its observers.

## GPU cost and ownership

Reuse buffers and materials; batch repeated objects. Avoid synchronous readbacks or repeated capability queries in the frame loop. Reduce full-screen fragment work and transparent overdraw before assuming polygon count is the problem. Query required capabilities at initialization and select a supported path. Compressed downloads do not describe decoded GPU memory use. These practices follow [MDN's WebGL guidance](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices).

With Three.js, removing a mesh does not release its owned geometry, material or texture. Dispose owned resources, render targets, controls and the renderer at final teardown; clear references and stop media sources. Shared cached resources belong to their cache owner and must not be disposed by one consumer while others still use them. Renderer memory counters may retain internal resources: compare trends after equivalent cycles, not an assumed absolute zero. See [Three.js disposal](https://threejs.org/manual/en/how-to-dispose-of-objects.html).

Also cancel animation callbacks, disconnect observers, remove DOM/media-query listeners and cancel or invalidate pending work. If an asset arrives after teardown, release its resources rather than attaching it to a destroyed scene. Disposal should tolerate a partially initialized scene and repeated calls.

## Failure and preference handling

On context loss, stop rendering and reveal the existing fallback. If implementing restoration, prevent the loss event's default behavior to permit restoration, listen for restoration, recreate GPU resources, and resume only under the current visibility/motion policy. Otherwise stay on the fallback. Avoid automatic reload loops. See [context loss events](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/webglcontextlost_event).

Read `prefers-reduced-motion` before starting nonessential animation and respond to changes. Implement the behavior in JavaScript as well as CSS: hiding the canvas alone does not stop its work. Prefer a poster or one static frame. See [reduced-motion guidance](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/%40media/prefers-reduced-motion).

Feature-detect optional data-saving hints when useful, but do not depend on them or use user-agent strings as GPU benchmarks. A manual quality choice and measured adaptation must work without those hints. OffscreenCanvas/workers are an optional response to demonstrated main-thread pressure, with feature detection and a main-thread fallback; they do not remove GPU cost.
