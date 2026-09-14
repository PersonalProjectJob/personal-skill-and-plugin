---
name: evidence
description: >-
  Use when a workspace already has E2E capability (a READY/PARTIAL verdict
  from the e2e-setup skill) and you need to execute test flows or test-case
  files, gather PASS/FAIL evidence organized by severity, auto-circle the
  failing element on screenshots, capture network/console debug evidence for
  a wrong API/response, bundle/publish results, and log them for the team.
  Triggers "/evidence", "run this test case", "grade QA", "circle the failure
  on the screenshot", "test this business flow".
---

# evidence — Execute tests/flows on a ready workspace, gather evidence, report PASS/FAIL

This skill is the **execution + reporting** half of your E2E evidence discipline. It runs after
the `e2e-setup` skill (see the companion `e2e-setup-plugin`) has already produced a
`READY`/`PARTIAL` verdict. `e2e-setup` handles whether the workspace can run a browser at all;
this skill handles running the test/flow, gathering evidence, and explaining *why* something
failed.

**Mandatory prerequisite:** `<workspace>/.e2e/env.json` must exist. Missing it → stop immediately
and say "run the e2e-setup skill on `<workspace>` first"; don't silently invoke provisioning
yourself.

## Configuration this skill reads

From `${REPO_ROOT}/.agent-rules.local` (see `.agent-rules.local.example`) — both optional, degrade
gracefully if unset:

| Variable | Meaning | If unset |
|---|---|---|
| `E2E_LOG_ROOT` | Absolute path, **outside any git worktree**, where the cross-task manager log (`LOG.md` + `thumbs/`) accumulates — see "Team-wide log" below | `log-append.mjs` is skipped; the mandatory per-task bundle (`FEATURE.md`/`manifest.json`/ZIP) still runs, it's just not rolled up into a team-wide log |
| `GH_REPO_ISSUES` | `owner/repo` of the issue tracker used by Mode 2's `Issue:` field (same variable as `github-issues-plugin`, reuse it if that plugin is already configured) | Mode 2 can't auto-detect `deployed`/`selftest` from issue Status; every run defaults to `selftest` |

## Mode 1 — run an existing flow JSON

`smoke.mjs` only does `goto` + shoot, so it **can't reach** states that only exist after an
interaction: a modal opened by a button, a form in an error state, a cart with items, a
`date → time → specialist`-style multi-step flow. To capture those states you go through
`flow.mjs`.

```bash
node "<workspace>/.e2e/flow.mjs" --flow <name> --workspace "<workspace>"
```

A flow is a JSON file under `.e2e/flows/` (template: `_TEMPLATE.json`). The engine **enforces**
four constraints — not documentation advice, but conditions for exit 0:

1. **Only real interaction verbs** (`click`/`fill`/`select`/`press`/`hover`/`check`/`scroll`/
   `reload`). No verb sets state or calls an internal render function directly — injecting state
   isn't E2E, so the engine doesn't open that door. `scroll` uses `mouse.wheel()` (a real
   synthetic input event, like a click) or `scrollIntoViewIfNeeded()` when moving toward a
   specific element — never `page.evaluate(() => scrollTo(...))`. `reload` calls `page.reload()`
   — a real action (like a person pressing F5), unlike `goto`-ing the same URL again, which
   doesn't trigger the same load lifecycle.
2. **Every `shot` needs ≥1 proof step** (`waitFor`/`expectText`/`expectVisible`/`expectUrl`/
   `expectUrlNot`/`expectRequest`) since the previous shot. Missing → `FLOW_FAILED` and **no image
   is produced**. `settle` is a plain wait, it does **not** count as proof.
3. **The flow must have ≥1 interaction.** Just `goto` + `shot` → `FLOW_FAILED`, reason "this is a
   smoke test disguised as a user flow".
4. **A shot taken after a scroll needs an `expectVisible` after the last scroll.** The engine
   requires that exact verb **and** confirms the target is actually within the viewport — a plain
   `waitFor` doesn't count. Missing → `FLOW_FAILED`. The shot manifest records `scrollY`, the
   scroll method/target, the expectation, and readiness.

| Flow verdict | Exit | Meaning |
|---|---|---|
| `FLOW_VERIFIED` | 0 | Reached the end of the flow, every image has proven its state |
| `FLOW_FAILED` | 3 | A step failed, or constraint 2/3/4 was violated. **That run's images are moved to `out/<flow>/REJECTED/` and renamed `REJECTED-*`** — so you can debug without anyone accidentally attaching them to an issue |
| `TARGET_UNREACHABLE` | 2 | No port is serving the app (probes 3000/3001/3002/5173/5174) |
| `BLOCKED` | 1 | No runner/browser available |

