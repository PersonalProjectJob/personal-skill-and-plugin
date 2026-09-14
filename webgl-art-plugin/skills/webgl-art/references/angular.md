# Angular bridge

Use the companion [Angular skill](../../angular-frontend/SKILL.md) for Angular engineering. Check the installed Angular version, zone-based or zoneless mode, SSR/hydration and project conventions before selecting APIs. Do not install React Three Fiber into Angular; use the framework-neutral renderer or an existing compatible Angular scene integration.

## Persistent HTML iframe host

For a full-document artistic experience, read [HTML and host architecture](html-host-architecture.md) and [message protocol](message-protocol.md). Keep the iframe owner in the stable application shell outside the changing detail outlet. Retain its identity/src/session across inputs and routing updates; send content and host visibility messages rather than recreating the element.

Register transport handlers in the browser after the view exists, before starting iframe navigation. In a zone-based application, register message listeners outside Angular and re-enter only after accepting a meaningful message that changes Angular UI. Receiving a child message can still schedule work in the host; iframe separation is not immunity from change detection. In zoneless mode, use the application's supported state notification APIs without assuming NgZone is required. Tear down listeners/subscriptions through the supported destroy lifecycle.

Set the iframe URL from trusted application configuration, retaining Angular's resource-URL protections. Do not bypass the sanitizer for arbitrary supplied URLs. Drive activity from router/overlay state, not only document visibility. Handle load separately from bridge/visual readiness, and apply the current state when the child becomes ready. Provide real standalone links inside the HTML experience and a host fallback on timeout.

## Lifecycle and change detection

Keep template content and a stable canvas host inside the component; keep graphics resources out of template-reactive state. Initialize once the view is available in the browser. On supported Angular versions, `afterNextRender` is suitable for browser-only DOM initialization and must be registered in a valid injection context. It does not run during SSR. In older projects, use the supported view lifecycle with an explicit browser guard. Avoid evaluating browser globals at module scope. See [Angular lifecycle](https://angular.dev/guide/components/lifecycle) and [SSR guidance](https://angular.dev/best-practices/performance/ssr).

In a zone-based app, initialize the third-party engine, frame scheduling and frequent input handlers within `NgZone.runOutsideAngular`; scheduling only the next frame outside the zone may leave other engine listeners inside it. Re-enter for meaningful HTML state changes such as selection, loading failure or a manual quality change. In zoneless applications, avoid notifying template signals on every frame; the same separation still matters. See [zone pollution](https://angular.dev/best-practices/zone-pollution).

Use `DestroyRef.onDestroy` when supported or `ngOnDestroy` for cleanup, including pending async loads. Check a cancellation/generation token after every asynchronous initialization stage before installing the controller. If destruction wins the race, dispose resources that arrive later. Do not rely only on checking whether the canvas is still connected.

## Data and integration

- Inputs/signals describe semantic settings such as palette, selected item and quality. Pass updates to the controller without rebuilding the whole renderer.
- High-frequency pointer coordinates and simulation time live in the controller. Expose outputs only for user-meaningful events; do not emit a frame counter through change detection.
- Handle query/input API differences according to the installed version. Preserve the project's standalone/NgModule composition.
- Keep graphic loading local to the owning page or deferred component; use a supported lazy boundary and retain HTML fallback. Do not require a framework upgrade for this effect.

## Verify

Run the actual target's build and configured checks. Navigate into and out of the view repeatedly, destroy it while graphics are loading, resize its container and toggle visibility/motion preferences. Confirm one renderer owner and no accumulating loops/listeners. Profile the Angular component during ambient animation: template updates should correspond to semantic changes, not every graphics frame. SSR/hydration validation is required only for targets that use it; label an untested mode explicitly.
