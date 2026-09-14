# Research Synthesis

## Purpose

Dùng skill này để biến raw qualitative và quantitative evidence thành traceable findings, insights, user needs, opportunities và Problem definition có thể dùng cho quyết định sản phẩm. Nó không biến ghi chú thành sự thật bằng cách đặt tên chủ đề đẹp hơn.

Workflow là Raw Evidence → Observation → Patterns → Findings → Insights → User Needs → Opportunities → Problem Definition. Mỗi bước nâng mức diễn giải; evidence traceability là điều kiện để biết bước nào còn đứng vững.

## Use When

- Chạy khi đã có research notes, transcripts, survey data hoặc behavioural evidence nhưng chưa có findings có thể dùng.
- Chạy sau `02-user-research` để tổng hợp evidence theo research question và limitations đã có.
- Chạy khi Product Decision Brief cần cập nhật Problem statement, opportunity hoặc priority từ evidence mới.
- Chạy trước `05-solution-exploration` khi đội cần biết problem nào đáng giải, thay vì bắt đầu từ feature.

## Do Not Use When

- Chưa có raw evidence hoặc research plan: dùng `../02-user-research/SKILL.md`.
- Cần xác định vì sao kinh doanh làm việc này, buyer/user, goals hoặc MVP scope: dùng `../01-product-discovery/SKILL.md`.
- Cần tạo/kiểm thử solution cụ thể: dùng `05-solution-exploration`; synthesis không thay validation.
- Cần giải thích metric/funnel chỉ bằng số: dùng `06-data-informed-design`; không suy UX diagnosis từ analytics signal.

## Inputs

**Required context**

- EVIDENCE — Raw evidence items có ID, source/session/date, research question, participant/sample scope, method và limitations.
- OWNER INPUT REQUIRED — Decision hoặc product question mà synthesis cần hỗ trợ.
- EVIDENCE — Research Plan, participant criteria, consent/privacy constraints và note structure từ `02-user-research` khi evidence do team thu thập.

**Optional context**

- EVIDENCE — Quantitative cuts, segmentation definitions, prior findings và Product Decision Brief để kiểm scope.
- OWNER INPUT REQUIRED — Stakeholder cần dùng output và decision/artefact mà họ đang cân nhắc.

## Context Loading

Đọc đủ `../_shared/GOVERNANCE.md`, `../_shared/EVIDENCE_RULES.md`, `../_shared/DECISION_RULES.md` và `../_shared/OUTPUT_STANDARDS.md` nếu chưa nạp trong lượt này; không nạp lại cùng nội dung. Đọc `../ROUTING.md` khi route chưa rõ hoặc cần specialist; đọc `../GLOSSARY.md` khi thuật ngữ chưa rõ.

Đọc đầy đủ `../_shared/RESEARCH_RULES.md` trước research/validation. Khi viện dẫn nguồn, đọc §B của rule này và trọn các mục được viện dẫn trong `../SOURCE_REGISTRY.md`, gồm giới hạn và trạng thái kiểm chứng; không mặc định nạp toàn registry.

Đọc raw data cùng Research Plan và Limitations trước khi tạo theme. Không synthesis từ executive summary, memory hoặc một list solution đã mong muốn; chúng che mất trace và thúc đẩy confirmation bias.

## Owner-Friendly Explanation

Synthesis là cầu nối giữa những mẩu evidence rời và một quyết định sản phẩm. Observation nói điều đã thấy; finding tóm lược điều evidence cho thấy; insight giải thích vì sao điều đó quan trọng và kéo theo cân nhắc gì. Xem ranh giới chính xác ở `../GLOSSARY.md`.

Một theme không trace được về raw evidence là opinion của người tổng hợp, không phải finding. Trace thêm cột và ID, nhưng đổi lại Owner có thể kiểm phát hiện thay vì phải tin người trình bày.

## Core Principles

