# Design Leadership

## Purpose

Dùng skill này để senior Product Designer hoặc Design Lead làm rõ rationale, điều phối stakeholder, facilitate workshop, dẫn dắt critique/review, phát triển năng lực đội và giữ quality bar có thể quyết. Nó biến bất đồng mơ hồ thành câu hỏi, evidence, options, trade-offs, authority và next action rõ ràng.

Leadership ở đây không đồng nghĩa với chức danh hay quyền ra mọi quyết định. Agent/Design Lead có thể tạo điều kiện để đội đóng góp và đưa recommendation; người chịu decision ownership vẫn giữ quyền quyết định cuối cùng theo `../_shared/GOVERNANCE.md` và `../_shared/DECISION_RULES.md`.

## Use When

- Cần giải thích design rationale, stakeholder brief hoặc evidence-based argument trước một decision.
- Cần facilitate workshop, brainstorming, alignment, conflict resolution hoặc cross-functional collaboration.
- Cần phân biệt critique exploratory với review có gate/decision.
- Cần mentoring, coaching, feedback, quality-bar improvement, design principles hoặc team-improvement recommendation.
- Cần escalate vì decision ownership, evidence, scope, risk hoặc authority chưa rõ.

## Do Not Use When

- Cần critique chi tiết một screen/artefact đã có: route screen critique capability (xem `../ROUTING.md` §5) theo `../ROUTING.md` §5.
- Cần quyết product problem, scope hoặc priority lần đầu: dùng `01-product-discovery`; cần evidence từ users: dùng `02`/`03`.
- Cần quality/accessibility/design-system execution trên artefact: dùng `08` để chọn bar và route specialist review.
- Cần pipeline kỹ thuật, commit, PR hoặc staffing/compensation decision: không thuộc skill này; route theo pipeline/Owner authority phù hợp.

## Inputs

**Required context**

- OWNER INPUT REQUIRED — Decision/problem, accountable decision owner, stakeholders, scope, deadline, authority boundary và desired outcome of the meeting or communication.
- Relevant research/findings, design options, constraints, decision records, prior agreements and quality/release risks with source and limitation.
- Artefact/brief version, target audience, platform/product context and any unresolved conflict stated by each side.

**Optional context**

- Workshop history, team capability signals, feedback themes, design principles, service metrics and previous improvement actions.
- Missing decision owner, stakeholder representation, user evidence, technical feasibility or approval authority.

## Context Loading

Đọc đủ `../_shared/GOVERNANCE.md`, `../_shared/EVIDENCE_RULES.md`, `../_shared/DECISION_RULES.md` và `../_shared/OUTPUT_STANDARDS.md` nếu chưa nạp trong lượt này; không nạp lại cùng nội dung. Đọc `../ROUTING.md` khi route chưa rõ hoặc cần specialist; đọc `../GLOSSARY.md` khi thuật ngữ chưa rõ.

Đọc `../_shared/RESEARCH_RULES.md` khi công việc gồm nghiên cứu người dùng hoặc desk research. Khi viện dẫn nguồn, đọc §B của rule này và trọn các mục được viện dẫn trong `../SOURCE_REGISTRY.md`, gồm giới hạn và trạng thái kiểm chứng; không mặc định nạp toàn registry.

Đọc Decision Register hiện có, rationale/evidence trace, stakeholder constraints, unresolved questions và required approval path. Không dùng influence để lách Owner; khi quyền quyết chưa rõ, ghi `OWNER INPUT REQUIRED` và escalate đúng scope trước khi tổ chức một meeting chỉ để “đồng thuận”.

## Owner-Friendly Explanation

Nhiều cuộc họp kẹt không phải vì mọi người bất đồng về thiết kế, mà vì đang nói về bốn việc khác nhau: ai được góp ý, ai đưa recommendation, ai phải approve, và ai sở hữu decision cuối. Đặt tên đúng việc đang diễn ra giúp người tham gia biết họ cần đóng góp evidence, chọn option, hay chỉ xác nhận một gate.

Consensus có giá trị khi nó làm lộ trade-off và tạo cam kết thực thi. Nhưng consensus không phải lúc nào cũng cần: người chịu decision ownership vẫn giữ quyền quyết. Chasing unanimous agreement là một hình thức trì hoãn, không phải collaboration tốt.

## Core Principles

- Tách bốn vai trong mọi meeting/brief; không dùng “sign-off” như từ thay thế cho cả bốn.

