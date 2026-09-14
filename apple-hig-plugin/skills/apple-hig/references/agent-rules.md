# Mode Contracts

Read **only the section for your detected mode**. The role and source rules above them apply to all modes.

Domain rules live elsewhere and are not repeated here: layout, navigation, forms, states, feedback,
motion, and privacy are in `patterns.md`; typography, color, materials, icons, and tokens are in
`foundations.md`; per-component contracts are in `components.md`.

## Role

You are acting as product designer, UX architect, and UI implementer for Apple platforms. Prioritize in
this order: comprehensibility → user agency → accessibility → system components and behavior →
adaptability → consistency → refinement.

## Source rules

- `MUST` treat Apple HIG and Apple Developer Documentation as the primary sources (`sources.md`).
- `MUST` distinguish three kinds of statement, every time: Apple's official guidance, widespread
  platform convention, and this project's own decision.
- `MUST` tag spacing, radius, brand color, and breakpoint values chosen by the project as
  `Project decision`.
- `MUST NOT` claim a value is required by Apple when Apple does not specify it.
- `MUST NOT` reproduce Apple documentation at length. Interpret and link.
- `MUST NOT` infer an API from the HIG. HIG describes experience; Developer Documentation describes
  implementation. Check availability against the project's minimum OS version.
- `MUST` record the access date when producing a long-lived specification.

---

## `native_apple` — SwiftUI, UIKit, AppKit

- `MUST` prefer system components over custom drawing.
- `MUST` use semantic colors and semantic text styles, not literal values.
- `MUST` preserve the system's navigation gestures, including swipe-back.
- `MUST` use the platform API for sheets, alerts, menus, navigation, search, and forms.
- `SHOULD` look for an SF Symbol before drawing a new icon.
- `MUST NOT` re-create a navigation bar, tab bar, switch, or sheet with custom drawing when the system
  component would do the job.

### Preferred API by need

| Need | API |
|---|---|
| Hierarchical stack | `NavigationStack` |
| Sidebar + detail | `NavigationSplitView` |
| Peer-level sections | `TabView` |
| Transient task | `.sheet`, `.fullScreenCover` only when genuinely warranted |
| Important decision | `.alert`, `.confirmationDialog` |
| Search | `.searchable` |
| Adaptive grid | `LazyVGrid` with `.adaptive(minimum:)` |
| Keyboard avoidance | `.safeAreaInset(edge: .bottom)` |

- `MUST NOT` add a custom Back button when the system provides one.
- `MUST` use tabs for destinations, not as a filter over a small content set.
- `MUST` preserve tab state across switches while the data is still valid.
- `SHOULD` use a sidebar or multi-column layout when the width allows.
- `MUST NOT` place a destructive action adjacent to the confirming action.

---

## `cross_platform_mobile` — Flutter, React Native, and similar

- `SHOULD` reproduce the target platform's mental model and behavior, not just its colors.
- `MUST` test iOS and Android separately. One passing says nothing about the other.
- `MUST NOT` force a pixel-identical visual style onto both platforms when doing so breaks a
  convention on either.
- `MUST` support Dynamic Type or the framework's equivalent text-scaling mechanism.
- `SHOULD` use native navigation transitions and system gestures wherever the framework exposes them.
- `MUST` verify that platform-specific back behavior works: iOS swipe-back and Android's system back
  are different mechanisms, and both must leave the app in a valid state.
- `MUST NOT` describe a framework widget as a "native iOS component". It resembles one.

---

## `web_apple_inspired` — React, Angular, Vue, any web app

- `MUST` apply only the transferable parts of HIG: UX principles, hierarchy, typography scale, motion
  purpose, clarity, and state coverage.
- `MUST` meet web accessibility on web terms: semantic HTML first, real keyboard support, visible
  focus, ARIA only where semantics fall short. HIG is not a substitute for WCAG.
- `MUST NOT` call a web component a "native iOS component".
- `MUST NOT` imitate Apple's system UI closely enough that a user could believe this is an Apple product.
- `SHOULD` keep interactions appropriate to the web rather than forcing mobile gestures onto a desktop
  pointer.
- `MUST` treat the breakpoint ladder in `responsive-matrix.md` §4 as a `Project decision`, never as an
  Apple specification.
- `MUST` handle the things the platform gives you for free on native and does not on web: safe-area
  insets (`env(safe-area-inset-*)`), keyboard occlusion via the visual viewport, and `dvh` instead of `vh`.
- For token and Tailwind specifics, reference `frontend-code-standards` §14 rather than restating its
  numbers here.
