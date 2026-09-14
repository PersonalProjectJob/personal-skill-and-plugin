# Version and architecture

## Compatibility comes first

Angular, CLI, Node.js, TypeScript and RxJS have supported combinations. Resolve the actual project versions and consult the [compatibility matrix](https://angular.dev/reference/versions). Do not fix a dependency mismatch by disabling type checks or forcing package installation without examining the cause.

Use stable APIs by default. Experimental and developer-preview APIs have different compatibility guarantees; inspect the status for the target version before adopting them. Upgrade work should follow Angular's [update guidance](https://angular.dev/update) and [release policy](https://angular.dev/reference/releases), one major at a time when required by the update tooling.

Examples of rules that need version checks:

- Whether standalone components or a change-detection strategy are already defaults.
- Availability and stability of signal inputs, outputs, Signal Forms and resource APIs.
- Supported bootstrap, HTTP providers, test runner and SSR/hydration configuration.

The current [AI recommendations](https://angular.dev/ai/develop-with-ai) describe Angular v22+ defaults such as OnPush and stable Signal Forms. Do not paste those assumptions into an older application. Read version-specific documentation or installed public type declarations when the current guide differs from the target.

## Feature ownership and naming

For new organization, group code by business feature. Keep a component's TypeScript, HTML, styles and tests together; use descriptive hyphenated filenames and co-located `.spec.ts` tests. Keep a file focused on one concept and move independent business transformations out of presentation code. These are [style recommendations](https://angular.dev/style-guide), not runtime requirements.

Preserve a consistent existing naming scheme, including `.component.ts` or `.service.ts` suffixes. Do not perform a repository-wide rename to match a newer guide. Avoid generic dumping grounds and premature shared abstractions.

A useful starting boundary is component -> feature service/state -> HTTP client, adapted to the repository. Add a facade or repository only where it owns meaningful orchestration, caching or normalization. Keep feature-specific services next to their feature rather than forcing every service into one global folder.

## Dependency injection

Prefer `inject()` in supported injection contexts. A field initializer or injection-context factory can resolve a dependency; an arbitrary event handler cannot assume that context exists. Inject the dependency or `DestroyRef` while in context and retain the reference for later use. See [injection contexts](https://angular.dev/guide/di/dependency-injection-context).

Choose provider scope deliberately: application, route or component. A root service shares state application-wide; a component provider creates a more local lifetime. Avoid accidentally creating a second state owner by redeclaring providers. See [hierarchical injectors](https://angular.dev/guide/di/hierarchical-dependency-injection).

Prefer the stable service/provider idiom supported by the installed release. Do not mechanically replace `@Injectable` or constructor injection in an unrelated fix.

## TypeScript

Use meaningful DTO/domain types and narrow uncertain input from `unknown`. Prefer inference for obvious local values. For new projects, enable strict TypeScript and Angular template checking; for existing projects, do not globally tighten or weaken compiler options as a side effect of a small change. Angular's [template checking guide](https://angular.dev/tools/cli/template-typecheck) explains `strictTemplates`.

Types describe expected shapes; they do not validate network data at runtime. Reuse the project's validation boundary when the external contract is uncertain.
