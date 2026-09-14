# Interaction Design

## Purpose

Dùng skill này để chuyển validated needs và problems thành Information Architecture (IA), navigation, flows, states và interaction behaviour nhất quán. Nó mô tả người dùng làm gì, hệ thống phản hồi thế nào và hồi phục ra sao, để implementation và evaluation không phải đoán từ một happy path.

Interaction Design không tự chứng minh problem đáng giải hay một solution được người dùng muốn. Khi problem, evidence hoặc option còn bất định, skill này làm việc cùng `03-research-synthesis` và `05-solution-exploration` thay vì thay thế chúng.

## Use When

- Problem/opportunity đã có evidence đủ để cần tổ chức nội dung, taxonomy, navigation hoặc task structure.
- Cần mô tả User Flow, Task Flow, state, validation, recovery, permission hoặc responsive behaviour trước khi build.
- Cần biến một selected concept/prototype thành Interaction Specification có thể review và test.
- Cần rà edge cases của hành động quan trọng trước design handoff hoặc usability testing.

## Do Not Use When

- Cần xác định problem, user need, priority hoặc outcome: dùng `01-product-discovery` và/hoặc `03-research-synthesis`.
- Cần sinh và so sánh nhiều solution hay chọn prototype fidelity: dùng `../05-solution-exploration/SKILL.md`.
- Cần giải thích funnel/metric hay đặt experiment measurement: dùng `../06-data-informed-design/SKILL.md`.
- Cần áp Apple platform guidance chi tiết: route sang skill `apple-hig` theo `../ROUTING.md` §5.

## Inputs

**Required context**

- EVIDENCE — Approved Problem statement, User Needs/Opportunities, relevant research findings và limitations từ `03` hoặc Owner-confirmed equivalent.
- OWNER INPUT REQUIRED — Target platform, product constraints, roles/permissions, content/data dependencies và decision owner.
- EVIDENCE — Existing IA, navigation, design system, platform conventions, accessibility requirements và known technical constraints.

**Optional context**

- EVIDENCE — Task observations, support issues, analytics questions và prototype feedback that affect a flow/state.
- EVIDENCE GAP — Unknown role rules, failure behaviour, responsive breakpoint behaviour hoặc data lifecycle that limits a specification.

## Context Loading

Đọc đủ `../_shared/GOVERNANCE.md`, `../_shared/EVIDENCE_RULES.md`, `../_shared/DECISION_RULES.md` và `../_shared/OUTPUT_STANDARDS.md` nếu chưa nạp trong lượt này; không nạp lại cùng nội dung. Đọc `../ROUTING.md` khi route chưa rõ hoặc cần specialist; đọc `../GLOSSARY.md` khi thuật ngữ chưa rõ.

Đọc `../_shared/RESEARCH_RULES.md` khi công việc gồm nghiên cứu người dùng hoặc desk research. Khi viện dẫn nguồn, đọc §B của rule này và trọn các mục được viện dẫn trong `../SOURCE_REGISTRY.md`, gồm giới hạn và trạng thái kiểm chứng; không mặc định nạp toàn registry.

Đọc problem evidence, content inventory, current navigation, role/permission policy, supported platforms và component constraints của dự án. Không tự đặt roles, technical behaviour hay accessibility conformance; ghi `EVIDENCE GAP` và gửi đúng câu hỏi cho Owner/engineering.

## Owner-Friendly Explanation

IA trả lời thông tin nằm ở đâu và gọi tên ra sao; taxonomy là hệ phân loại/đặt tên bên trong IA. User Flow là đường đi xuyên sản phẩm cho một goal có thể có nhiều nhánh; Task Flow là các bước cụ thể để hoàn thành một task. Xem `../GLOSSARY.md` để không biến một sơ đồ vừa quá mơ hồ vừa bỏ sót nhánh.

