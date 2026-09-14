---
name: create-pr-issues
description: Use when asked to create GitHub issues from a PR's tasks and add them to a GitHub Projects (v2) board with Status, Item Type, Environment, Week, Effort, and Due Date set. Owns the project-board mechanics only — issue-body wording, evidence rules, and task sizing live in the companion agent-rules files this skill reads.
---

# Create Issues from PR → Add to Project Board

## Scope of this skill

This skill owns **project-board mechanics**: reading a PR's changes, creating parent + child
issues, adding them to a GitHub Projects (v2) board, resolving that board's field/option IDs
**live** (never hardcoded — a copy-pasted GraphQL ID from someone else's board is wrong the
moment you paste it), and setting every field correctly.

It does **not** own issue wording, evidence rules, or task sizing — those are read from:

| Concern | Read from |
|---|---|
| Issue body template, voice, length caps, "no local-doc paths" rule | `.agent-rules.d/github-issue.md` |
| Task Tier Gate (micro task vs. full spec) | `.agent-rules.d/task-sizing.md` |
| Screen-name lookup for the `Màn hình`/screen field | `.agent-rules.d/screen-registry.md` |
| Where evidence screenshots are stored + naming | `.agent-rules.d/reports-export.md` |

Read the ones relevant to the current task **in full** before drafting anything — don't invent
a different structure.

## Configuration this skill reads

From `${REPO_ROOT}/.agent-rules.local` (`.agent-rules.local.example` in this plugin) —
`GH_OWNER`, `GH_PROJECT_NUMBER`, `GH_REPO_CODE`, `GH_REPO_ISSUES`, `GH_ASSIGNEE_PRIMARY`,
`GH_ASSIGNEE_REVIEWER`. Any of these missing when first needed → ask the user once, then
**write the answer back into `.agent-rules.local`** so the next run doesn't ask again.

`GH_REPO_ISSUES` unset → same repo as `GH_REPO_CODE`; every issue/PR cross-reference below can
use a bare `#N`. Set and different from `GH_REPO_CODE` → **every** cross-reference between the
two repos must use the full `owner/repo#N` form — GitHub resolves a bare `#N` against the repo
the reference lives in, not the repo it's pointing at, and a bare number across repos silently
points at the wrong thing (or nothing) instead of erroring.

## Trigger

User says: "create issues from this PR", "add PR tasks to the project board", "create testing
issues for PR #N".

**This skill's PR Body Template also applies to every `gh pr create`/`gh pr edit` in
`${GH_REPO_CODE}`**, even in a session that hasn't called this skill yet — a PR is often opened
before issues are created, not after.

---

## PR Body Template (mandatory on every `gh pr create`/`gh pr edit`)

Don't use the generic `## Summary / ## Changes / ## Test plan` template. Use:

```markdown
## Summary

**Branch:** `<branch-name>`
**Issue:** <link to a pre-existing issue this PR implements> (omit if none exists yet)

<2-4 sentences describing the problem and the change, in plain language — someone who
doesn't read code should be able to follow it>

## Evidence

| Item | Before | After |
|-----|-------|-----|
| <area changed> | <image/link, or `No screenshot — <reason>`> | <image/link, or `No screenshot — <reason>`> |

## Testing

- <build/test you actually ran + result, e.g. `pnpm build` passed>
- <what you did NOT verify, and exactly why — missing credentials, missing environment, a
  gated route... NEVER silently omit this line>

Refs <GH_REPO_ISSUES>#<related issue>
Closes <GH_REPO_ISSUES>#<issue this PR closes, if any>
```

Rules:

- **Cross-repo references, if `GH_REPO_ISSUES` ≠ `GH_REPO_CODE`:** always use the full
  `owner/repo#N` form in `Refs`/`Closes` — see "Configuration" above for why a bare `#N` breaks.
- **A pre-existing issue exists** (see "Detecting a pre-existing origin issue" below): fill in
  `Issue:` and `Closes <repo>#<issue>` from the start.
- **No pre-existing issue, PR opened first** (the common case when this skill runs after code
  is already written): omit the `Issue:` line, but Summary/Evidence/Testing are still mandatory.
  After this skill creates the parent + child issues, come back and `gh pr edit --body-file` to
  append `Refs`/`Closes` at the end — don't rewrite the Summary/Evidence/Testing already there.
- **Evidence**: follow this skill's Evidence Discovery step below — don't grab an arbitrary
  screenshot, and don't skip a screenshot that's actually capturable.