- Bắt đầu bằng raw evidence nguyên văn/nguồn gốc, tạo OBSERVATION trước diễn giải, rồi mới affinity mapping hoặc thematic analysis.
- EVIDENCE — GOV.UK five-step process là extract observations verbatim → affinity diagram → short findings → decide actions → share (`../SOURCE_REGISTRY.md` §3). Quy trình chi tiết dưới đây là diễn giải vận hành của Agent.
- Mỗi theme, finding, insight, user need và opportunity phải giữ links/IDs về raw evidence items tạo ra nó. Không trace được thì ghi `INFERENCE` hoặc bỏ, không gọi FINDING.
- PATTERN cần số lần lặp và tập evidence; single observation không thành pattern theo `../_shared/EVIDENCE_RULES.md` §2.
- User need mô tả need/pain/mong muốn, không solution. Theo Product Talk, opportunity có hơn một cách giải; nếu chỉ có một cách, đó là solution trá hình. Đây là practitioner framework, không phải requirement (`../SOURCE_REGISTRY.md` §8).
- Persona, JTBD, Empathy Map, Customer Journey Map và Service Blueprint đều optional. Chỉ tạo khi artefact cải thiện understanding hoặc một decision cụ thể theo `../_shared/RESEARCH_RULES.md` §A6.
- Persona dựng hoàn toàn từ assumption bị cấm; nếu buộc cần bản tạm cho trao đổi, ghi `ASSUMPTION-BASED PERSONA — NOT YET VALIDATED` ngay trong artefact.

## Evidence Requirements

Dùng evidence labels và forbidden transformations ở `../_shared/EVIDENCE_RULES.md`; không nâng quote thành PATTERN, pattern thành causal claim, hay user request thành validated requirement.

Evidence Map là artefact bắt buộc của lần synthesis này: mỗi derived item phải có ID, label, source raw IDs, scope và limitation. Findings không có raw IDs không được đưa vào output.

Quantitative evidence phải ghi calculation, timeframe, segment/cohort và limitations; qualitative evidence phải ghi session/source IDs và participant scope. Không tổng hợp dữ liệu identifiable vào artefact chia sẻ.

## Workflow

1. Inventory raw items, scope, consent/data restrictions, research questions và limitations; gán stable Evidence ID cho item chưa có ID.
2. Extract OBSERVATION gần nguyên văn, giữ source ID và tách researcher interpretation.
3. Affinity-map observations hoặc code theme thực dụng; theme card lưu mọi Evidence ID, không chỉ title.
4. Kiểm recurrence/scope; chỉ label PATTERN khi có số lần lặp và tập evidence.
5. Viết short FINDING, sau đó INSIGHT với implication rõ; ghi trace IDs cho cả hai.
6. Chuyển insight thành User Needs và Opportunities không gắn solution; test opportunity bằng câu hỏi “có hơn một cách đáp ứng không?”.
7. Soạn Problem statement, candidate actions và handoff; cập nhật `01-product-discovery` nếu problem/priority thay đổi, dừng OWNER DECISION cho decision quan trọng.

## Methods

| Method / artefact | Hợp cho | Không hợp cho |
|---|---|---|
| Affinity mapping | Gom observations từ nhiều source và vẫn giữ raw IDs. | Không chứng minh prevalence hoặc causation. |
| Practical thematic analysis | Code lặp lại về behaviour/context/pain để phát hiện theme. | Không thay raw evidence hoặc biện minh theme không trace được. |
| JTBD | Mô tả tiến bộ người dùng đang cố đạt khi điều đó giúp quyết product problem. | Không dùng như nghi thức hoặc thay evidence về behaviour. |
| Persona | Đại diện segment có evidence khi nó cải thiện decision. | Không dùng cho fictional profile dựng từ assumption; dùng label bắt buộc nếu tạm thời không validated. |
| Empathy Map | Làm rõ cảm nhận/bối cảnh khi bằng chứng đủ chi tiết. | Không thay transcript/observation hoặc thêm suy đoán vào ô map. |
| Customer Journey Map | Hiểu sequence, channel và handoff xuyên hành trình khi điều đó quyết định ưu tiên. | Không dùng nếu journey không thay đổi decision hoặc evidence chỉ phủ một điểm. |
| Service Blueprint | Liên kết customer journey với backstage process khi service dependency là nguyên nhân cần xử lý. | Không dùng cho một problem UI cục bộ không có service handoff. |
| How Might We | Mở hướng solution sau khi opportunity/problem đã traceable. | Không dùng để đặt tên solution sẵn có hoặc thay Problem statement. |