Một màn đẹp chỉ mô tả thành công vẫn chưa đủ: người dùng nhập sai, không có dữ liệu, mất mạng, bị từ chối quyền, đổi ý và cần hồi phục. State Matrix và Edge Case Matrix biến những trường hợp đó thành điều kiện review được trước khi chúng thành lỗi sau release.

## Core Principles

- Tổ chức IA từ user goal, content hierarchy, mental model và task frequency/importance; không từ sitemap nội bộ hoặc tên database.
- Giữ taxonomy nhất quán: label cùng ý phải cùng tên, category phải có boundary, và navigation phải giúp người dùng dự đoán nơi đến.
- Viết User Flow cho goal và branching; viết Task Flow cho một task. Ghi happy path, alternative path và error path thay vì gộp thành “user journey”.
- Model state trước screen: empty, loading, error, partial, success, disabled và read-only khi liên quan; mỗi state nêu trigger, message, action và transition.
- Với mỗi action quan trọng, xét ít nhất Success, Invalid input, Empty data, Duplicate, Permission problem, System failure, Network failure, User cancellation và Recovery.
- Thiết kế validation để người dùng hiểu lỗi, sửa được và không mất input; confirmation chỉ dùng khi hệ quả cần được hiểu; undo/recovery được ưu tiên khi action có thể đảo ngược.
- Responsive requirement là behavioural requirement: khi không gian/thiết bị đổi, nêu information priority, navigation, input, overflow, state và task continuity đổi thế nào; không chỉ ghi kích thước.
- EVIDENCE — Apple HIG và Material Design là platform guidance, không phải universal UX law; chúng xung đột về navigation, back behaviour, control placement và typography (`../SOURCE_REGISTRY.md` §10–§11). Không có một pattern cross-platform “đúng” do hai nguồn này áp đặt.
- EVIDENCE — Trong WCAG, success criteria, glossary definitions và Conformance là normative; Understanding và mọi Techniques là informative. Không dùng một listed technique không tự là WCAG failure (`../SOURCE_REGISTRY.md` §5).

## Evidence Requirements

Mỗi structure/flow quyết định cần trace về User Need, task evidence, content constraint, platform requirement hoặc stated assumption. Khi chọn navigation pattern hoặc interaction convention vì platform, nêu platform và retrieval date của guidance; Apple HIG và M3 không publish version/date để trích như release version.

IA label, role rule và error/recovery behaviour phải kiểm bằng source dự án hoặc Owner/engineering input. Nếu evidence chỉ nói user need mà chưa nói implementation behaviour, giữ solution detail là option để test, không gọi requirement.

## Workflow

1. Xác nhận problem, user goal, target platform, roles, constraints, primary tasks và decision đang cần hỗ trợ; kiểm evidence trace/limitations.
2. Inventory content, objects, labels, relationships và permissions; phác content hierarchy, taxonomy và navigation structure theo mental model cần hỗ trợ.
3. Chọn một goal; vẽ User Flow gồm entry/exit, happy, alternative và error paths. Tách Task Flow cho các tasks cần đặc tả.
4. Model States and transitions: empty/loading/error/success/partial/disabled/read-only; ghi system response, user action, validation, confirmation, undo và recovery.
5. Lập Edge Case Matrix cho mọi action important; xác định owner của policy/technical unknown thay vì lặng lẽ chọn một behaviour.
6. Viết responsive behavioural requirements và platform-specific references. Với Apple work chi tiết, route `apple-hig`; với Material/Android, nêu platform scope thay vì áp sang Apple/web.
7. Review Interaction Specification bằng task-based walkthrough; handoff sang `05` để prototype/test, hoặc lặp lại khi test/analytics trả evidence mới.

## Methods

