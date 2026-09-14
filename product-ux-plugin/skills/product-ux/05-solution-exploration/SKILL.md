# Solution Exploration

## Purpose

Dùng skill này để mở nhiều solution cho một problem/opportunity đã traceable, chọn option có trade-off rõ, prototype ở fidelity vừa đủ, kiểm assumption với người dùng và iterate trước khi implementation đắt hơn. Workflow là Problem → Opportunity / HMW → Alternative Solutions → Prioritisation → Prototype → Validate → Learn → Iterate.

Brainstorming chỉ là một method để sinh option, không phải toàn bộ product process. Skill này không dùng một workshop hoặc một prototype đẹp để thay cho problem evidence, usability evidence hay Owner decision.

## Use When

- `03-research-synthesis` đã tạo problem/opportunity đủ rõ và đội cần khám phá hơn một solution direction.
- Đã có Task Flow và State Matrix từ `04-interaction-design`, cần kiểm thử usability của một thiết kế cụ thể với người dùng: vào Workflow theo Lối B.
- Cần chọn prototype fidelity theo question, lập Validation Plan hoặc chạy concept/usability evaluation.
- Cần so sánh options theo value, risk, impact/effort và evidence gap trước khi commit build.
- Cần tổng hợp Usability Findings, severity và Iteration Recommendation trước release/next round.

## Do Not Use When

- Problem, user need hoặc evidence trace chưa rõ: dùng `../03-research-synthesis/SKILL.md` hoặc quay về `../01-product-discovery/SKILL.md`.
- Cần thiết kế IA, navigation, detailed flows/states hoặc Edge Case Matrix cho direction đã chọn: dùng `../04-interaction-design/SKILL.md`.
- Cần định nghĩa KPI, experiment measurement hoặc đọc analytics signal: dùng `../06-data-informed-design/SKILL.md`.
- Cần một visual direction/UI implementation thay vì validation decision: route đến skill chuyên dụng tại `../ROUTING.md` §5.

## Inputs

**Required context**

- EVIDENCE — Problem statement, Opportunity/User Need, Evidence Map IDs, scope và limitations từ `03` or Owner-confirmed equivalent.
- OWNER INPUT REQUIRED — Product goal, decision to support, target users, release/time/cost constraints và decision owner.
- EVIDENCE — Existing concepts, feasibility constraints, IA/flow/state materials, accessibility/platform scope and previous evaluation evidence.

**Optional context**

- EVIDENCE — Analytics questions, Metric Definitions, prior experiment learnings và support evidence from `06`.
- EVIDENCE GAP — Unknown technical feasibility, participant access, critical edge-case policy hoặc outcome threshold needed to select an option.

## Context Loading

Đọc đủ `../_shared/GOVERNANCE.md`, `../_shared/EVIDENCE_RULES.md`, `../_shared/DECISION_RULES.md` và `../_shared/OUTPUT_STANDARDS.md` nếu chưa nạp trong lượt này; không nạp lại cùng nội dung. Đọc `../ROUTING.md` khi route chưa rõ hoặc cần specialist; đọc `../GLOSSARY.md` khi thuật ngữ chưa rõ.

Đọc đầy đủ `../_shared/RESEARCH_RULES.md` trước research/validation. Khi viện dẫn nguồn, đọc §B của rule này và trọn các mục được viện dẫn trong `../SOURCE_REGISTRY.md`, gồm giới hạn và trạng thái kiểm chứng; không mặc định nạp toàn registry.

Đọc Evidence Map/limitations từ `03`, User Flow/Task Flow/State Matrix từ `04` nếu đã có, và Measurement Plan từ `06` nếu success/guardrail cần được đo. Không bắt đầu bằng solution Owner nêu như thể đó là requirement; giữ nó là một option cho tới khi evidence/decision xác nhận.

## Owner-Friendly Explanation

Một opportunity có thể có nhiều ways to address; solution exploration giúp Owner nhìn các hướng trước khi đội đầu tư sâu vào một hướng. Trade-off Matrix không chọn hộ Owner: nó chỉ làm rõ mỗi option hứa đem lại gì, tốn gì, risk nào chưa biết và evidence nào có thể đảo kết luận.

Prototype là câu hỏi được làm hữu hình, không phải bản thu nhỏ của sản phẩm. Nếu cần kiểm structure hoặc wording, low fidelity thường đủ; đẩy lên high fidelity quá sớm khiến reviewer góp ý màu sắc khi thứ cần học là navigation hoặc task sequence.

## Core Principles