Besides images, every flow run also records a **Playwright trace** (`trace.zip`, open with
`npx playwright show-trace`) and a **video** (`.webm`) — a reviewer can replay the whole path, not
just look at the final image.

**Selector priority order**: `role` (accessibility tree, most stable) → `text` → `label` /
`placeholder` / `testId` → `css` (an escape hatch, counted into `escapeHatchSelectors` in the
output so a reviewer sees how much the flow leans on DOM structure).

**Secrets in a flow**: never write them literally. Use `"${E2E_OWNER_EMAIL}"` — the engine
interpolates it from env/`.env.local`, marks that step `valueMasked: true`, and **never** puts the
real value in the output.

**Login**: `--login ui` signs in through the real form and caches `storageState` into
`.e2e/state/<role>.json` (8h TTL, re-logs in automatically once expired). This is the difference
from an API-based login helper script some projects keep alongside the E2E kit (sign in via API,
inject a token into `localStorage`) — that's fine to *reach* a screen, but it does **not** prove
the login flow itself. If you need to prove login, use the flow; don't take the token shortcut.

⚠️ `.e2e/state/*.json` **contains a real session**. It lives under `.e2e/` so it's already covered
by `.git/info/exclude`, but don't copy it elsewhere, don't attach it to an issue.

Run all four viewports with one command (each viewport is a fresh context and re-runs the whole
flow):

```bash
node "<workspace>/.e2e/flow.mjs" --flow <name> --workspace "<workspace>" \
  --viewport all --evidence-root "<TaskFolder>"
```

This command automatically calls `bundle.mjs` once all 4/4 flows are green.

## Local bundle (mandatory)

If you already have evidence from another runner **and that runner produced a compatible
`run.json` in each viewport folder**, run bundle on its own:

```bash
node "<workspace>/.e2e/bundle.mjs" --evidence-dir "<TaskFolder>" \
  --feature "<feature name>" --environment staging --route "/route"
```

Bundle only PASSes when all four viewport folders have PNGs and a `run.json` carrying verdict
`FLOW_VERIFIED`, with the shot count matching the PNG count. It writes `FEATURE.md`,
`manifest.json`, `SHA256SUMS.txt` into TaskFolder and creates `<TaskFolder>.zip` next to it. This
is the core deliverable; it needs no GitHub/OAuth and works fine for a user who just wants
screenshots, saved, zipped, with a feature description.

## Publish to a GitHub Release (optional)

A GitHub Release's assets are a convenient evidence store: no Google Drive/Sheets OAuth consent
flow the user has to click through in a browser first — it reuses whatever `gh` session is
already logged in.

⚠️ **If the repo is private, an asset URL is NOT "anyone with the link can open it."** An
anonymous `curl` (with or without a bearer token) against `browser_download_url` gets **404**;
only `gh release download` or `gh api -H "Accept: application/octet-stream" .../releases/assets/<id>`
(using that same logged-in `gh` session) can fetch it. In practice the URL opens fine **in a
browser tab already signed in to GitHub with access to the repo** — just don't expect to paste
that link for someone without repo access, and don't use an unauthenticated `curl`/script to
"verify the link is alive" (it'll report a false 404, not a broken link).

```bash
node "<workspace>/.e2e/publish.mjs" --evidence-dir "<folder with the .png/.md just captured>" \
  [--repo owner/name] [--tag qa-evidence-2026-Wxx] [--slug <name>]
```

- **Package FIRST, never captures on its own** — run it after `capture.mjs`/`flow.mjs`, it takes a
  folder that already has images. No `.md` description already in the folder ⇒ it auto-generates
  a `MANIFEST.md` listing files + byte sizes, then zips it alongside the images. Both the manifest
  and the zip are built in a **system temp directory** — `--evidence-dir` is **never** written to
  (it never mutates the original evidence folder in your notes/vault).
- **The repo is NOT auto-detected from `--evidence-dir`** — an evidence folder is often a folder in
  a separate notes/vault repo with its own unrelated GitHub remote, nothing to do with the app
  repo. Resolution order: `--repo` → the `repo` field in `.e2e/env.json` (written by the
  provisioning script from the app workspace itself) → missing both ⇒ **fail clearly**, never
  guess.
- **`--tag` defaults to the ISO week** (`qa-evidence-2026-W35`, from system time) — avoids one
  evergreen release ballooning forever. To group by ticket instead, pass your own tag
  (`--tag qa-evidence-<ticket-id>`).
- **Files are filtered before zipping**: only evidence-like extensions (`.png/.jpg/.md/.zip/.webm/
  ...`) are kept, anything else is dropped and **reported explicitly** (`excluded: [...]`), never
  silently skipped. A filename matching a secret pattern (`.env`, `token`, `credential`,
  `password`, `apikey`, `.pem`, `.key`...) makes the **entire run fail hard** — there's no flag to
  suppress that check.
- **`--clobber` on upload** — calling it again (retry after a network error) doesn't fail with
  "asset already exists". The temp zip is deleted after a successful upload; it's kept (with its
  path in the error) if the upload fails, so you can debug.