| Method | Hợp cho | Không hợp cho |
|---|---|---|
| Content inventory and IA map | Làm rõ object, hierarchy, taxonomy, labels và navigation. | Chứng minh user preference hoặc task success. |
| Card sorting / tree testing | Kiểm taxonomy/label/discoverability khi có người dùng và content đủ rõ. | Thiết kế micro-interaction hoặc đo nhu cầu mới. |
| User Flow | Map một goal xuyên product với branches và dependencies. | Ghi chi tiết field validation của một task. |
| Task Flow | Đặc tả steps, decisions, system feedback của một task. | Thay IA hoặc cover toàn bộ product journey. |
| State modelling | Bắt empty/loading/error/permission/recovery behaviour. | Chọn visual style hay chứng minh usability. |
| Cognitive walkthrough | Kiểm liệu từng bước có visible goal/action/feedback cho task đã biết. | Thay usability test với người thật hoặc phát hiện unknown task context. |
| Platform-pattern review | Áp convention của một platform đã xác định. | Trộn HIG và Material thành một universal rule. |

## Decision Gates

Dừng ở OWNER DECISION khi thay đổi primary navigation, information hierarchy ảnh hưởng nhiều roles, permission model, destructive-action policy, cross-platform trade-off, hoặc requirement có EVIDENCE GAP then chốt. Theo record tại `../_shared/DECISION_RULES.md` §3–§5.

Agent có thể chọn notation, level of detail và thứ tự review. Agent không tự chốt role access, retention/deletion, irreversible action behaviour hoặc platform scope khi Owner chưa xác nhận.

## Outputs / Artifacts

```markdown
# INFORMATION ARCHITECTURE
**Scope / user goal**
<goal, target platform, evidence IDs>
| Content / object | Taxonomy / label | Parent / relationship | Navigation location | Role access | Mental-model rationale | Evidence / gap |
|---|---|---|---|---|---|---|
| | | | | | | |
```

```markdown
# USER FLOW
Goal: <user goal>
Entry: <entry condition>
Happy path: <step → step → success>
Alternative paths: <condition → branch → outcome>
Error paths: <failure → message/action → recovery>
Exit / resume: <completion, cancellation or saved progress>
```

```markdown
# TASK FLOW
Task: <specific task>
| Step | User intent/action | System response | Validation / confirmation | State / transition | Evidence / gap |
|---|---|---|---|---|---|
| | | | | | |
```

```markdown
# STATE MATRIX
| Surface / action | State | Trigger | User sees | User can do | System response | Recovery / transition | Role / permission |
|---|---|---|---|---|---|---|---|
| | empty / loading / error / partial / success / disabled / read-only | | | | | | |
```

```markdown
# INTERACTION SPECIFICATION
| Element / action | Intent | Trigger | Feedback | Validation | Confirmation / undo | Keyboard/touch behaviour | Responsive behaviour | Platform scope |
|---|---|---|---|---|---|---|---|---|
| | | | | | | | | |
```

```markdown
# EDGE CASE MATRIX
Important action: <name>
| Situation | Detection / trigger | User-facing response | Allowed action | Data preservation | Recovery / owner | Test evidence needed |
|---|---|---|---|---|---|---|
| Success | | | | | | |
| Invalid input | | | | | | |
| Empty data | | | | | | |
| Duplicate | | | | | | |
| Permission problem | | | | | | |
| System failure | | | | | | |
| Network failure | | | | | | |
| User cancellation | | | | | | |
| Recovery | | | | | | |
```

Kết thúc mỗi deliverable bằng `Changes to Owner Input`, `Dropped / Deferred`, `Governance self-check` và, khi có decision, `Decision Register` theo `../_shared/OUTPUT_STANDARDS.md` §C.

## Handoff / Routing

`04-interaction-design` và `05-solution-exploration` là siblings, không phải một bước bắt buộc trước bước kia. Dùng `05` khi direction/fidelity cần được khám phá và validated; dùng `04` khi structure, flows và states cần đủ rõ để đặc tả. Hai skill lặp: prototype/test trong `05` có thể trả evidence khiến IA, Task Flow hoặc State Matrix trong `04` đổi.

