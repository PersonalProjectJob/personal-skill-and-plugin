# Product Delivery

## Purpose

Dùng skill này để Product Design cộng tác xuyên implementation và release: chuẩn bị quyết định, làm rõ acceptance criteria, bàn giao đủ ngữ cảnh, đối chiếu build với thiết kế, hỗ trợ UAT và học sau phát hành. Design không mặc nhiên kết thúc ở handoff; vòng sở hữu là Design → Handoff → Implementation → Design QA → UAT → Release → Measure.

Đây là thực hành cộng tác sản phẩm, không phải quy trình branching, commit, PR hay CI. Những cơ chế kỹ thuật đó thuộc pipeline của repo; route sang `dispatch` và các rule của repo theo `../ROUTING.md` §5.

## Use When

- Có design direction đã được chọn và đội cần chuẩn bị implementation, handoff hoặc acceptance criteria.
- Cần làm rõ câu hỏi từ Developers về behaviour, states, content, responsive behaviour hoặc technical constraints.
- Cần Design QA trên build, hỗ trợ UAT, release UX check hoặc ghi nhận design debt.
- Cần nối release với Measurement Plan và post-launch learning của `06-data-informed-design`.

## Do Not Use When

- Problem, outcome, priority hoặc MVP scope chưa được Owner quyết: dùng `01-product-discovery`.
- Flows, states, edge cases hoặc solution direction chưa đủ rõ: dùng `04-interaction-design` hoặc `05-solution-exploration`.
- Cần chạy accessibility, token/component audit hoặc critique trên artefact cụ thể: route theo `../ROUTING.md` §5.
- Cần thực hiện pipeline kỹ thuật, tạo branch, commit, PR hoặc CI: dùng pipeline repo qua `dispatch`; đọc rule files được nêu trong `../ROUTING.md` §5, không gọi rule như một skill.

## Inputs

**Required context**

- Approved problem/solution decision, Interaction Specification, state/edge-case materials và validation limitations.
- OWNER INPUT REQUIRED — Release goal, scope, decision owner, stakeholder/UAT representative, timeline và risk tolerance.
- Known technical constraints, platform scope, existing component/design-system constraints, Definition of Done và current release process supplied by the team.

**Optional context**

- Backlog items, prototype findings, prior Design QA/UAT results, support issues và Metric Definitions.
- Unknown data migration, permission, performance, localisation, instrumentation hoặc rollback behaviour that limits release readiness.

## Context Loading

Đọc đủ `../_shared/GOVERNANCE.md`, `../_shared/EVIDENCE_RULES.md`, `../_shared/DECISION_RULES.md` và `../_shared/OUTPUT_STANDARDS.md` nếu chưa nạp trong lượt này; không nạp lại cùng nội dung. Đọc `../ROUTING.md` khi route chưa rõ hoặc cần specialist; đọc `../GLOSSARY.md` khi thuật ngữ chưa rõ.

Đọc `../_shared/RESEARCH_RULES.md` khi công việc gồm nghiên cứu người dùng hoặc desk research. Khi viện dẫn nguồn, đọc §B của rule này và trọn các mục được viện dẫn trong `../SOURCE_REGISTRY.md`, gồm giới hạn và trạng thái kiểm chứng; không mặc định nạp toàn registry.

Đọc decision records, selected option, Interaction Specification, design-system references, release process và Measurement Plan nếu có. Không suy ra technical constraint từ mockup; ghi `EVIDENCE GAP` hoặc hỏi Developers/Owner, rồi phản ánh tác động vào option hoặc acceptance criteria.

## Owner-Friendly Explanation

Handoff không phải lúc design “ném file qua tường”. Đó là lúc đội thống nhất user outcome, những hành vi phải đúng, phần nào chưa biết và ai quyết khi build gặp constraint. Điều này giảm việc phát hiện sai flow chỉ sau khi đã triển khai đắt hơn.

Design QA hỏi “build có khớp thiết kế và interaction spec không?” UAT hỏi “người dùng hoặc đại diện nghiệp vụ có xác nhận nhu cầu thật đã được đáp ứng không?” Hai việc có thể dùng chung build nhưng không thay nhau; SFIA tách UAT (BPTS) với UX evaluation (USEV), xem `../SOURCE_REGISTRY.md` §1.

## Core Principles