- **Testing**: must state plainly if you have NOT verified the UI yourself (no test account, no
  environment, a gated route) — this is the input this skill's Step 1 uses to decide `Done` vs.
  a review-pending status for a self-verified item. Hiding what wasn't verified sets the wrong
  status.

---

## Resolve the board's fields (live — do this once per run, cache nothing across runs)

```bash
gh api graphql -f query='
{
  organization(login: "'"${GH_OWNER}"'") {
    projectV2(number: '"${GH_PROJECT_NUMBER}"') {
      id
      fields(first: 30) {
        nodes {
          ... on ProjectV2FieldCommon { id name }
          ... on ProjectV2SingleSelectField { id name options { id name } }
          ... on ProjectV2IterationField {
            id name
            configuration { iterations { id title startDate duration } }
          }
        }
      }
    }
  }
}'
```

(Use `user(login: "${GH_OWNER}") { projectV2(...) { ... } }` instead of `organization(...)` if
the board belongs to a personal account, not an org.)

This returns the project's own `id`, and for every field its `id` plus — for single-select
fields — every option's `id` by `name`, and — for the iteration field — every sprint/iteration
with its date range. **Resolve field and option IDs by name from this response every run.** A
hardcoded ID from a different board (or from this board after someone renames a column) is
wrong in a way that fails silently — `updateProjectV2ItemFieldValue` with a stale option ID
either errors or, worse, sets a value that doesn't match what the UI shows for that ID anymore.

This skill assumes your board has fields named **Status**, **Item Type**, **Environment**,
**Week** (an Iteration field), and **Effort** (a Number field), plus a Due Date date field. If
your board names them differently, the field lookup above will simply not find a name it
expects — tell the skill the actual names once, and it persists that mapping the same way as
the other config (see "Configuration" above).

### Item Type → default Status (edit this table to match your board's actual option names)

| Item Type | Default Status | When |
|---|---|---|
| Backlog | Define | Created from feedback/spec, not yet actionable |
| Task | Code Review → Testing | Parent needing independent verification. Code Review while the PR is open, Testing once merged |
| **Dev Task** | **Done** | Self-verified — the agent built, tested, and confirmed it working in this session. No human re-verification step. |
| Enhance | Testing | |
| Doc | Todo | |
| Bug | Testing | |

> **Dev Task = Done only if actually self-verified.** If the agent created a Dev Task but could
> **not** verify it (missing credentials, missing environment), do not set Done — use Testing or
> In Progress and say why in the issue body.
>
> **Task/Enhance/Bug gate on PR state:** PR not yet merged → Code Review; PR merged → Testing
> (queued for independent review). Check with `gh pr view <N> --json state,mergedAt`.

### Environment options (edit to match your board)

| Base branch | Environment |
|---|---|
| `master` / `main` | Production |
| `staging` | Staging |
| anything else (`dev`, `test`, ...) | Test |

Get the PR's base branch with `gh pr view <N> --json baseRefName -q .baseRefName`. Base branch
doesn't map cleanly to any of the three → ask the user, don't guess.

---

## Issue Tổng (Parent Issue + Sub-Issues) — every run

**Every run must produce a parent + child structure** — create the child issues first, then
group them under a parent via the sub-issues API. This holds even for a single child issue.

### Detecting a pre-existing origin issue — if found, it IS the parent (don't create a new one)

In priority order:

1. The user supplied an issue number/URL directly.
2. The PR body contains `Closes`/`Fixes`/`Resolves`/`Refs` pointing at an **issue** (not a PR)
   that's still open — using the full `owner/repo#N` form if `GH_REPO_ISSUES` differs from
   `GH_REPO_CODE` (see "Configuration").
3. The corresponding spec doc (if your project keeps one) already references a tracking issue.

When an origin issue exists:
- Do **not** create a new parent. Link children to it directly via `addSubIssue`.
- Make sure it's on the board (add it if it's not there yet); set its Status per the parent
  rule above; keep its existing Item Type if already set, otherwise default to Task; assign
  `${GH_ASSIGNEE_REVIEWER}` + `${GH_ASSIGNEE_PRIMARY}` if `GH_ASSIGNEE_REVIEWER` is set,
  otherwise just `${GH_ASSIGNEE_PRIMARY}`; do **not** set Effort on it; only fill Week/Due Date
  if they're currently empty — never overwrite an existing value.
- Do **not** rewrite its body and do **not** comment a list of children onto it. After
  `addSubIssue` succeeds, GitHub's native sub-issue relationship is the single source of truth —
  a manual comment listing the same children is redundant and can drift.
