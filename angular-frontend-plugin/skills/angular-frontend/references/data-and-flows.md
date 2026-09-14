# Data and user flows

## HTTP and contracts

Use the application's configured `HttpClient` and feature data boundary. Keep URL construction, DTO mapping and transport errors in the established service/repository layer. Avoid a parallel `fetch()` path that bypasses application interceptors unless the task requires it.

An `HttpClient` generic is a compile-time assertion, not response validation. Each subscription can send another request; make ownership explicit before binding or subscribing more than once. Cancelling a client subscription does not prove the server rolled back a mutation. See [making requests](https://angular.dev/guide/http/making-requests).

Reuse configured interceptors for cross-cutting concerns, and inspect their ordering. Do not forward credentials to arbitrary third-party destinations. New interceptor style should match the target version and app configuration. See [interceptors](https://angular.dev/guide/http/interceptors).

Separate loading, empty, error and success states when they are visibly different. Do not turn request failure into a successful empty list. After a mutation, update or invalidate/refetch the actual state owner; rendering a success toast alone does not refresh data.

## Concurrency is a behavior decision

| Behavior | Appropriate RxJS operator when using streams |
| --- | --- |
| Only the latest search/filter request matters | `switchMap` |
| Ignore another submit while one is active | `exhaustMap` |
| Every action must run in order | `concatMap` |
| Independent operations may run concurrently | `mergeMap`, with bounded concurrency where needed |

Do not use latest-request cancellation for writes that must finish. Ensure a submit guard actually covers the pending interval. Place error handling so one failed search does not permanently terminate subsequent searches; restore pending state on failure and cancellation as well as success.

Primary API definitions: [switchMap](https://rxjs.dev/api/operators/switchMap), [exhaustMap](https://rxjs.dev/api/operators/exhaustMap), [concatMap](https://rxjs.dev/api/operators/concatMap), [mergeMap](https://rxjs.dev/api/operators/mergeMap).

## Forms

Keep the installed form approach for an existing feature. For new forms, check target-version stability and custom-control support before choosing Signal Forms; typed Reactive Forms remain a supported choice. Do not substitute React Hook Form or require an unrelated schema library. See [Signal Forms](https://angular.dev/guide/forms/signals/overview) and [typed Reactive Forms](https://angular.dev/guide/forms/typed-forms).

Separate editable form state from confirmed server data. Validate at submit time even when validation also runs on input. Show actionable field errors after the appropriate interaction, handle async validation pending state, retain user input after request failure, and prevent duplicate submissions.

For Reactive Forms, remember that disabled controls are omitted from the group's normal value. Use `getRawValue()` only when the contract intentionally includes those controls; disabled/read-only UI never grants backend write permission. Configure nullable versus non-nullable reset semantics deliberately. Source: [typed forms](https://angular.dev/guide/forms/typed-forms).

Use real labels; placeholders are examples, not replacements for labels. Preserve formatters, normalization, autocomplete, input modes and validation when extracting an existing control. Integrate custom controls through the chosen form system's supported API. Source: [form validation](https://angular.dev/guide/forms/form-validation).

## Routing

Use the configured Angular Router. Prefer feature-level lazy loading where it improves initial loading without delaying essential first-screen content. Keep route parameters/query parameters reactive when a component can be reused across navigation. See [route loading](https://angular.dev/guide/routing/loading-strategies).

Return a `UrlTree` or a supported redirect result from guards rather than returning false and separately navigating. Guards support navigation UX; the server still enforces authorization. Test unauthorized access, redirects and relevant unsaved-change behavior. See [route guards](https://angular.dev/guide/routing/route-guards).
