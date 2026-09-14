# Data-Informed Design

## Purpose

Dùng skill này để dùng behavioural data, research evidence và product metrics nhằm làm rõ quyết định thiết kế cần học gì tiếp theo. Data-informed ưu tiên dữ liệu như một đầu vào quan trọng nhưng không giao quyền phán đoán cho dashboard; dữ liệu định lượng thường cho biết *điều gì* đang xảy ra, còn dữ liệu định tính thường giúp giải thích *vì sao*.

Không loại evidence nào tự nói cho đội biết phải thiết kế solution nào. Skill này biến tín hiệu thành câu hỏi, evidence, hypothesis và phép đo có thể học được, không biến metric thành phán quyết về UX.

## Use When

- Có analytics signal, funnel, retention, feature usage hoặc câu hỏi về KPI cần diễn giải đúng phạm vi.
- Cần định nghĩa Measurement Plan, metric, baseline, target, success metric hoặc guardrail metric trước/sau một thay đổi.
- Cần thiết kế experiment hoặc Post-launch Learning Review cho một hypothesis đã nêu rõ.
- Cần nối product goal với Goals-Signals-Metrics và lựa chọn HEART categories một cách có chủ đích.

## Do Not Use When

- Chưa rõ product problem, goal hoặc decision mà dữ liệu phải hỗ trợ: quay về `../01-product-discovery/SKILL.md`.
- Có raw interview/observations nhưng chưa có traceable finding: dùng `../03-research-synthesis/SKILL.md`.
- Cần nghiên cứu nguyên nhân hành vi chưa được quan sát: dùng `../02-user-research/SKILL.md`; funnel không tự chẩn đoán UX.
- Cần tạo flows, states và interaction behaviour: dùng `../04-interaction-design/SKILL.md`; cần tạo và kiểm nhiều solution: dùng `../05-solution-exploration/SKILL.md`.

## Inputs

**Required context**

- OWNER INPUT REQUIRED — Product goal, decision cần hỗ trợ, người sở hữu metric và time horizon.
- EVIDENCE — Analytics export hoặc dashboard link, event definitions, calculation, timeframe, segment/cohort và known instrumentation limitations.
- EVIDENCE — Research findings hoặc raw-evidence references khi câu hỏi cần giải thích hành vi, theo `../_shared/EVIDENCE_RULES.md` §1.

**Optional context**

- OWNER INPUT REQUIRED — Target, risk tolerance, experiment capacity, release/change calendar và data/privacy constraints.
- EVIDENCE GAP — Baseline, tracking coverage, experiment eligibility hoặc qualitative evidence cần có để giải thích signal.

## Context Loading

Đọc đủ `../_shared/GOVERNANCE.md`, `../_shared/EVIDENCE_RULES.md`, `../_shared/DECISION_RULES.md` và `../_shared/OUTPUT_STANDARDS.md` nếu chưa nạp trong lượt này; không nạp lại cùng nội dung. Đọc `../ROUTING.md` khi route chưa rõ hoặc cần specialist; đọc `../GLOSSARY.md` khi thuật ngữ chưa rõ.

Đọc `../_shared/RESEARCH_RULES.md` khi công việc gồm nghiên cứu người dùng hoặc desk research. Khi viện dẫn nguồn, đọc §B của rule này và trọn các mục được viện dẫn trong `../SOURCE_REGISTRY.md`, gồm giới hạn và trạng thái kiểm chứng; không mặc định nạp toàn registry.

Đọc Product Decision Brief, Metric Definitions, tracking plan, analytics implementation notes, research synthesis và release timeline của dự án nếu có. Không có dữ liệu dự án thì không dựng chart hay baseline; ghi `EVIDENCE GAP` tại quyết định bị giới hạn.

## Owner-Friendly Explanation

Metric là một đại lượng đo được; KPI là metric Owner đã chọn để theo dõi thành công. Baseline là giá trị hiện tại để so sánh, target là giá trị muốn đạt; không có baseline thì thay đổi sau release không có điểm xuất phát đáng tin.

Analytics có thể chỉ ra người dùng dừng ở bước nào hoặc nhóm nào quay lại. Nó không tự cho biết màn hình tệ, người dùng nhầm gì, hay solution nào đúng. Vì thế một Measurement Plan tốt nêu rõ câu hỏi, evidence cần có, điều sẽ đo, giới hạn và quyết định nào sẽ thay đổi khi học được.