| Việc đang diễn ra | Câu hỏi để nhận ra | Output cần có |
|---|---|---|
| `Contribution` | Ai cung cấp context, evidence, risk hoặc option? | Input có source/scope; không tự thành decision. |
| `Recommendation` | Ai phân tích options và đề xuất hướng? | Rationale, trade-offs, confidence và what would change it. |
| `Approval` | Ai xác nhận gate, resource, compliance hoặc release authority? | Explicit status/authority; có thể không sở hữu product decision. |
| `Decision ownership` | Ai chịu trách nhiệm chọn option cuối và hậu quả? | Decision record/status; không bị thay bằng vote hay consensus. |

- Critique là peer input exploratory để cải thiện một option; review là gated assessment dẫn tới decision. Trước meeting phải nêu loại, question, authority, input and expected outcome. Running critique when a decision is needed produces ideas without conclusion; running review when exploration is needed closes options too early.
- Evidence-based argument bắt đầu từ problem, evidence/limitation, option và trade-off; không bắt đầu từ seniority, taste hoặc screen đẹp. Dùng thang nguồn tại `../_shared/EVIDENCE_RULES.md` §4 và không nâng assumption thành fact.
- EVIDENCE — DfE Design Skills Framework nêu Design communication, Designing together, Leading design, Evidence-based design và Iterative design trong framework riêng của DfE (`../SOURCE_REGISTRY.md` §2). Đây không phải cross-government mandate và không quy định một meeting format.
- Design rationale phải nói choice phục vụ goal/user/task nào, evidence nào chống đỡ, constraint nào áp dụng, alternative nào bị loại và điều gì sẽ làm lựa chọn đổi. Một rationale không nói được alternative dễ biến thành hậu-hợp-thức-hoá.
- Stakeholder management là làm expectation/authority/risk visible sớm: who needs to contribute, who must approve, who decides, khi nào và nếu không quyết thì chặn việc gì. Không phải chiều theo stakeholder có tiếng nói lớn nhất.
- Negotiation và conflict resolution bắt đầu bằng shared decision question, facts/unknowns, interest/constraint và alternatives. Không gọi một conflict là “communication issue” khi thực chất decision owner hoặc authority bị thiếu.
- Design principle phải giúp loại ít nhất một option trong một trade-off thật. Nguyên tắc không thể eliminate bất kỳ option nào là slogan, không phải principle; sửa nó cho observable, bounded và decision-relevant.
- EVIDENCE — SFIA dùng 7 responsibility levels: Follow, Assist, Apply, Enable, Ensure/advise, Initiate/influence, Set strategy/inspire/mobilise (`../SOURCE_REGISTRY.md` §1). Dùng chúng làm vocabulary cho scope trách nhiệm, không suy chức danh, reporting line hay salary.
- Mentoring giúp người khác tăng capability qua practice/reflection; coaching dùng câu hỏi để họ tự tạo insight/action; feedback mô tả observable behaviour/impact/next step. Không dùng bất kỳ cái nào để áp recommendation chưa có rationale.

## Evidence Requirements

Workshop Plan phải nêu decision question, meeting type, participants/their four roles, evidence inputs, limitation, facilitation method, agenda/timebox, decision path, documentation owner và escalation trigger. Không hứa consensus khi meeting thực sự chỉ cần contribution.

Stakeholder Brief và Design Review phải link options, evidence, uncertainties, trade-offs, recommendation, decision owner và impact of delay. Decision Log dùng đúng record và register ở `../_shared/DECISION_RULES.md` §4–§5; không tạo format cạnh tranh.

Team Improvement Recommendation cần observation/evidence về capability/process, affected scope, options, expected learning, owner, measurement/feedback signal và review date. Không chẩn đoán con người hoặc level responsibility từ title, impression hay một incident.

## Workflow

1. Nhận decision question, desired outcome, deadline, responsible decision owner và stakeholder map. Nếu ownership/approval route không rõ, mark `OWNER INPUT REQUIRED` và escalate trước facilitation.
2. Inventory evidence, constraints, prior decisions, assumptions and disagreements. Tách factual disagreement, preference, authority conflict và evidence gap; không giải chúng bằng một format meeting duy nhất.
3. Chọn mode: communication brief, workshop, brainstorming, critique, review, conflict-resolution conversation, mentoring/coaching or improvement review. Nêu rõ mode không dùng và vì sao.
4. Với workshop/brainstorming, thiết kế agenda gồm framing, silent/structured contribution nếu cần, option generation, evidence/trade-off review, decision or next-evidence step. Facilitation tạo space công bằng, không tạo fake consensus.
5. Với critique, giữ option mở, invite peer input theo question/quality bar, capture suggestions và owner of next iteration. Với review, trình evidence/options và close bằng decision status, approver/owner và blocked work.
6. Viết rationale/Stakeholder Brief theo Owner format ở `../_shared/OUTPUT_STANDARDS.md` §B. Khi recommendation làm thay product goal, scope, user trade-off hoặc risk acceptance, stop at OWNER DECISION.
7. Document decision using `../_shared/DECISION_RULES.md` §4–§5; communicate what was decided, what was not, rationale, dissent/limitations when material, owner and next step.
8. Sau meeting, coach/mentor on one observable capability or process; record Team Improvement Recommendation, signal to review and re-route design/quality/delivery work as needed.

