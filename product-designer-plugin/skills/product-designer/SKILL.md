---
name: product-designer
description: >
  UX/UI design: Design System Audit, wireframe → visual-UI two-stage flow via Pencil MCP,
  component library reuse. Keywords: "UI/UX design", "product design", "wireframe", "mockup",
  "design phase". Prerequisites: a product/requirements doc for the feature, and a component
  library location (existing or first-time).
---

# Product Designer Skill

> Role: UX/UI design, wireframes, Design System Audit, component library management.

---

## Configuration this skill reads

From `${REPO_ROOT}/.agent-rules.local` (see `.agent-rules.local.example`) — both **optional**,
degrade gracefully if unset:

| Variable | Meaning | If unset |
|---|---|---|
| `${PRODUCT_DOC_DIR}` | Where product/design docs, wireframes, mockups and the component library live | Defaults to `docs/` in the repo |
| `${TELEGRAM_THREAD_DESIGN}` | Chat thread/channel that receives the design-progress report at Step 10 | Skill **asks the user once** at report time, then **writes the answer into `.agent-rules.local`** (creating it from the `.example` if it doesn't exist) so the next run doesn't ask again. If the user has no such channel, print the report inline instead. |

## When to Activate

- **Keywords:** "UI/UX design", "product design", "wireframe", "mockup", "design phase"
- **Prerequisites:**
  - ✅ A product/requirements doc exists for this feature (whatever your project calls it —
    a Product Doc, a spec, a ticket with enough detail to design from)
  - ✅ A tracking issue is available (GitHub, Linear, Jira — any tracker; a plain description
    works too if the project has none)

## Input Artifacts

- Product/requirements doc for the feature (location per your project's convention)
- Tracking issue or ticket for the feature (URL or ID, whatever tracker you use)

## Process

### Step 0: Design System Audit (MANDATORY, before any design work)

1. Load `references/audit-checklist.md` and run it against the codebase — this is self-contained;
   it does not need an external design-system tool. Scan CSS/component files for hardcoded hex
   values and magic numbers, and check whether primitive → semantic → component token layers exist.
2. Tokens missing or non-compliant → report the findings to the user, get approval, fix the tokens
   **first**, then proceed.
3. Document the audit result in the product doc (template in `references/audit-checklist.md`).

### Step 1-2: Read Requirements + Check Library

1. Read the product/requirements doc and the tracking issue.
2. Check for an existing component library at `${PRODUCT_DOC_DIR}/design-system/<project>-library.pencil`
   (or your design tool's equivalent).
   - **Exists** → import it, reuse components, only create new ones.
   - **Doesn't exist** → this is the first feature; create a base library (Button, Input, Card,
     Modal, Navbar — adjust to your design system's actual primitives).

### Pencil MCP — preflight (run BEFORE Stage 1)

This applies specifically if you design through Figma-Pencil's MCP server; skip it if you use a
different design tool.

1. **The Pencil desktop app must already be open.** The MCP server is a bridge to that running app,
   not a standalone server — close the app and every tool call dies with it.
2. **The canvas is a single-owner resource: one agent at a time.** A per-agent `--agent` flag
   separates the *channel* (e.g. one CLI vs. another) but **not the document**. Never let two
   agents call the Pencil MCP tools concurrently — there is no `git status` equivalent to detect
   the collision, and the canvas silently overwrites whichever write lands second. If you hand
   wireframe-building to a second agent, wait for it to report done before you call
   `export_nodes`/`get_screenshot` yourself.
3. **Don't hand-edit the MCP server config.** The Pencil app itself writes the MCP entry into your
   coding agent's config file when it detects the agent is installed (check the app's own log for
   confirmation it registered the server).
4. **`MCP error -32603: ... transport not connected to app: <name>` does not mean the app is dead.**
   The usual cause is a previous agent session still holding an MCP server process spawned from an
   older config. Check for a stray `mcp-server-*` process (e.g. on Windows:
   `Get-CimInstance Win32_Process -Filter "Name like '%mcp-server%'" | Select-Object ProcessId, CreationDate, CommandLine`)
   and compare its command line against your current config and the app's own log for a listening
   port/timestamp mismatch. A mismatch means: restart your agent session — editing the config again
   will not kill the stale process.

### Step 3-5: Wireframe — Stage 1 (fast/cheap model)

The point of a two-model split is that structure and polish are different jobs with different
costs: burning a strong model's budget on box-and-line layout wastes it, and a cheap model asked
to do visual polish under-delivers. Use whichever fast/cheap model your coding-agent setup makes
available for Stage 1 — the model name matters far less than keeping Stage 1 **grayscale,
structure-only, no visual effects**.

1. Generate the wireframe: component hierarchy, layout, spacing, responsive breakpoints (adjust to
   your project's actual breakpoints — a common set is mobile <768px, tablet 768–1024px,
   desktop >1024px). Reuse library components before creating new ones. Grayscale only — no color
   polish, no shadows, no gradients.
2. Export PNG + the design-tool's native file to `${PRODUCT_DOC_DIR}/wireframes/<feature>/`.
3. ⏸️ **Wait for user approval before proceeding.** Do not start Stage 2 without it.
4. Rejected → revise with the same Stage 1 model → export → present again → repeat until approved.

### Step 6-7: Visual UI — Stage 2 (stronger model, only after wireframe approval)

1. Load the **approved** wireframe as input. Apply color (design tokens, not raw hex), typography,
   iconography, visual hierarchy (contrast/emphasis/whitespace), and effects (shadows, borders,
   gradients) as needed. Maintain accessibility — contrast ratio ≥ 4.5:1 for text.
2. Export to `${PRODUCT_DOC_DIR}/mockups/<feature>/`.
3. Visual polish pass: spacing/alignment/balance, hover/active/transition states, then export the
   final mockup.

If your CLI wrapper for the coding agent only runs correctly inside a specific IDE's embedded
terminal (a real constraint some setups have), verify that for your own tooling before Stage 1 —
don't assume a plain external terminal works.

### Step 8-10: Document & Report

1. Update the product doc: design links (wireframe + visual UI), audit results, component-library
   status, version/changelog entry with a timestamp.
2. Format the report using `references/report-template.md`.
3. Send it to `${TELEGRAM_THREAD_DESIGN}` if configured (asking once and persisting the answer per
   the configuration table above); otherwise print it inline in the response.

## Output Artifacts

| Artifact | Location |
|----------|----------|
| Design System Audit Report | Embedded in the product doc |
| Component Library | `${PRODUCT_DOC_DIR}/design-system/<project>-library.pencil` (or your tool's equivalent) |
| Wireframes | `${PRODUCT_DOC_DIR}/wireframes/<feature>/` |
| UI Mockups | `${PRODUCT_DOC_DIR}/mockups/<feature>/` |
| Updated product doc | wherever the feature's product/requirements doc lives |
| Progress report | `${TELEGRAM_THREAD_DESIGN}`, or printed inline if unset |

## Blocking Conditions

| Condition | Action |
|-----------|--------|
| Prerequisite doc not approved/available | Report as blocked; wait |
| Design System Audit fails | Report to user → get approval → fix tokens first |
| Wireframe rejected | Revise → re-present → wait for approval |
| Design tool's IDE-terminal requirement not met | Surface the exact error; don't silently retry in a different terminal |
