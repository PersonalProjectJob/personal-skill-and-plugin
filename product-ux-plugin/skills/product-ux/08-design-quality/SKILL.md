# Design Quality

## Purpose

Dùng skill này để quyết định product cần đạt quality bar nào, vì sao bar đó áp dụng, và bằng chứng nào đủ để nói rủi ro đã được xử lý. Phạm vi gồm consistency, accessibility, interaction quality, responsive behaviour, content clarity, platform conventions, design-system governance và design debt.

Skill này không là WCAG checklist thứ hai, design-system specification thứ hai, hay một audit mechanics thay thế. Nó phân loại finding và route review thực thi sang specialist skill phù hợp trong `../ROUTING.md` §5.

## Use When

- Cần chọn quality bar cho release, surface, platform, component hoặc design-system change.
- Cần phân biệt accessibility requirement với UX best practice, platform guidance hoặc team convention trong review comment.
- Cần tổng hợp Design Quality Review, Design System Audit, Component Audit, Accessibility Review hoặc Design Debt Report.
- Cần quyết quality risk, consistency trade-off, exception hoặc quality-improvement priority trước delivery/release.

## Do Not Use When

- Cần chạy accessibility review chi tiết trên một artefact/màn cụ thể: route accessibility review capability khi host có specialist (xem `../ROUTING.md` §5). Khi host không có specialist, dùng Minimum design accessibility triage trong `Methods` và `Outputs / Artifacts` chỉ để lấp gap ở tầng quyết định thiết kế; ghi giới hạn còn lại là `EVIDENCE GAP`, không đưa ra tuyên bố conformance.
- Cần audit token/component mechanics hoặc viết design-system specification: route `ckm:design-system` nếu host có skill này.
- Cần Apple-platform design detail: route `apple-hig`; cần critique màn cụ thể: route screen critique capability (xem `../ROUTING.md` §5); cần microcopy review: route UX copy review capability (xem `../ROUTING.md` §5).
- Chưa có problem, target user, platform scope hoặc selected direction: quay lại `01`, `04` hoặc `05` trước khi đặt quality bar.

## Inputs

**Required context**

- OWNER INPUT REQUIRED — Product/release scope, platform, intended users, target conformance level if one is required, risk owner và decision authority.
- Design artefact/build version, primary tasks, states, responsive behaviour, component references, existing design-system documentation and known design debt.
- Applicable regulatory/procurement/accessibility requirement or explicit absence of one, with source and scope.

**Optional context**

- Prior audit findings, usability evidence, support issues, technical implementation constraints and platform guidance retrieved for the target platform.
- Unknown assistive-technology support, semantic implementation, component ownership, version impact or target audience needs.

## Context Loading

Đọc đủ `../_shared/GOVERNANCE.md`, `../_shared/EVIDENCE_RULES.md`, `../_shared/DECISION_RULES.md` và `../_shared/OUTPUT_STANDARDS.md` nếu chưa nạp trong lượt này; không nạp lại cùng nội dung. Đọc `../ROUTING.md` khi route chưa rõ hoặc cần specialist; đọc `../GLOSSARY.md` khi thuật ngữ chưa rõ.

Đọc `../_shared/RESEARCH_RULES.md` khi công việc gồm nghiên cứu người dùng hoặc desk research. Khi viện dẫn nguồn, đọc §B của rule này và trọn các mục được viện dẫn trong `../SOURCE_REGISTRY.md`, gồm giới hạn và trạng thái kiểm chứng; không mặc định nạp toàn registry.

Đọc platform scope, design-system docs có thật, Interaction Specification, states, release criteria và prior findings. Không gọi một component “accessible” hoặc “conformant” khi chưa biết rendered implementation, page scope và applicable criterion; ghi `EVIDENCE GAP` rồi route review thực thi.

## Owner-Friendly Explanation

“Theo standard” là câu quá mơ hồ để ra quyết định. Một review comment có thể đang nói về luật WCAG, một UX practice, quy ước Apple, quy ước Material, hoặc rule riêng của design system. Năm loại này có trọng lượng khác nhau; gộp chúng lại khiến team hoặc làm quá mức, hoặc bỏ sót yêu cầu thật.

Quality review giúp Owner thấy loại rule, lý do nó áp dụng, evidence, impact và lựa chọn xử lý. Nó không hứa rằng một checklist pass sẽ tự động làm sản phẩm usable cho mọi người, hay rằng dùng component nổi tiếng tự động đạt conformance.

## Core Principles