## Core Principles

- Phân biệt event (hành động được ghi nhận), event property (thuộc tính của lần xảy ra), user property (thuộc tính mô tả người dùng), metric, KPI, baseline và target theo `../GLOSSARY.md`.
- Giữ chuỗi Product Goal → Question → Evidence → Finding → Insight → Hypothesis → Experiment → Measurement → Learning. Không nhảy từ dashboard sang solution.
- `analytics signal → UX diagnosis` là phép biến đổi bị cấm theo `../_shared/EVIDENCE_RULES.md` §2. Funnel drop-off có thể do wrong audience, wrong expectation, bước cố ý lọc người không phù hợp, instrumentation error hoặc measurement window bị hỏng.
- Đọc funnel (sequence, conversion, drop-off), segment, cohort, retention, paths và feature usage như các lát cắt của hành vi; ghi rõ denominator, timeframe và rule tính trước khi so sánh.
- Định nghĩa activation, adoption, engagement, retention, conversion và churn cho sản phẩm cụ thể trước khi dùng tên chúng. Một từ giống nhau giữa dashboard không đảm bảo cùng phép tính.
- UX metrics gồm satisfaction, task success, error rate và time on task; chọn metric vì nó trả lời goal, không vì dashboard có sẵn.
- EVIDENCE — HEART là selection aid: mỗi category Happiness, Engagement, Adoption, Retention, Task Success phải có quyết định include/exclude rõ ràng, không phải năm ô bắt buộc điền (`../SOURCE_REGISTRY.md` §6).
- EVIDENCE — HEART metrics bổ sung, không thay thế research methods, và chủ yếu hỗ trợ đánh giá sản phẩm đã launch; không dùng thay formative research (`../SOURCE_REGISTRY.md` §6).
- A/B testing và thử nghiệm định lượng đòi hỏi kỷ luật thống kê riêng: quy ước 4–8 người mỗi vòng của GOV.UK (`../SOURCE_REGISTRY.md` §3) chỉ áp dụng cho nghiên cứu định tính tại `02`, tuyệt đối không chuyển giao sang tính toán cỡ mẫu định lượng hay A/B test.
- Khi lập kế hoạch thử nghiệm, bắt buộc phải xác định trước: primary metric, baseline hiện tại, Minimum Detectable Effect (MDE — mức thay đổi tối thiểu có ý nghĩa cần phát hiện), statistical power (thường chọn 80% với mức ý nghĩa alpha 5%), cỡ mẫu cần thiết trên mỗi biến thể (sample size per variant), thời lượng tối thiểu (planned duration/window nhằm bao quát trọn chu kỳ tuần), guardrail metric, và quy tắc dừng (stopping rule) được cam kết trước.
- Cấm dừng thử nghiệm sớm chỉ vì nhìn thấy kết quả hoặc p-value tạm thời có vẻ khả quan (the peeking problem — kiểm tra kết quả liên tục giữa chừng làm tăng vọt tỉ lệ false positive).
- Không có chuẩn phổ quát bắt buộc các tham số này (No universal standard requires this). Đây là thực hành chuyên môn chuẩn mực của ngành thử nghiệm số và là diễn giải của Agent (`../_shared/RESEARCH_RULES.md` §B1–§B2).

## Evidence Requirements

Mọi con số phải có source, metric definition, population, timeframe, calculation và limitation. So sánh segment cần nêu thuộc tính chia nhóm; cohort cần nêu shared start time; retention cần nêu calculation type.

Nêu measurement coverage trước khi diễn giải: event có bắn không, properties có hợp lệ không, identity có bị tách/gộp sai không, và conversion window có phản ánh chu kỳ thực không. Nếu chưa kiểm được, signal là câu hỏi cần điều tra, không phải finding về product.

Dữ liệu thử nghiệm (experiment evidence) phải bao gồm: định nghĩa metric, baseline, MDE, statistical power, cỡ mẫu thực tế trên mỗi biến thể, thời lượng chạy trọn vẹn và xác nhận tuân thủ quy tắc dừng cam kết trước. Kết quả từ thử nghiệm bị dừng sớm do peeking không được coi là FACT hay EVIDENCE hợp lệ; phải ghi nhận là INFERENCE kèm rủi ro sai lệch cao.

