# Component Contracts

## 1. The contract every component declares

```yaml
component:
  name: ""
  purpose: ""
  platform_component: ""     # the system component this maps to, or "custom" + justification
  anatomy: []
  variants: []
  sizes: []
  states: []
  content_rules: []
  behavior_rules: []
  accessibility: { role: "", label: "", value: "", hint: "", focus_behavior: "" }
  analytics: []
  acceptance_criteria: []
```

Every component `MUST` define: default · pressed/active · focused · disabled · loading · error (if
applicable) · selected (if applicable).

## 2. Button

Initiates an immediate action.

**Variants:** primary · secondary · tertiary · destructive · icon-only (only when necessary) · menu button.

- `MUST` label by outcome, not by mechanism.
- `MUST` have exactly one prominent primary action per task group.
- `MUST` disable during submit to prevent duplicate sends.
- `MUST` give icon-only buttons an accessible label.
- `MUST` use the destructive semantic role where it applies.
- `SHOULD` show progress inside the button for short waits, keeping the label and context.
- `MUST NOT` use "Click here", "OK", or an ambiguous icon when a better label exists.

**Acceptance:** one tap produces one action · loading does not noticeably change width · disabled still
reads its purpose · VoiceOver announces label and role · adequate interaction target.

## 3. Text field

**Anatomy:** persistent label (where needed) · input · optional prefix/suffix · helper text · error text
· clear/reveal action.

**States:** empty · focused · filled · invalid · disabled · read-only.

- `MUST` use secure input for passwords and the right keyboard/content type throughout.
- `MUST` keep the label visible after the user types.
- `MUST` place the error next to the field and preserve the value when validation fails.
- `SHOULD` support autofill.
- `MUST NOT` use a placeholder as the only label on a form that matters.
- `MUST NOT` flash validation errors before the user has finished typing.

**Acceptance:** screen reader reads label, value, required state, error · focus indicator is clear ·
return key behaves · long input does not break layout · copy/paste works.

## 4. Search field

**States:** idle · focused · typing · loading results · results · no results · error/offline.

- `MUST` provide clear.
- `MUST` cancel or discard stale responses.
- `MUST` indicate the active scope or filter.
- `MUST` provide no-result guidance.
- `SHOULD` debounce remote search and offer recent searches where useful.

## 5. Toggle

Changes a binary state immediately.

- `MUST` be used for settings that take effect at once.
- `MUST` label the feature or state, not "on/off".
- `MUST` reflect the real backend state, and roll back with an error if the update fails.
- `MUST NOT` be used for an action that needs a separate submit if that would confuse.
- `MUST NOT` show a silent optimistic update the server rejected.

**Acceptance:** state and label are read aloud · on/off is not conveyed by color alone.

## 6. Picker and segmented control

- `SHOULD` use a segmented control for a small set of peer options; a picker for many.
- `MUST` show a clear selected state.
- `MUST` handle long labels and localization.
- `MUST NOT` use a segmented control as long-form top-level navigation.

## 7. List and row

**Row anatomy:** leading icon/image · primary label · secondary label · value/status · disclosure or
accessory · optional contextual actions.

- `MUST` make clear whether the row opens a detail or performs an action.
- `MUST` provide selected and focused states on iPad and macOS.
- `MUST` keep a sensible reading order.
- `MUST NOT` crowd a row with direct actions.
- `SHOULD` move secondary actions into swipe or a context menu where the convention supports it.

## 8. Card

A card is a custom pattern, not a default.

- `MUST` be used where the grouping carries meaning.
- `MUST` give a whole-card tap a clear affordance, and keep nested buttons from conflicting with it.
- `MUST` have loading and error states if the card loads independently.
- `MUST NOT` wrap every small group in a card.
- `SHOULD` try spacing and sections first.

## 9. Navigation bar and toolbar

- Native apps `MUST` use the system navigation bar and toolbar.
- `MUST` keep the title clear. Leading position is for navigation or cancel; trailing is for
  screen-related actions.
- `MUST NOT` crowd in unlabeled icons.
- `SHOULD` move secondary actions into a menu.

## 10. Tab bar and sidebar

**Tab bar** — for frequent, top-level destinations.

- `MUST` keep labels stable and positions fixed regardless of data.
- `MUST` show a clear selected state.
- Badges `MUST` carry real meaning.

**Sidebar** — for wide space or many destinations.

- `MUST` keep selection synchronized with the detail pane.
- `MUST` support collapse/expand per platform convention.

## 11. Sheet

- `MUST` have a narrow goal and an obvious dismiss.
- `MUST` warn on dismissal with unsaved data.
- `MUST` remain usable once the keyboard appears.
- `MUST NOT` present a sheet from a sheet in a normal flow.
- `SHOULD` pick a detent that suits the content.

## 12. Alert and confirmation dialog

- Alerts are for important information needing attention; confirmation dialogs are for a choice or
  confirming an action.
- `MUST` use a specific title and state the consequence.
- `MUST` mark destructive actions as destructive.
- `MUST NOT` use an alert as a routine success message.
- `MUST NOT` contain a long form.

## 13. Progress indicator

Determinate when progress is measurable; indeterminate when it is not.

- `MUST` keep one indicator type for the duration of a task.
- `MUST` offer cancel for long, stoppable tasks.
- `MUST NOT` spin forever with no timeout or retry.
- `SHOULD` add progress text for long tasks.

## 14. Empty state

**Required content:** what is empty · why it might be empty · what the user can do next · a primary
action where appropriate.

- `MUST` distinguish empty from error, and `MUST NOT` blame the user.
- `SHOULD` keep the copy short and the illustration from overwhelming the task.

## 15. Error state

**Levels:** field error · inline section error · recoverable page error · blocking system error.

- `MUST` scope the error as narrowly as the cause allows.
- `MUST` offer retry or a fix, and preserve entered data.
- `MUST` log technical detail without showing a stack trace to the user.
- `MUST` use specific, courteous copy.

## 16. Toast and banner

- `SHOULD` be used for transient feedback needing no decision.
- `MUST NOT` be the only place information the user needs is shown.
- `MUST` stay long enough to read, or be reviewable elsewhere.
- `MUST` support screen reader announcement, and `MUST` avoid queuing many at once.

## 17. Menu

- `SHOULD` group secondary or infrequent actions.
- `MUST` order by frequency and risk, keep labels short, and support keyboard and pointer where the
  platform has them.
- `SHOULD` separate destructive actions into their own group.

## 18. Image and media

- `MUST` provide an accessibility description when an image carries content, and hide decorative
  images from the accessibility tree.
- `MUST` keep a sensible aspect ratio and provide loading and failure states.
- Autoplay `MUST` respect accessibility and user preference, and `MUST NOT` start audio unexpectedly.

## 19. Custom component gate

Build a custom component **only when every one of these is true**:

- [ ] No system component satisfies the task
- [ ] The custom behavior delivers clear value
- [ ] Keyboard, focus, and VoiceOver are implemented
- [ ] Dynamic Type behavior is defined
- [ ] The full state contract exists
- [ ] A test plan exists
- [ ] The reason is written into the design decision log

Failing any line means using the system component. "The system version looks slightly off-brand" is not
one of these lines.
