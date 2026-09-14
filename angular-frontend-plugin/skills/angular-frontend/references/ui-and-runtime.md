# UI and runtime quality

## Accessibility and visual behavior

Use semantic HTML controls with accessible names. Support keyboard activation and visible focus; for dialogs, manage entry focus, contained navigation where appropriate, escape behavior and focus restoration. Announce meaningful asynchronous feedback without making every state change noisy. Reuse accessible primitives from the installed library. See [Angular accessibility](https://angular.dev/best-practices/a11y).

Run automated accessibility checks on changed UI when available and also exercise keyboard/focus behavior. An automated clean result does not establish full WCAG conformance.

Use the project's design tokens, spacing, breakpoints and translation pipeline. Do not mandate Angular Material, Tailwind, a brand color or a particular icon library. Keep platform-specific measurement standards in the project's existing design reference instead of inventing universal Angular pixel rules.

Exercise variable-length content, loading/error/empty states and small viewports. Dialogs need bounded height, a reachable scrollable body and usable actions. Form layouts should collapse where columns stop being readable. Respect reduced-motion preferences and avoid relying on hover alone for functionality.

## Performance

Measure the affected interaction or bundle before applying broad optimizations. Track stable list identities, avoid repeated request subscriptions, and keep CPU-heavy work away from frequently reevaluated templates.

Use `NgOptimizedImage` for supported image use cases. Provide dimensions/aspect ratio; prioritize genuine first-screen/LCP images and avoid prioritizing every image. Check its restrictions before using it with data URLs or unusual image sources. See [image optimization](https://angular.dev/guide/image-optimization).

Use route lazy loading or `@defer` for suitable noncritical content, with useful placeholder/error behavior. Verify actual dependency deferral rather than assuming a visual placeholder reduced the bundle. Do not defer essential navigation or primary content automatically. See [deferred loading](https://angular.dev/guide/templates/defer).

## SSR and hydration, when present

Check the application's rendering mode. Browser globals such as `window`, `document`, storage and observers are not universally available on the server. Put browser-only work behind the supported platform/render boundary. Preserve compatible server/client initial markup and avoid direct DOM changes that conflict with hydration. Do not disable SSR or hydration merely to hide a regression. See [SSR](https://angular.dev/guide/ssr) and [hydration](https://angular.dev/guide/hydration).

## Security

Treat external HTML and URLs as untrusted. Prefer safe Angular binding; do not introduce `bypassSecurityTrust*`, raw DOM insertion or runtime template compilation as a shortcut. If rich content is required, inspect the trust boundary and approved sanitization approach. CSP and Trusted Types are defense-in-depth mechanisms, not substitutes for safe bindings. See [Angular security](https://angular.dev/best-practices/security).

Frontend-delivered environment files cannot hold private credentials. Keep secrets server-side. Authentication storage and CSRF handling must follow the app/backend contract; this skill does not prescribe a universal token-storage method.
