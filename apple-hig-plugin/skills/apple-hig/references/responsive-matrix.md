# Responsive & Adaptive Matrix — iPhone, iPad, Mac, Web

Adaptation is the part of HIG work that most often ships broken, because the failure only appears at a
width or text size nobody opened. This file is the contract for getting it right in all three
implementation modes.

## 1. The four device classes — what actually varies

Not a table of screen sizes. The sizes change every year; these forces do not.

| Class | What governs the design |
|---|---|
| **iPhone** | Compact width. Portrait-primary. One-handed thumb reach. Keyboard occludes up to half the screen. Dynamic Island at the top, home indicator at the bottom. No pointer. |
| **iPad** | Regular width, but *not reliably* — Split View gives you 1/2 or 1/3 of the screen, Slide Over gives you a phone-width overlay, and **Stage Manager gives you an arbitrary window size**. External keyboard and pointer may or may not be attached. Both orientations are first-class. |
| **Mac** | Arbitrary resizable window down to whatever minimum you declare. Menu bar owns global commands. Pointer hover is available and expected. Full keyboard access is expected. Multiple windows of the same app. |
| **Web** | A breakpoint ladder you define. **No size class API.** No system chrome — no safe area unless you ask for it, no system back gesture. `hover` and `pointer` media queries instead of device facts. `vh` lies on mobile browsers; `dvh` does not. |

## 2. The central invariant

**Adapt on size class or container width. Never on device identity.**

```swift
// WRONG — device identity
if UIDevice.current.userInterfaceIdiom == .pad { showSidebar() }

// RIGHT — size class
@Environment(\.horizontalSizeClass) private var sizeClass
// sizeClass == .regular → sidebar; .compact → stack
```

```js
// WRONG — user agent sniffing
const isTablet = /iPad/.test(navigator.userAgent)

// RIGHT — the container's own width
@container (min-width: 48rem) { .list-detail { grid-template-columns: 20rem 1fr; } }
```

Two consequences people miss:

- An iPad running your app in **1/3 Split View is a phone**. Give it the compact layout. Checking
  "is iPad" gives it a sidebar in a 320pt column.
- A **landscape iPhone Max is `.regular`** horizontally. It should behave like a small iPad, not like a
  stretched phone.

`MUST NOT` branch on device model, idiom, or user agent for layout. `MUST` branch on size class
(native), the equivalent breakpoint/`MediaQuery` (cross-platform), or container width (web).

## 3. Adaptation by need

Compact and regular are the two states worth designing. Everything else interpolates.

| Need | Compact | Regular | `native_apple` | `cross_platform_mobile` | `web_apple_inspired` |
|---|---|---|---|---|---|
| **Hierarchical navigation** | Push/pop stack, one level visible | Persistent sidebar or column beside detail | `NavigationStack` / `NavigationSplitView` | `Navigator` / react-navigation stack; switch on `MediaQuery` width | Routed panes; container query swaps single-pane for two-pane |
| **List → detail** | Detail replaces list; back returns | List and detail side by side; selection persists and is visible | `NavigationSplitView` two- or three-column | Master-detail widget switched on width | Grid with `grid-template-columns`; selected row keeps `aria-current` |
| **Modality (transient task)** | Sheet covering most of the screen | Sheet at a smaller detent, popover anchored to its trigger, or an inspector pane | `.sheet` + `presentationDetents`, `.popover`, `.inspector` | Bottom sheet compact; dialog/side panel regular | Full-screen dialog compact; anchored popover or side panel regular. Focus trap and `Escape` in both |
| **Toolbar / secondary actions** | 1–2 visible, rest in an overflow menu | Actions laid out; menu only for the rare ones | `.toolbar` with `ToolbarItem` placement; `Menu` for overflow | Platform app bar + overflow | Visible action row; overflow menu below the breakpoint |
| **Grid columns** | 1 column, or 2 for dense thumbnails | Auto-fill on a minimum item width — never a hardcoded column count | `LazyVGrid` with `.adaptive(minimum:)` | `GridView` with computed `crossAxisCount` | `repeat(auto-fill, minmax(<min>, 1fr))` |
| **Typography scale** | Semantic roles; headings step down one level | Same semantic roles; larger display sizes earn their space | Semantic text styles (`.largeTitle`…`.caption`) — never fixed pt | Platform text theme + text scale factor | `clamp()` on a semantic role scale; respect user font size |
| **Interaction target** | ≥44×44pt, touch only, no hover affordances | ≥44×44pt for touch; pointer may shrink the *visual* but not the hit area. Hover states allowed but never load-bearing | `.contentShape` to widen hit area beyond the glyph | Platform minimum tap target; check both | `min-height: 44px` + `@media (hover: hover)` for hover-only polish |
| **Keyboard & focus** | Software keyboard: avoid occlusion, `return` key semantics | Hardware keyboard expected: full tab order, shortcuts, `Escape` dismisses, focus returns to trigger | `.focused`, `.keyboardShortcut`, `.onSubmit`, `.safeAreaInset` for the keyboard | Platform focus traversal; test with a hardware keyboard on iPad | Real tab order, visible focus ring, no keyboard trap |