## Methods

| Method | Hợp cho | Không hợp cho |
|---|---|---|
| Stakeholder Brief | Làm shared problem, evidence, options và decision path rõ trước meeting. | Thay decision record hoặc che EVIDENCE GAP. |
| Decision-focused workshop | Tạo contribution, so sánh trade-off và chuẩn bị/ra decision với owner rõ. | Ép unanimous agreement hoặc thay user research. |
| Brainstorming / brainwriting | Mở nhiều options sau khi problem/question đã rõ; brainwriting hữu ích khi một số người dễ lấn át. | Chọn winner, giải authority conflict hoặc chứng minh user need. |
| Design critique | Lấy peer input exploratory để cải thiện option còn mở. | Gated approval hoặc kết luận release readiness. |
| Design review | Đánh giá option/quality against stated bar để ra decision. | Ideation rộng hoặc góp ý không có decision question. |
| Conflict-resolution mapping | Tách interest, evidence, constraint, authority và options trong bất đồng. | Ép compromise khi một requirement/decision owner có quyền rõ. |
| Mentoring / coaching / feedback | Phát triển capability qua practice, reflection và observable next step. | Đánh giá salary/title hoặc thay performance process của tổ chức. |

## Decision Gates

Dừng OWNER DECISION khi recommendation đổi product goal, scope/MVP, priority, user-group trade-off, quality/release risk, budget/access/privacy/compliance, hoặc khi conflict không thể giải trong authority của meeting. Dùng status, record và register tại `../_shared/DECISION_RULES.md` §2–§5.

Escalate khi decision owner absent, approval and ownership conflict, evidence gap then chốt, deadline prevents a reversible learning step, or a participant seeks consensus to override responsible authority. Agent có thể facilitate/coach và recommend; Agent không tự claim approval or decision ownership.

## Outputs / Artifacts

```markdown
# WORKSHOP PLAN
**Decision question and meeting type**
<contribution / critique / review / decision workshop>
**Roles**
| Participant | Contribution | Recommendation | Approval | Decision ownership |
|---|---|---|---|---|
| | | | | |
**Evidence and gaps**
EVIDENCE — <inputs, source and limitation>
EVIDENCE GAP — <unknown and decision it limits>
**Agenda / facilitation / output**
<timebox, method, capture owner, decision or next-evidence path, escalation trigger>
```

```markdown
# STAKEHOLDER BRIEF
**WHAT WE KNOW**
EVIDENCE — <facts/findings and scope>
**WHAT WE DO NOT KNOW**
EVIDENCE GAP — <uncertainty>
**WHY IT MATTERS**
<outcome, task, risk>
**OPTIONS / TRADE-OFFS / MY RECOMMENDATION / CONFIDENCE / WHAT COULD CHANGE THIS RECOMMENDATION**
<complete each field>
**OWNER DECISION REQUIRED**
<owner, deadline, blocked work>
```

```markdown
# DESIGN CRITIQUE
Question: <what to improve; option remains open>
| Area | Peer contribution | Evidence / quality-bar reference | Suggested experiment or iteration | Owner |
|---|---|---|---|---|
| | | | | |
Outcome: <inputs captured; no approval/decision implied>
```

```markdown
# DESIGN REVIEW
Question: <gated assessment to decide>
| Option / area | Evidence / limitation | Quality or decision criterion | Finding | Recommendation | Decision impact |
|---|---|---|---|---|---|
| | | | | | |
Decision status: PENDING | APPROVED | MODIFIED | REJECTED | DEFERRED
```

```markdown
# DESIGN PRINCIPLES
| Principle | Observable meaning | Trade-off it resolves | Option it would eliminate | Boundary / exception |
|---|---|---|---|---|
| | | | | |
Test: if no credible option can be eliminated, rewrite or remove the principle.
```

```markdown
# TEAM IMPROVEMENT RECOMMENDATION
| Observation / evidence | Capability or process scope | Options | Expected learning / outcome | Owner | Feedback signal | Review date |
|---|---|---|---|---|---|---|
| | | | | | | |
```

```markdown
# DECISION LOG
Use the exact decision record in `../_shared/DECISION_RULES.md` §4.

**Decision Register**
| ID | Quyết định | Status | Chờ ai | Chặn việc gì |
|---|---|---|---|---|
| D-1 | | PENDING | Owner | |
```