- Mỗi finding phải thuộc đúng một trong năm category dưới đây; nếu liên quan nhiều category, tách thành các finding có relationship thay vì gọi chung là “the standard”.

| Category | Cách nhận ra trong review comment | Quyền lực / cách xử lý |
|---|---|---|
| `WCAG normative requirement` | Nêu success criterion, glossary definition hoặc Conformance requirement áp cho page/scope. | Requirement chỉ khi criterion áp dụng; review execution qua accessibility review capability (xem `../ROUTING.md` §5). |
| `UX best practice` | Nêu task clarity, consistency, error prevention/recovery hoặc usability rationale. | Khuyến nghị chuyên môn; cần evidence/impact, không gọi là conformance failure. |
| `Apple HIG guideline` | Nêu Apple platform scope và HIG convention. | Guidance của Apple platform, không phải universal law; route `apple-hig`. |
| `Material guideline` | Nêu Material/Android scope và M3 guidance. | Guidance cho Material/Android, không phải universal law. |
| `Team design-system convention` | Nêu token/component/pattern/version trong documentation của đội. | Internal convention; nêu owner/version và exception process, không nâng thành WCAG. |

- EVIDENCE — WCAG A, AA và AAA là cumulative; conformance claim theo từng page. AA là target thường dùng trong pháp lý/procurement, nhưng target thực tế phải do requirement/Owner xác nhận (`../SOURCE_REGISTRY.md` §5).
- EVIDENCE — Trong WCAG, chỉ success criteria, glossary definitions và Conformance section là normative. Understanding documents và tất cả Techniques, cả sufficient/advisory, đều informative; không dùng listed technique không tự là WCAG failure (`../SOURCE_REGISTRY.md` §5).
- EVIDENCE — WCAG 3.0 chỉ là Working Draft; không ghi thành requirement. Registry đánh dấu dates của WCAG 2.2 Recommendation/update cần re-verification, vì vậy không trình bày chúng như verified facts (`../SOURCE_REGISTRY.md` §5).
- WCAG conformance không tự chứng minh usability cho disabled people; Material/HIG component cũng không tự confer conformance. Cần xem task, implementation, context và evidence phù hợp.
- Design system làm scale consistency qua design tokens, components, controlled variants, patterns, documentation, ownership và version awareness. Nó không loại bỏ phán đoán về user need, platform scope hay quality trade-off.
- Review interaction quality theo primary task và states: discoverability, feedback, error prevention/recovery, keyboard/focus implications, responsive continuity, content clarity và semantic expectations. Route detailed implementation testing thay vì tự suy từ mockup.
- Contrast, target size, accessible authentication, labels/names, keyboard interaction, focus và assistive-technology considerations có thể là relevant review topics; criterion/requirement chỉ được khẳng định sau khi xác định page, technology, scope và applicable WCAG success criterion.
- Design debt là gap tích luỹ giữa sản phẩm thật với quality bar/design system đã thống nhất. Ghi impact, spread, owner, version context, decision và recheck condition; không biến preference đơn lẻ thành debt.

## Evidence Requirements

Mỗi review finding phải có artefact/build version, surface/page, affected task/state, category trong năm loại, applicable reference hoặc rationale, observation/evidence, user/business impact, owner, disposition và retest/verification need. “Looks inconsistent” không đủ để request implementation change.

Với WCAG, ghi criterion và scope khi đã xác định; nếu chưa xác định, ghi `EVIDENCE GAP` và route execution. Với team convention, liên kết documentation/version thật; nếu docs chưa tồn tại, ghi assumption hay gap, không bịa token policy. Với platform guidance, ghi target platform và retrieval date.

Accessibility Review phải tách stated conformance target, automated/manual evidence, assistive-technology/keyboard evidence, limitation và human usability evidence. Áp dụng evidence labels trong `../_shared/EVIDENCE_RULES.md` §1–§3.

## Workflow

