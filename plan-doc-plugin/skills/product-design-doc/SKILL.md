---
name: product-design-doc
description: >
  Plan Part 1 of 3 — Product / UX: root cause, Persona, Scenario, Audit, product
  Solution, User Flow (Mermaid), Wireframe. Part of a 3-part plan flow — see
  "PLAN — bước tiếp theo" below for the full sequence and file convention.
---

# Product-design doc (Part 1 — Product / UX)

**Readable name:** product-design doc · **PLAN Part 1**

## When to Activate

- Plan mode before engineering detail; keywords: product design, UX, Persona, Scenario, wireframe, user flow, root cause.

## Role

**Why / who / what’s wrong / product-level solution / user journey (diagram) / UI structure (wireframe).** Not file-by-file implementation (that is **engineering-doc**).

## Sections (order)

1. **Persona**  
2. **Scenario**  
3. **Audit** (problem + **root cause** when known)  
4. **Solution (Product & UX)** — goals, scope, metrics; not repo file lists  
5. **User Flow** — **Mermaid required**  
6. **Wireframe**  

---

### Persona

```markdown
## Persona
### Primary Users
- …
### Secondary Users
- …
```

### Scenario

```markdown
## Scenario
### Current State
…
### Desired State
…
### Business Impact
- …
```

### Audit

High-level areas only; deep mapping → **engineering-doc**.

```markdown
## Audit
### Problem / root cause
- …
### Codebase review (high level)
- **Areas touched**: …
### Gaps identified
1. …
```

### Solution (Product & UX)

```markdown
## Solution (Product & UX)
### Product goals
- …
### UX principles
- …
### In scope / Out of scope
- …
```

### User Flow

**Must** include Mermaid (`flowchart`, `sequenceDiagram`, or `journey`). No prose-only substitute.

- Node IDs: no spaces; complex labels: follow Mermaid quoting rules; no HTML entities in labels.

### Wireframe

```markdown
## Wireframe
### Component layout
…
### Responsive breakpoints
- …
```

---

## Checklist (Part 1)

- [ ] Root cause clear where relevant  
- [ ] Solution stays product/UX (no eng task list)  
- [ ] User Flow = valid Mermaid  
- [ ] Wireframe matches scenario + flow  

## PLAN — bước tiếp theo, quy ước file (3 phần)

Sau Phần 1: **engineering-doc** (Phần 2) → **qa-doc** (Phần 3). Một plan đầy đủ = **một** tài liệu
gồm 10 mục đúng thứ tự: Persona · Scenario · Audit · Solution (Product & UX) · User Flow · Wireframe ·
Solution vs codebase · Technical · To-Do List · Test Cases.

- **Đường dẫn**: `docs/06-tasks/{ticket}_{mô-tả-snake-case}_{YYMMDD}.md` (YYMMDD 6 số, mô tả snake_case).
- **Bắt buộc có URL GitHub issue đầy đủ** trong doc; chưa có thì hỏi user trước khi đặt tên theo ticket.
- **Đã có doc trùng ticket?** Hỏi cập nhật hay tạo mới. Cập nhật thì append `## Changelog` (mới nhất
  trên cùng), không ghi đè nội dung cũ.
- Không bỏ một trong ba phần khi user cần plan đầy đủ. User Flow chỉ bullet (không Mermaid) không tính
  là đạt.
