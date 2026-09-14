# Product Discovery

## Purpose

Dùng skill này để biến một ý tưởng hoặc yêu cầu sản phẩm thành một Product Decision Brief: bối cảnh, outcome cần đạt, bằng chứng hiện có, bất định, phương án và quyết định đang chờ Owner. Nó giúp phân biệt Business goal, Product goal và User goal trước khi đội cam kết một output.

Discovery giảm bất định về việc có nên giải một vấn đề và giải theo hướng nào; delivery là phần xây thứ đã được quyết. Xem định nghĩa dùng chung trong `../GLOSSARY.md` và ranh giới hoạt động trong `../SOURCE_REGISTRY.md` §7.

## Use When

- Chạy khi chưa rõ vì sao làm việc này, ai bị ảnh hưởng, hoặc outcome nào đáng theo đuổi.
- Chạy khi một đề xuất cần phân biệt buyer với user, business goal với user goal, hoặc output với outcome.
- Chạy khi cần so sánh phạm vi MVP, cơ hội, trade-off hay rủi ro trước một OWNER DECISION.
- Chạy lại sau `03-research-synthesis` khi finding mới làm thay đổi Problem statement, cơ hội hoặc ưu tiên.

## Do Not Use When

- Ý tưởng còn mơ hồ, demand chưa rõ, tiền đề cần bị thách thức, hoặc Owner đã nhảy thẳng vào giải pháp: route sang gstack `/office-hours` theo `../ROUTING.md` §4, rồi quay lại đây khi bối cảnh đã rõ.
- Đã có raw research nhưng chưa có finding: dùng `../03-research-synthesis/SKILL.md`.
- Câu hỏi là cách thu thập evidence từ người dùng: dùng `../02-user-research/SKILL.md`.
- Vấn đề đã được quyết và cần thiết kế/kiểm thử giải pháp: route sang `04-interaction-design` hoặc `05-solution-exploration` theo `../ROUTING.md`.

## Inputs

**Required context**

- OWNER INPUT REQUIRED — Product context: sản phẩm, product stage, hiện trạng, phạm vi và stakeholder có quyền quyết.
- OWNER INPUT REQUIRED — Business context: Business goal, buyer nếu khác user, ràng buộc, mốc thời gian và điều không thể thay đổi.
- EVIDENCE — Evidence hiện có: Owner-confirmed facts, analytics, research, tài liệu nội bộ hoặc competitive evidence, mỗi mục kèm nguồn và phạm vi theo `../_shared/EVIDENCE_RULES.md` §1.

**Optional context**

- OWNER INPUT REQUIRED — Các option đã được thảo luận, quyết định trước đó và điều Owner muốn giữ nguyên.
- EVIDENCE GAP — Cần biết current behaviour, mức độ nhu cầu, khả năng kỹ thuật hoặc điều kiện kinh doanh nếu các dữ liệu đó quyết định ưu tiên.

## Context Loading

Đọc đủ `../_shared/GOVERNANCE.md`, `../_shared/EVIDENCE_RULES.md`, `../_shared/DECISION_RULES.md` và `../_shared/OUTPUT_STANDARDS.md` nếu chưa nạp trong lượt này; không nạp lại cùng nội dung. Đọc `../ROUTING.md` khi route chưa rõ hoặc cần specialist; đọc `../GLOSSARY.md` khi thuật ngữ chưa rõ.

Đọc `../_shared/RESEARCH_RULES.md` khi công việc gồm nghiên cứu người dùng hoặc desk research. Khi viện dẫn nguồn, đọc §B của rule này và trọn các mục được viện dẫn trong `../SOURCE_REGISTRY.md`, gồm giới hạn và trạng thái kiểm chứng; không mặc định nạp toàn registry.

Nếu có brief, analytics, research hoặc decision record của dự án, đọc chúng trước khi viết. Không có chúng thì nêu `EVIDENCE GAP` hoặc `OWNER INPUT REQUIRED`, không suy diễn từ thị trường hay đối thủ.

## Owner-Friendly Explanation

Product Discovery trả lời một câu đơn giản: trước khi đầu tư làm thứ này, ta biết gì về vấn đề, ai được lợi, cái giá của từng hướng là gì, và Owner cần chốt điều gì. Output là thứ đội tạo ra; outcome là thay đổi có thể quan sát ở người dùng hoặc kinh doanh sau output đó — xem `../GLOSSARY.md`.

