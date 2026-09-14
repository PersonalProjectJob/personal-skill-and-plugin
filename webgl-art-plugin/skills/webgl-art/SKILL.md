---
name: webgl-art
description: Build reusable artistic websites with an independent HTML/CSS/JavaScript and WebGL runtime, optionally connected to a React or Angular host through a persistent iframe and validated message bridge. Use for creative portfolios, cinematic landing pages, visual storytelling and their performance optimization; also supports direct canvas integration. Not a requirement to add WebGL to ordinary UI.
---

# WebGL Art

Build a distinctive website whose content and interactions remain useful while its visual layer loads, pauses, fails or scales down. Treat art direction and runtime cost as joint design constraints. This skill provides rendering guidance; the project's framework skill owns application architecture.

For portfolio-style work, explicitly consider an independently runnable HTML experience with React/Angular handling application data and navigation. Keep this as a first-class architecture, rather than automatically translating every graphic into framework components.

## Establish the target

Inspect the requested application, package manifest, installed versions, rendering mode, owning page and existing assets. Do not infer Angular or React from an unrelated host workspace. For a greenfield request without a specified stack, use plain HTML/CSS/ES modules for a standalone experience; use the chosen framework for an application. Do not install a framework just to render a shader.

Record the site's purpose, primary action, visual motif, target devices, existing performance baseline and proposed quality tiers. If design details are open, choose a coherent direction and state the assumption. Preserve explicit references and approval requirements already attached to the project.

Trace the live entrypoint before reusing an existing project: an iframe can load vendored JavaScript that differs from package.json, and nearby renderer modules may not be active. Inspect script URLs, actual engine versions, host mounting, all schedulers, data mapping and existing evidence. A historical audit or comparison narrative is not a current benchmark.

## Choose the runtime boundary

Read [HTML and host architecture](references/html-host-architecture.md) when building a portfolio-style experience or separating graphics from an application. It covers standalone HTML, persistent iframe and direct component modes, along with scene/content extension points. Prefer the mode justified by the project's interaction and lifecycle needs; an iframe does not guarantee a separate CPU thread or better FPS.

For iframe mode, also read [message protocol](references/message-protocol.md). Use its optional [bridge starter](assets/bridge.mjs) when useful; it has no framework or package dependencies. The starter validates transport and caller-supplied message schemas; readiness, content revision and renderer lifecycle remain application responsibilities. Run `node --test scripts/bridge.test.mjs` from this skill's directory when modifying it.

Read [portfolio findings](references/portfolio-findings.md) only when adapting an existing authored experience or checking why these boundaries exist. It distinguishes inspected source facts from improvements to implement; it is not a mandate to copy that portfolio's visual design.

## Connect to the framework skills

Load only the companion for the target stack, and read its full entrypoint before applying it:

| Target | Companion and this skill's bridge |
| --- | --- |
| Angular | [angular-frontend](../angular-frontend/SKILL.md) for components, state, version compatibility and tests; [Angular bridge](references/angular.md) for WebGL ownership |
| React / TSX | [frontend-developer](../frontend-developer/SKILL.md) for project implementation conventions; [React bridge](references/react.md) for effects, Strict Mode and optional React Three Fiber |
| Plain HTML / JS | No framework prerequisite; use [runtime and HTML](references/runtime.md) directly |

These companion links are local to this skill collection. If distributed alone, discover installed skills by name; if a companion is absent, report that fact and use the included bridge plus project instructions. Do not fabricate a missing skill or install one silently. A companion's project workflow does not authorize commits, publishing or messages to others, nor require importing that project's state/CSS stack into a different application.

For detailed 3D scene production or scientific explainers, discover the separately installed `3dviz-pro-max` skill only when needed; it is not required for a website shader. For shared UI dimensions, type scales, motion durations and focus conventions, use the installed `frontend-code-standards` skill, section 14, in the relevant platform scope. Do not duplicate those numeric UI standards here.

## Choose the visual technique

Read [art direction](references/art-direction.md) when designing the experience. Choose the least costly technique that achieves the intended appearance:

- CSS/SVG for typography, layout, gradients, masks and simple transitions.
- Canvas 2D for flat generative marks when it meets the visual need.
- A small WebGL shader for a procedural background or distortion that benefits from GPU work.
- Three.js for cameras, meshes, lighting and asset loading. Reuse an existing renderer before adding another library.
- React Three Fiber only for a compatible React stack where declarative scene composition is useful. It is optional and not an Angular dependency.

Prefer one dominant visual idea with restrained supporting motion. A request for an artistic site is not a reason to make every section continuously animate.

## Implement the enhancement

Read [runtime and HTML](references/runtime.md) for every WebGL implementation, and the selected framework bridge when applicable.

1. Build the semantic page, responsive layout and static visual fallback first. Keep headings, links, forms and primary actions in HTML.
2. Reserve the canvas dimensions; load graphics separately from critical content. Replace the poster only after a successful first render.
3. Give the renderer a clear lifecycle owner, visibility policy and resource cleanup. Maintain a single active loop per renderer; coordinate any auxiliary cloth, cursor, audio and timer work with the same lifecycle. In iframe mode, a covered scene receives an explicit pause while its context remains mounted.
4. Implement reduced motion, user pause and a lower quality tier along with the main effect. Ensure the lower tier preserves the composition.
5. Measure a representative interaction and optimize the demonstrated bottleneck. Prefer reducing visual cost over adding concurrency or caching without evidence.

Read [performance and verification](references/performance.md) before choosing budgets or claiming an optimization. Its graphics budgets are adjustable starting points, not universal standards or guaranteed results.

## Deliver

Provide the resulting files or page, explain the chosen motif and framework connection, and report actual checks with their environment and limitations. For implementations include the fallback behavior, quality controls, build output, interaction evidence and before/after measurements when optimizing. Separate field Web Vitals, lab measurements and visual inspection.

If only designing or creating instructions, say what remains unimplemented. Never promise good performance on all hardware, label a screenshot as a performance test, or report unmeasured FPS as achieved.

Official references were checked on 2026-09-14 and are linked beside the relevant guidance. Recheck APIs against the installed versions before implementing examples.