- Prints **one line, `✅ Uploaded: <url>`**, before the full JSON — see the "operator-friendly
  final report" section below for why.
- No new package installs: zips with `Compress-Archive` (Windows) or `zip` (posix) — tools already
  on the system, doesn't touch the project's `package.json`/lockfile.

### Rendering an image inline in an issue/PR body

`publish.mjs` above **zips** the whole evidence folder — right for a downloadable bundle, but a
`.zip` URL does **not** render as an `<img>` when embedded with markdown `![]()` (GitHub only
auto-renders an image when the asset itself is an image file). When the goal is embedding exactly
one image **inline into a "Current"/"Expected"/evidence-table cell of an issue or PR** (instead of
a browser-based attachment upload), use `gh release upload` directly with the raw `.png`, skipping
`publish.mjs`:

```bash
# 1) Create/reuse a Release to hold the asset (any tag, e.g. named after the issue/ticket)
gh release create <tag> --repo <owner>/<repo> --title "<tag>" --notes "Evidence assets" \
  || true   # ignore the error if the release already exists

# 2) Upload the raw .png (no zip) — --clobber so re-running doesn't fail with "asset exists"
gh release upload <tag> "<path/to/screenshot.png>" --repo <owner>/<repo> --clobber

# 3) Get the asset URL and embed it with markdown image syntax in the issue/PR body
gh release view <tag> --repo <owner>/<repo> --json assets -q '.assets[].url'
# → https://github.com/<owner>/<repo>/releases/download/<tag>/<file>.png
# Embed: ![short description](https://github.com/<owner>/<repo>/releases/download/<tag>/<file>.png)
```

**Verified in practice**: posting a comment containing `![...](...png)` pointing at a release
asset, then reading it back with `gh api .../issues/comments/<id> -H "Accept: application/vnd.github.html+json" -q '.body_html'`
returns a real `<img src="..." style="max-width: 100%;">` wrapped in an `<a>` — genuine inline
rendering, not just a download link. The whole flow only uses an already-logged-in `gh` CLI — **no
browser, no cookies, no re-login needed.** Same private-repo caveat as `publish.mjs` above: only a
viewer already signed in to GitHub with access to `<owner>/<repo>` sees the rendered image — an
anonymous `curl` still gets 404.

**Don't use this for image upload (tried, does NOT work in an agent sandbox):** importing a real
browser's GitHub session cookie into a headless browser session to paste/upload an image through
the UI. In a sandboxed coding-agent environment this tends to crash on cookie decryption and fails
to keep a process alive between separate tool calls. Don't chase browser-cookie automation for
"automating GitHub image upload" — `gh release upload` above is cheaper, has no browser
dependency, and is verified to work.

## Team-wide log

`bundle.mjs` only creates `FEATURE.md`/`manifest.json` **inside that run's own evidence folder**.
Nobody wants to open N different bundle folders to know which feature was just tested — you want
one file, newest-first, a manager can skim. Run this right after `bundle.mjs` succeeds:

```bash
node "<workspace>/.e2e/log-append.mjs" --evidence-dir "<TaskFolder>" [--token "<external executor's self-reported token count>"]
```

- **Where it writes:** `${E2E_LOG_ROOT}/LOG.md` — **not** inside `workspace/.e2e/`. Reason: a
  task's evidence lives in `.e2e/out/` of a specific worktree, and that worktree **will get
  deleted** (`git worktree remove`); the log needs to live somewhere durable, outside every
  worktree, so it can accumulate across many tasks/machines. The provisioning script writes this
  path into `.e2e/env.json` (field `skillLogRoot`) at provision time, sourced from your
  `.agent-rules.local`'s `E2E_LOG_ROOT`; `log-append.mjs` reads that field itself — no need to pass
  it by hand unless you want to force a different location (`--log-dir`).
