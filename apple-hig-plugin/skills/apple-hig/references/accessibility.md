# Accessibility Checklist — Apple Platforms

## Severity

- **Blocker** — the task cannot be completed with assistive technology.
- **Major** — missing label, wrong focus, clipped text, or low contrast on primary content.
- **Minor** — suboptimal hint, unclear grouping, imperfect announcement.

## 1. VoiceOver / screen reader

- [ ] Every control has an accessible name
- [ ] The name describes purpose, not shape
- [ ] Role is correct: button, link, heading, adjustable, toggle
- [ ] Value and state are announced correctly
- [ ] Decorative icons are hidden from the accessibility tree
- [ ] Related content is combined or contained appropriately
- [ ] Reading order matches logic and visual hierarchy
- [ ] No focus lands on hidden elements
- [ ] Focus moves into a modal on open and back to the trigger on close
- [ ] After a failed submit, focus or announcement leads to the error
- [ ] Dynamically updated content is announced when it matters
- [ ] Custom gestures have an equivalent accessibility action
- [ ] Swipe actions have an equivalent route

## 2. Dynamic Type and text scaling

- [ ] Semantic text styles used
- [ ] Text grows without clipping
- [ ] No fixed height on text containers
- [ ] Button labels wrap, or the layout adapts
- [ ] Horizontal rows become vertical where needed
- [ ] The primary action survives at the largest text size
- [ ] Text in tabs and toolbars checked specifically
- [ ] Custom fonts scale through the appropriate API
- [ ] No important text baked into an image
- [ ] Long localized strings checked

## 3. Contrast and color

- [ ] Primary text meets adequate contrast
- [ ] Custom text targets at least 4.5:1 in ordinary cases
- [ ] Large and bold text checked separately
- [ ] Light Mode passes
- [ ] Dark Mode passes
- [ ] Increase Contrast passes
- [ ] Reduce Transparency does not destroy hierarchy
- [ ] Errors are not signalled by red alone
- [ ] Selection is not signalled by color alone
- [ ] Charts carry pattern or label beyond color
- [ ] Disabled state still communicates its purpose

## 4. Interaction target and motor accessibility

- [ ] Touch targets are large enough and do not overlap
- [ ] Small icons have an expanded hit area
- [ ] No task demands excessive precision
- [ ] Drag has a button or menu alternative
- [ ] Custom multi-finger gestures have an alternative
- [ ] No short, non-extendable time limits
- [ ] Destructive actions are not adjacent to primary ones
- [ ] Controls remain usable one-handed or while the device moves
- [ ] Pointer targets and hover states are clear on iPad and macOS

## 5. Keyboard and focus

- [ ] The task can be completed by keyboard where the platform supports it
- [ ] Tab order is logical
- [ ] Focus indicator is visible
- [ ] No keyboard trap
- [ ] `Escape` closes modals and popovers per convention
- [ ] `Return`/`Space` activate the right control
- [ ] Shortcuts do not conflict with the system
- [ ] Focus returns to the trigger after an overlay closes
- [ ] Sidebar and list selection stay synchronized with focus

## 6. Motion

- [ ] Reduce Motion is read from the system setting
- [ ] Parallax and large zooms have a reduced alternative
- [ ] No flashing
- [ ] No unnecessary infinite loops
- [ ] Motion is not the only channel conveying a change
- [ ] Auto-scroll can be stopped
- [ ] Transitions do not lose focus
- [ ] Loading animation is not distracting

## 7. Audio, haptics, media

- [ ] Sound is not the only feedback channel
- [ ] Haptics do not replace text or status
- [ ] Video has captions where needed
- [ ] No unexpected autoplay
- [ ] Pause and stop exist
- [ ] Media controls have accessible labels
- [ ] Transcript available where the content requires it

## 8. Forms

- [ ] The label always identifies the field
- [ ] Required vs optional is clear
- [ ] Errors are specific and linked to their field
- [ ] Data survives an error
- [ ] Keyboard type is appropriate
- [ ] Autofill works
- [ ] Password manager works
- [ ] A secure field's reveal action is accessible if present
- [ ] Submit leads sensibly to the first error
- [ ] No reliance on placeholders
- [ ] No re-entry of data already known

## 9. Content and language

- [ ] Copy is clear, short, and does not blame
- [ ] Terminology is consistent
- [ ] Acronyms are explained
- [ ] No directional language where layout can change
- [ ] Date, time, and number follow the locale
- [ ] Link text makes sense read in isolation
- [ ] Heading hierarchy is correct
- [ ] No instruction depends on "the red one on the right"

## 10. Permissions and privacy

- [ ] Permission requested in context
- [ ] Pre-permission explanation where needed
- [ ] Denied state still offers a way forward
- [ ] Route to Settings when the user chooses
- [ ] Private data not read aloud unintentionally
- [ ] Sensitive content protected in the app switcher and screenshots where required
- [ ] No dark patterns

## 11. Test matrix

```yaml
test_matrix:
  appearances: [light, dark, increased_contrast, reduced_transparency]
  text:        [default, largest_standard, accessibility_large]
  input:       [touch, voiceover, keyboard, pointer]
  motion:      [standard, reduce_motion]
  content:     [normal, long_localized, empty, error]
```

## 12. Definition of Done

Accessibility is done only when:

- No Blocker remains.
- No Major remains without an approved remediation plan.
- The primary task is completable with VoiceOver.
- Text scaling loses no data and no action.
- Light, Dark, and contrast modes pass.
- Keyboard and focus pass on every platform that requires them.

A checked box requires an observation, not an expectation. See the evidence rule in `review-gate.md`.
