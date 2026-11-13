# UI and runtime quality

Use this reference for HTML semantics, accessibility, responsive styling, images, runtime performance, security, and browser-only integrations.

## Build semantic UI first

Use native elements for headings, links, buttons, forms, dialogs, lists, tables, and landmarks before adding ARIA. Preserve keyboard interaction, visible focus, label relationships, error announcements, and logical reading order. Test at narrow and wide viewports and with increased text size.

Follow the project's design tokens, component library, CSS architecture, themes, and localization system. Do not introduce a parallel token set or hardcode user-visible strings when translation infrastructure exists.

Reserve image and media dimensions to avoid layout shift. Use responsive sources and lazy loading when supported by the current asset pipeline and appropriate for the content's paint priority.

## Measure before optimizing

Identify whether the bottleneck is network transfer, JavaScript execution, React rendering, layout/paint, or GPU work. Capture a reproducible baseline and change the demonstrated cause.

Common actions include reducing shipped code, deferring non-critical work, virtualizing genuinely large collections, stabilizing expensive child inputs, and lowering visual cost. Use route or component lazy loading at a boundary with a deliberate loading state. Memoization is useful only when the saved work exceeds its comparison and complexity cost.

Preserve input responsiveness during expensive updates using APIs supported by the installed React version and framework. Do not report a screenshot, production build, or synthetic score as proof of smooth interaction on all devices.

## Own imperative resources

Canvas, WebGL, observers, workers, media, and third-party widgets need one lifecycle owner. Start them after the host element exists, pause when policy requires it, and dispose listeners and resources during cleanup. Account for Strict Mode development cycles.

## Security

Render text through React's normal escaping. Avoid raw HTML injection; when a contract requires it, sanitize untrusted HTML with the project's established boundary. Never expose server secrets through client environment variables. Validate external URLs before using them in navigation, embeds, or resource requests.

Official references:

- [Lazy loading React components](https://react.dev/reference/react/lazy)
- [`memo`](https://react.dev/reference/react/memo)
- [React DOM components](https://react.dev/reference/react-dom/components)
- [WAI accessibility fundamentals](https://www.w3.org/WAI/fundamentals/accessibility-intro/)
