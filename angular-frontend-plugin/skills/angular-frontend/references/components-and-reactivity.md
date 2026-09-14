# Components and reactivity

## Components and templates

For supported modern projects, prefer standalone composition, signal-based `input()`/`output()` APIs and built-in template control flow. Keep existing NgModule/decorator integration coherent when it remains in scope. Import the directives and pipes the template actually uses. Angular's [AI guidance](https://angular.dev/ai/develop-with-ai) describes these modern conventions.

Make required inputs explicit. Use two-way binding only when editing shared input state is part of the component's public contract. Keep event names about domain actions rather than implementation details.

Use stable item identity in `@for` tracking for mutable/reordered lists. Array position is suitable only when identity truly follows position, such as an immutable static list. Keep expensive transformations outside template expressions. See [template control flow](https://angular.dev/guide/templates/control-flow).

Prefer class/style bindings and component/directive `host` metadata for new code. Use `readonly` for input/output/query references that should not be reassigned; `protected` can express members intended only for the template. Preserve formatting and simple inline/external template conventions already present. See [Style Guide](https://angular.dev/style-guide).

## State selection

| Need | Default decision |
| --- | --- |
| Local synchronous UI value | A signal when supported by the application |
| Read-only value derived from state | `computed()` |
| Async event composition, cancellation, sequencing | RxJS or the established async abstraction |
| Application-wide state already owned by a store | Update that store, not a duplicate signal cache |
| Editable draft | Explicit draft and submit/reset boundary |

Update signal objects/arrays through `set()` or `update()` with appropriate new references; mutating an object in place does not itself notify consumers. Read-only signals do not deeply freeze objects. Keep computed derivations pure. Use effects for synchronization with imperative external systems rather than copying derived state into a second writable value. See [Signals](https://angular.dev/guide/signals).

Create `toSignal()` once for a stable stream and reuse it; repeated creation can create repeated subscriptions. Specify a valid initial-value strategy, and use `requireSync` only when synchronous emission is guaranteed. Respect its injection/lifecycle requirements. Use `AsyncPipe` for template-owned observable subscriptions. See [RxJS interop](https://angular.dev/ecosystem/rxjs-interop).

For imperative subscriptions that can outlive the component, arrange teardown. Use supported `takeUntilDestroyed()` in an injection context or pass a previously injected `DestroyRef`; use the existing teardown approach in older releases. Not every completing HTTP subscription leaks, but destroyed components should not keep obsolete request work alive. See [takeUntilDestroyed](https://angular.dev/ecosystem/rxjs-interop/take-until-destroyed).

## Rendering and lifecycle

Determine the actual change-detection configuration before adding explicit OnPush options or manual change detection. Prefer state updates Angular can observe over scattered `detectChanges()` calls. An existing Zone.js application and a zoneless application can have different notification assumptions; consult [zoneless guidance](https://angular.dev/guide/zoneless).

Do not change bound state in the middle of a lifecycle traversal just to silence an expression-change error. Place DOM-dependent work at the appropriate render boundary, guard destroyed instances before delayed work, and clean up event listeners and timers. See [component lifecycle](https://angular.dev/guide/components/lifecycle).