- **Thumbnail images are COPIED, not linked.** Each shot PNG is copied to
  `log/thumbs/<feature>-<timestamp>/` next to `LOG.md` — fully independent from the original
  `evidenceDir` (which disappears with the worktree). Not resized (avoids adding a dependency) —
  displayed small in the table via the original image's own dimensions; any Markdown renderer that
  supports `![]()` inside a table scales it to the column.
- **Entry format, newest on top:**
  ```markdown
  ## <feature> - Aug 25 2026 - 3m12s / token: not measured (main-loop has no tool to read back its own token count)

  - Environment: dev
  - Route: /dashboard/settings
  - ZIP: `82366705 bytes`, SHA-256: `3385cf1c...`

  | Shot (click the URL to open it as of capture time) | Desktop (1440x900) | Tablet Portrait (768x1024) | Tablet Landscape (1024x768) | Mobile (375x812) |
  |---|---|---|---|---|
  | **01-page-list**<br>[https://example.com/dashboard/settings](https://example.com/dashboard/settings) | ![](thumbs/.../desktop--01-page-list-desktop.png) | ... | ... | ... |
  ```
  Entry title follows this pattern: `"<feature> - <month day year, e.g. Aug 25 2026> - <total
  elapsed time and token spend>"`. The **Shot** column shows the (bold) name, then on the next line
  the **full URL**, in full — never hidden behind a text label — captured as `page.url()` at the
  exact moment of the shot; `flow.mjs` records `url` on every shot
  (`shots.push({ label, url: page.url(), ... })`, passed through into `run.json`/`manifest.json`);
  an older flow that predates this field makes `log-append.mjs` print
  `_(URL not recorded — flow.mjs predates this field, re-run)_` instead of guessing a link. Each
  viewport's header carries its real dimensions per `flow.mjs`'s own preset (never a made-up
  number).
- **Time: a REAL number, never guessed.** Take the summed `elapsedMs` across the 4 viewports in
  `manifest.json` (the actual time `flow.mjs` spent running) — not the whole chat session's
  elapsed time.
- **Token: NEVER fabricated.** A main-loop agent typically has no tool to read back its own total
  token count. Default to `not measured (...)`; only put a real number when `--token` is passed
  with a number an external executor (not the main loop) self-reported.
- No shots readable on disk (empty/corrupt bundle) ⇒ fail clearly, don't write a garbage entry to
  the log.
- **Durable across worktrees, deliberately NOT synced across machines.** Two different worktrees on
  the *same* machine both append correctly into the same `LOG.md` (each resolves the same
  `skillLogRoot` from its own `.e2e/env.json`). But if a *different* machine also has this skill
  installed, it gets its own separate `log/`, entirely local — it never sees another machine's
  entries. Per-machine, not synced, is the deliberate default; if you need cross-machine sync
  later, that's the place to change it (track `log/` in git + commit/push/pull inside
  `log-append.mjs`, or just sync `LOG.md` without `thumbs/`).
- **A machine/sandbox that doesn't have `E2E_LOG_ROOT` configured (a remote executor running on a
  different machine than whoever ran provisioning) ⇒ `log-append.mjs` fails clearly, doesn't write
  a garbage log, doesn't throw a raw stack trace.** `skillLogRoot` in `.e2e/env.json` is an
  ABSOLUTE path on the machine that ran provisioning — it only means something when
  `log-append.mjs` also runs on that same machine. Running on a different machine/sandbox (that
  path doesn't exist/isn't writable there) ⇒ the write is caught and reported clearly: use
  `--log-dir <a path writable on this machine>`, or skip `log-append.mjs` entirely — "Local bundle"
  above still gives you `FEATURE.md`/`manifest.json`/ZIP without a team-wide log. Don't invent a
  `--log-dir` to make it pass silently; ask whoever dispatched the run if a real team-wide log is
  needed for that remote run.

## Mode 2 — test by test case (`testcase-parse.mjs` + `testcase-report.mjs`)

**Mode 1** (plus the bundle/publish sections above — just capturing evidence for a hand-written
flow) **is unchanged**. Mode 2 is an ADDITIONAL path, used when you already have a list of test
cases (not a flow JSON) and want to know which case PASSes/FAILs, grouped by severity — borrowing
a 4×7 taxonomy (`critical/high/medium/low` × `visual/functional/ux/content/performance/console/
accessibility`), not a new invented scale.