1. Xác nhận scope, user tasks, platform, target quality/conformance, source of authority, release decision owner và existing system ownership.
2. Lập Quality Bar Map: áp dụng năm categories riêng; ghi requirement/guideline/convention nào thực sự liên quan và loại nào không liên quan.
3. Review task, state, content, responsive and recovery behaviour for consistency and UX quality; bảo toàn distinction giữa observation, finding và recommendation.
4. Kiểm accessibility specialist trong catalogue của host trước khi route detailed accessibility execution (xem `../ROUTING.md` §5). Nếu specialist có mặt, route sang đó và Minimum design accessibility triage chỉ là triage ban đầu; nếu không có, chạy triage tối thiểu ở tầng thiết kế, ghi `EVIDENCE GAP` cho semantic implementation, rendered behaviour, assistive technology, applicable criterion và mọi phần chưa kiểm. Triage không tạo tuyên bố conformance. Với Apple platform route `apple-hig`; với token/component mechanics route `ckm:design-system` nếu host có skill này; với critique/copy route specialist skill.
5. Tổng hợp outputs từ specialist reviews vào Design Quality Review, không copy checklist của họ. Triage finding bằng category, impact, scope, evidence confidence, owner và disposition.
6. Chạy Design System/Component Audit ở mức governance: documentation, ownership, version awareness, adoption/deviation, variant boundary và debt; không tự định nghĩa token architecture.
7. Trình options khi quality bar, exception, debt priority hoặc target conformance gây trade-off. Ghi approved exception và recheck condition trong Decision Register.
8. Handoff quality findings sang `07-product-delivery` để Design QA/release treatment; loop về `04`/`05` khi finding đổi flow, state hoặc solution.

## Methods

| Method | Hợp cho | Không hợp cho |
|---|---|---|
| Quality Bar Map | Phân loại authority trước review để tránh lẫn năm category. | Thay concrete audit trên artefact. |
| Task-and-state quality walkthrough | Rà consistency, recovery, content clarity và responsive continuity. | Claim WCAG conformance không có applicable-criterion evidence. |
| Accessibility review routing | Chọn specialist execution khi accessibility scope cụ thể. | Sao chép WCAG checklist vào deliverable này. |
| Minimum design accessibility triage | Khi host không có accessibility specialist, rà các quyết định thiết kế dễ tạo barrier và ghi finding/limitation để bàn giao. | Audit implementation, ánh xạ từng WCAG success criterion hoặc tuyên bố conformance. |
| Design-system governance audit | Làm rõ ownership, docs, version impact, variants và debt. | Thiết kế token/component architecture từ đầu. |
| Component audit | So sánh component use/deviation với documented convention. | Khẳng định component confers accessibility conformance. |
| Design-debt triage | Ưu tiên gap có impact/spread và decision owner rõ. | Gom taste/polish không có impact vào backlog debt. |

## Decision Gates

Dừng OWNER DECISION khi chọn conformance target, chấp nhận exception cho normative requirement hoặc release quality risk, thay team convention có ảnh hưởng rộng, ưu tiên debt có trade-off release/roadmap, hoặc unresolved issue chạm privacy, access hay compliance. Dùng record ở `../_shared/DECISION_RULES.md` §3–§5.

Agent có thể đề xuất quality bar, route execution và triage format. Agent không tự tuyên bố conformance, không tự waive requirement, và không đổi design-system convention đã được team chấp thuận.

## Outputs / Artifacts

```markdown
# DESIGN QUALITY REVIEW
Scope / build / platform: <version and target>
| ID | Task / state | Category | Reference or rationale | OBSERVATION / evidence | Impact | Disposition | Owner / verify |
|---|---|---|---|---|---|---|---|
| Q-01 | | WCAG normative / UX best practice / Apple HIG / Material / team convention | | | Critical / High / Medium / Low | Fix / exception / investigate / debt | |
```

```markdown
# DESIGN SYSTEM AUDIT
System documentation/version: <link or EVIDENCE GAP>
| Area | Documented token/component/pattern | Ownership | Version awareness | Adoption / deviation | Quality impact | Next action |
|---|---|---|---|---|---|---|
| Tokens | | | | | | |
| Components / variants | | | | | | |
| Patterns / documentation | | | | | | |
```

```markdown
# COMPONENT AUDIT
| Component / variant | Intended task/state | Used instances | Team-convention reference | Deviation | Category if separate | Decision / owner |
|---|---|---|---|---|---|---|
| | | | | | Team convention / UX best practice | |
```