Receive approved problem/opportunity và limitations từ `03-research-synthesis`; handoff IA, Task Flow, State Matrix, state/edge-case unknowns và Interaction Specification sang `05` theo Lối B cho prototype/usability validation. Với Apple detail và accessibility review cụ thể, kiểm specialist availability và fallback theo `../ROUTING.md` §5.

## Anti-patterns

- ❌ Vẽ một luồng thành công rồi giao dev tự đoán các lỗi. / ✅ Dùng Edge Case Matrix cho đủ success, failure, cancellation và recovery.
- ❌ Dùng taxonomy theo tên database. / ✅ Đặt tên và nhóm theo mental model, task và content hierarchy.
- ❌ Gộp User Flow với Task Flow thành sơ đồ khó đọc. / ✅ Tách goal-level branches khỏi task-level interaction.
- ❌ Gọi HIG hoặc Material là luật UX cho mọi nền tảng. / ✅ Ghi platform scope và xử lý trade-off khi conventions xung đột.
- ❌ Coi không dùng WCAG Technique là lỗi conformance. / ✅ Đánh giá criterion normative; dùng Techniques như guidance informative.

## Sources

EVIDENCE — SFIA 9 HCEV, `../SOURCE_REGISTRY.md` §1, chống đỡ phạm vi User experience design; methods, templates và workflow là diễn giải của Agent.

EVIDENCE — Apple Human Interface Guidelines, retrieved 2026-09-07, `../SOURCE_REGISTRY.md` §10, chống đỡ Apple-platform conventions only; detailed Apple work routes to `apple-hig`.

EVIDENCE — Material Design 3, retrieved 2026-09-07, `../SOURCE_REGISTRY.md` §11, chống đỡ Material/Android conventions only; Jetpack Compose is the recommended Android platform, while Material Web and Android Views are maintenance-mode.

EVIDENCE — WCAG 2.2, `../SOURCE_REGISTRY.md` §5, chống đỡ normative/informative boundary; it does not make a specific UI pattern universally required.

## Example

ILLUSTRATIVE EXAMPLE — not project data

```markdown
# TASK FLOW
Task: An analyst saves a filtered approval-history view.
| Step | User intent/action | System response | Validation / confirmation | State / transition |
|---|---|---|---|---|
| 1 | Name view and select filters | Show matching records | Name required; inline error preserves filters | editing → valid |
| 2 | Save | Store view and confirm | Undo available after save | saving → success |

# EDGE CASE MATRIX
| Situation | User-facing response | Data preservation | Recovery / owner |
|---|---|---|---|
| Duplicate | Explain name already exists; offer rename or replace if policy permits | Preserve entered filters | Return to name field; policy is OWNER INPUT REQUIRED |
| Permission problem | Explain view cannot be shared with selected role | Preserve private draft | Choose allowed role or save private |
| Network failure | Show retry and offline status | Keep draft locally only if confirmed feasible | Retry; engineering confirms persistence |
| User cancellation | Ask only if unsaved edits exist | Do not save | Return to list |
```

## Owner Decision

Present IA/flow/state decisions with the Owner format in `../_shared/OUTPUT_STANDARDS.md` §B. Do not mark navigation, role, irreversible-action or cross-platform decisions approved without an Owner record.

```markdown
### D-1 — Approve interaction structure and unresolved policy
Decision status: PENDING
Date: <YYYY-MM-DD>
Decided by:
Question: <Which structure, role/policy behaviour and platform scope should proceed to validation/build?>
Evidence: <labelled user needs, task evidence, constraints and gaps>
Options: <A / B / defer>
Trade-offs: <discoverability, risk, implementation and affected roles>
Recommendation: <agent recommendation>
Confidence: HIGH | MEDIUM | LOW — <why>
Would change it: <evidence that changes the recommendation>
If MODIFIED:
Reopens when:
```