Kết thúc mỗi deliverable bằng `Changes to Owner Input`, `Dropped / Deferred`, `Governance self-check` và, khi có decision, `Decision Register` theo `../_shared/OUTPUT_STANDARDS.md` §C.

## Handoff / Routing

Route concrete screen critique to screen critique capability (xem `../ROUTING.md` §5); route accessibility/design-system/platform quality execution through `08-design-quality` and `../ROUTING.md` §5. Handoff approved/modified decision records, dissent/limitations, ownership and next actions to `04`, `05`, `07` or `08` based on the work affected.

Route missing user evidence to `02`/`03`, changed problem/priority to `01`, and post-release metric questions to `06`. Leadership does not turn stakeholder preference into user evidence or a recommendation into decision approval.

For a solution workshop, `05` owns alternatives, trade-offs, prototype and validation artifacts. `09` owns facilitation, participation fairness, authority/conflict handling and decision mechanics. Route directly to `05` when only options are missing; involve `09` when the main uncertainty is how stakeholders contribute or decide. Keep one named owner for each artifact.

## Anti-patterns

- ❌ Gọi mọi người trong meeting là “approver”. / ✅ Tách contribution, recommendation, approval và decision ownership.
- ❌ Chờ unanimous consensus dù decision owner đã rõ. / ✅ Thu dissent/trade-off rồi để responsible owner quyết và ghi record.
- ❌ Chạy critique nhưng đòi sign-off. / ✅ Dùng critique để mở option; dùng review khi cần gate và decision.
- ❌ Gọi một principle là “đơn giản” nhưng không loại được option nào. / ✅ Viết observable trade-off và phép thử eliminate option.
- ❌ Dùng seniority hoặc taste thay evidence. / ✅ Nêu problem, evidence/limitation, options, trade-offs và điều sẽ đổi recommendation.
- ❌ Gọi một người “chưa đủ level” từ title hoặc một lỗi. / ✅ Đặt capability scope, observable feedback, practice và review signal.

## Sources

EVIDENCE — UK DfE Design Skills Framework, `../SOURCE_REGISTRY.md` §2, chống đỡ vocabulary Design communication, Designing together, Leading design, Evidence-based design and Iterative design; it is DfE’s framework, not cross-government guidance.

EVIDENCE — SFIA 9 responsibility levels, `../SOURCE_REGISTRY.md` §1, chống đỡ vocabulary for scope of responsibility only; it does not determine job titles or salary.

EVIDENCE — Shared governance and decision format, `../_shared/GOVERNANCE.md` and `../_shared/DECISION_RULES.md`, control authority and Decision Log mechanics; facilitation methods and templates are diễn giải của Agent.

## Example

ILLUSTRATIVE EXAMPLE — not project data

```markdown
# WORKSHOP PLAN
Decision question and meeting type: Review — should the approval-history filter ship with a saved-view shortcut, or should the shortcut be deferred?
| Participant | Contribution | Recommendation | Approval | Decision ownership |
|---|---|---|---|---|
| Product Designer | Interaction evidence and options | Yes | No | No |
| Developer | Feasibility constraint | No | No | No |
| Product Owner | Business context | May contribute | Yes for scope | Yes |
**Evidence and gaps**
EVIDENCE — Design QA shows the primary filter task works in staging; source: DQ-02, illustrative example.
EVIDENCE GAP — No user evidence establishes that saved views are needed in this release.
Agenda: frame decision (5m) → review evidence/options (15m) → trade-offs (10m) → Product Owner decision or research/defer path (10m).

# DESIGN PRINCIPLES
| Principle | Observable meaning | Trade-off it resolves | Option it would eliminate | Boundary / exception |
|---|---|---|---|---|
| Preserve task continuity | Users can recover context after an interruption | Compact UI versus recovery action | A shortcut that silently loses filters | Exception requires explicit Owner risk acceptance |
```

## Owner Decision

Present stakeholder or leadership decisions with `../_shared/OUTPUT_STANDARDS.md` §B. Decision Log remains the shared format in `../_shared/DECISION_RULES.md` §4–§5; do not replace it with workshop notes.

```markdown
### D-1 — Confirm decision ownership and next action
Decision status: PENDING
Date: <YYYY-MM-DD>
Decided by:
Question: <Who owns this decision, and which option or evidence step should proceed?>
Evidence: <labelled evidence, stakeholder constraints and gaps>
Options: <A / B / research more / defer / escalate>
Trade-offs: <outcome, user impact, risk, delay and relationship cost>
Recommendation: <agent recommendation>
Confidence: HIGH | MEDIUM | LOW — <why>
Would change it: <evidence or authority clarification that reverses the recommendation>
If MODIFIED:
Reopens when:
```
