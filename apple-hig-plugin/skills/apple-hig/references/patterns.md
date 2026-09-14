# Patterns — Architecture, Navigation, Data Entry, States, Feedback, Privacy

Layout and adaptation are not here — they are in `responsive-matrix.md`. Native API choices are in
`agent-rules.md`.

## 1. Information architecture

- `MUST` identify the primary task before drawing a screen.
- `MUST` settle on 3–7 top-level areas before choosing tabs or a sidebar.
- `MUST` use hierarchical navigation for list-to-detail flows.
- `MUST` use modality for narrow, temporary, or focus-demanding tasks.
- `MUST NOT` use modality as the product's primary navigation.
- `MUST` keep area names stable across navigation, titles, and deep links.
- `MUST` avoid unnecessary nested navigation.
- `MUST` keep important information and actions in predictable positions.
- `MUST` describe, for every flow: entry point, success condition, failure condition, and exit path.

**Acceptance criteria:** the user can always tell where they are · a valid way back exists · deep links
open the right screen *and state* · no navigation loops · no more than one modal stacked in a normal flow.

## 2. Navigation

- `MUST` preserve the system back gesture.
- `MUST` use tabs for destinations, never as a filter over a small content set.
- `MUST` preserve tab state across switches while the data remains valid.
- `MUST NOT` place a destructive action next to the confirming one.
- `SHOULD` use a sidebar or multi-column layout when width allows.

**Acceptance criteria:** swipe-back works on iOS where appropriate · keyboard shortcuts and focus work
on iPadOS/macOS where supported · titles do not truncate at large text sizes · navigation state restores
on return to foreground when the domain requires it.

## 3. Data entry and forms

- `MUST` ask only for data that is genuinely needed.
- `MUST` use the appropriate keyboard and content type.
- `MUST` use secure input for secrets.
- `MUST` keep a persistent label wherever the field's purpose could be forgotten.
- `MUST` place errors next to the field that caused them.
- `MUST` preserve the user's input when validation fails.
- `SHOULD` validate on blur or on submit; real-time only when it does not interrupt typing.
- `SHOULD` support autofill, password managers, paste, and scanning where relevant.
- `MUST NOT` block paste for passwords or one-time codes without a real security reason.
- `MUST NOT` flash errors while the user is still mid-entry.

```yaml
field_states: [empty, focused, filled, invalid, disabled, read_only, loading_suggestion]
```

**Acceptance criteria:** label, value, hint, and error read sensibly to a screen reader · the keyboard's
`Next`/`Done` behave · focus order is logical · long forms are grouped or summarized · a failed submit
moves focus to the first error where appropriate.

## 4. Search

- `SHOULD` use the system search interface.
- `MUST` define scope, recent searches, suggestions, no-result, and error/offline.
- `MUST` allow the query to be cleared.
- `MUST` announce when a filter or scope is active.
- `MUST NOT` present results from a previous query as results for the current one.
- `SHOULD` debounce network requests.

**Acceptance criteria:** keyboard appears and focus lands correctly · clear works · no-result explains
how to fix the query · a screen reader learns that the result count changed.

## 5. Modality — sheets, alerts, confirmations

- `MUST` use modality for a focused, short, or decision-requiring task.
- `MUST` provide an obvious way to dismiss.
- `MUST` warn before a dismissal that would discard unsaved input.
- `MUST NOT` use an alert for long content or a multi-step flow.
- `MUST NOT` stack sheets in a normal flow.
- `SHOULD` follow the platform's convention for the position of confirm and cancel.

**Acceptance criteria:** swipe-to-dismiss never silently discards data · VoiceOver focus moves into the
modal on open and back to the trigger on close · destructive confirmations name the affected object ·
modality has not become the product's navigation.

## 6. Loading, empty, error, offline

Every data-fetching screen declares all of these:

```yaml
states:
  initial_loading: ; refreshing: ; content: ; empty: ; partial_content:
  recoverable_error: ; blocking_error: ; offline: ; permission_denied:
```

- `MUST` show a signal immediately rather than a blank screen.
- `MUST` distinguish genuinely empty from failed-to-load.
- `MUST` offer retry for recoverable errors, and say what to do next.
- `MUST` use determinate progress when progress is measurable, indeterminate when it is not.
- `MUST NOT` switch between progress types mid-task in a way that shifts layout.
- `MUST NOT` show an unbounded spinner with no timeout and no way out.
- `SHOULD` keep existing content visible while refreshing.
- `SHOULD` let the user keep using the parts that do not depend on the pending data.

**Acceptance criteria:** no flicker between skeleton and content · retry does not duplicate the request
· offline does not discard entered data · the empty state does not blame the user.

## 7. Feedback and notifications

- `MUST` respond immediately to a tap or click.
- `MUST` make clear whether a task is running, succeeded, or failed.
- `MUST` show errors near their origin, and offer a way to fix or retry.
- `MUST` use an alert only when a decision or a risk is genuinely involved.
- `MUST NOT` let important information vanish in a short-lived toast.
- `SHOULD` keep the user in place rather than routing them to a generic error screen.
- `SHOULD` use passive notification for information requiring no decision.
- Haptics and sound `MAY` reinforce feedback but `MUST NOT` be its only channel.

**Acceptance criteria:** success does not block the flow unnecessarily · errors state a remedy ·
notifications do not repeat or spam · non-essential notifications can be turned off.

## 8. Motion

- `MUST` have a purpose: orientation, continuity, feedback, or status.
- `MUST` support Reduce Motion, with an equivalent full experience.
- `MUST` keep focus and accessibility state stable across a transition.
- `MUST NOT` let animation delay the task.
- `MUST NOT` use strong movement, infinite loops, or gratuitous parallax.
- `MUST NOT` animate properties that cause layout jank when a better option exists.
- `SHOULD` prefer system transitions.

**Acceptance criteria:** interaction is never blocked while animating · Reduce Motion loses no
capability · animation does not lose the user's reading position.

## 9. Permissions and privacy

- `MUST` request a permission at the moment the user starts the feature that needs it.
- `MUST` explain the value before the system prompt where that helps.
- `MUST` handle denied, restricted, and unavailable states.
- `MUST` offer a route to Settings when the user chooses to reconsider.
- `MUST` collect only what the stated purpose requires.
- `MUST` keep private content out of logs, analytics, and the app switcher where the domain requires it.
- `MUST NOT` block the whole product over a non-essential permission.
- `MUST NOT` use dark patterns to pressure a permission, a signup, or data sharing.

**Acceptance criteria:** the app remains usefully usable when a secondary permission is refused ·
permission copy is specific, not generic · no dark patterns · sensitive data absent from ordinary logs.

## 10. Localization and writing

- `MUST` write short, direct, task-oriented copy.
- `MUST` use one term consistently for one concept.
- `MUST` support text expansion.
- `MUST` use locale rules for numbers, currency, dates, and plurals.
- `MUST NOT` build sentences by concatenating strings.
- `SHOULD` follow the product's and platform's sentence-case convention.

**Acceptance criteria:** no important word truncated · Vietnamese diacritics render correctly ·
dates are unambiguous · button labels name the action · errors do not blame.

## 11. Performance perception

- `MUST` show first meaningful content early.
- `MUST NOT` block the UI thread.
- `MUST` size images to their display size.
- `MUST` avoid large layout shifts.
- `MUST` offer cancellation for long tasks where feasible.
- `SHOULD` prefetch where the probability is high and privacy is unaffected.

## 12. Delivery package

A design hand-off contains at minimum:

```
/feature-name
  overview.md          state-matrix.md
  user-flow.md         accessibility.md
  screens.md           analytics-events.md
  component-map.md     acceptance-criteria.md
```
