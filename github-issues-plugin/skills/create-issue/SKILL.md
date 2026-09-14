---
name: create-issue
description: >-
  Use when asked to create a standalone GitHub issue from a description, idea, bug report,
  or requirement — not from a PR. Shapes vague input, sizes it against the Task Tier Gate,
  writes the body per the shared issue-content rule, captures the required "expected result"
  screenshot when the change is visible, then creates the issue and sets every project-board
  field. For issues derived from a PR's tasks use create-pr-issues instead.
---

# create-issue — Standalone GitHub issue from a description

This skill does **not** define issue content, wording, or evidence rules — those live in
`.agent-rules.d/github-issue.md`, `.agent-rules.d/task-sizing.md`, and
`.agent-rules.d/screen-registry.md`. Read them; don't invent a different structure. This skill
only coordinates: size the request → shape it → write the body per those rules → capture
evidence → hand off to the board mechanics in `create-pr-issues`.

**Don't use this skill when:** the issue comes from a PR's tasks (use `create-pr-issues`
instead), or a pre-existing origin issue already exists (the user gave a URL, the PR says
`Closes #N`, or the project's own tracking convention already points at one) — that issue IS
the parent; only create children and link them via the sub-issues API.

## Step 0 — Load the rules (before anything else)

1. Read `.agent-rules.d/github-issue.md` in full — the body template, the "how to write
   current/expected state" guidance, the length caps, the no-local-doc-path rule, the
   technical-vs-member-facing template split, the Evidence Discovery order, and what happens
   after creation.
2. Read `.agent-rules.d/task-sizing.md` (Task Tier Gate) and `.agent-rules.d/screen-registry.md`
   (screen-name lookup).
3. Read `${REPO_ROOT}/.agent-rules.local` for `GH_OWNER`/`GH_PROJECT_NUMBER`/`GH_REPO_CODE`/
   `GH_REPO_ISSUES`/`GH_ASSIGNEE_PRIMARY`/`GH_ASSIGNEE_REVIEWER` — anything missing when first
   needed, ask once and persist the answer (see `create-pr-issues/SKILL.md` "Configuration").

No `.agent-rules` at all in this repo (e.g. running in a different project's worktree) → stop
and tell the user; don't fabricate a template from memory.

## Step 1 — Refinement Gate

Input still vague ("do something about X", "this screen looks bad", missing a clear
before/after) → refine it first (brainstorm/forcing-questions with the user) rather than
drafting an issue from an unclear idea.

Coming out of this step you need all four pieces, because they ARE the template inputs:
**screen + current problem + who's affected + expected outcome.**

## Step 2 — Task Tier Gate

Per `.agent-rules.d/task-sizing.md`:

| Tier | Condition | Consequence |
|---|---|---|
| **Micro task** | < 2h, no business-logic change | No spec doc. **The issue body IS the mini-spec** — current/impact/expected must be complete enough for someone to build it without asking follow-up questions. Tracked as one `(Xh)` line in the active sprint/tracking file. |
| **Full spec** | ≥ 2h or changes business logic | Write a spec doc first (per this project's doc workflow) before creating the issue. Don't put a reference to that internal doc in the issue body or vice versa — the board is the single source of truth for status; see Step 6. |

Torn between the two tiers → ask the user, don't decide alone.

## Step 3 — Write the body

Follow `github-issue.md` §3/§3b/§3c exactly. **Pick the template by Item Type before writing**:
Task/Backlog/Bug/Enhance → the member-facing template; Dev Task → the technical template
(opens with a 3-bullet summary: goal / what this issue covers / where it picks up — pointing at
acceptance-criteria state, not a file/route).

Easiest things to get wrong, check each one:

- **The one-line summary is mandatory** (member-facing: ≤25 words, first line; Dev Task: the
  3-bullet summary section) — a reader who only reads that line must understand what's changing.
- **Length caps**: member-facing fields ≤ 2 sentences each; Dev Task Requirement ≤ 6 bullets,
  Acceptance Criteria ≤ 8 lines. Over the cap → split the issue, or fold related criteria up a
  level of abstraction — never delete a criterion just to fit under the cap.
- **No local/internal doc paths** in the body — a teammate opening the issue can't follow them.
- **No internal spec ID in the footer** — only `Refs #<PR>` / `Refs #<issue>` / `Closes #<issue>`;
  no valid reference → drop the footer line entirely.
- **Screen name**: look it up in `screen-registry.md`, don't guess. Missing → add a row now.
- **"Current state"**: where + what the user did + how the screen responded, quoting the actual
  on-screen text where possible.
- **"Expected result"**: a **visible** change — never settle for "no longer broken".
- Member-facing template: no file/component/prop/endpoint names; no `Test Steps`/`Acceptance
  Criteria`/`Changes`/technical-note sections (the Dev Task template has its own dedicated
  Acceptance Criteria section and is allowed those terms).
- Title is the outcome, no `[Bug]`/`[Testing]` prefix.

## Step 4 — Evidence

Run the full Evidence Discovery order from `github-issue.md` §4 — don't skip it.

- **Current-state screenshot**: check this project's existing spec/asset locations first, then
  capture one yourself if the screen already exists; can't do either → write "No screenshot —
  needs a manual attachment" with the reason.
- **Expected-result screenshot — mandatory when the change is visible.** Screen already has code
  → a throwaway patch showing the target state, captured for real (never AI-generated for a UI
  mockup); no code yet → a wireframe, clearly labeled as a sketch.
- Save into this project's canonical evidence location (`reports-export.md`); never commit
  evidence images into the source repo.

## Step 5 — Create the issue + set the board

Reuse `create-pr-issues`' mechanics exactly — its "Resolve the board's fields" query, Step 3
(current iteration), Steps 4–8 (create → node IDs → add to project → assign → batch-set
fields). Don't invent a new mutation shape.

Invariants:

- `gh issue create --body-file` — never inline `--body` on Windows (gets truncated).
- Set every field: Status, Item Type, Environment, Week, Effort (+ Due Date).
- Assignee by Item Type: Backlog/Task → `${GH_ASSIGNEE_REVIEWER}` + `${GH_ASSIGNEE_PRIMARY}` (or
  just Primary if no Reviewer configured); Dev Task and the rest → `${GH_ASSIGNEE_PRIMARY}` only.
- Verify assignment stuck: `gh issue view <N> --json assignees`.
- Origin issue already exists → it's the parent; link children via the sub-issues API.

## Step 6 — Upload evidence, and what NOT to sync back

- Upload images per `github-issue.md` §5 (prefer a pure-CLI release-asset upload over browser
  automation; manual drag-and-drop as the last resort, with the file path reported to the user).
- **Don't write the issue/PR link into any internal spec doc** — the board is the single source
  of truth for status; a copied link in a doc nobody updates goes stale the moment the issue
  moves.
- Do still save evidence media to the canonical location and update its own evidence section
  with the local filenames. A micro task still gets its one-line `(Xh)` tracking entry per
  `task-sizing.md` — a reporting/rollup script may depend on that line existing.
- Verify the issue is on the board with all fields set before reporting done.

## Final report

| Item | Value |
|---|---|
| Tier | Micro task / Full spec + why |
| Issue | `#<N>` + URL |
| Parent | pre-existing (`#N`) / newly created / none |
| Board | Status, Item Type, Week, Effort, Assignee set |
| Evidence | current-state source; expected-result: how it was produced (real patch / wireframe / why not) |

## Common mistakes

| Wrong | Right |
|---|---|
| Inventing a `Summary / Changes / Test Scope` template | Only the template in `github-issue.md` §3 |
| "Expected result" written as "works correctly now" | Describe the visible change |
| Guessing the screen name | Look it up in `screen-registry.md`; missing → add a row |
| Skipping the expected-result screenshot for a UI change | Mandatory — capture it for real, or state exactly why not |
| Writing the issue/PR link into an internal spec doc | Don't — the board is the source of truth |
| `gh issue create --body` inline | `--body-file` |
| Creating a new parent when an origin issue already exists | The origin issue is the parent |
| Committing evidence images into the repo | Save to the canonical evidence location, upload to GitHub |
