# Verification

Use this reference before reporting implementation or review work complete.

## Choose checks by risk

Start with the smallest command that exercises the changed owner, then broaden when the change affects shared state, routing, build configuration, data infrastructure, or multiple user flows.

- Pure logic: focused unit tests and typecheck.
- Component behavior: render with the project's test utilities and assert what the user can observe.
- Data hooks or mutations: test request parameters, normalized results, error behavior, and cache or route-data refresh.
- Routing or forms: test navigation, validation, submission, pending behavior, failure recovery, and confirmed success state.
- Visible flow: run the relevant browser interaction at representative desktop and mobile sizes.
- Shared configuration or architecture: run the full typecheck, lint, tests, and production build configured by the repository.

Do not install a new runner merely to mirror implementation details. Follow existing test setup, providers, factories, and network mocking. Prefer accessible queries and user actions over component internals.

## React-specific checks

- No Hook is conditional or hidden in an ordinary function.
- Effect setup has complete and idempotent cleanup.
- Strict Mode does not duplicate subscriptions, timers, requests, or imperative renderers.
- Async results cannot overwrite newer user intent.
- List keys preserve item identity.
- Pending actions guard duplicate submission.
- Error and empty states remain actionable.

## Report evidence accurately

State the command, environment, result, and limitation. Separate type safety, unit behavior, browser evidence, accessibility checks, and performance measurements. A build proves bundling and type-related gates configured in that command; it does not prove the user flow.

Useful official references:

- [React test utilities](https://react.dev/reference/react/act)
- [React Testing Library guiding principles](https://testing-library.com/docs/guiding-principles)
- [React Profiler](https://react.dev/reference/react/Profiler)
