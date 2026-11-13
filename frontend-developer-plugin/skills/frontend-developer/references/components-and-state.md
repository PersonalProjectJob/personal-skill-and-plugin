# Components and state

Use this reference for component design, hooks, state ownership, effects, refs, context, and rendering bugs.

## Keep rendering pure

Given the same props, state, and context, render should produce the same result. Do not mutate inputs, perform network requests, register listeners, write storage, or start animation loops during render. Event handlers own user-triggered side effects. Effects synchronize with systems outside React.

Call Hooks only at the top level of React components or custom Hooks. Do not call them inside branches, loops, nested functions, event handlers, or ordinary utilities.

## Model minimal state

Store the smallest changing source of truth. Derive values during render when they can be calculated from props or existing state. Avoid duplicated, contradictory, or deeply nested state. Keep transient state close to its owner; lift it to the nearest common owner only when multiple branches must coordinate.

Use stable domain identifiers for selection and list keys. Do not use an array index as a key when items can be inserted, removed, sorted, or reordered. Treat state as immutable and use functional updates when the next value depends on the previous value.

## Effects and external resources

Use an Effect for synchronization with an external system such as a browser API, subscription, timer, network connection, imperative widget, or renderer. If no external system exists, first try deriving during render or handling work in an event.

Every setup must have matching cleanup when it allocates a listener, subscription, observer, timer, request, worker, or graphics resource. Include every reactive dependency or restructure the code so the dependency is unnecessary. Do not disable Hook lint rules to hide stale closures.

Strict Mode may run an extra development setup/cleanup cycle. Treat this as a lifecycle test; make setup reversible and cleanup idempotent.

## Refs, context, and memoization

Use refs for values that do not affect rendering or for imperative handles. Avoid reading or writing refs during render except for stable initialization patterns supported by React.

Use context for data genuinely needed by a distant subtree. Split frequently changing context from stable configuration when rerender cost is demonstrated. Preserve the project's state library when it already owns cross-feature state.

Use `memo`, `useMemo`, and `useCallback` after measuring a meaningful render cost or when stable identity is part of a child or Hook contract. They are performance tools, not semantic guarantees.

Official references:

- [Thinking in React](https://react.dev/learn/thinking-in-react)
- [Choosing the state structure](https://react.dev/learn/choosing-the-state-structure)
- [Rules of Hooks](https://react.dev/reference/rules/rules-of-hooks)
- [`useEffect`](https://react.dev/reference/react/useEffect)
- [`StrictMode`](https://react.dev/reference/react/StrictMode)