Buyer có thể trả tiền còn user dùng hằng ngày; khi hai nhóm khác nhau, brief phải cho thấy ai được lợi và ai chịu trade-off. Chi phí của việc tách hai vai là thêm một cột phân tích, nhưng không tách sẽ dễ tối ưu cho người mua mà làm hại người dùng, hoặc ngược lại.

## Core Principles

- Phát biểu Business goal, Product goal và User goal riêng rẽ; một option phục vụ hai goal mà hy sinh goal còn lại phải ghi trade-off.
- Viết Problem statement theo khuôn ai / trong hoàn cảnh nào / trở ngại gì / hệ quả gì; không đưa solution vào câu này. Xem `../GLOSSARY.md`.
- Đặt current behaviour trước proposed feature. Một competitive pattern chỉ là context hoặc evidence về thị trường, không phải user need; `competitor pattern → user need` bị cấm theo `../_shared/EVIDENCE_RULES.md` §2.
- Xác định product stage vì loại evidence hợp lý khác nhau giữa ý tưởng, sản phẩm mới và sản phẩm đã vận hành; không tự bịa stage khi Owner chưa xác nhận.
- EVIDENCE — SVPG mô tả Four Big Risks: Value, Usability, Feasibility và Business viability. Đây là practitioner framework, không phải chuẩn hay taxonomy đầy đủ; ethical, legal, privacy, security và accessibility risks không nằm trong bốn nhóm này (`../SOURCE_REGISTRY.md` §7).
- Dùng MVP là phiên bản nhỏ nhất đủ để học điều cần học hoặc giao giá trị thật, không phải bản rút gọn của roadmap. Scope MVP phải nêu learning hoặc value sẽ kiểm được.
- Ghi assumptions bằng `ASSUMPTION — NOT YET VALIDATED`, rồi chuyển assumption quan trọng thành HYPOTHESIS có cách chứng minh sai.

## Evidence Requirements

Áp dụng 11 evidence labels, authority ladder, six forbidden transformations và anti-hallucination list của `../_shared/EVIDENCE_RULES.md`; không nhắc lại chúng ở đây.

Một Product Decision Brief đủ để trình gate khi có Product context, Business goal, Product goal, User goal, constraints, risk view, tối thiểu hai options có trade-off, RECOMMENDATION, Confidence, và điều có thể làm khuyến nghị sai. Thiếu evidence then chốt vẫn có thể trình, nhưng decision record phải nói rõ `EVIDENCE GAP` và status giữ `PENDING`.

Mọi claim về current behaviour phải có nguồn/phạm vi; mọi unknown phải ghi `EVIDENCE GAP`. Competitive analysis, khi có, phải ghi nguồn, ngày và phạm vi; nó không thay user research.

## Workflow

1. Xác nhận Product context, product stage, stakeholder, decision owner và điều Owner đã yêu cầu; ghi thay đổi vào deliverable theo `../_shared/GOVERNANCE.md`.
2. Tách buyer và user; viết Business goal, Product goal, User goal, outcome cần quan sát và output đang được đề xuất.
3. Inventory evidence, facts, assumptions, current behaviour và constraints; phân nhãn từng item theo `../_shared/EVIDENCE_RULES.md` §1.
4. Frame Problem statement, liệt kê Opportunities không gắn solution, và xếp Four Big Risks cùng các rủi ro ngoài framework.
5. Nếu premise mơ hồ hoặc solution-first, ghi route sang `/office-hours` trong brief, không fork hay ghi đè workflow đó; khi `/office-hours` trả bối cảnh, ghi route quay lại `01-product-discovery`.
6. So sánh ít nhất hai option, gồm MVP scope nếu phù hợp; nêu benefit, cost, affected stakeholder, trade-off, evidence gap và cách falsify assumption.
7. Đưa RECOMMENDATION, mức Confidence và OWNER DECISION; chỉ Proceed sau `APPROVED` hoặc `MODIFIED` theo `../_shared/DECISION_RULES.md`.

## Methods