## Decision Gates

Tạo artefact và chọn coding method không cần Owner approval nếu không chạm sensitive data/access. Thay đổi Problem definition, ưu tiên opportunity, MVP scope, hoặc trade-off giữa groups phải dừng OWNER DECISION theo `../_shared/DECISION_RULES.md` §3.

Nếu evidence map có EVIDENCE GAP then chốt, trình options gồm nghiên cứu thêm, quyết với uncertainty, hoặc defer; không viết recommendation như FACT.

## Outputs / Artifacts

Dùng các template sau. Evidence Map là nơi làm evidence traceability vận hành được, không phải phụ lục trang trí.

```markdown
# EVIDENCE MAP
| Derived ID | Label | Statement | Raw Evidence IDs | Source / scope | Limitation | Decision supported |
|---|---|---|---|---|---|---|
| O-01 | OBSERVATION | | RE-01 | | | |
| P-01 | PATTERN | | RE-01, RE-04, RE-07 | <count and set> | | |
| F-01 | FINDING | | P-01 | | | |
| I-01 | INSIGHT | | F-01 | | | |
| N-01 | User Need | | I-01 | | | |
| OA-01 | Opportunity | | N-01 | | | |
```

```markdown
# RESEARCH FINDINGS
**Scope and Limitations**
<participant/sample, method, timeframe, unanswered questions>
| Finding ID | FINDING — short summarising statement | Evidence Map IDs | Scope | Limitation |
|---|---|---|---|---|
| F-01 | | | | |
```

```markdown
# INSIGHTS
| Insight ID | INSIGHT — why this happens / why it matters | Finding IDs | Consequence to consider | Confidence |
|---|---|---|---|---|
| I-01 | | | | HIGH / MEDIUM / LOW |
```

```markdown
# USER NEEDS
| Need ID | User Need — <user needs to... because...> | Insight IDs | Not a solution | Evidence gap |
|---|---|---|---|---|
| N-01 | | | | |
```

```markdown
# OPPORTUNITY AREAS
| Opportunity ID | Opportunity | User Need IDs | More than one way to address? | Candidate directions, not commitments |
|---|---|---|---|---|
| OA-01 | | | Yes / No — if No, reclassify as solution | |
```

```markdown
# PROBLEM STATEMENT
<Who, in what context, faces what obstacle, with what consequence. No solution verbs.>

Evidence trace: <Finding / Insight / Need / Opportunity IDs>
EVIDENCE GAP — <what remains unknown and which decision it limits>
```

## Handoff / Routing

Handoff Research Findings, Evidence Map, Insights, User Needs, Opportunity Areas, Problem Statement, raw-data access constraints and limitations to `01-product-discovery` for updated goals/options/priority, or to `05-solution-exploration` only after an Owner-approved problem/opportunity is available.

Route back to `02-user-research` if trace exposes an EVIDENCE GAP that blocks a decision; specify the exact question and required participant/context rather than asking for “more research”.

## Anti-patterns

