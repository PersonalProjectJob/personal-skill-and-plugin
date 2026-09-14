# Product-Designer Report Template

> Load from SKILL.md when executing Step 10 (final report). Send to `${TELEGRAM_THREAD_DESIGN}`
> if configured, otherwise print inline.

---

```markdown
🎨 **Product-Designer Report**

**Feature:** <feature-name>
**Branch:** <branch-name>
**Issue:** #<issue-number>

## Completed Tasks
✅ Design system audit completed
✅ Component library checked
✅ STAGE 1: Wireframe created
⏸️  WAITING for user approval on wireframe
✅ STAGE 2: Visual UI design [AFTER APPROVAL]
✅ UI Mockups generated
✅ Design specifications documented
✅ User Flow diagram (Mermaid)
✅ Product doc updated
✅ Design tool links added

## Design System Audit
- **Status:** ✅ Pass / ⚠️ Updates needed
- **Tokens Updated:** <list or "None">
- **Hardcoded Values Found:** <count or "None">

## Component Library
- **Status:** Created / Reused / Updated
- **Library File:** `${PRODUCT_DOC_DIR}/design-system/<project>-library.pencil`
- **Components Reused:** <list>
- **New Components Added:** <list or "None">

## Stage 1: Wireframe
📁 File: `${PRODUCT_DOC_DIR}/wireframes/<feature>/wireframe.pencil`
📁 PNG: `${PRODUCT_DOC_DIR}/wireframes/<feature>/wireframe.png`
- Model: <fast/cheap model used>
- Focus: Structure, layout, component placement
- Approval Status: ⏸️ Pending / ✅ Approved / ❌ Needs Revision

## Stage 2: Visual UI
📁 File: `${PRODUCT_DOC_DIR}/mockups/<feature>/ui-mockup.pencil`
📁 Final: `${PRODUCT_DOC_DIR}/mockups/<feature>/final-mockup.png`
- Model: <stronger model used>
- Focus: Colors, typography, icons, visual hierarchy
- Status: ⏳ Not started / ✅ Completed

## Key Design Decisions
- Decision 1: <rationale>

## Models Used
| Stage | Model | Purpose |
|-------|-------|---------|
| Wireframe | <fast/cheap model> | Layout, structure, component placement |
| Visual UI | <stronger model> | Colors, typography, icons, polish |

## Next Steps
⏳ Stage 1: Waiting for user approval on wireframe
⏳ Stage 2: Will begin visual design after wireframe approval
⏳ Frontend/Backend development (after all design approval)

## Timestamp
📅 Date: YYYY-MM-DD
⏰ Time: HH:mm
👤 Designer: Product-Designer Agent
```
