---
name: apple-hig
description: Use when designing, building, or reviewing UI for Apple platforms — iOS, iPadOS, macOS — or Apple-inspired web, including adaptive layout across iPhone/iPad/Mac/browser widths, size classes, Dynamic Type, Dark Mode, safe area, keyboard avoidance, VoiceOver, SF Symbols, SwiftUI/UIKit navigation, or any request citing Apple Human Interface Guidelines or HIG compliance.
---

# Apple HIG — Design, Build, Review

## Overview

Turns Apple's Human Interface Guidelines into executable rules for three implementation modes, with
adaptive behavior across four device classes and a review gate that requires evidence.

**Core principle:** adapt to **available width and text size**, never to device identity. A phone-width
window on an iPad is a phone. A landscape iPhone Max at regular width is a small iPad.

This is interpretation, not translation. It does not replace Apple's documentation and never copies it
at length — see `references/sources.md` for the official URLs.

## When to use

- Designing screens, flows, or components for iPhone / iPad / Mac.
- Writing SwiftUI, UIKit, AppKit, Flutter, React Native, or Apple-styled web UI.
- Making something responsive across device classes, orientations, or window sizes.
- Reviewing existing UI for HIG compliance, Dynamic Type, Dark Mode, or VoiceOver.

**Not for:** Android-only Material Design work · watchOS / tvOS / visionOS (out of scope, ask before
extrapolating) · web work with no Apple-platform intent (use `frontend-code-standards` instead).

## Phase 0 — Intake (always first)

Fill this contract. Any value you cannot establish goes in an explicit `Assumptions` list in your
output. Never fill a gap with a silent default.

```yaml
product:        { name, purpose, primary_users[], key_tasks[] }
implementation: { mode, platforms[], minimum_os_version, framework, supported_devices[], orientations[], localization[] }
design:         { brand_assets_available, design_system_available, dark_mode_required, accessibility_target }
```

### Detect the mode from repo evidence, then confirm

| Evidence in repo | Mode |
|---|---|
| `*.xcodeproj`, `*.xcworkspace`, `Package.swift` | `native_apple` |
| `pubspec.yaml`, or `react-native` in `package.json` | `cross_platform_mobile` |
| `vite.config.*`, `next.config.*`, `angular.json`, `nuxt.config.*` | `web_apple_inspired` |

State the detected mode and confirm it before proceeding. No evidence found → ask.

## Reference routing

**Your reading list for this task is exactly the cells in your phase's row.** Read the "always" files
before acting; read a "when relevant" file at the moment its subject comes up.