- EVIDENCE — Scrum Guide 2020 (November 2020) định nghĩa đúng 3 accountabilities: Product Owner, Scrum Master, Developers; 5 events: Sprint, Sprint Planning, Daily Scrum, Sprint Review, Sprint Retrospective; và 3 artifacts: Product Backlog, Sprint Backlog, Increment (`../SOURCE_REGISTRY.md` §4).
- Scrum Guide không định nghĩa designer, UX hay researcher role; “Developers” bao trùm các chuyên môn. Cách design cộng tác là product practice do đội chọn, không phải Scrum requirement.
- EVIDENCE — Backlog refinement là hoạt động ongoing để thêm description, order, size và chia nhỏ item; nó không phải một trong năm events và không tự là ceremony hay meeting bắt buộc (`../SOURCE_REGISTRY.md` §4).
- Discovery làm giảm uncertainty về giải pháp nên làm gì; delivery tạo implementation bền vững, tin cậy của điều đã quyết. Đây là practitioner framing của SVPG, không phải Scrum rule; SVPG mô tả hai hoạt động của một cross-functional team, không phải hai team tách biệt (`../SOURCE_REGISTRY.md` §7).
- Story points, velocity, sprint zero và dual-track agile là industry practices, không có trong Scrum Guide. Chỉ dùng khi đội nêu rõ mục đích, giới hạn và không biến chúng thành điều kiện để design được làm.
- `Owner` của bộ này và Scrum `Product Owner` có thể khác người; xác định authority cho từng decision theo `../GLOSSARY.md` trước khi xin approval.
- Product Backlog là nơi làm rõ thứ tự/giá trị các việc có thể làm; Sprint Backlog là plan cho Sprint; Increment là phần giá trị có thể kiểm. Design có thể đóng góp clarity, evidence và acceptance criteria, nhưng Product Owner giữ trách nhiệm ordering theo Scrum.
- Acceptance criteria là điều kiện kiểm được cho một item; chúng khác Definition of Done, vốn là điều kiện áp chung cho Increment. Criteria nêu observable behaviour và recovery, không chép lại pixel hoặc giả định implementation.
- Technical constraint là input cần trace: nêu constraint, source/owner, user/design impact, option và điều cần quyết. Không dùng “không làm được” như kết luận không có evidence.
- Release readiness gồm UX risk còn lại, Design QA, UAT scope, support/rollback communication và measurement readiness; không biến một checklist thành bằng chứng rằng outcome đã đạt.

## Evidence Requirements

Delivery Plan phải trace mỗi scope item về approved decision, user need, interaction/acceptance criterion, technical constraint và owner. Khi build khác spec, ghi observation về khác biệt trước khi kết luận là defect; có thể là constraint, deliberate change hoặc implementation error.

Design QA Report cần build/version, environment, task/state, expected behaviour, observed behaviour, evidence link, severity, owner và retest result. UAT cần criteria, representative, scenario, result và limitation; không gọi sign-off mơ hồ là UAT evidence.

Post-launch outcome/metric không được suy từ “đã release”. Handoff Measurement Plan, instrumentation gaps và guardrail concerns sang `06-data-informed-design`; áp dụng labels tại `../_shared/EVIDENCE_RULES.md` §1–§3.

## Workflow

1. Xác nhận decision đã approved, delivery scope, release goal, accountabilities, constraints, current working method và gates. Phân biệt Scrum facts với team practices trong Delivery Plan.
2. Làm backlog-ready cùng Product Owner/Developers: bổ sung description, order/size discussion khi đội cần, acceptance criteria, dependencies, states, error/recovery và open questions. Gọi refinement là ongoing activity, không phải Scrum event.
3. Chuẩn bị Design Readiness Checklist và Handoff Checklist: design link/version, task flows, states, content, component references, accessibility/platform route, analytics and unresolved decisions.
4. Trong Sprint Planning/Daily Scrum/Sprint Review/Retrospective, đóng góp khi có design/UX work liên quan: làm rõ user intent và trade-off, nhận implementation feedback, demo task outcome và cải thiện collaboration. Không tuyên bố Scrum bắt designer phải dự các events.
5. Trong implementation, trả lời clarification bằng cập nhật traceable vào handoff/decision record; khi constraint làm đổi user outcome, options hoặc scope, dừng OWNER DECISION thay vì âm thầm sửa mockup.
6. Chạy Design QA trên staging build theo primary task, alternative/error paths và responsive/platform scope. Triage mismatch: fix, accepted exception, investigate hoặc defer as design debt.
7. Hỗ trợ UAT trên staging với business/user representative và real-need scenarios. Tách failed acceptance criterion, UAT finding và design mismatch để người chịu trách nhiệm quyết đúng việc.
8. Trước production release, chạy Release UX Checklist, xác nhận support/rollback owner, instrumentation/guardrail readiness và known risks. Sau release, handoff sang `06` để đo và quyết iterate, investigate, stop hoặc scale.