- Bắt đầu từ Problem/Opportunity/HMW traceable; HMW mở hướng solution chứ không được lén cài feature vào câu hỏi.
- Sinh nhiều alternatives trước prioritisation. Brainstorming, brainwriting, sketching, Crazy 8 và co-design là methods tùy câu hỏi, participant và risk; không method nào là nghi thức bắt buộc.
- So sánh options bằng outcome sought, evidence, impact/effort, Four Big Risks/constraint, accessibility/platform implications và unknowns; impact/effort là hỗ trợ thảo luận, không phải máy chấm điểm tự động.
- Chọn fidelity từ câu hỏi: structure/navigation → low; interaction clarity/task sequence → low hoặc medium; visual hierarchy/content confidence → medium; detailed behaviour/implementation handoff chỉ khi evidence cần high. Ghi question và deliberate exclusions trên prototype.
- Heuristic evaluation rẻ và nhanh nhưng không thay usability testing với real users: nó tìm principle violations, không tìm chỗ người thật bị kẹt. Xem ranh giới thuật ngữ trong `../GLOSSARY.md`.
- Task-based usability testing kiểm liệu participant có hoàn thành task trong context; concept testing kiểm value/understanding của direction, không chứng minh adoption sau launch.
- Ghi severity cho mỗi usability finding. Không có severity, list findings biến thành wish list và không biết điều gì phải sửa trước release.
- EVIDENCE — GOV.UK convention là 4–8 participants mỗi round và thêm rounds để học thêm, không phóng to một round thành statistical proof (`../SOURCE_REGISTRY.md` §3).

## Evidence Requirements

Mỗi option phải nối về Opportunity/User Need ID, constraints và explicit evidence gap. Evaluation evidence cần participant/task scope, method, prototype version, observed behaviour, limitations và source IDs; không biến một preference hoặc quote thành validated requirement.

Prototype Plan ghi test question, fidelity rationale, excluded details, tasks, participant criteria, success observation và decision it can change. Nếu prototype không thể trả lời decision, chưa nên làm nó.

Severity không phải fact tự nhiên: nêu rationale theo impact, frequency/evidence scope, persistence/recovery và release risk. Đừng bịa participant number, task-success rate hoặc preference; dùng `EVIDENCE GAP` khi project data chưa có.

## Workflow

**Lối A — từ problem/opportunity:** dùng khi chưa có direction cụ thể cần kiểm; chạy trọn workflow, bắt đầu từ sinh phương án ở bước 1–4.

**Lối B — từ `04-interaction-design`:** dùng khi đã có Task Flow, State Matrix và một thiết kế cụ thể cần kiểm thử usability; bỏ qua phần sinh và chọn phương án (bước 2–4), vào thẳng bước 5 để chọn fidelity, rồi lập Prototype Plan và Validation Plan. Lối B không miễn trừ việc phát biểu câu hỏi cần kiểm trước khi chọn fidelity; đây vẫn là ràng buộc cốt lõi của skill này.

1. Xác nhận traceable Problem, Opportunity/User Need, Product Goal, decision, constraints và evidence limitations; route back nếu problem chưa đủ rõ.
2. Viết Opportunity / HMW không solution-first; tạo alternatives bằng method nhỏ nhất phù hợp (solo sketch, brainwriting, group session hoặc co-design).
3. Mô tả từng option: outcome sought, core interaction, assumptions, feasibility/viability/usability risks, impact/effort, accessibility/platform implications và falsification evidence.
4. Chọn concept để prototype qua Trade-off Matrix; dừng OWNER DECISION nếu choice thay priority, MVP scope hoặc user trade-off.
5. Chọn fidelity từ validation question; annotate prototype với tested/not-tested để tránh feedback lệch chủ đề.
6. Lập Validation Plan theo question. Với concept/usability test có người dùng thật, bàn giao protocol/recruitment/consent/session execution cho `02`; `05` giữ question, prototype version, fidelity và task scope. Trực tiếp chạy expert heuristic evaluation/cognitive walkthrough khi phù hợp. Chỉ đổi research executor khi có Owner assignment rõ và vẫn áp contract của `02`; expert review không thay real-user evidence.
7. Với một vòng evaluation có scope task/prototype rõ, tổng hợp observations do `02` trả thành task-level findings có raw IDs, severity và Iteration Recommendation. Chuyển synthesis đa nghiên cứu hoặc findings làm đổi product framing sang `03`. Loop về `04` nếu IA/flow/state đổi và về `06` nếu cần post-launch measurement.

## Methods