## 4. Breakpoint contract — web mode

**Everything in this section is a `Project decision`.** Apple publishes size classes; Apple does not
publish web breakpoints. Presenting these numbers as an Apple requirement violates invariant 2.

| Name | Min width | Maps to | Typical occupant |
|---|---|---|---|
| `compact` | 0 | compact size class | iPhone portrait, iPad 1/3 Split View, narrow Stage Manager window |
| `medium` | 768px | compact→regular boundary | iPad portrait, iPad 1/2 Split View |
| `regular` | 1024px | regular size class | iPad landscape, small Mac window |
| `wide` | 1440px | regular and above | Mac full window, desktop browser |

Tailwind mapping: `medium`→`md`, `regular`→`lg`, `wide`→`2xl`.

These are the same four numbers the evidence table verifies at — 375 sits inside `compact`. Keep the
ladder and the verification widths identical; if one moves, move both.

Prefer **container queries** over viewport media queries for components that can appear in a sidebar,
a modal, and a full-width page. A component that reads the viewport is wrong the moment it is reused
in a narrower container.

## 5. Text scale × width — the interaction nobody tests

Each axis alone passes. Together they fail.

At **regular width** with **accessibility text sizes**, a two-column layout has enough width and not
enough width at the same time: the columns fit, the text inside them does not.

**Rule: a layout decision reads both available width and current text size.** Width alone is not enough.

```swift
@Environment(\.horizontalSizeClass) private var sizeClass
@Environment(\.dynamicTypeSize) private var typeSize

// Two columns only when both the width AND the text size allow it
var useTwoColumns: Bool { sizeClass == .regular && !typeSize.isAccessibilitySize }
```

On web the equivalent is checking that the content still fits at the user's font size — which means
sizing in `rem`, letting containers grow, and verifying at an enlarged browser font size, not only at
a narrow viewport.

`MUST NOT` set a fixed height on any container holding text.
`MUST` let button labels wrap or the row reflow vertically rather than truncate.
`MUST` keep the primary action reachable at the largest supported text size.

## 6. Occlusion contract

Things that cover your content, and what to do about each.

| Occluder | Rule |
|---|---|
| **Safe area** | Content and controls respect it. Backgrounds and decoration `MAY` extend past it. Never put a primary action under the home indicator or Dynamic Island. |
| **Software keyboard** | The focused field and its submit control must both stay visible. Native: `.safeAreaInset(edge: .bottom)` or a scroll view that adjusts. Web: the visual viewport shrinks — test it, don't assume. |
| **`vh` on mobile browsers** | Mobile Safari and Chrome compute `100vh` against the address-bar-collapsed viewport, so `vh`-only sizing clips content on first load. Declare the fallback pair **in one CSS rule** (`max-height: 90vh; max-height: 90dvh;`), not as two competing utility classes — generated-stylesheet order is not reliable. |
| **Stage Manager window chrome** | The window can be nearly any size, including narrower than the app was designed for. Do not assume iPad means wide. |
| **macOS minimum window size** | Declare one, and make sure the primary task is completable at it. |
| **Scroll-under toolbars / material** | Content scrolling under a translucent bar must stay legible. Do not rely on transparency alone to separate layers. |

## 7. Verification

The evidence table in `review-gate.md` is the single definition. Do not restate it here — read it and
produce what it asks for.

Short version: `native_apple` → previews across the state × size-class matrix plus simulator
screenshots at Dynamic Type XXL and Dark. `cross_platform_mobile` → run both platforms. 
`web_apple_inspired` → screenshots at 375 / 768 / 1024 / 1440.

## 8. Anti-patterns

| Anti-pattern | Why it fails |
|---|---|
| Fixed height on a text container | Clips at larger Dynamic Type sizes |
| Absolute positioning for primary layout | Cannot reflow on resize, rotation, or text growth |
| `vh`-only sizing | Wrong on mobile browsers from the first paint |
| Hover as the only affordance | Nothing on touch discovers it |
| Primary action behind a gesture at compact width | Undiscoverable, and inaccessible without a fallback action |
| Tabs used as content filters | Tabs are destinations; filters belong in the content area |
| Porting iOS gestures onto desktop | Desktop users expect pointer and keyboard, not swipe |
| Assuming iPad has a pointer | It might not. Touch targets stay at touch size. |
| Hardcoded column counts | Breaks at every width you did not personally check; use auto-fill on a minimum width |
| One layout for "tablet" | Split View and Stage Manager mean iPad spans phone-width to desktop-width |