- ❌ Đặt tên một theme mà không kèm ID bằng chứng gốc. / ✅ Giữ Evidence ID trên mọi theme và mọi phát biểu suy ra từ nó.
- ❌ Gọi một câu trích đơn lẻ là `PATTERN`. / ✅ Nêu số lần lặp và tập bằng chứng, hoặc giữ ở mức `OBSERVATION`.
- ❌ Biến “người dùng đòi xuất file” thành một requirement. / ✅ Truy nhu cầu bên dưới và cách họ đang tự xoay xở.
- ❌ Tạo Persona/CJM/JTBD vì bản trình bày cần có. / ✅ Chỉ tạo khi nó cải thiện hiểu biết hoặc một quyết định cụ thể.
- ❌ Viết persona hư cấu rồi trình bày như kết quả nghiên cứu. / ✅ Bỏ nó đi, hoặc gắn nhãn `ASSUMPTION-BASED PERSONA — NOT YET VALIDATED` ngay trong artefact.
- ❌ Biến một opportunity thành “xây feature X”. / ✅ Áp phép thử nhiều-hơn-một-cách; chỉ có một cách thì đó là solution, phân loại lại.

## Sources

EVIDENCE — GOV.UK Service Manual, `../SOURCE_REGISTRY.md` §3, chống đỡ five-step analysis from verbatim observations through affinity diagram and short findings to actions/sharing; Evidence Map mechanics and templates are diễn giải của Agent.

EVIDENCE — SFIA 9 UNAN, `../SOURCE_REGISTRY.md` §1, chống đỡ ranh giới user experience analysis; artefact choice and decision logic are diễn giải của Agent.

EVIDENCE — Teresa Torres / Product Talk, `../SOURCE_REGISTRY.md` §8, chống đỡ opportunity-versus-solution test; it is a practitioner framework, not a standard or requirement.

## Example

ILLUSTRATIVE EXAMPLE — not project data

```markdown
# EVIDENCE MAP
| Derived ID | Label | Statement | Raw Evidence IDs | Source / scope | Limitation | Decision supported |
|---|---|---|---|---|---|---|
| O-01 | OBSERVATION | P-01 switched among three records before copying approval dates. | RE-01 | Session P-01 | One session | Workflow focus |
| O-02 | OBSERVATION | P-02 used a spreadsheet to track approval dates. | RE-04 | Session P-02 | One session | Workflow focus |
| P-01 | PATTERN | Two of two observed analysts assembled dates outside the product. | RE-01, RE-04 | 2 contextual sessions | Not prevalence | Research next step |
| F-01 | FINDING | Observed analysts assembled approval history through external workarounds. | P-01 | Two sessions | Small, purposive sample | Problem framing |
| I-01 | INSIGHT | Analysts need a verifiable history because crossing records makes omission risk hard to detect. | F-01 | Two sessions | Need more contexts | Opportunity |
| N-01 | User Need | Analysts need to assemble and verify approval history without manual cross-record tracking. | I-01 | Two sessions | Not yet quantified | Opportunity |
| OA-01 | Opportunity | Reduce effort and omission risk in approval-history assembly. | N-01 | Two sessions | Multiple directions remain | Explore options |
```

“Add export” is not the opportunity in this example: history could be assembled by export, in-product history, integration or another direction. The next Owner decision is whether evidence is sufficient to explore directions or whether another context round is needed.

## Owner Decision

Present the traceable synthesis in the Owner format of `../_shared/OUTPUT_STANDARDS.md` §B. Any decision changing Problem definition, opportunity priority or next investment remains PENDING until Owner decides.

```markdown
### D-1 — Approve problem definition and next evidence/action
Decision status: PENDING
Date: <YYYY-MM-DD>
Decided by:
Question: <Which traceable problem/opportunity should guide the next step?>
Evidence: <Evidence Map IDs and limitations>
Options: <research more / explore option A / defer>
Trade-offs: <learning, time, risk of each>
Recommendation: <labelled recommendation>
Confidence: HIGH | MEDIUM | LOW — <why>
Would change it: <new evidence that reverses it>
If MODIFIED:
Reopens when:
```
