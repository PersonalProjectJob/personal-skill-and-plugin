# Review Gate

Run this against your own output before reporting done, and against someone else's work when asked to
review. Output two things: findings, then the Final Quality Gate table.

## 1. Severity

- **Blocker** — task cannot be completed, security flaw, or serious accessibility failure.
- **Major** — wrong pattern, wrong component behavior, layout breaks in a common state.
- **Minor** — polish, spacing, copy, consistency.
- **Suggestion** — optional improvement.

## 2. Report format

```md
# HIG Compliance Review

## Summary
- Overall result:
- Blockers:
- Major issues:
- Minor issues:
- Assumptions:

## Findings

### HIG-001 — <short title>
- Severity:
- Platform:
- Screen/component:
- Evidence:            # what you observed, and how
- Expected:
- Actual:
- User impact:
- Recommended fix:
- Source category:     # Apple official guidance | Platform convention | Project decision
```

## 3. The evidence rule

**A gate row may read `Pass` only when its Evidence cell names something you actually observed.**

| Mode | Counts as evidence | Does NOT count |
|---|---|---|
| `native_apple` | SwiftUI previews across the state × size-class matrix; simulator screenshots at Dynamic Type XXL and in Dark Mode; VoiceOver rotor walkthrough | "it uses system components, so it's fine" |
| `cross_platform_mobile` | Running **both** iOS and Android, with a screenshot from each | running one platform and reasoning about the other |
| `web_apple_inspired` | `resize_window` at 375 / 768 / 1024 / 1440 with a screenshot at each; `read_console_messages`; computed CSS read via `javascript_tool` | a green `pnpm build` or `tsc`; reading the source |

- **A green build proves nothing about layout.** Type checking and bundling render nothing. Overflow,
  clipping at large text, and safe-area collisions are invisible to them.
- **Injecting state via `page.evaluate` is not running the flow.** Drive the real interaction.

No evidence available? Write `Unverified` and state what would be needed. A false `Pass` is worse than
an honest gap.

## 4. Final Quality Gate

| Check | Pass/Fail/Unverified | Evidence | Fix |
|---|---|---|---|
| System component priority | | | |
| Navigation convention | | | |
| Dynamic Type | | | |
| VoiceOver | | | |
| Light/Dark | | | |
| Loading / empty / error | | | |
| Safe area / keyboard | | | |
| Destructive action safety | | | |
| Privacy / permissions | | | |
| Localization | | | |

## 5. Review areas

### Navigation
- [ ] Top-level destinations use an appropriate pattern
- [ ] Back works; swipe-back is not blocked without reason
- [ ] Tabs are not used as filters
- [ ] Modality has not replaced navigation
- [ ] No multi-layer modal stacking
- [ ] Deep links open the correct state
- [ ] State is preserved on return where appropriate

### Layout
- [ ] Safe area correct
- [ ] Keyboard avoidance correct
- [ ] Compact width correct
- [ ] Regular/wide width correct
- [ ] Split view / sidebar correct where required
- [ ] Landscape correct where supported
- [ ] Window resizing correct
- [ ] No fixed height causing clipping
- [ ] Long text does not break the layout
- [ ] No unintended horizontal overflow

### Typography
- [ ] Semantic text styles
- [ ] Dynamic Type
- [ ] Heading hierarchy
- [ ] Text wrapping
- [ ] No important text inside an image
- [ ] Vietnamese glyphs and diacritics correct
- [ ] Number, date, currency per locale
- [ ] Error copy is clear

### Color and appearance
- [ ] Semantic colors
- [ ] Light Mode
- [ ] Dark Mode
- [ ] Increased Contrast
- [ ] Reduced Transparency
- [ ] Sufficient contrast
- [ ] State not conveyed by color alone
- [ ] Brand color does not destroy legibility
- [ ] Material does not obscure content

### Components
- [ ] System components preferred
- [ ] Button has all states
- [ ] Field has all states
- [ ] Toggle reflects backend truth
- [ ] Row affordance is clear
- [ ] Search has clear / no-result / error
- [ ] Correct progress type
- [ ] Destructive role applied
- [ ] Icon-only controls labelled
- [ ] Custom components justified

### State coverage — per screen
- [ ] Initial loading · Refreshing · Content · Empty · Partial content
- [ ] Recoverable error · Blocking error · Offline · Permission denied
- [ ] Disabled · Success · Cancellation
- [ ] Background/foreground restoration where needed

### Forms and validation
- [ ] Field labels clear
- [ ] Keyboard type correct
- [ ] Autofill
- [ ] Secure input
- [ ] Sensible validation timing
- [ ] Error next to field
- [ ] Data not lost
- [ ] Duplicate submit prevented
- [ ] Loading state
- [ ] Focus lands on first error
- [ ] Server errors mapped
- [ ] Paste and password managers not blocked without reason

### Accessibility
- [ ] VoiceOver completes the happy path
- [ ] VoiceOver completes error recovery
- [ ] Reading order correct
- [ ] Modal focus correct
- [ ] Large Dynamic Type
- [ ] Adequate touch targets
- [ ] Keyboard navigation
- [ ] Focus indicator
- [ ] Reduce Motion
- [ ] Dynamic changes announced
- [ ] Custom gestures have alternatives
- [ ] Decorative assets hidden

### Feedback and motion
- [ ] Tap produces feedback
- [ ] Requests show progress
- [ ] Success is clear without blocking
- [ ] Errors offer a remedy
- [ ] Toasts last long enough
- [ ] Motion has purpose
- [ ] Reduce Motion
- [ ] No animation-driven layout shift
- [ ] No autoplaying audio

### Privacy and permissions
- [ ] Requested in context
- [ ] Purpose clear
- [ ] Denied flow
- [ ] Restricted/unavailable flow
- [ ] Settings recovery
- [ ] No excess collection
- [ ] No sensitive data logged
- [ ] No dark patterns
- [ ] Consent withdrawable where required

### Performance and resilience
- [ ] First meaningful content early
- [ ] UI thread not blocked
- [ ] No duplicate requests
- [ ] Cancellation and stale-response handling
- [ ] Retry with appropriate backoff
- [ ] Offline preserves drafts
- [ ] Images optimized
- [ ] No leaks from animations or tasks
- [ ] Correct restore after background

## 6. Automated test candidates

Navigation path · deep link · form validation · duplicate-submit prevention · loading→content ·
loading→error→retry · empty state · offline draft preservation · permission denied · Dynamic Type
snapshot · Dark Mode snapshot · VoiceOver labels · keyboard focus order · destructive confirmation.

## 7. Release gate

Do not release while any of these remain:

- Accessibility Blocker
- Data loss
- A serious destructive action without confirmation
- Navigation dead end
- Permission loop
- Unbounded spinner
- The primary task failing in Dark Mode or at large Dynamic Type
- Crash, or stale data that leads the user to act wrongly