## Methods

| Method | Hợp cho | Không hợp cho |
|---|---|---|
| Backlog-ready conversation | Làm rõ scope, dependencies, criteria và unknown trước implementation. | Thay Owner ordering hoặc biến thành mandatory Scrum ceremony. |
| Acceptance-criteria walkthrough | Chuyển task/state/rule thành điều kiện kiểm được với team. | Đặc tả architecture, commit process hoặc pixel-perfect implementation. |
| Design handoff | Chia sẻ design intent, states, assets, references và open decisions. | Tuyên bố build đã đúng hoặc thay Design QA. |
| Build-versus-spec Design QA | Kiểm task, state, interaction và visual hierarchy trên build. | Xác nhận business need đã được đáp ứng; đó là UAT. |
| Scenario-based UAT support | Giúp representative kiểm acceptance criteria trong business context. | Thay usability evaluation hoặc loại bỏ technical testing. |
| Release UX readiness review | Phơi bày release risk, support, rollback và measurement gap. | Chứng minh outcome/retention trước khi có post-launch data. |
| Design-debt review | Ghi và ưu tiên chênh lệch có tác động tích luỹ. | Gom mọi cosmetic preference thành debt không có impact. |

## Decision Gates

Dừng OWNER DECISION khi technical constraint làm đổi outcome, MVP scope, primary task, user-group trade-off, privacy/access, acceptance of unresolved high-risk issue, release exception hoặc rollback exposure. Dùng record tại `../_shared/DECISION_RULES.md` §3–§5.

Agent có thể đề xuất format handoff, sequence QA và cách làm rõ criteria. Agent không tự chấp nhận deviation tác động user outcome, không gọi UAT passed khi representative/authority chưa xác nhận, và không tự release.

## Outputs / Artifacts

```markdown
# DELIVERY PLAN
**Delivery goal and release scope**
OWNER INPUT REQUIRED — <approved outcome, release, owner>
| Item | Decision / user-need trace | Delivery status | Dependency / technical constraint | Acceptance-criteria owner | Open question / gate |
|---|---|---|---|---|---|
| | | Ready / In progress / Blocked / Deferred | FACT — <source> | | EVIDENCE GAP — <what limits decision> |
```

```markdown
# DESIGN READINESS CHECKLIST
| Check | Evidence / link | Status | Owner / next action |
|---|---|---|---|
| Approved decision and scope | | Ready / Gap | |
| Primary, alternative and error paths | | Ready / Gap | |
| States, content and responsive behaviour | | Ready / Gap | |
| Component/accessibility/platform route | | Ready / Gap | |
| Acceptance criteria and analytics needs | | Ready / Gap | |
| Technical constraints and open decisions | | Ready / Gap | |
```

```markdown
# ACCEPTANCE CRITERIA SUPPORT
Item: <backlog item>
| Scenario / precondition | User action | Expected observable result | Error / recovery | Evidence / open gap |
|---|---|---|---|---|
| | | | | EVIDENCE GAP — <if unknown> |
```

```markdown
# HANDOFF CHECKLIST
| Handoff item | Link / version | Recipient | Question or decision still open |
|---|---|---|---|
| Design intent and task flow | | Developers | |
| States / edge cases / content | | Developers, QA | |
| Component and platform references | | Developers | |
| Measurement / guardrail needs | | Analytics / product | |
```

```markdown
# DESIGN QA REPORT
Build / environment: <staging URL or build ID>
| ID | Task / state | Expected spec | OBSERVATION — build result | Impact / severity | Disposition | Owner / retest |
|---|---|---|---|---|---|---|
| DQ-01 | | | | Critical / High / Medium / Low | Fix / accepted exception / investigate / design debt | |
```

```markdown
# RELEASE UX CHECKLIST
| Check | Evidence | Status | Owner / contingency |
|---|---|---|---|
| Design QA disposition and retest | | Ready / Risk | |
| UAT scenario/result and limitation | | Ready / Risk | |
| Known user impact and support response | | Ready / Risk | |
| Rollback / incident contact | | Ready / Risk | |
| Metric, guardrail and instrumentation handoff | | Ready / Risk | |
| Design debt recorded | | Ready / Risk | |
```