Khi dùng Amplitude, tách generic analytics concept khỏi tool behaviour: user properties chỉ áp dụng cho future events, không hồi tố event lịch sử, là hành vi Amplitude chứ không phải luật chung. N-Day, Unbounded và Bracket retention cho số khác nhau từ cùng data; nêu calculation type. This Order, Any Order và Exact Order là funnel order modes của Amplitude, không phải taxonomy di động (`../SOURCE_REGISTRY.md` §9).

## Workflow

1. Xác nhận Product Goal, decision owner, decision bị chặn và hiện trạng measurement; inventory event, event property, user property, data quality và access constraints.
2. Viết Analytics Questions trước khi mở chart: cần biết what, why, for whom, during which timeframe và để thay đổi decision nào.
3. Định nghĩa metric: numerator, denominator, population, inclusion/exclusion, timeframe, baseline, target, owner, calculation type và limitations.
4. Chọn các lát cắt phù hợp: funnel/conversion/drop-off; segment; cohort/retention; paths; feature usage. Không suy causal claim từ một lát cắt.
5. Nối quantitative evidence với qualitative evidence khi cần giải thích why; nếu thiếu, tạo câu hỏi cho `02` hoặc handoff raw evidence sang `03`.
6. Viết Hypothesis có expected change, mechanism, population, falsification condition, success metric và guardrail metric.
7. Chọn experiment phù hợp. A/B test phân bổ ngẫu nhiên các biến thể đồng thời. Trước khi chạy A/B test, bắt buộc tính cỡ mẫu dựa trên baseline conversion và MDE mong muốn (với statistical power thông dụng 80%, alpha 5%); cam kết runtime tối thiểu bao quát chu kỳ kinh doanh (tối thiểu 1–2 tuần đầy đủ); xác định guardrail metric và pre-committed stopping rule. Cấm dừng sớm khi peeking thấy p-value tạm thời nhỏ hơn 0.05. Before/after comparison không loại được seasonality, campaign, maturity hay thay đổi đồng thời.
8. Sau release, chạy Post-launch Learning Review: so planned versus observed, kiểm guardrail, record limitations, decide iterate / investigate / stop / scale tại OWNER DECISION khi cần.

## Methods

| Method | Hợp cho | Không hợp cho |
|---|---|---|
| Funnel analysis | Xác định bước nào trong sequence có conversion/drop-off cần đặt câu hỏi. | Kết luận UI, motivation hoặc causation từ drop-off. |
| Segmentation | So sánh behaviour theo role, plan, region hoặc property đã định nghĩa. | Suy ra nhóm là nguyên nhân của khác biệt. |
| Cohort and retention analysis | Theo dõi nhóm có shared start time qua thời gian; retention phải ghi N-Day / Unbounded / Bracket khi dùng Amplitude. | Gọi segment tĩnh là cohort hoặc báo retention không calculation type. |
| Paths and feature usage | Tìm route thường gặp, hành vi trước/sau event và mức dùng feature. | Suy intent, satisfaction hoặc task success không có evidence khác. |
| HEART Goals-Signals-Metrics | Chọn metric UX phù hợp với goal và loại trừ category không hữu ích một cách tường minh. | Điền đủ năm categories như checklist hoặc thay early research. |
| Controlled experiment | Kiểm causal hypothesis khi randomisation, exposure, sample size/power và measurement đáng tin; tuân thủ pre-committed stopping rule. | Kiểm thay đổi không thể randomise, mẫu thiếu statistical power, hoặc dừng sớm do peeking mà vẫn kết luận causation. |
| Before/after review | Theo dõi vận hành sau thay đổi khi A/B test không khả thi. | Chứng minh change là nguyên nhân duy nhất của kết quả. |

## Decision Gates

Dừng ở OWNER DECISION khi chọn KPI/target có trade-off, thay definition of success, áp dụng tracking chạm personal data/permission, chọn audience exposure, hoặc scale một experiment dù guardrail chưa rõ. Dùng status và record tại `../_shared/DECISION_RULES.md` §2–§5.

Agent có thể đề xuất chart, metric definition và method nhỏ nhất để giảm uncertainty. Agent không tự chốt target, threshold chấp nhận rủi ro hay rollout audience.

## Outputs / Artifacts