```markdown
# MINIMUM DESIGN ACCESSIBILITY TRIAGE
Scope / design version / platform: <version and target>
Purpose: triage các quyết định thiết kế khi host không có accessibility specialist; checklist này không tạo ra tuyên bố conformance.
Route: <accessibility specialist when available; otherwise named handoff owner and EVIDENCE GAP>
| Check | Kiểm ở tầng thiết kế | Dấu hiệu hỏng | Finding / limitation / next action |
|---|---|---|---|
| Contrast | So sánh từng cặp foreground/background của text, icon, control và mọi state trên artefact; tra ngưỡng chính xác trong bản normative trước khi claim requirement. | Text, icon, border hoặc state chỉ phân biệt được ở điều kiện lý tưởng, hoặc thông tin chỉ đổi bằng màu. | |
| Focus order and visibility | Đi qua primary task bằng thứ tự focus được chú thích trong flow, kể cả modal, menu, error và return state; chỉ rõ focus indicator phải còn thấy. | Focus nhảy qua bước, vào vùng không liên quan, biến mất, hoặc indicator khó nhận ra. | |
| Keyboard operation and no focus trap | Mô phỏng thao tác primary task chỉ với keyboard trong flow và states; kiểm cách mở, dùng và đóng overlay. | Control chỉ thao tác được bằng pointer, không tới/activate được, hoặc focus không thoát được khỏi vùng. | |
| Touch target | Rà layout chật, responsive state và control cạnh nhau để xác nhận vùng chạm riêng biệt, dễ chọn; tra ngưỡng chính xác trong bản normative trước khi claim requirement. | Target nhỏ hoặc sát nhau đến mức dễ chạm nhầm, nhất là khi layout co lại. | |
| Labels and names | Đọc label, icon, helper copy và state như người không dựa vào hình thức; ghi rõ purpose/state mà implementation phải truyền đạt. | Icon hoặc control không có tên/purpose rõ, label mơ hồ, hoặc trạng thái chỉ hiện bằng hình thức. | |
| Error identification and repair | Chạy flow với input thiếu/sai trong từng state; kiểm lỗi chỉ ra chỗ nào sai, vì sao và cách sửa. | Chỉ có lỗi chung chung, field lỗi không nhận ra, hoặc người dùng không biết bước khôi phục. | |
| Heading structure | Vẽ outline heading theo content grouping và reading order dự kiến; nêu semantic intent khi handoff. | Nhóm nội dung không có heading, heading chỉ dùng để trang trí, hoặc cấp heading làm đứt mạch nội dung. | |
| Reflow at zoom | Xem layout với text/phóng to và breakpoint tương đương để kiểm thứ tự đọc, control, nội dung và thao tác còn liên tục. | Nội dung bị cắt, phải cuộn theo hai chiều để hoàn thành task, hoặc control/label tách khỏi nhau. | |
| Motion | Liệt kê animation, auto-update và timed transition; xác định thông tin thay thế, cách giảm/dừng motion hoặc state tĩnh. | Chỉ hiểu được trạng thái qua chuyển động, motion không có cách giảm/dừng phù hợp, hoặc thay đổi làm mất ngữ cảnh. | |
| Consistent help | Theo dõi các task cùng loại để so vị trí, tên gọi và đường vào help/support; ghi exception có chủ đích. | Help biến mất ở state rủi ro, cùng một help có tên/vị trí khác nhau, hoặc đường trợ giúp đổi khó đoán. | |

Không ánh xạ checklist này sang từng WCAG success criterion. Việc đó cần bản WCAG normative cùng page, technology và scope áp dụng; nằm ngoài phạm vi triage này.
```

```markdown
# ACCESSIBILITY REVIEW
Target: OWNER INPUT REQUIRED — <applicable target and authority>
| Surface/page | Task/state | WCAG criterion or EVIDENCE GAP | Evidence method | Result / limitation | Execution route | Retest owner |
|---|---|---|---|---|---|---|
| | | | keyboard / focus / labels-names / assistive technology / contrast / authentication | | accessibility specialist (availability check required) | |
```

```markdown
# DESIGN DEBT REPORT
| Debt ID | Gap from agreed bar/system | Scope / spread | User or delivery impact | Category | Owner | Disposition / recheck condition |
|---|---|---|---|---|---|---|
| DD-01 | | | | Team convention / UX best practice / other linked finding | | Fix / defer / accepted exception |
```

```markdown
# QUALITY RECOMMENDATION
**Quality bar and authority**
<five-category map and applicable scope>
**Evidence and limitations**
EVIDENCE — <review evidence and scope>
EVIDENCE GAP — <what blocks a conformance or release claim>
**Options and trade-offs**
<fix / staged remediation / exception / defer>
**Recommendation and decision needed**
<recommendation; OWNER DECISION if required>
```

Kết thúc mỗi deliverable bằng `Changes to Owner Input`, `Dropped / Deferred`, `Governance self-check` và, khi có decision, `Decision Register` theo `../_shared/OUTPUT_STANDARDS.md` §C.

## Handoff / Routing

