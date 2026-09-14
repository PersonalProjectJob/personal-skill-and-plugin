# Feature Specification — <feature name>

- Mode: `native_apple | cross_platform_mobile | web_apple_inspired`
- Platforms / device classes:
- Framework / minimum OS version:
- Date:

Every value below carries a provenance tag where it is not self-evident:
`Apple official` · `Platform convention` · `Project decision` · `Assumption`.

## 1. Assumptions

Anything not established from the brief, the repo, or Apple's documentation. State it rather than
quietly defaulting.

## 2. User goals

## 3. Business rules

## 4. Information architecture

3–7 top-level areas. Name them the same way in navigation, titles, and deep links.

## 5. User flow

Cover every branch, not just the happy path:

- Happy path
- Validation failure
- Empty
- Loading
- Error (recoverable / blocking)
- Offline
- Permission denied
- Cancel / back

## 6. Screen inventory

| ID | Name | Purpose | Entry points | Primary action |
|---|---|---|---|---|

## 7. Screen specifications

One `templates/screen-spec.yaml` block per screen.

## 8. Component mapping

| Need | System component | Custom? | Justification (if custom) |
|---|---|---|---|

A custom entry requires the custom component gate in `references/components.md` to be fully satisfied.

## 9. State matrix

| Screen | Loading | Refreshing | Content | Empty | Partial | Recoverable error | Blocking error | Offline | Permission denied |
|---|---|---|---|---|---|---|---|---|---|

## 10. Adaptive behavior

Per screen, at minimum compact and regular. Say what changes, not just that it adapts.

| Screen | Compact | Regular | Text-scale interaction | Occlusion notes |
|---|---|---|---|---|

## 11. Accessibility

Per screen: heading structure, focus order, announcements, labels for icon-only controls, alternatives
for custom gestures.

## 12. Content and localization

Copy for labels, empty states, and errors. Note text-expansion risk and locale-formatted values.

## 13. Analytics

Only events with a stated use. No collection beyond the stated purpose.

## 14. Acceptance criteria

Testable statements. "Works correctly" is not one.

## 15. Risks and open questions

Including anything that must be confirmed with backend or design before implementation.

## 16. Self-review findings

The ten self-check answers, plus the Final Quality Gate table from `references/review-gate.md`.