**`Environment:` must come from the actual ticket/issue under test, never guessed/defaulted.** QA
tests against the **environment that was actually deployed** (recorded in the ticket or product
doc — test/staging/hotfix/production), not local sourcecode — so "is the local code up to date"
isn't the question here; the right question is **"did I test against the environment the ticket
names."** The `Environment:` field below drives `--env` passed to `flow.mjs`/`testcase-parse.mjs`
— getting it wrong can mean testing the wrong environment while still getting `FLOW_VERIFIED`.

**The `Issue:` field (optional) auto-determines mode — no need to set it by hand.** Set
`Issue: #<number>` pointing at an issue on your GitHub Projects board, and pass
`--issue-repo <owner>/<repo>` (or configure `GH_REPO_ISSUES` in `.agent-rules.local` — see
"Configuration" above) — `testcase-parse.mjs` then runs `gh issue view` to check Status:

| Issue Status | Mode | Constraint |
|---|---|---|
| `Testing` | `deployed` | `Environment` is mandatory; **only runnable against an already-deployed URL target** — a `dev`/`file` target gets auto-flagged `MODE_MISMATCH` by `testcase-report.mjs`, even if `flow.mjs` itself reports `FLOW_VERIFIED` |
| Any other value (including `In Progress`), or `Issue:` not set, or `--issue-repo` not passed | `selftest` | No extra constraint — target/environment are free, fits a dev self-checking before opening a PR |

`gh` failing (network/auth/issue doesn't exist) ⇒ a clear warning in `warnings`, auto-fallback to
`selftest` — a temporary GitHub API hiccup never hard-blocks the run.

**Test case file format** — Markdown, NOT a flow JSON (so QA/PM can write it without knowing the
technical syntax):

```markdown
# TC-001: Save account settings successfully

- **Feature:** Dashboard Settings
- **Environment:** staging
- **Issue:** #123
- **Route:** /dashboard/settings
- **Severity if it fails:** high
- **Category:** functional

| # | Step | Expected result |
|---|------|-------------------|
| 1 | Go to the settings page | See the "Account settings" heading |
| 2 | Click "Save changes" | "Saved" text appears |
| 3 | Reload the page | The value just saved is still there |
```

Three-step process — **Mode 1's rigor applies unchanged, never relaxed**:

1. **Parse (machine does this, deterministic)**:
   ```bash
   node "<workspace>/.e2e/testcase-parse.mjs" --file "<test-case>.md" --issue-repo <owner>/<repo>
   ```
   Only reads the table + metadata into structured JSON — it does **not** guess actions, doesn't
   run a browser. Missing Severity/Category or a value outside the enum ⇒ uses a default
   (`medium`/`functional`) with a `warnings` entry, not a hard fail (this affects report quality,
   not runnability). No table parses at all ⇒ fails clearly.
2. **Translate (the AGENT does this — the ONE place free-form reasoning happens in this flow)**:
   read the JSON from step 1, and for EACH row translate `Step` into exactly one real verb
   (`click`/`fill`/`scroll`/`reload`...) and `Expected result` into exactly one proof step
   (`expectText`/`expectVisible`), write out a normal `flow.json`, then run it through **the same
   `flow.mjs`** — no parallel engine, no shortcut. A row that can't be translated (too vague,
   element not found) ⇒ let `flow.mjs` fail naturally; never invent a guessed action just to make
   it pass.
3. **Aggregate results (machine does this, deterministic)**:
   ```bash
   node "<workspace>/.e2e/flow.mjs" --flow <generated>.json --workspace "<workspace>" \
     --out "<out-dir>" > "<out-dir>/flow-output.json" 2>&1
   node "<workspace>/.e2e/testcase-report.mjs" --testcase <parsed-testcase.json> \
     --run "<out-dir>/flow-output.json" --results-file "<TaskFolder>/testcase-results.json" --render
   ```
   Each test case's verdict = `flow.mjs`'s own verdict, never re-graded — `flow.mjs` already
   enforces "no shot slips through unproven", so a PASS here is as trustworthy as a Mode 1 PASS.
   **`--run` must point at the FULL saved stdout of `flow.mjs`** (`> file.json`), not just
   `run.json` — because `run.json` ONLY exists when the verdict is `FLOW_VERIFIED`; recording a
   FAILed test case requires reading from the saved stdout. Running `testcase-report.mjs`
   repeatedly with different test cases **accumulates** into the same `--results-file` (same id
   updates it, a different id appends) — no manual merging needed. `--render` writes
   `<results-file>.md`: total pass/fail, a table by severity, a detail table sorted by severity
   (most critical always shown first) — like a "top N things to fix" list.
