# Coding-Agent Commands — Product Designer

> Load from SKILL.md when executing Step 3 (wireframe) or Step 6 (visual UI).

This file intentionally does **not** pin a specific CLI wrapper or model name — those go stale
fast (a model in wide use today can be retired within a year). What has to stay fixed is the
**contract**: two separate invocations, a cheap/fast model for Stage 1 and a stronger model for
Stage 2, with a hard approval gate between them. Substitute your own coding agent's invocation
syntax into the template below.

---

## Stage 1: Wireframe Creation

### Create Wireframe

```bash
<your-coding-agent-cli> -m "<fast/cheap model>" \
  --prompt "Create a Pencil wireframe for <feature-name> (Ticket: #<number>).

  REQUIREMENTS:
  - Use the existing component library: ${PRODUCT_DOC_DIR}/design-system/<project>-library.pencil
  - Reuse components: Button, Input, Card, Modal, Navbar (adjust to your actual library)
  - Design name: <feature-name>-<ticket-id>-wireframe

  FOCUS (structure & layout ONLY):
  - Component hierarchy and layout structure
  - Responsive breakpoints: mobile (<768px), tablet (768-1024px), desktop (>1024px)
  - Spacing and alignment
  - User flow and navigation

  CONSTRAINTS:
  - GRAYSCALE colors only — no color polish
  - No shadows, gradients, or visual effects
  - Focus on structure, not visual design
  - Keep it simple and clear"
```

### Export Wireframe

```bash
<your-coding-agent-cli> -m "<fast/cheap model>" \
  --prompt "Export the wireframe to:
  - PNG:   ${PRODUCT_DOC_DIR}/wireframes/<feature>/wireframe.png
  - Native: ${PRODUCT_DOC_DIR}/wireframes/<feature>/wireframe.pencil"
```

---

## Stage 2: Visual UI Design (AFTER wireframe approval)

### Create Visual UI

```bash
<your-coding-agent-cli> -m "<stronger model>" \
  --prompt "Design the visual UI from the APPROVED wireframe.

  INPUT:
  - Approved wireframe: ${PRODUCT_DOC_DIR}/wireframes/<feature>/wireframe.pencil
  - Feature: <feature-name> (Ticket: #<number>)
  - Design name: <feature-name>-<ticket-id>-visual

  VISUAL DESIGN FOCUS:
  - Color palette: design tokens (var(--color-primary), var(--color-secondary)) — not raw hex
  - Typography: font families, sizes, weights, line-height
  - Icons: from your project's icon set
  - Visual hierarchy: contrast, emphasis, whitespace
  - Effects: shadows, borders, gradients (if needed)

  DESIGN SYSTEM:
  - Reuse existing tokens from ${PRODUCT_DOC_DIR}/design-system/
  - Follow component variants (primary, secondary, danger buttons, etc.)
  - Maintain accessibility (contrast ratio >= 4.5:1)

  OUTPUT:
  - Native: ${PRODUCT_DOC_DIR}/mockups/<feature>/ui-mockup.pencil
  - PNG:    ${PRODUCT_DOC_DIR}/mockups/<feature>/ui-mockup.png"
```

### Visual Polish

```bash
<your-coding-agent-cli> -m "<stronger model>" \
  --prompt "Polish the visual design:
  - Refine spacing, alignment, visual balance
  - Add hover states and transition details
  - Optimize visual hierarchy
  - Export final: ${PRODUCT_DOC_DIR}/mockups/<feature>/final-mockup.png"
```

---

## Component Library Management

### Check Library Exists

```bash
if [ -f "${PRODUCT_DOC_DIR}/design-system/<project>-library.pencil" ]; then
  echo "Library exists — reuse components"
  <your-coding-agent-cli> -m "<fast/cheap model>" \
    --prompt "Import from the library and reuse existing components..."
else
  echo "First feature — create base library"
  <your-coding-agent-cli> -m "<fast/cheap model>" \
    --prompt "Create a component library with base components:
    Button (primary, secondary, danger), Input (text, password, search),
    Card (default, elevated, outlined), Modal, Navbar.
    Save to: ${PRODUCT_DOC_DIR}/design-system/<project>-library.pencil"
fi
```

---

## Important Notes

- If your coding-agent CLI wrapper only runs correctly inside a specific IDE's embedded terminal,
  confirm that for your setup before Stage 1 — some wrappers fail silently outside it.
- **Model choice is directional, not literal:** use the cheapest model that reliably produces
  clean grayscale structure for Stage 1, and the strongest model you have for Stage 2 polish.
  Using the strong model for Stage 1 wastes budget on polish nobody asked for yet; using the cheap
  model for Stage 2 under-delivers on the one step where polish is the point.
