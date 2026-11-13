---
name: frontend-developer
description: Build, fix, refactor, and review React frontend applications using JavaScript or TypeScript, components, hooks, state, data loading, forms, routing, styling, accessibility, performance, and tests. Use for React or TSX implementation and code review, with guidance matched to the installed React version and framework. Not for Angular, Vue, or framework migrations without explicit scope.
---

# React Frontend Developer

Produce maintainable React changes that fit the target application's installed versions, rendering model, architecture, and user requirements. This is project-neutral engineering guidance; it does not mandate a router, state library, CSS system, meta-framework, or design system.

## Establish context

Before editing, inspect project instructions, `package.json`, the lockfile, TypeScript and build configuration, the application entrypoint, and the owning feature with its callers and tests. In a monorepo, identify the actual application and package target.

Record the facts that affect implementation:

- Installed React, renderer, TypeScript, framework and build-tool versions; package manager and real build/test/lint commands.
- Client-only, SSR, streaming, or server-component boundaries; router, state, data, form, styling, translation, and testing libraries already in use.
- Requested behavior, acceptance criteria, data contract, browser support, and the smallest owning surface.

Use installed or locked versions over memory and dependency ranges. Do not add a framework, state library, CSS system, or data client just because it is familiar. For a new application without pinned choices, verify supported current options before scaffolding.

Read [Version and architecture](references/version-and-architecture.md) for setup, structural work, rendering boundaries, migrations, or an unfamiliar React stack.

## Apply rules with the right scope

- **Correctness requirements:** keep rendering pure, follow the Rules of Hooks, preserve data and security boundaries, and clean up external resources.
- **React recommendations:** prefer composition, minimal state, and explicit ownership while respecting APIs available in the installed version.
- **Project decisions:** follow the repository's router, state, form, data, styling, translation, naming, and test conventions. Do not present local choices as React requirements.

A feature request does not authorize a React upgrade, router replacement, state-library migration, or application-wide refactor. If no runnable target exists, distinguish a proposal or isolated example from a verified integration.

## Read only the relevant reference

| Work | Reference |
| --- | --- |
| Versions, project shape, rendering boundaries | [Version and architecture](references/version-and-architecture.md) |
| Components, hooks, state, effects, refs | [Components and state](references/components-and-state.md) |
| API data, mutations, forms, routing, errors | [Data and user flows](references/data-and-flows.md) |
| Accessibility, CSS, images, performance, security | [UI and runtime quality](references/ui-and-runtime.md) |
| Tests, review, evidence, delivery | [Verification](references/verification.md) |

Read multiple references only when the change crosses those boundaries.

## Execute

For artistic websites with WebGL, GLSL, or Three.js, discover the optional `webgl-art` skill by name. It supports an independent HTML experience in a persistent iframe host and direct canvas integration. Keep application architecture in this skill; use its React bridge for validated messages, renderer ownership, Strict Mode cleanup, accessible fallbacks, and measured performance.

1. Reproduce or trace the current behavior and identify its owner before designing the change.
2. Implement at the existing feature boundary. Split a component or hook when it gains a real independent responsibility, not to satisfy an arbitrary file shape.
3. Model async actions with explicit pending, success, failure, and retry behavior. Keep confirmed server data separate from editable input state.
4. Verify the changed behavior using the configured runner. For visible flows, exercise the relevant interaction in a browser; source inspection alone is not runtime evidence.
5. Review the diff for unrelated edits, stale closures, missing cleanup, accessibility regressions, data races, and unsupported version assumptions.

In review mode, report defects with a trigger, consequence, and location. Do not rewrite working code merely to match a preferred style unless refactoring is requested.

## Deliver

Explain the resulting behavior, affected files, commands executed, evidence, and remaining limitations. Do not claim that compilation proves accessibility, a mocked request proves live integration, or a screenshot proves performance.

Guidance was checked against official React documentation on **2026-09-14**. Recheck version-sensitive APIs against the installed stack before implementing examples.