`08-design-quality` prepares quality-bar recommendations and explains their authority; Owner approves the decision. Use the capability/dependency registry in `../ROUTING.md` §5 for accessibility, token/component, Apple, screen-critique and UX-copy execution. Confirm the exact skill name, availability and permitted scope before handoff; if a specialist is missing, report the evidence gap and continue independent quality-governance work.

Handoff categorised findings, quality-bar map, exceptions, debt and retest needs to `07-product-delivery` for Design QA/release disposition. Route interaction/solution changes to `04`/`05`, and research gaps about actual disabled-user usability to `02`/`03` rather than treating conformance as that evidence.

## Anti-patterns

- ❌ Gọi mọi comment là “the standard”. / ✅ Gắn đúng một trong năm category và nêu authority/rationale.
- ❌ Dùng WCAG Technique như requirement. / ✅ Kiểm success criterion/glossary/Conformance khi applicable; coi Techniques là informative guidance.
- ❌ Gọi WCAG 3.0 là requirement hiện hành. / ✅ Ghi đây là Working Draft và dùng target đã xác nhận.
- ❌ Nói component HIG/Material tự accessible. / ✅ Kiểm task, implementation, scope và criterion; route review thực thi.
- ❌ Viết design-system audit thành token spec mới. / ✅ Audit governance, ownership, docs, version awareness, adoption và deviation.
- ❌ Gọi design debt là mọi thứ chưa đẹp. / ✅ Ghi gap từ bar đã thống nhất cùng impact, spread và owner.

## Sources

EVIDENCE — WCAG 2.2, `../SOURCE_REGISTRY.md` §5, chống đỡ conformance levels, page scope, normative/informative boundary và Working Draft status of WCAG 3.0; dates marked partial are not asserted as verified.

EVIDENCE GAP — Không có nguồn nào trong registry xác minh từng cách kiểm cụ thể của Minimum design accessibility triage; `../SOURCE_REGISTRY.md` §5 chỉ bao hàm authority/boundary của WCAG và hiện là `PARTIAL`. No universal standard requires this checklist. Recommended practice based on: diễn giải triage ở tầng thiết kế của Agent, bị giới hạn bởi authority/boundary WCAG đã ghi tại `../SOURCE_REGISTRY.md` §5.

EVIDENCE — Apple Human Interface Guidelines, retrieved 2026-09-07, `../SOURCE_REGISTRY.md` §10, chống đỡ Apple-platform guidance only; detailed work routes to `apple-hig`.

EVIDENCE — Material Design 3, retrieved 2026-09-07, `../SOURCE_REGISTRY.md` §11, chống đỡ Material/Android guidance only; it does not confer accessibility conformance.

EVIDENCE — SFIA 9 USEV, `../SOURCE_REGISTRY.md` §1, chống đỡ phạm vi UX evaluation; triage, templates và routing are diễn giải của Agent.

## Example

ILLUSTRATIVE EXAMPLE — not project data

```markdown
# DESIGN QUALITY REVIEW
Scope / build / platform: Approval-history filter, staging build 42, web.
| ID | Task / state | Category | Reference or rationale | OBSERVATION / evidence | Impact | Disposition | Owner / verify |
|---|---|---|---|---|---|---|---|
| Q-01 | Apply filter with keyboard | WCAG normative requirement | EVIDENCE GAP — applicable success criterion must be confirmed by accessibility review | Focus disappears after opening the filter panel in staging | High — keyboard task cannot continue | Investigate | accessibility specialist (availability check required) / retest |
| Q-02 | Empty filter result | UX best practice | Recovery clarity for a primary task | Empty state gives no way to clear filters | Medium — user must guess recovery | Fix | Design + Developers / Design QA |
| Q-03 | Filter label | Team design-system convention | Filter component documentation v2 | A bespoke icon replaces documented labelled control | Medium — inconsistency and discoverability risk | Decide exception or adopt component | System owner |
```

## Owner Decision

Present quality-target, exception and debt-priority choices with the Owner format in `../_shared/OUTPUT_STANDARDS.md` §B. Do not treat consensus from a review as approval.

```markdown
### D-1 — Approve quality bar, exception or remediation priority
Decision status: PENDING
Date: <YYYY-MM-DD>
Decided by:
Question: <Which applicable bar, exception treatment or debt priority should govern this scope?>
Evidence: <categorised findings, authority, scope and limitations>
Options: <fix now / staged remediation / approved exception / defer>
Trade-offs: <user risk, compliance, consistency, effort and release timing>
Recommendation: <agent recommendation>
Confidence: HIGH | MEDIUM | LOW — <why>
Would change it: <evidence that reverses the recommendation>
If MODIFIED:
Reopens when:
```