| Phase | Always read | Read when relevant |
|---|---|---|
| **Design** | `references/agent-rules.md` (your mode's section only), `references/responsive-matrix.md`, `references/patterns.md` | `foundations.md`, `components.md`, `accessibility.md`, `templates/feature-spec.md`, `templates/screen-spec.yaml` |
| **Code** | `references/agent-rules.md` (your mode's section only), `references/responsive-matrix.md`, `references/components.md` | `foundations.md`, `accessibility.md` |
| **Review** | `references/review-gate.md`, `references/accessibility.md` | the reference covering each finding's subject |

In `agent-rules.md`, read only the section for the mode you detected. The cross-mode rules are below —
they are short and always apply.

Review is the closing gate of Design and Code, not a separate errand. Finish design or code, then run
the Review row against your own output before reporting done.

## Invariants

These apply in every phase and every mode.

1. **Conflict priority order.** Safety and privacy → accessibility → task completion → platform
   convention → product consistency → aesthetics. Resolve every trade-off in that order.
2. **Label the provenance of every value.** Tag each rule, number, or token as one of:
   `Apple official` · `Platform convention` · `Project decision` · `Assumption`.
   Never present a value you or the project chose as something Apple mandates.
3. **Keyword semantics.** `MUST` / `MUST NOT` are binding. `SHOULD` / `SHOULD NOT` may be departed
   from with a stated reason. `MAY` is optional.
4. **Interpret, don't transcribe.** No long verbatim quoting of Apple documentation. Link
   `references/sources.md` instead.
5. **System components first.** A custom control is allowed only through the custom component gate in
   `references/components.md`, and the justification must be written down.
6. **No `Pass` without evidence.** See below.
7. **Run the self-check before handoff.** See below.

### Cross-mode rules (always apply)

- `MUST NOT` describe a web or Flutter component as a "native iOS component". It resembles one; it is not one.
- `MUST NOT` imitate Apple's system UI closely enough that a user could mistake the product for an Apple product.
- `MUST NOT` derive an API from the HIG. HIG describes experience; Developer Documentation describes
  implementation. Check API availability against the project's minimum OS version.
- `MUST` verify each platform you claim to support. One platform passing is not evidence about another.

## The evidence rule

The review gate ends in a Final Quality Gate table. **A row may read `Pass` only when its Evidence cell
names something you actually observed.**

| Mode | Counts as evidence | Does NOT count |
|---|---|---|
| `native_apple` | SwiftUI previews across the state × size-class matrix; simulator screenshots at Dynamic Type XXL and in Dark Mode; VoiceOver rotor walkthrough | "it uses system components, so it's fine" |
| `cross_platform_mobile` | Running **both** iOS and Android, with a screenshot from each | running one platform and reasoning about the other |
| `web_apple_inspired` | `resize_window` at 375 / 768 / 1024 / 1440 with a screenshot at each; `read_console_messages`; computed CSS read via `javascript_tool` | a green `pnpm build` or `tsc`; reading the source |

Two specifics that catch people out:

- **A green build proves nothing about layout.** Type checking and bundling do not render anything.
  Overflow, clipping at large text sizes, and safe-area collisions are invisible to them.
- **Injecting state via `page.evaluate` is not running the flow.** Drive the real interaction.

### Rationalizations that mean you are about to violate this

| Excuse | Reality |
|---|---|
| "The change is too small to need a screenshot" | Layout breakage is mostly caused by small changes. The screenshot takes seconds. |
| "I used the system component, so it adapts correctly" | System components adapt their own chrome. Your surrounding layout is still yours. |
| "It worked at desktop width, so narrower is fine" | Narrower is where it breaks. That is the width you must check. |
| "The build passed" | The build never rendered a pixel. |
| "I'll mark it Pass and note the caveat" | A `Pass` with a caveat is read as a `Pass`. Mark it unverified. |
| "I can see from the code that it's correct" | Reading code is a prediction. The gate asks for an observation. |

**Red flags — stop and go get the evidence:** you are writing `Pass` and the Evidence cell is empty,
vague ("looks fine"), or describes an intention rather than an observation · you are about to report
done without having rendered the thing at more than one width · you are reasoning about a platform you
did not run.

No evidence available? Write `Unverified` and say what would be needed. That is an honest result. A
false `Pass` is not.

## Self-check before handoff

Answer all ten, in writing, in your output:

1. Did I re-implement a system component that would have worked?
2. Can the user go back and cancel from every screen?
3. Does the layout hold when text grows to accessibility sizes?
4. Does every data screen have loading, empty, error, and offline states?
5. Is any icon-only control missing an accessible label?
6. Is any state conveyed by color alone?
7. Does every destructive action have confirmation or undo?
8. Is any system permission requested before the user has context for it?
9. Is any content hidden behind the keyboard or outside the safe area?
10. Is any assumption still unstated?

## Minimum output

Design and Code tasks both deliver:

```
1. Assumptions            7. State matrix
2. Platform and mode      8. Component map
3. User goals             9. Accessibility notes
4. Information architecture   10. Edge cases
5. User flow              11. Acceptance criteria
6. Screen list            12. Open risks
```

Use `templates/feature-spec.md` for the long form and `templates/screen-spec.yaml` per screen.

## Common mistakes

| Mistake | Do this instead |
|---|---|
| Branching on device identity (`UIDevice`, `userAgent`) | Branch on size class or container width |
| One visual design forced identically onto iOS and Android | Match each platform's mental model; check both |
| Calling a project breakpoint or token an Apple requirement | Tag it `Project decision` |
| Sizing with `100vh` on web | Declare `vh` then `dvh` as a fallback pair in one CSS rule |
| Fixed height on a container holding text | Let it grow; text scales |
| Verifying only at desktop width | 375px first — that is where it breaks |
| Treating review as optional polish | It is the gate; run it before reporting done |

## Related skills

- `frontend-code-standards` — §14 covers HIG-adjacent web token/Tailwind values. In
  `web_apple_inspired` mode, reference its numbers rather than restating them here.
- `feature-focused-tester` — for the 3-layer test progression once the UI exists.