| Method | Hợp cho | Không hợp cho |
|---|---|---|
| Brainstorming | Mở alternatives khi group có shared problem/context và facilitation giữ được divergence. | Thay discovery, evidence hoặc prioritisation. |
| Brainwriting | Sinh ideas công bằng hơn khi người nói nhiều có thể lấn át hoặc cần time to think. | Giải quyết policy/feasibility conflict không có decision owner. |
| Sketching / Crazy 8 | Nhanh tạo nhiều representations của flow/structure trước khi chi tiết hóa. | Kiểm visual polish hoặc production feasibility. |
| Co-design | Khám phá language, constraint và alternatives cùng participants khi partnership phù hợp. | Nhờ users quyết roadmap hoặc thiết kế production UI hộ đội. |
| Impact/effort comparison | Làm trade-off về expected value, cost và uncertainty visible. | Chứng minh impact hoặc chọn option bằng score giả chính xác. |
| Concept testing | Kiểm hiểu/giá trị của direction và assumptions trước detailed interaction. | Đo hành vi production hoặc task success của interaction chưa đủ thật. |
| Task-based usability testing | Quan sát người dùng cố hoàn thành task với prototype/flow. | Suy prevalence, demand toàn thị trường hoặc causal post-launch impact. |
| Heuristic evaluation | Tìm principle violations nhanh trước/sau test. | Thay usability test with real users. |
| Cognitive walkthrough | Rà goal/action/feedback for a known task, especially before recruiting. | Phát hiện unknown contexts/motivations của real users. |

## Decision Gates

Dừng ở OWNER DECISION khi chọn solution direction/MVP scope, chấp nhận user trade-off, dùng participant/personal data, thay success definition, hoặc release với critical/high-severity finding chưa được xử lý. Theo `../_shared/DECISION_RULES.md` §3–§5.

Agent được chọn ideation/evaluation method và prototype notation, miễn là nó khớp question. Agent không tự coi option thắng là approved, không tự chấp nhận severity risk, và không tự mở rộng prototype thành build scope.

## Outputs / Artifacts

```markdown
# SOLUTION OPTIONS
Problem / Opportunity: <ID and statement>
| Option | User outcome sought | Core concept | Assumptions | Evidence supporting / gap | Risks / constraints | What would falsify it |
|---|---|---|---|---|---|---|
| A | | | | | | |
| B | | | | | | |
```

```markdown
# TRADE-OFF MATRIX
| Option | Expected impact | Effort | Usability / feasibility / viability risk | Accessibility / platform implication | Evidence confidence | Cost of being wrong | Recommendation status |
|---|---|---|---|---|---|---|---|
| | | | | | | | PENDING |
```

```markdown
# PROTOTYPE PLAN
**Question to test**
<decision-relevant question>
**Fidelity**
<low / medium / high — rationale tied to question>
**Included**
<what is represented>
**Deliberately excluded**
<what reviewers must not evaluate yet>
**Failure mode to avoid**
<e.g. colour feedback when structure is the test>
**Tasks / scenarios**
<task IDs, starting context, success observation>
```

```markdown
# VALIDATION PLAN
| Question / hypothesis | Method | Participant / evaluator criteria | Prototype version | Task / prompt | Evidence captured | Limitation | Decision supported |
|---|---|---|---|---|---|---|---|
| | concept test / usability test / heuristic / walkthrough | | | | | | |
```

```markdown
# USABILITY FINDINGS
| ID | Finding | Evidence / observation IDs | Affected task | Severity | Rationale | Recommendation | Retest needed |
|---|---|---|---|---|---|---|---|
| UF-01 | FINDING — <what happened> | | | Critical / High / Medium / Low | impact + frequency + persistence/recovery + release risk | | Yes / No |
```

```markdown
# ITERATION RECOMMENDATION
| Finding / assumption | Severity or confidence | Option | Change / investigate / defer | Reason | Evidence needed next | Owner decision needed |
|---|---|---|---|---|---|---|
| | | | | | | |
```

**Severity scheme**

| Severity | Meaning | Release treatment |
|---|---|---|
| Critical | Blocks a primary task, risks loss/harm, or has no viable recovery. | Fix and retest before release; Owner explicitly accepts any exception. |
| High | Seriously impairs an important task; workaround is unreliable/costly. | Fix before release unless Owner records a bounded exception. |
| Medium | Causes repeated friction or error but a workable recovery exists. | Plan fix by priority; retest if changed flow carries risk. |
| Low | Minor friction or polish issue without meaningful task/outcome effect. | Batch or defer with rationale. |

