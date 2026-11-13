# Data and user flows

Use this reference for API integration, server state, mutations, forms, routing, authentication, and async ordering.

## Preserve the data boundary

Trace the repository's existing path from UI to data access. Components should render states and invoke feature APIs; transport details, normalization, caching, retries, and authentication belong in their established owners. Do not add raw `fetch` calls to components when the project uses a client, repository, route loader, server action, or query library.

Keep server state in the existing server-state owner. Do not copy query results into local state unless the user is editing an intentional draft. After a mutation, update or invalidate the exact cache or route data that owns the visible result.

Validate untrusted response data at the boundary required by the project. Do not guess fields from a stale mock when a live schema or generated client exists.

## Make async transitions explicit

Represent pending, success, empty, failure, retry, and cancellation behavior that users can observe. Disable or guard re-entrant actions while a non-idempotent request is pending. Display values confirmed by the server after submission instead of continuing to read mutable form state.

Prevent stale responses from overwriting newer intent. Use the framework or data library's cancellation and request identity mechanisms. Cleanup alone does not cancel a server operation; distinguish ignoring a stale result from aborting transport.

## Forms and validation

Follow the existing controlled, uncontrolled, or form-library convention. Keep validation rules close to the contract that owns them, show errors next to the relevant field, preserve entered values after recoverable failure, and focus the first actionable error when the project supports it.

Use semantic labels, fieldsets, autocomplete tokens, input modes, and correct input types. Client validation improves feedback but does not replace server validation.

## Routing, errors, and auth

Use the installed router or framework routing APIs. Preserve URL ownership for shareable state such as filters, tabs, and pagination when that is the current convention. Handle not-found, unauthorized, and unexpected failures at the nearest established error boundary.

Keep tokens and privileged operations out of render code. Use the project's auth/session boundary and validate redirects or user-controlled URLs before navigation.

Official references:

- [Sharing state between components](https://react.dev/learn/sharing-state-between-components)
- [Reacting to input with state](https://react.dev/learn/reacting-to-input-with-state)
- [You might not need an Effect](https://react.dev/learn/you-might-not-need-an-effect)
- [Escape hatches](https://react.dev/learn/escape-hatches)