| Method | Hợp cho | Không hợp cho |
|---|---|---|
| Product context mapping | Làm rõ product stage, stakeholder, buyer/user, goals và constraints. | Không chứng minh user need hay demand. |
| Evidence and assumption inventory | Phân loại cái đã biết, chưa biết và assumption cần kiểm. | Không thay nghiên cứu hoặc analytics. |
| Opportunity framing | EVIDENCE — Product Talk nêu opportunity là nhu cầu/pain/mong muốn chưa gắn solution; dùng để giữ nhiều hướng giải. | Không dùng để quyết ưu tiên khi chưa có evidence (`../SOURCE_REGISTRY.md` §8). |
| Competitive analysis | Dùng để hiểu context, pattern và option thị trường khi nguồn ghi rõ. | Không dùng để suy user need, copy capability, hay thay user research. |
| Risk review | Dùng Four Big Risks như câu hỏi phát hiện Value, Usability, Feasibility và Business viability risk, bổ sung ethical/legal/privacy/security/accessibility risk riêng. | Không coi bốn nhóm là checklist đầy đủ hoặc evidence rằng risk đã được xử lý. |
| Option comparison | Dùng khi Owner cần chọn scope, thứ tự hoặc hướng MVP. | Không dùng khi premise chưa đủ rõ; route `/office-hours` trước. |

## Decision Gates

Dừng ở OWNER DECISION khi brief thay đổi Business goal, Product goal, success definition, MVP scope, thứ tự opportunity, trade-off giữa nhóm user, hoặc có EVIDENCE GAP then chốt. Dùng record và 5 status nguyên dạng trong `../_shared/DECISION_RULES.md` §2–§4.

Agent có thể chọn cách tổ chức brief và phương pháp evidence, nhưng không tự chốt strategy hay recommendation. Recommendation không phải DECISION.

## Outputs / Artifacts

Primary output là Product Decision Brief. Dùng nguyên template sau và điền evidence labels vào từng claim.

```markdown
# PRODUCT DECISION BRIEF

**Context**
FACT — <product context, product stage, stakeholder, buyer và user; nguồn>

**Business Goal**
OWNER INPUT REQUIRED — <business outcome, owner, time horizon>

**Product Goal**
OWNER INPUT REQUIRED — <product outcome; không lẫn với output>

**User Goal**
EVIDENCE GAP — <user outcome hoặc context cần chứng minh>

**Evidence**
EVIDENCE — <source, scope, date, n/segment nếu có>

**Facts**
FACT — <verified item + source>

**Assumptions**
ASSUMPTION — NOT YET VALIDATED — <assumption>

**Problem Statement**
<ai / trong hoàn cảnh nào / trở ngại gì / hệ quả gì; không chứa solution>

**Opportunities**
<opportunity là need/pain/desire, không phải feature>

**Constraints**
FACT — <confirmed constraint + source>

**Risks**
<Value / Usability / Feasibility / Business viability; ethical / legal / privacy / security / accessibility khi liên quan>

**Options**
| Option | Outcome sought | MVP / scope | Evidence gap | Affected stakeholder |
|---|---|---|---|---|
| A | | | | |
| B | | | | |

**Recommendation**
<option + why>
Confidence: HIGH | MEDIUM | LOW — <why>

**What could prove this wrong?**
HYPOTHESIS — <evidence or experiment that would reverse the recommendation>

**Open Questions**
EVIDENCE GAP — <what is needed, for which decision>

**Owner Decision**
### D-1 — <short decision name>
Decision status: PENDING
Date: <YYYY-MM-DD>
Decided by:
Question: <one decision>
Evidence: <labelled evidence>
Options: <A / B>
Trade-offs: <gain and cost of each>
Recommendation: <agent recommendation>
Confidence: HIGH | MEDIUM | LOW — <why>
Would change it: <what reverses it>
If MODIFIED:
Reopens when:
```

Giữ `Changes to Owner Input`, `Dropped / Deferred`, `Governance self-check` và `Decision Register` ở cuối brief theo `../_shared/OUTPUT_STANDARDS.md` §C.

## Handoff / Routing

Handoff sang `02-user-research` khi brief có EVIDENCE GAP về user behaviour, context, pain, motivation hoặc workaround; gửi Problem statement, priority uncertainty, participant criteria draft và assumptions cần kiểm.