4. **Package (optional)**: to zip it up with images, use `bundle.mjs`/`publish.mjs` as usual on the
   evidence folder from the test cases you ran — neither script needs to know anything about test
   cases, they just see a folder of images like always.

## Mode 3 — Adventure: survey a website you don't know yet (`recon.mjs` + `adventure.mjs`)

Modes 1 and 2 both **assume you already know where to go** — the flow JSON and the test-case
Markdown are both hand-written. Mode 3 fills the step BEFORE that: QA is handed an unfamiliar URL
and needs a map before writing the first test case.

```bash
node "<workspace>/.e2e/adventure.mjs" --pass 1 --workspace "<workspace>" --target "<url>"
```

**Two passes, with a human decision gate in between.** Pass 1 is a cheap survey (no screenshots,
no element measurement) that then prints a per-branch cost table using **real measurements**
(`avgNavMs` measured in that same pass, not a constant) — whichever branches get approved are what
Pass 2 actually screenshots. There's no hard silent cutoff: missing coverage is always a named
decision, logged in the report under a `user-deferred` code (distinct from `unreachable`).

**Recon runs before a single click.** `recon.mjs` collects routes from `sitemap.xml`, `robots.txt`,
path strings extracted from the JS bundle, and OpenAPI if exposed. For an SPA (React/TanStack-
style) the **bundle is the primary source** — `onClick → navigate()`-style navigation isn't
`<a href>`, so a link-based BFS stalls almost immediately. Recon returns two separate sets:
`discovered` (every route template) and `navigable` (directly reachable); an excluded route gets a
reason code (`param-unresolved` / `wildcard` / `robots-disallow`), it never silently disappears.

⚠️ **Read-only by default, and this is a safety constraint, not an option.** Only follows same-
origin links; does NOT click buttons, does NOT submit forms. There's no reliable heuristic to
distinguish `<button>Delete</button>` from `<button>View</button>` — icon-only buttons and i18n
break any text-based guess. Clicking buttons on a real environment is a destructive action.

**Three outputs**, written into `<TaskFolder>/` so `bundle.mjs`/`publish.mjs` can reuse it without
modification:

| File | Contents |
|---|---|
| `OBSERVED-ARCHITECTURE.md` | 9 sections: coverage (3 separate numbers), a 4-viewport route map, the nav tree & a Mermaid sitemap, API surface, auth gates, forms, client storage keys (values masked), what wasn't reached, and this document's own limits |
| `RISKS.md` | Two labeled blocks: **Measured** (DOM/geometry, 100% reproducible) and **Observed** (console/network/timing, allowed to differ between runs) |
| `report.html` | An offline dashboard: filter by route, switch view mode, click an image to zoom |
| `adventure-log.jsonl` | Raw log, accumulates across runs — adding an artifact later doesn't require re-crawling |

**The "Observed" block distinguishes three states, not two**: `not yet collected` (a route wasn't
visited this run) is different from `none` (a listener was attached, no event was seen). An early
version of this once printed "no console errors" without ever having attached a listener — in a QA
artifact that's worse than leaving it blank, since a reader might take it as a real all-clear.

**The document's name states its own limit.** A crawler sees URLs, the DOM, network, console. It
does NOT see the code's architecture, state management, or intent. Hence "architecture *observed*
from the browser" — no flag turns that caveat off.

## Turning an existing architecture doc into a Mermaid sitemap diagram

Once you have an `OBSERVED-ARCHITECTURE.md` (or a crawl log `adventure-log.jsonl`), this skill also
supports and standardizes turning the nav-tree structure into a **visual sitemap diagram in
Mermaid** (`flowchart TD` / `graph TD`).

### 1. Grouping & hierarchy (clusters & subgraphs)

Mermaid code is generated deterministically, clustered by URL prefix and screen context. Define
your own clusters to match your site's actual information architecture — don't reuse another
project's category names verbatim. A generic starting shape:

- **Core (`CAT_CORE`):** root domain `/`, top-level landing/marketing pages.
- **Content (`CAT_CONTENT`):** article/blog/docs-style routes.
- **Account (`CAT_ACCOUNT`):** auth, profile, settings routes.
- **Commerce (`CAT_COMMERCE`):** catalog, cart, checkout-style routes (if applicable).
- **Admin (`CAT_ADMIN`):** internal/back-office routes.
- **Legal (`CAT_GOVERNANCE`):** about, terms, privacy, partner-policy style routes.