```markdown
# MEASUREMENT PLAN
**Product Goal**
OWNER INPUT REQUIRED — <outcome and decision owner>
**Question**
<what must be learned, for which decision?>
**Evidence available**
EVIDENCE — <analytics/research source, scope, timeframe, limitation>
**HEART selection**
| Category | Include / Exclude | Goal | Signal | Metric | Why this choice |
|---|---|---|---|---|---|
| Happiness | | | | | |
| Engagement | | | | | |
| Adoption | | | | | |
| Retention | | | | | |
| Task Success | | | | | |
**Open gap**
EVIDENCE GAP — <missing evidence and decision limited>
```

```markdown
# METRIC DEFINITIONS
| Metric / KPI | Definition and formula | Event/properties | Population | Timeframe | Baseline | Target | Owner | Limitation |
|---|---|---|---|---|---|---|---|---|
| | | | | | | | | |
```

```markdown
# ANALYTICS QUESTIONS
| ID | Question | Method/cut | Evidence needed | Decision supported | Limitation |
|---|---|---|---|---|---|
| AQ-01 | | | | | |
```

```markdown
# FUNNEL ANALYSIS
Funnel definition: <ordered events, identity rule, conversion window>
| Step | Event definition | Entrants | Conversion | Drop-off | Segment/cohort | Data-quality check | Alternative explanations |
|---|---|---|---|---|---|---|---|
| | | | | | | | wrong audience / expectation / intended filter / instrumentation / window |
FINDING — <only what the analysis shows; no UX diagnosis>
```

```markdown
# HYPOTHESES
HYPOTHESIS — If <change> for <population>, then <success metric> will <expected direction>, because <testable mechanism>.
Could be false when: <result or observation that falsifies it>
```

```markdown
# EXPERIMENT PLAN
| Hypothesis | Method / variants | Eligibility & allocation | Primary metric & baseline | MDE & statistical power | Required sample size per variant | Planned duration & window | Guardrail metric | Pre-committed stopping rule | Analysis plan & risks |
|---|---|---|---|---|---|---|---|---|---|
| | A/B test / before-after | <eligibility criteria, 50/50 split> | <primary metric and current baseline %> | <target MDE, power (e.g. 80%), alpha (e.g. 5%)> | <sample size n per variant> | <minimum duration, full weekly cycles> | <guardrail metric and threshold> | <stop only when target n reached; no early stopping on interim p-value> | <statistical test, segmentation plan, risks> |
```

```markdown
# POST-LAUNCH LEARNING REVIEW
| Planned hypothesis | Observed result | Success / guardrail result | Evidence quality | Learning | Next option |
|---|---|---|---|---|---|
| | | | | | iterate / investigate / stop / scale |
```

Kết thúc mỗi deliverable bằng `Changes to Owner Input`, `Dropped / Deferred`, `Governance self-check` và, khi có decision, `Decision Register` theo `../_shared/OUTPUT_STANDARDS.md` §C.

## Handoff / Routing

Route to `02-user-research` when an analytics question needs context, motivation or workaround evidence; route to `03-research-synthesis` when raw qualitative evidence needs traceable findings. Handoff Metric Definitions, question IDs, segment/cohort definitions and data-quality limitations.

Route to `04-interaction-design` when a validated problem needs flows/states; route to `05-solution-exploration` when more than one solution should be explored. Receive their hypotheses and task definitions, then return Measurement Plan and post-launch learning. The loop follows `../ROUTING.md` §1, not a waterfall.

## Anti-patterns

- ❌ Gọi funnel drop-off là bằng chứng UI tệ. / ✅ Ghi signal, kiểm audience, expectation, intended filter, instrumentation và window rồi mới chọn nghiên cứu.
- ❌ Dùng retention không nói calculation type. / ✅ Nêu N-Day, Unbounded hoặc Bracket và tool behaviour nếu áp dụng.
- ❌ Điền đủ HEART vì có năm chữ cái. / ✅ Quyết định include/exclude từng category theo goal.
- ❌ Tuyên bố A/B thắng chỉ vì conversion tăng. / ✅ Kiểm guardrail, allocation, exposure và limitation trước khi học.
- ❌ Dừng A/B test sớm khi thấy kết quả tạm thời khả quan hoặc p-value vừa đạt ngưỡng (peeking problem). / ✅ Cam kết trước cỡ mẫu và thời gian chạy tối thiểu; chỉ dừng và kết luận theo đúng pre-committed stopping rule.
- ❌ Dùng quy ước 4–8 người của định tính cho A/B test hoặc survey định lượng. / ✅ Tính toán cỡ mẫu dựa trên baseline, MDE và statistical power; quy ước 4–8 người của GOV.UK chỉ áp dụng cho nghiên cứu định tính tại `02`.
- ❌ So sánh trước/sau rồi kết luận thay đổi gây ra kết quả. / ✅ Nêu confounders hoặc dùng controlled experiment khi cần causal claim.