Kết thúc mỗi deliverable bằng `Changes to Owner Input`, `Dropped / Deferred`, `Governance self-check` và, khi có decision, `Decision Register` theo `../_shared/OUTPUT_STANDARDS.md` §C.

## Handoff / Routing

Receive selected solution, Interaction Specification, state/edge-case matrix và validation limitations từ `04`/`05`. Route detailed accessibility, HIG, component/system, critique, microcopy and handoff mechanics to the existing specialist skills in `../ROUTING.md` §5; this document decides readiness and quality risk, not their execution mechanics.

Handoff Design QA/UAT outcomes, release version, unresolved design debt and instrumentation questions to `06-data-informed-design` for post-launch measurement. Route new user evidence to `02`/`03`; route a changed problem or priority to `01` instead of silently extending delivery scope.

## Anti-patterns

- ❌ Gọi backlog refinement là Scrum ceremony bắt buộc. / ✅ Gọi đúng là hoạt động ongoing và để đội chọn cách phối hợp.
- ❌ Nói Scrum bắt designer phải dự mọi event. / ✅ Mô tả participation là product practice theo nhu cầu collaboration.
- ❌ Bàn giao màn hình mà không có states, recovery hay open questions. / ✅ Bàn giao task intent, behaviour, constraints và decision trace.
- ❌ Dùng Design QA như UAT sign-off. / ✅ Tách build-versus-spec khỏi xác nhận nhu cầu nghiệp vụ/người dùng.
- ❌ Release xong rồi mới nghĩ đến metric. / ✅ Handoff measurement/guardrail và kiểm instrumentation trước release.
- ❌ Giữ chênh lệch lặp lại trong chat. / ✅ Ghi design debt với impact, owner, disposition và điều kiện mở lại.

## Sources

EVIDENCE — Scrum Guide 2020, `../SOURCE_REGISTRY.md` §4, chống đỡ accountabilities, events, artifacts và backlog-refinement boundary; delivery workflow là diễn giải của Agent.

EVIDENCE — SFIA 9 BPTS and USEV, `../SOURCE_REGISTRY.md` §1, chống đỡ ranh giới UAT với UX evaluation; templates và severity treatment là diễn giải của Agent.

EVIDENCE — UK DfE iterative design vocabulary, `../SOURCE_REGISTRY.md` §2, chống đỡ cải tiến lặp; không áp đặt một delivery process.

EVIDENCE — SVPG, `../SOURCE_REGISTRY.md` §7, chống đỡ discovery/delivery framing như practitioner practice, không phải Scrum requirement.

## Example

ILLUSTRATIVE EXAMPLE — not project data

```markdown
# ACCEPTANCE CRITERIA SUPPORT
Item: Resume a saved approval-history view.
| Scenario / precondition | User action | Expected observable result | Error / recovery | Evidence / open gap |
|---|---|---|---|---|
| Analyst has permission and a saved view | Select a saved view | Applied filters and result list are shown; view name is visible | If the saved view was deleted, explain it and return to list | EVIDENCE — approved Interaction Specification v3 |
| Analyst lost permission | Select the same view | Explain access changed; do not reveal records | Offer permitted views; preserve navigation context | OWNER INPUT REQUIRED — access-policy owner |

# DESIGN QA REPORT
Build / environment: staging build 42
| ID | Task / state | Expected spec | OBSERVATION — build result | Impact / severity | Disposition | Owner / retest |
|---|---|---|---|---|---|---|
| DQ-01 | Deleted saved view | Recovery message and return action | Build shows a blank list without explanation | High — user cannot recover task | Fix | Developers / retest on staging |
```

## Owner Decision

Present release-risk or scope choices using `../_shared/OUTPUT_STANDARDS.md` §B. Keep exceptions PENDING until the responsible Owner decides.

```markdown
### D-1 — Approve delivery exception or release UX risk
Decision status: PENDING
Date: <YYYY-MM-DD>
Decided by:
Question: <Which unresolved constraint, QA/UAT result or scope exception is acceptable for this release?>
Evidence: <labelled QA, UAT, constraint and measurement evidence>
Options: <fix before release / bounded exception / defer / do not release>
Trade-offs: <user impact, delivery delay, risk and learning>
Recommendation: <agent recommendation>
Confidence: HIGH | MEDIUM | LOW — <why>
Would change it: <evidence that reverses the recommendation>
If MODIFIED:
Reopens when:
```