- Link children with the sub-issues API (`GraphQL-Features: sub_issues` header — a plain
  task-list checkbox is not the same relationship and doesn't get GitHub's own sub-issue UI):

```bash
gh api graphql -H "GraphQL-Features: sub_issues" -f query='
mutation {
  c1: addSubIssue(input: {issueId: "<PARENT_NODE_ID>", subIssueId: "<CHILD_NODE_ID>"}) { subIssue { number } }
}'
```

---

## Step-by-Step Workflow

### Step 1: Confirm inputs

- **PR number** (default: current branch's PR).
- **Pre-existing origin issue?** — check the three sources above.
- **Item Type per issue** (default: Dev Task if the agent built and self-verified it in this
  session; Task if it needs someone else to verify).
- **Status**: don't ask — derive it from Item Type + PR state (see the table above).
- **Environment**: don't ask — derive it from the PR's base branch.
- **Effort per task**: ask once ("per-task, or one uniform estimate?").
- **Due date** = today, automatically — don't ask.

### Step 2: Analyze the PR's tasks

```bash
gh pr view <PR_NUMBER> --repo ${GH_REPO_CODE} --json title,body,files,commits,baseRefName
```

1. **Code facts (internal use only):** identify which files/components/logic changed and split
   them into independent groups — one child issue per group.
2. **Map to a screen/user-journey name** using this project's screen registry (see
   `.agent-rules.d/screen-registry.md`) — look it up, don't invent a name from the file path.
3. **Branch by the child's Item Type:** Task/Backlog/Bug/Enhance use the member-facing template
   in `github-issue.md` §3; Dev Task uses the technical template in §3d. Follow that file's rules
   for length caps and the mandatory one-line summary — don't re-derive them here.

### Step 2b: Evidence

Run this project's Evidence Discovery order (`github-issue.md` §4) for every child that uses the
member-facing template — don't skip it, and don't grab an arbitrary screenshot. Dev Task issues
skip this (they use an Attachments section instead — see `github-issue.md` §3d).

Show the draft (title, screen, evidence file names) to the user before creating anything —
catching a wrong screenshot at this point is much cheaper than after the issue exists.

### Step 3: Get the current iteration

Use the field-resolution query above; pick the iteration where
`startDate <= today < startDate + duration`.

### Step 4: Create the issues

**Before creating a Dev-Task-template child, check its own Acceptance Criteria section: every
item must already be `- [x]`.** If any are still `- [ ]`, stop — don't create a "Done" child with
unchecked criteria, and don't check them off just to pass this gate.

```bash
gh issue create --repo ${GH_REPO_ISSUES} --title "<task title>" --body-file <body_file>
```

Don't pass `--label` — Item Type on the board is the single source of truth for issue
classification; a GitHub label duplicating it drifts the moment Item Type changes and nothing
keeps them in sync.

Record each `issue_number` for the next step.

### Step 5: Get node IDs

```bash
gh api graphql -f query='
{
  repository(owner: "<owner>", name: "<repo-name-from-GH_REPO_ISSUES>") {
    i1: issue(number: <N1>) { id }
    i2: issue(number: <N2>) { id }
  }
}'
```

### Step 6: Add to the project (batch)

```bash
gh api graphql -f query='
mutation {
  a1: addProjectV2ItemById(input: { projectId: "<PROJECT_ID>", contentId: "<NODE_ID_1>" }) { item { id } }
  a2: addProjectV2ItemById(input: { projectId: "<PROJECT_ID>", contentId: "<NODE_ID_2>" }) { item { id } }
}'
```

