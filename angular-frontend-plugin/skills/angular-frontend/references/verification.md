# Verification and review

## Use the project's runner

Inspect package scripts and the target's test builder first. Use the configured Vitest, Jasmine/Karma or other supported setup; do not migrate test infrastructure for a feature fix. Run in non-watch mode using flags supported by that runner. Angular's current [testing guide](https://angular.dev/guide/testing) may differ from an older application's setup.

For changed component behavior, test rendered output and user interaction with `TestBed` and existing testing utilities. Set inputs through supported component APIs when their update semantics matter. Account for asynchronous rendering before asserting DOM results. Avoid tests coupled only to private implementation details.

## Select checks by failure risk

| Change | Meaningful checks |
| --- | --- |
| Pure transformation/validator | Focused inputs, edge cases and invalid data |
| Component or form behavior | Input/output contract, interaction, validation, pending and failure states |
| HTTP service/interceptor | Method, URL, payload, response mapping, errors and unexpected duplicate requests |
| Routing | Direct entry, parameters, guard redirects and back navigation where relevant |
| Visible user flow | Browser smoke of changed path, small viewport, keyboard/focus, runtime errors |
| SSR/hydration | Configured server build/render plus client hydration behavior |

Run the affected tests and applicable build/template compilation checks. Use configured lint checks when available. Broaden tests for changes to shared providers, state or cross-feature services. A purely editorial or cosmetic change does not automatically require new unit tests.

## HTTP tests

Use `HttpTestingController` with the target version's test providers. If configuring `provideHttpClient(...)`, register it before `provideHttpClientTesting()` so the testing backend wins. Subscribe or trigger the actual caller before expecting the request; assert the request, flush a response/error and verify no unexpected requests remain. See [HTTP testing](https://angular.dev/guide/http/testing).

Mock tests establish client behavior. When live integration is part of acceptance criteria, also exercise the authorized environment and capture method/status and observable result without exposing credentials or personal data.

## Review prompts

- Can a slow previous search overwrite newer results?
- Can two submit actions produce unintended writes? Can failure leave the UI permanently pending?
- Does navigation or teardown leave work operating on a destroyed view?
- Does a second provider or subscription accidentally duplicate state or requests?
- Are submitted values and displayed success values the intended snapshot/server result?
- Do the chosen API/defaults exist in the installed Angular version?
- Are keyboard access, focus and translated error messages preserved?

Only report findings supported by the changed path. These questions guide inspection; they are not mandatory additional test cases for every task.

## Evidence in the final response

State what changed and list actual command outcomes. Label skipped checks and their concrete reason. Distinguish a passing build, mock integration, browser smoke and live integration. Never invent screenshots, network traces or test results.
