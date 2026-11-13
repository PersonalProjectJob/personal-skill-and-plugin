# Version and architecture

Use this reference when entering an unfamiliar React repository, creating an application, changing routing or rendering boundaries, or reviewing a migration.

## Discover the real stack

Inspect `package.json`, the lockfile, framework configuration, entrypoints, route definitions, TypeScript configuration, and build scripts. Record exact installed versions for React, the renderer, framework, router, compiler or transpiler, test runner, and key state/data libraries.

Classify the runtime before moving code:

- A client-only application owns navigation and rendering in the browser.
- SSR or streaming code must keep browser-only APIs out of server execution.
- A framework with server components or server functions has explicit client/server module boundaries; follow that framework's installed-version documentation.
- A library package must preserve its public exports, peer dependency range, and supported module formats.

Do not infer a Vite SPA, Next.js application, or any other framework from React alone. React's official setup guidance recommends a framework for many new applications and also documents building from scratch when the constraints justify it. Preserve the repository's existing choice unless migration is the requested outcome.

## Choose component boundaries

Start from the data and interaction model. A component should own a coherent responsibility and visible state. Prefer composition over configuration-heavy components with many mode flags. Extract a custom Hook when stateful behavior is reused or becomes independently testable; do not hide simple local event handling behind ceremonial abstractions.

Keep server/client, route/layout, feature/shared, and domain/transport boundaries explicit. Avoid shared folders that become collections of unrelated helpers.

## TypeScript and public contracts

Follow the project's strictness and generated-type workflow. Type component props and external boundaries. Narrow unknown data before use, model meaningful variants with unions, and avoid assertions that merely silence the compiler. Do not duplicate API schemas by hand when the project generates them.

Official references:

- [Creating a React app](https://react.dev/learn/creating-a-react-app)
- [Build a React app from scratch](https://react.dev/learn/build-a-react-app-from-scratch)
- [Rules of React](https://react.dev/reference/rules)
- [TypeScript with React](https://react.dev/learn/typescript)