## Sources

EVIDENCE — Google HEART, `../SOURCE_REGISTRY.md` §6, chống đỡ năm categories, Goals → Signals → Metrics, selection discipline và giới hạn với formative research. Templates và workflow là diễn giải của Agent.

EVIDENCE — Amplitude Documentation, `../SOURCE_REGISTRY.md` §9, chống đỡ operational analytics concepts và các hành vi tool-specific đã nêu; không chống đỡ universal metric definitions hay benchmark.

EVIDENCE — UK DfE Design Skills Framework, `../SOURCE_REGISTRY.md` §2, chống đỡ evidence-based design vocabulary; decision logic là diễn giải của Agent.

Không có chuẩn phổ quát nào trong `../SOURCE_REGISTRY.md` bao hàm các quy tắc thống kê thực nghiệm (statistical power, MDE, sample size calculation, peeking problem, pre-committed stopping rule). Các nội dung này là thực hành chuyên môn chuẩn mực của ngành thử nghiệm số và là diễn giải của Agent (`../_shared/RESEARCH_RULES.md` §B1–§B2). Quy ước 4–8 người của GOV.UK (`../SOURCE_REGISTRY.md` §3) là quy tắc định tính riêng của `02`, không áp dụng cho thử nghiệm định lượng.

## Example

ILLUSTRATIVE EXAMPLE — not project data

```markdown
# FUNNEL ANALYSIS
Funnel definition: Create workspace → Invite collaborator → First shared task, same account, 14-day window.
| Step | Event definition | Entrants | Conversion | Drop-off | Alternative explanations |
|---|---|---|---|---|---|
| Invite collaborator | invite_sent | <not supplied> | <not supplied> | <not supplied> | The user may be a solo user, expect an invitation later, hit a tracking defect, or be outside the 14-day window. |
FINDING — No product conclusion is available because product data were not supplied.

HYPOTHESIS — If invitation can be deferred and resumed, eligible collaborative users will reach First shared task more often without lowering 14-day invite completion.
Success metric: eligible-user first-shared-task conversion.
Guardrail metric: 14-day invite completion for eligible users.
```

```markdown
# EXPERIMENT PLAN
ILLUSTRATIVE EXAMPLE — not project data
| Hypothesis | Method / variants | Eligibility & allocation | Primary metric & baseline | MDE & statistical power | Required sample size per variant | Planned duration & window | Guardrail metric | Pre-committed stopping rule | Analysis plan & risks |
|---|---|---|---|---|---|---|---|---|---|
| Deferred invite improves shared task completion | A/B test (Control: mandatory invite; Variant: deferrable invite) | New workspace creators on desktop; 50/50 split | First-shared-task completion at day 14 (baseline: 12.0%) | MDE +1.5% absolute (rel +12.5%), power 80%, alpha 5% | n = 7,200 per variant | 14 full days (two weekly business cycles) | 14-day invite completion rate (floor: 18.0%) | Stop only when target n (7,200/variant) reached and 14 full days elapsed; no early stopping on interim p-value | Two-tailed two-proportion z-test; segment by workspace size; risk of novelty effect in first 3 days |
```

## Owner Decision

Present Measurement Plan using `../_shared/OUTPUT_STANDARDS.md` §B. Keep any KPI, target, tracking scope, exposure or rollout decision PENDING until Owner responds.

```markdown
### D-1 — Approve measurement and experiment scope
Decision status: PENDING
Date: <YYYY-MM-DD>
Decided by:
Question: <Which goal, metric definition, target and exposure scope should govern this learning loop?>
Evidence: <labelled Measurement Plan items and limitations>
Options: <A / B / defer>
Trade-offs: <learning value, risk and cost of each>
Recommendation: <agent recommendation>
Confidence: HIGH | MEDIUM | LOW — <why>
Would change it: <evidence that changes the choice>
If MODIFIED:
Reopens when:
```
