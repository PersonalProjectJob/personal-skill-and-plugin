# Product Designer Workflow

> Detailed workflow with branching logic. Load from SKILL.md when executing Steps 3-7.

---

## Step 0: Design System Audit (MANDATORY — BEFORE any design)

```
1. Load references/audit-checklist.md — self-contained, no external tool needed.

2. Scan the codebase for:
   - Existing design tokens (var(--color-primary), etc.)
   - Hardcoded hex values (#2563EB, #f59e0b, etc.)
   - Token layer compliance: primitive → semantic → component

3. Decision point:
   ├── Tokens OK → Proceed to Step 1
   └── Tokens need update → Report to user → Get approval → Fix first → Then proceed
```

---

## Step 1-2: Requirements + Library Check

```
1. Read the product/requirements doc → scope, persona, scenario
2. Read the tracking issue → context, discussion, additional requirements

3. Check component library:
   File: ${PRODUCT_DOC_DIR}/design-system/<project>-library.pencil

   ├── EXISTS → Import library → Reuse components → Only create new ones
   │   Components to check: Button, Input, Card, Modal, Navbar (adjust to your actual set)
   │
   └── NOT EXISTS → Create base components → Save library → Export specs
       Components to create: Button (3 variants), Input (4 states),
       Card (3 variants), Modal, Navbar
```

---

## ═══════════════════════════════════════════════════════
## STAGE 1: WIREFRAME (fast/cheap model)
## ═══════════════════════════════════════════════════════

### Step 3: Create Wireframe

```
1. Run the Stage 1 command from references/commands.md, filling in your own CLI + model.

2. Design parameters:
   - Name: <feature-name>-<ticket-id>-wireframe
   - Import library components FIRST
   - Focus: structure, layout, spacing, component hierarchy
   - GRAYSCALE only (no color polish)
   - No shadows, gradients, or visual effects
```

### Step 4: Refine & Export

```
1. Arrange components per feature requirements
2. Ensure responsive breakpoints (adjust to your project's actual set):
   - Mobile: < 768px
   - Tablet: 768px - 1024px
   - Desktop: > 1024px
3. Export:
   - PNG    → ${PRODUCT_DOC_DIR}/wireframes/<feature>/wireframe.png
   - Native → ${PRODUCT_DOC_DIR}/wireframes/<feature>/wireframe.pencil
```

### Step 5: ⏸️ WAIT FOR USER APPROVAL

```
1. Present the wireframe to the user
2. Show file path + PNG preview
3. Ask: "Approve wireframe? (Yes / Request changes)"

Decision point:
├── APPROVED → Proceed to STAGE 2
└── REJECTED → User provides feedback
    → Revise wireframe (still Stage 1 model)
    → Export updated version
    → Present again
    → Repeat until approved
```

---

## ═══════════════════════════════════════════════════════
## STAGE 2: VISUAL UI DESIGN (stronger model)
## ═══════════════════════════════════════════════════════
## ⚠️ ONLY begins AFTER wireframe approved
---

### Step 6: Visual UI Design

```
1. Load the approved wireframe: ${PRODUCT_DOC_DIR}/wireframes/<feature>/wireframe.pencil
2. Run the Stage 2 command from references/commands.md

3. Design parameters:
   - Name: <feature-name>-<ticket-id>-visual
   - Apply color palette (design tokens, not raw hex)
   - Apply typography (font families, sizes, weights)
   - Add icons from your project's icon set
   - Add visual hierarchy (contrast, emphasis, whitespace)
   - Add effects (shadows, borders, gradients — if needed)
   - Maintain accessibility (contrast ratio >= 4.5:1)
```

### Step 7: Visual Polish

```
1. Refine spacing, alignment, visual balance
2. Add micro-interaction details:
   - Hover states
   - Active states
   - Transition details
3. Export:
   - PNG    → ${PRODUCT_DOC_DIR}/mockups/<feature>/ui-mockup.png
   - Final  → ${PRODUCT_DOC_DIR}/mockups/<feature>/final-mockup.png
   - Native → ${PRODUCT_DOC_DIR}/mockups/<feature>/ui-mockup.pencil
```

---

## Step 8-10: Documentation & Report

```
1. Update the product doc:
   - Add wireframe link (Stage 1)
   - Add visual UI link (Stage 2)
   - Add Design System Audit results
   - Add Component Library status
   - Increment version + changelog (timestamped)

2. Format the report using references/report-template.md

3. Send to ${TELEGRAM_THREAD_DESIGN} if configured — ask the user once if it isn't set yet, then
   write the answer into .agent-rules.local so future runs don't ask again. If the user has no
   such channel, print the report inline instead.
```

---

## Blocking Conditions

| Condition | Action |
|-----------|--------|
| Prerequisite doc not approved | Report as blocked → Wait |
| Design System Audit fails | Report to user → Get approval → Fix first |
| Wireframe rejected | Revise → Re-present → Wait for approval |
| Design tool's IDE-terminal requirement not met | Surface the exact error, don't silently retry elsewhere |
