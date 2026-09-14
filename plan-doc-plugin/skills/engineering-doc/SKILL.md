---
name: engineering-doc
description: >
  Plan Part 2 of 3 — Engineering: solution vs codebase, technical design, To-Do list.
  Part of a 3-part plan flow — see "PLAN — trước / sau" below for the file convention.
---

# Engineering doc (Part 2)

**Readable name:** engineering doc · **PLAN Part 2**

## When to Activate

- Implementation planning; keywords: technical plan, codebase, files to change, todo, dev tasks.

## Role

Map the product plan to **this repo**: paths, architecture, **To-Do**. Full test scenarios → **qa-doc**.

## Sections (order)

1. **Solution vs codebase**  
2. **Technical**  
3. **To-Do List**  

---

### Solution vs codebase

```markdown
## Solution vs codebase
### Existing behavior
- `src/...` — …
### Changes required
| Area | File / module | Change |
|------|----------------|--------|
### Dependencies
- …
```

### Technical

Use `src/services/` for APIs (no raw `fetch` in components per project rules).

For **any user-visible copy** (labels, errors, empty states): plan i18n keys per the project's locale-file convention (e.g. `en.json` / `vi.json` pairs, same key structure) and its translation hook — do not leave hardcoded strings in components. If the `frontend-code-standards` skill is in use on this project, its data-boundary and i18n rules apply here too.

**Refactor gradually:** Do not scope a task as "rewrite the entire i18n / language-context layer". Write To-Do items per screen or epic (e.g. "Reviews modal: remove hardcoded strings + EN/VN keys"); a global context/provider migration is a follow-up once enough call sites have moved.

**GitHub issue (when fetching content via the API):** Read the token **only** from an environment variable (e.g. `GITHUB_TOKEN` / `GH_TOKEN`) — never hardcode it, never ask the user to paste it in chat, never write it into a committed file.

Optional Mermaid architecture in its **own** fenced block.

```markdown
## Technical
### Architecture
…
### Data & contracts
- …
### Risks & mitigations
- …
```

### To-Do List

```markdown
## To-Do List
### Data layer
- [ ] …
### Components & i18n
- [ ] …
- [ ] New strings: keys added to `en.json` + `vi.json` (if UI-facing)
### Integration
- [ ] …
```

Do not replace **qa-doc** test cases with a thin checklist.

---

## Checklist (Part 2)

- [ ] Changes reference real paths or modules  
- [ ] To-Do items assignable / estimable  

## PLAN — trước / sau

Trước: **product-design-doc** (Phần 1). Sau: **qa-doc** (Phần 3). Quy ước file & ticket đầy đủ —
xem "PLAN — bước tiếp theo" ở `product-design-doc/SKILL.md`.
