---
name: angular-frontend
description: Build, fix, refactor, and review Angular frontend applications using TypeScript, components, templates, dependency injection, Signals/RxJS, HTTP, forms, routing, and Angular tests. Use for Angular implementation and code review, with guidance matched to the installed version. Not for AngularJS 1.x or React/Vue implementation.
---

# Angular Frontend

Produce maintainable Angular changes that fit the application's version, architecture, and user requirements. This is a project-neutral engineering skill, not an official Angular package or a mandated UI design system.

## Establish context

Before editing, inspect the nearest project instructions, package manifest and lockfile, Angular workspace/project configuration, TypeScript configuration, and the owning feature with its callers and tests. In a monorepo, identify the actual application target.

Record the relevant facts briefly:

- Installed Angular/CLI, TypeScript and RxJS versions; package manager and existing build/test/lint commands.
- Standalone or NgModule composition; rendering and change-detection setup; existing state, form, UI and translation libraries.
- Requested behavior, acceptance criteria, data contract, and the smallest owning surface.

Use installed versions or lockfile resolutions over dependency ranges. Run the project's local CLI when available; do not download an unrelated latest CLI just to inspect a repository. For a new application without a pinned version, verify a currently supported stable version and compatibility before scaffolding.

Read [Version and architecture guidance](references/version-and-architecture.md) for setup, structural work, migrations, or an unfamiliar Angular version. Do not assume examples from the current documentation compile on older releases.

## Apply rules with the right scope

- **Correctness requirements:** respect supported APIs, injection contexts, data contracts, lifecycle ownership, and security boundaries.
- **Angular recommendations:** use modern stable idioms when supported; preserve coherent existing code when a migration is outside scope.
- **Project decisions:** respect the installed UI kit, CSS approach, translation system, state library, formatting and naming conventions. Do not label these as Angular requirements.

Changing a feature is not authorization to upgrade Angular, replace the form/state library, or restructure the whole application. Do not infer a React stack from the host workspace when the requested target is Angular. If no target application is available, distinguish a proposal or standalone example from a verified integration.

## Read only the relevant reference

| Work | Reference |
| --- | --- |
| Version selection, project structure, services, DI | [Version and architecture](references/version-and-architecture.md) |
| Components, templates, reactive state, subscriptions | [Components and reactivity](references/components-and-reactivity.md) |
| API integration, request concurrency, forms, routing | [Data and user flows](references/data-and-flows.md) |
| Accessibility, CSS, images, performance, SSR, security | [UI and runtime quality](references/ui-and-runtime.md) |
| Tests, review, verification and delivery | [Verification](references/verification.md) |

Read multiple references only when the requested change crosses those boundaries. Official source links are beside the relevant guidance; do not load the entire Angular manual by default.

## Execute

For artistic websites with WebGL/GLSL or Three.js, combine this skill with [webgl-art](../webgl-art/SKILL.md). It supports an independent HTML experience in a persistent iframe host as well as direct canvas integration. Keep Angular architecture here; use its Angular bridge for validated messages, renderer lifecycle, change-detection isolation, accessible fallbacks and performance measurement. Ordinary Angular UI does not require WebGL.

1. Trace the current behavior and identify its owner before designing the fix.
2. Implement at the existing feature boundary. Keep reusable logic separate when it has a real independent responsibility; avoid ceremonial layers for trivial code.
3. For async user actions, explicitly cover the pending, success and failure transitions. Verify which values the server confirmed and how the visible state becomes fresh.
4. Test the changed behavior using the configured runner. For visible flows, exercise the relevant interaction in a browser; source inspection alone is not runtime evidence.
5. Review the diff for unrelated edits, compatibility assumptions and missing integration points. Report commands actually executed and any unverified behavior.

In review mode, report actionable defects with their trigger, consequence and location. Do not rewrite working code simply to match a preferred style unless refactoring is requested.

## Delivery

Explain the resulting behavior, affected files, verification outcomes and remaining limitations. Keep framework explanations simple when the user is learning: state the rule, why it matters, and one small example. Follow the user's conversation language.

Do not claim that compilation proves accessibility, that an HTTP mock proves live backend integration, or that a generated example was run. Commit, publishing and environment changes remain governed by the user's scope and host permissions.

## Source maintenance

Guidance researched against official documentation on **2026-09-14**. Recheck version-sensitive defaults and API stability when applying it to a different release. The reference date is not a guarantee of future compatibility.

The Angular team's [AI guidance](https://angular.dev/ai/develop-with-ai) and [official agent skills](https://angular.dev/ai/agent-skills) are upstream references. This skill adds local workflow and decision guidance; it does not require installing another skill or an MCP server.