Record each `item.id` (the `PVTI_...` project-item id — distinct from the issue's own node id).

### Step 7: Assign

- **Dev Task** and similar self-verified items: `${GH_ASSIGNEE_PRIMARY}` only.
- **Task/Backlog** (parent-tier, needs independent verification): `${GH_ASSIGNEE_REVIEWER}` +
  `${GH_ASSIGNEE_PRIMARY}` if `GH_ASSIGNEE_REVIEWER` is set, otherwise just
  `${GH_ASSIGNEE_PRIMARY}`.

```bash
gh issue edit <N> --repo ${GH_REPO_ISSUES} --add-assignee <username> [--add-assignee <username2>]
```

**Always verify after assigning** — GitHub silently drops an assignee who isn't a collaborator
on the repo, with no error:

```bash
gh issue view <N> --repo ${GH_REPO_ISSUES} --json assignees -q '.assignees[].login'
```

### Step 8: Set every field (batch mutation)

```bash
gh api graphql -f query='
mutation {
  s1: updateProjectV2ItemFieldValue(input: {
    projectId: "<PROJECT_ID>", itemId: "<ITEM_ID_1>", fieldId: "<STATUS_FIELD_ID>"
    value: { singleSelectOptionId: "<STATUS_OPTION_ID>" }
  }) { projectV2Item { id } }

  t1: updateProjectV2ItemFieldValue(input: {
    projectId: "<PROJECT_ID>", itemId: "<ITEM_ID_1>", fieldId: "<ITEM_TYPE_FIELD_ID>"
    value: { singleSelectOptionId: "<ITEM_TYPE_OPTION_ID>" }
  }) { projectV2Item { id } }

  env1: updateProjectV2ItemFieldValue(input: {
    projectId: "<PROJECT_ID>", itemId: "<ITEM_ID_1>", fieldId: "<ENVIRONMENT_FIELD_ID>"
    value: { singleSelectOptionId: "<ENVIRONMENT_OPTION_ID>" }
  }) { projectV2Item { id } }

  w1: updateProjectV2ItemFieldValue(input: {
    projectId: "<PROJECT_ID>", itemId: "<ITEM_ID_1>", fieldId: "<WEEK_FIELD_ID>"
    value: { iterationId: "<WEEK_ITER_ID>" }
  }) { projectV2Item { id } }

  e1: updateProjectV2ItemFieldValue(input: {
    projectId: "<PROJECT_ID>", itemId: "<ITEM_ID_1>", fieldId: "<EFFORT_FIELD_ID>"
    value: { number: <EFFORT_HOURS> }
  }) { projectV2Item { id } }

  d1: updateProjectV2ItemFieldValue(input: {
    projectId: "<PROJECT_ID>", itemId: "<ITEM_ID_1>", fieldId: "<DUE_DATE_FIELD_ID>"
    value: { date: "<TODAY_YYYY-MM-DD>" }
  }) { projectV2Item { id } }
}'
```

Every ID above (`<PROJECT_ID>`, every `<..._FIELD_ID>`, every `<..._OPTION_ID>`, `<WEEK_ITER_ID>`)
comes from the "Resolve the board's fields" query — never write a literal ID into this mutation
that didn't come from that response in the current run. Batch every item's aliases into one
mutation (`s1/s2`, `t1/t2`, ...). Issues from the same PR share one Environment (same base
branch) but can have different Item Type/Status.

Get today's date programmatically, don't hardcode it:

```bash
# PowerShell
$today = Get-Date -Format "yyyy-MM-dd"
# Bash
today=$(date +%Y-%m-%d)
```

### Step 9: Parent issue + link sub-issues

**9A — origin issue already exists (no new parent):** get its node id, `addSubIssue` each child
onto it, make sure it's on the board with fields set per the parent rule above, and if its body
doesn't yet reference this PR, append (don't rewrite) a `Refs <GH_REPO_CODE>#<PR_NUMBER>` line.

**9B — no origin issue (create a new parent):** its body always uses the member-facing template
(`github-issue.md` §3) even when every child is a technical Dev Task — write it fresh from the
member's point of view, don't paste the child's technical Requirement/Acceptance-Criteria
content into it. Get its node id, `addSubIssue` each child, add it to the board, assign both
`${GH_ASSIGNEE_REVIEWER}` + `${GH_ASSIGNEE_PRIMARY}` (or just Primary if no Reviewer is
configured), Item Type = Backlog (from a spec) or Task (from a PR), Status = Define (Backlog) or
Code Review→Testing per PR state (Task), **no Effort**, Week/Due Date same as the children.

### Step 10: After creation

Follow `reports-export.md` for where evidence lives and `task-sizing.md` for whether this needs
a full spec doc or just a one-line tracking entry — don't invent a different tracking location.

---

## Effort Estimation Guide (edit to match your team's actual estimates)

| Task type | Effort |
|-----------|--------|
| Copy/i18n only | 0.5h |
| UI component tweak | 1h |
| UI component rewrite | 1.5h |
| Logic/flow change | 2h |
| Full feature (multi-file) | 3h |

**Hard cap 6h/task** — if a real estimate exceeds it, split into smaller issues along a natural
boundary (per endpoint, per screen, per FE/BE layer) rather than cramming multiple pieces of
work into one Effort value to keep a single issue.

---

## Auth Requirements

The token needs the `project` scope to add/update project items:

```bash
gh auth refresh -h github.com -s project
gh auth status   # verify current scopes
```