Kết thúc mỗi deliverable bằng `Changes to Owner Input`, `Dropped / Deferred`, `Governance self-check` và, khi có decision, `Decision Register` theo `../_shared/OUTPUT_STANDARDS.md` §C.

## Handoff / Routing

Receive traceable Problem/Opportunity and limitations from `03-research-synthesis`. `05-solution-exploration` and `04-interaction-design` are siblings: use `05` to choose/validate direction, use `04` to make IA, flows, states and edge cases coherent; loop between them when prototype evidence changes structure.

Handoff selected option, Prototype/Validation Plan, Usability Findings, severity rationale and Iteration Recommendation to `08-design-quality` for design-quality/accessibility decisions and to `06-data-informed-design` for launch measurement. Route all real-user research execution to `02` unless the Owner explicitly assigns a different executor under the same protocol/consent/evidence contract. `03` owns cross-study synthesis and synthesis that changes problem framing; `05` may summarise bounded single-round usability evidence with raw IDs. `05` owns solution options and validation artifacts; involve `09` only when facilitation, participation, conflict or authority needs work. `09` does not take ownership of solution artifacts.

## Anti-patterns

- ❌ Gọi một buổi brainstorming là toàn bộ product process. / ✅ Bắt đầu từ problem evidence, tạo alternatives rồi validate một decision cụ thể.
- ❌ Làm high-fidelity vì muốn prototype trông thuyết phục. / ✅ Chọn fidelity theo question và ghi rõ phần chưa được kiểm.
- ❌ Để reviewer góp ý màu sắc khi cần kiểm structure. / ✅ Dùng low fidelity, task và prompt tập trung vào navigation/sequence.
- ❌ Dùng heuristic review thay usability test. / ✅ Dùng heuristic để tìm principle violation và test real users để thấy họ thực sự mắc kẹt ở đâu.
- ❌ Liệt kê finding không severity. / ✅ Chấm impact, frequency, persistence/recovery và release risk để quyết thứ tự sửa.

## Sources

EVIDENCE — SFIA 9 HCEV and USEV, `../SOURCE_REGISTRY.md` §1, chống đỡ ranh giới User experience design/evaluation; workflow, fidelity logic and templates are diễn giải của Agent.

EVIDENCE — UK DfE Design Skills Framework, `../SOURCE_REGISTRY.md` §2, chống đỡ Evidence-based design và Iterative design capability vocabulary; không tạo mandatory product process.

EVIDENCE — GOV.UK Service Manual, `../SOURCE_REGISTRY.md` §3, chống đỡ moderated usability-testing guidance và 4–8 participants per round convention; it is not statistical proof.

EVIDENCE — WCAG 2.2, `../SOURCE_REGISTRY.md` §5, chống đỡ phân biệt normative success criteria với informative Techniques when accessibility intersects with a prototype; it does not replace usability evaluation.

## Example

ILLUSTRATIVE EXAMPLE — not project data

```markdown
# PROTOTYPE PLAN
Question to test: Can analysts locate and resume a saved approval-history view?
Fidelity: low — structure, label and task sequence are the uncertainty; colour and detailed visual style are deliberately excluded.
Failure mode to avoid: reviewers commenting on styling while the navigation model is untested.
Task: Starting from the workspace, find a saved view and change one filter.

# USABILITY FINDINGS
| ID | Finding | Affected task | Severity | Rationale | Recommendation |
|---|---|---|---|---|---|
| UF-01 | FINDING — Participant looked under Reports, not Views, and could not recover without facilitator help. | Resume saved view | High | Primary task blocked; label/model mismatch; no self-recovery observed in this illustration. | Test alternative IA labels and entry points in next low-fidelity round. |
```

## Owner Decision

Present Solution Options and validation evidence using `../_shared/OUTPUT_STANDARDS.md` §B. Keep selection, MVP scope, risk acceptance and release exceptions PENDING until Owner responds.

```markdown
### D-1 — Approve option, validation scope and release-risk treatment
Decision status: PENDING
Date: <YYYY-MM-DD>
Decided by:
Question: <Which option should be validated/advanced, and which unresolved findings are acceptable?>
Evidence: <labelled options, findings, severity and limitations>
Options: <A / B / research more / defer>
Trade-offs: <learning, cost, user risk and delay>
Recommendation: <agent recommendation>
Confidence: HIGH | MEDIUM | LOW — <why>
Would change it: <evidence that reverses the recommendation>
If MODIFIED:
Reopens when:
```
