# React bridge

Use [frontend-developer](../../frontend-developer/SKILL.md) for applicable React/TSX project conventions. Preserve the actual application's state, routing, CSS and data boundaries. Check installed React, Three.js and any renderer peer compatibility before adding packages. Choose one of the following rendering ownership models for a scene.

## Persistent HTML iframe host

For an independent full-document experience, read [HTML and host architecture](html-host-architecture.md) and [message protocol](message-protocol.md). React owns the stable iframe and semantic messages; the child owns graphics. Do not also initialize an imperative renderer in the React host.

Place the owner outside the route element that is replaced by a case-study overlay. Use a stable src/key/session; keep the current content and activity in refs or appropriately scoped subscriptions for the bridge. Subscribe only to host state used by this surface, rather than rerendering it for every store update. Separate effects for transport lifetime and validated snapshot updates; detach listeners symmetrically under Strict Mode. Parent listener readiness must precede child navigation, including fast cached loads.

On overlay open, send inactive/occluded host state and manage keyboard focus. On return, send active state without remounting the iframe. Do not let a late readiness callback reactivate an already covered scene. onLoad means document navigation occurred, not that the child rendered successfully. A boundary around the host does not catch exceptions inside the child document; use explicit ready/fallback/error messages and a timeout. The child should also run directly with functional links and a public data source or fallback.

## Imperative WebGL or Three.js

Render semantic content and a stable canvas ref. Create the controller in a client effect, and clean it up when the owner unmounts or the scene identity changes. Use refs for animation values; update React state for meaningful UI transitions, not frames. Separate renderer setup from setting updates so changing a color or pointer position does not rebuild the context.

Development Strict Mode intentionally runs an extra setup/cleanup cycle. Handle that with symmetric teardown, rather than disabling Strict Mode or setting a global initialization flag. Preserve effect dependency correctness; stale closures are not a performance optimization. See [React effects](https://react.dev/reference/react/useEffect).

For lazy imports or asset loads, keep the effect callback synchronous and start an inner async operation. On cleanup, invalidate that operation; after each await, check whether its owner still exists. Abort supported loads and dispose late resources. Keep the poster until the first successful frame and handle async failures explicitly: a React error boundary alone does not catch arbitrary promise or frame callback errors.

In an SSR framework, isolate graphics behind its client boundary and avoid browser-dependent module initialization. Keep the semantic shell available before hydration. Do not assume that adding a client directive makes every imported module safe for server evaluation.

## React Three Fiber, when already suitable

Let R3F own the canvas renderer and frame loop; do not add a second requestAnimationFrame scheduler for the same scene. Use `useFrame` for incremental animation and refs for object updates. Avoid `setState` in the render loop, and reuse scratch objects rather than allocating each frame. See [R3F performance pitfalls](https://github.com/pmndrs/react-three-fiber/blob/master/docs/advanced/pitfalls.mdx).

For scenes that settle, use on-demand rendering and invalidate when imperative controls, asynchronous assets or external values change. A continuously animating shader still needs frames; demand mode alone cannot animate its time uniform. Respect visibility/pause through the supported frame mode and animation subscription APIs, and test the resume path. Cap DPR, share repeated resources and instance repeated meshes when useful. See [scaling performance](https://r3f.docs.pmnd.rs/advanced/scaling-performance) and [frame hooks](https://r3f.docs.pmnd.rs/api/hooks).

Check disposal behavior for the installed R3F version, especially externally supplied primitives and loader caches. Do not combine consumer cleanup with cache disposal without explicit ownership. Keep semantic controls outside the canvas; offer a useful fallback for a missing context and scene load failure.

## Verify

Run build/type checks and meaningful existing tests. Exercise Strict Mode remount, route navigation during loading, prop changes without context recreation, pointer/touch input, reduced motion and pause/resume. Use the React profiler to confirm ambient animation does not repeatedly commit the surrounding page. Measure production rendering separately: development Strict Mode timings are not production performance evidence.