Adjust names/count freely to whatever the actual site's sitemap looks like — these are placeholder
labels, not a fixed taxonomy.

### 2. Consistent styling classes

The sitemap diagram classifies each page type with a dedicated style class:

- `:::root`: deep indigo tone, bright border — the root domain.
- `:::page`: dark tone, light gray border — standard content pages.
- `:::form`: amber/orange tone — flags a page with a data-entry form or user interaction.
- `:::policy`: slate tone — policy/terms/privacy documents.
- `:::media`: emerald/green tone — news, podcast, video channels.
- `:::ai` (or another distinct accent): violet tone — an AI/ML feature area, if the site has one.

### 3. Standalone CLI (`sitemap-diagram.mjs`)

The kit ships a standalone tool to extract and refresh the diagram from any architecture markdown
file:

```bash
# Extract and print the Mermaid code to the terminal
node .e2e/sitemap-diagram.mjs --input OBSERVED-ARCHITECTURE.md

# Update OBSERVED-ARCHITECTURE.md in place (replaces/adds its diagram section)
node .e2e/sitemap-diagram.mjs --input OBSERVED-ARCHITECTURE.md --update --target https://example.com

# Write the diagram to its own SITEMAP.md file
node .e2e/sitemap-diagram.mjs --input OBSERVED-ARCHITECTURE.md --output SITEMAP.md
```

### 4. Safe Mermaid syntax rules for an agent redrawing the sitemap by hand

When reading `OBSERVED-ARCHITECTURE.md` to reconstruct the sitemap diagram:

- **Node ID:** normalize to alphanumeric, no spaces, no special characters (e.g. `n_settings`,
  `n_news`).
- **Node label:** always wrap as `["<b>Screen name</b><br/><code>/route/</code>"]`.
- **Escaping:** replace square brackets `[` `]` with parentheses `(` `)` inside labels so they
  don't break the Mermaid parser.
- **Fallback:** always keep the classic text-tree block inside
  `<details><summary>View as a text tree</summary></details>` to preserve terminal readability.

## Auto-circling the FAIL location

Every FAILed test case in Mode 2 automatically produces `*-annotated.png` (a red circle around the
failing element) when the FAILed step's locator resolves. No extra flag needed — always on. When
the locator can't resolve an element, there's no annotated image and `results.md` just links the
debug data that's available. This is not pixel-diffing against a baseline.

## Testing business logic at the network layer — the `expectRequest` step

When the business outcome isn't visible in the UI, add an `expectRequest` step to the flow JSON:

```json
{
  "expectRequest": {
    "urlPattern": "*/orders/*/confirm",
    "method": "PUT",
    "bodyIncludes": { "status": "confirmed" },
    "expectStatus": 200
  }
}
```

`urlPattern` is a simple glob, only `*` is supported. `bodyIncludes` and `expectStatus` are
optional. A FAIL at the network layer has no UI location to circle; use the debug evidence below.

## Network/console debug evidence on FAIL

Every FAILed case automatically writes a `*-DEBUG.json` next to the diagnostic image: the relevant
request/response (method, URL, body, status; sensitive fields masked), console errors, and page
errors at the moment of failure. `results.md` shows a summary with a link to the debug file and
the annotated image if one exists. A PASSed case keeps the compact format.

## Optimized for the operator

1. **Four standard viewports, each viewport is a fresh flow run.** Desktop `1440x900` (DSF 1);
   tablet portrait `768x1024`, tablet landscape `1024x768`, mobile `375x812` (the latter three at
   DSF 2, `isMobile:true`, `hasTouch:true`). Never reuse business state from a prior viewport.
   Mobile/tablet must walk the equivalent sub-screens/tabs as desktop; the landscape breakpoint
   decides its own real layout — the runner doesn't force a bottom-sheet/cart mode.
2. **First view ≠ flow evidence.** An image right after `goto` is orientation/smoke only. An
   interactive feature only PASSes once a real click/scroll/fill flow reaches the state that needs
   proving.
3. **Readiness is a gate with output, not a silent `catch`.** The gate records whether
   `networkidle` was reached or timed out, real loaders (`animate-spin`, progressbar,
   `aria-busy=true`), and font/image settling. Don't treat a generic `.animate-pulse` as "the"
   loader. A flow has its own business-level expectation; a network timeout still shows up in the
   manifest even when it isn't always a hard blocker (RUM/long-polling can legitimately keep the
   network busy).