Handoff sang `03-research-synthesis` khi raw research đã có nhưng chưa có traceable findings. Handoff sang `05-solution-exploration` chỉ sau khi Owner quyết problem/opportunity đủ rõ để khám phá solutions.

Ghi cả route vào và route ra `/office-hours` trong Product Decision Brief khi áp dụng; `/office-hours` không bị fork hoặc overwrite.

## Anti-patterns

- ❌ Bắt đầu từ “xây feature X”. / ✅ Bắt đầu từ Problem statement và outcome cần quan sát.
- ❌ EVIDENCE — Đọc competitor pattern rồi gọi đó là user need. / ✅ Ghi nó là competitive evidence và xác minh need riêng.
- ❌ Gọi Four Big Risks là toàn bộ risk register. / ✅ Bổ sung ethical, legal, privacy, security và accessibility risks khi liên quan.
- ❌ Cắt MVP bằng cách giữ một danh sách feature nhỏ. / ✅ Giữ scope nhỏ nhất có learning hoặc value nói rõ.
- ❌ Tự đi qua gate vì recommendation nghe hợp lý. / ✅ Dừng PENDING cho đến OWNER DECISION.

## Sources

EVIDENCE — SFIA 9, `../SOURCE_REGISTRY.md` §1, chống đỡ ranh giới User experience analysis (UNAN) với các skill UX khác; phần workflow và templates là diễn giải của Agent.

EVIDENCE — SVPG, `../SOURCE_REGISTRY.md` §7, chống đỡ tên/định nghĩa Four Big Risks, outcome-over-output và ranh giới discovery/delivery; đây là practitioner framework, không phải chuẩn và không phải taxonomy rủi ro đầy đủ.

EVIDENCE — Teresa Torres / Product Talk, `../SOURCE_REGISTRY.md` §8, chống đỡ cách phân biệt Opportunity với Solution; phần chọn option là diễn giải của Agent.

EVIDENCE — gstack `/office-hours`, `../SOURCE_REGISTRY.md` §12, chỉ chống đỡ workflow integration vào/ra; không chống đỡ lý thuyết UX.

## Example

ILLUSTRATIVE EXAMPLE — not project data

```markdown
# PRODUCT DECISION BRIEF
**Context**
FACT — A SaaS team is considering “export approval history”; Owner says finance managers buy, while analysts prepare audits. Source: Owner workshop, 2026-09-07.
**Business Goal**
OWNER INPUT REQUIRED — Reduce renewal risk; baseline and target are not supplied.
**Product Goal**
ASSUMPTION — NOT YET VALIDATED — Make audit preparation less dependent on manual collection.
**User Goal**
EVIDENCE GAP — Need evidence of analysts’ current audit-preparation behaviour.
**Problem Statement**
Analysts preparing an audit cannot assemble a trustworthy approval history without switching among records, creating delay and a risk of omissions.
**Opportunities**
Make approval history easier to assemble and verify.
**Options**
| Option | Outcome sought | MVP / scope | Evidence gap | Affected stakeholder |
|---|---|---|---|---|
| A | Faster assembly | Export one approval record | Current workflow | Analyst |
| B | Fewer omissions | Searchable cross-record history | Data feasibility | Analyst, engineering |
**Recommendation**
Research the current workflow before selecting A or B. Confidence: LOW — neither need nor feasibility is evidenced.
**What could prove this wrong?**
HYPOTHESIS — Observation may show the bottleneck is access permission, not history assembly.
**Owner Decision**
Decision status: PENDING — Approve research before committing MVP scope.
```

## Owner Decision

Present the completed Product Decision Brief using the Owner format in `../_shared/OUTPUT_STANDARDS.md` §B: WHAT WE KNOW through OWNER DECISION REQUIRED. Stop at the record below; only Owner may change status.

```markdown
### D-1 — Approve product problem and next uncertainty to reduce
Decision status: PENDING
Date: <YYYY-MM-DD>
Decided by:
Question: <Which problem/opportunity and evidence gap should guide the next step?>
Evidence: <labelled brief items>
Options: <A / B / C>
Trade-offs: <each option's benefit and cost>
Recommendation: <labelled recommendation>
Confidence: HIGH | MEDIUM | LOW — <why>
Would change it: <new evidence that reverses it>
If MODIFIED:
Reopens when:
```
