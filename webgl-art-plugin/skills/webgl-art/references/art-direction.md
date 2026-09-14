# Art direction for a usable website

## Compose before animating

Express the concept as a short brief: audience, action, mood, typography, palette, spatial composition, primary effect and static equivalent. Use references as visual evidence, not as instructions to reproduce a site's code or branding.

Make the composition work in a still frame: readable hierarchy, intentional negative space and a focal point that does not compete with the call to action. Keep text contrast stable across the animation's brightest and darkest states; a quiet HTML text panel can help without flattening the artwork.

| Intended character | Candidate technique | Cheaper equivalent |
| --- | --- | --- |
| Editorial, sculptural | One lit object beside strong HTML typography | Poster of the object with CSS lighting cues |
| Atmospheric, organic | Low frequency procedural shader with a limited palette | Gradient or compressed still texture |
| Generative, geometric | Instanced repeated forms or a line field | SVG pattern or reduced Canvas 2D field |
| Tactile, photographic | Restrained image distortion on intentional interaction | Undistorted image and CSS transition |
| Narrative, immersive | Scroll progress controlling a small scene | Ordered HTML chapters with chapter images |

These are choices, not mandatory templates. Avoid adding particles, bloom, glass, a custom cursor and parallax merely to demonstrate capabilities. Sketch the mobile composition independently: moving the focal object, changing its crop or using a still may preserve the art better than uniformly shrinking desktop.

## Motion and interaction

- Give motion a purpose: reveal a relationship, show depth, respond to input or guide attention. Ambient motion should remain subordinate to reading.
- Keep native scroll, keyboard navigation and touch gestures. Do not hijack scrolling or hide the system cursor by default. Pointer effects are optional enhancements; links must work on touch and keyboard without them.
- Route pointer input only to the visual area that needs it. A decorative full-page canvas should not intercept clicks over content.
- If a story depends on scroll, keep the same information in document order and allow the reader to skip the effect. Avoid trapping progress behind an animation.
- Provide a reachable pause control for continuing ambient motion. Reduced-motion mode should remove unnecessary camera travel, parallax and distortion, while retaining meaning and user feedback.

## Review the design

Compare still, moving, reduced-motion and fallback states. Inspect both desktop and phone layouts, long copy, keyboard focus and zoom. Check the actual animated backgrounds behind text, not just a convenient screenshot. Match project design approval requirements when they apply; this skill itself adds no new approval ceremony.

Deliver a single resolved direction unless the user requests alternatives. Describe how it serves the page's purpose and which effect is removed first if measurements exceed the budget.