4. **The folder tree and local bundle are mandatory.** `<Task>/desktop`, `<Task>/tablet/portrait`,
   `<Task>/tablet/landscape`, `<Task>/mobile`; after the flow you must have `FEATURE.md`,
   `manifest.json`, `SHA256SUMS.txt`, and a ZIP next to it. A GitHub Release is optional publish
   only. Simplest command:

   ```bash
   node "<workspace>/.e2e/flow.mjs" --flow <name> --viewport all --evidence-root "<TaskFolder>"
   ```

5. **The image must reflect the real UI.** Never use `page.evaluate`, inline styles, or script
   injection to fix a fixed navbar/sidebar or make the image look nicer. If a full-page shot
   exposes a real fixed-element bug, report it as a product bug or capture a viewport/segment
   shot instead. `page.evaluate` may only read metrics like `scrollY`, never mutate DOM/CSS/state.
6. **Evidence after a scroll must be auditable.** Prefer `mouse.wheel()` in controlled increments;
   `scrollIntoViewIfNeeded()` is only a fallback for locator stability. The last scroll must be
   followed by `expectVisible` before the click/shot; the gate checking the bounding box must
   intersect the real viewport, not just be present in the DOM. The shot's manifest entry records
   `scrollY`, the scroll target/method, the expectation, and readiness.
7. **Final chat report format — fixed template.** This is the format of the message you type for
   the user after a flow/bundle run finishes — **different** from the content of `FEATURE.md`/
   `REPORT.md`/`manifest.json` (those stay unchanged). Always follow this shape:
   - Short bullets: what was done, what was verified — no long prose, no re-summarizing the whole
     JSON.
   - A **"Deliverables"** section: one markdown link per line to the ZIP/images/`FEATURE.md`/
     `manifest.json` — keep it so filenames stay readable in chat, but note that **clicking such a
     link inside a coding-agent chat pane typically does NOT open a native file browser** (it's
     rendered as an internal chat link, not an OS-level hyperlink). If the user should be able to
     open it with one real click, actively open it yourself instead of waiting for them to click:

     ```powershell
     Start-Process explorer.exe -ArgumentList '"<absolute path to the evidence folder, or the folder containing the ZIP>"'
     ```

     Run this (via your shell tool) **right after** reporting — it doesn't replace the
     "Deliverables" section (still keep that for readable names/paths in chat), it's an ADDITIONAL
     active hand-off step. Pick the one parent folder that contains the most related deliverables
     (e.g. the `out/` folder holding both `<feature>-evidence/` and `<feature>-evidence.zip` next
     to each other) so you open exactly one window, not one per file.

     **`LOG.md` (the team-wide log) always lives outside the current session's working
     directory** (it's under wherever `E2E_LOG_ROOT` points, not the product repo currently open)
     — a plain chat-panel file link to it will typically fail with something like "can't read this
     file, it lives outside the working directory". For `LOG.md` specifically, use `/select,` to
     open a file browser right at that file (not just its parent folder):

     ```powershell
     Start-Process explorer.exe -ArgumentList '/select,"<absolute path to LOG.md>"'
     ```
   - Right below that, two real numbers: `ZIP: <bytes> bytes` and `SHA-256: <hash>` — obtained via
     `stat`/`sha256sum`/`certutil -hashfile`, never remembered or guessed from earlier output.
   - If a real code gate ran this turn (lint/typecheck/test/build), add one simple text block, one
     line per check `<check>: <PASS|FAIL|SKIP> (exit <code>)`, ending with `VERDICT: <PASS|FAIL>`.
     A task that only captures evidence and never touches code ⇒ **drop this block entirely**,
     don't fabricate one just for form's sake.
   - **Never fabricate a "Worked for Xm Ys" figure or a total token count.** A main-loop agent
     typically has no tool to read back its own elapsed time/total token count for the current
     session — say plainly "not available" instead of guessing. Valid numbers to quote: a
     subagent's own usage (from its completion notification) or a number an external executor
     self-reported (e.g. a dedicated "Token:" line your dispatch workflow requires when the
     executor is a different tool than the main loop).
   - If `log-append.mjs` ran (the team-wide log), add one final line pointing at the entry just
     written in `LOG.md` (absolute path — no need to link every thumbnail, they're already in that
     entry's table). Didn't run log-append (e.g. only ran smoke/PARTIAL, not eligible) ⇒ drop this
     line entirely.
