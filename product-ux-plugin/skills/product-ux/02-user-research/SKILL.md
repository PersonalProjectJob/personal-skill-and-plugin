# User Research

## Purpose

Dùng skill này để chọn, lập kế hoạch và thực hiện phương pháp nghiên cứu nhỏ nhất có thể giảm bất định quan trọng về users. Output làm rõ research objective, research question, participant criteria, evidence capture và limitations; nó không hứa sẵn một câu trả lời.

User research thu thập evidence về past behaviour, current behaviour, context, pain, motivation, workaround và constraint. Nó không yêu cầu người tham gia thiết kế solution hộ đội sản phẩm.

## Use When

- Chạy khi Product Decision Brief có EVIDENCE GAP về user behaviour, context, pain, motivation, workaround hoặc constraint.
- Chạy khi cần kiểm một research question trước khi chọn MVP scope, problem priority hoặc solution direction.
- Chạy evaluative research khi đã có solution/prototype và câu hỏi là người dùng có hoàn thành task hay không.
- Chạy sau `01-product-discovery` khi mục tiêu và uncertainty đã đủ rõ để chọn method.

## Do Not Use When

- Đã có raw notes/data nhưng cần patterns, findings và insights: dùng `../03-research-synthesis/SKILL.md`.
- Cần giải thích một analytics signal, funnel hay metric: dùng `06-data-informed-design`; analytics signal không tự là UX diagnosis.
- Cần làm rõ premise của một ý tưởng còn mơ hồ: route `/office-hours` trước theo `../ROUTING.md` §4.
- Cần chọn UI hoặc build solution: dùng `04-interaction-design` hoặc `05-solution-exploration` sau khi evidence phù hợp đã có.

## Inputs

**Required context**

- OWNER INPUT REQUIRED — Research objective, decision sẽ được evidence hỗ trợ, product context và deadline.
- EVIDENCE — Existing evidence review: research trước, analytics, support data, documents hoặc known constraints, có nguồn/phạm vi.
- OWNER INPUT REQUIRED — Participant access, privacy constraints, consent process và người chịu trách nhiệm nghiên cứu.

**Optional context**

- OWNER INPUT REQUIRED — Research questions nháp, hypothesis, prototype/task, recruitment channel và incentive constraints.
- EVIDENCE GAP — Cần biết group nào có/không có trong sample để đánh giá scope của finding.

## Context Loading

Đọc đủ `../_shared/GOVERNANCE.md`, `../_shared/EVIDENCE_RULES.md`, `../_shared/DECISION_RULES.md` và `../_shared/OUTPUT_STANDARDS.md` nếu chưa nạp trong lượt này; không nạp lại cùng nội dung. Đọc `../ROUTING.md` khi route chưa rõ hoặc cần specialist; đọc `../GLOSSARY.md` khi thuật ngữ chưa rõ.

Đọc đầy đủ `../_shared/RESEARCH_RULES.md` trước research/validation. Khi viện dẫn nguồn, đọc §B của rule này và trọn các mục được viện dẫn trong `../SOURCE_REGISTRY.md`, gồm giới hạn và trạng thái kiểm chứng; không mặc định nạp toàn registry.

Đọc Product Decision Brief và research/analytics hiện có trước khi viết plan; research question phải kế thừa uncertainty đã được nêu, không tự đặt một mục tiêu nghiên cứu không nối với decision.

## Owner-Friendly Explanation

Nghiên cứu không có nghĩa là luôn phỏng vấn. Câu hỏi “bao nhiêu” cần dữ liệu định lượng đủ phạm vi; câu hỏi “vì sao” có thể cần phỏng vấn hoặc quan sát; câu hỏi “có làm được không” cần kiểm task. Chọn sai method vẫn tạo ra ghi chú, nhưng không giảm bất định mà Owner đang cần giải.

Generative research tìm vấn đề và bối cảnh khi chưa có solution; evaluative research kiểm solution đã có. Qualitative và quantitative là phân biệt thông dụng trong ngành, không phải taxonomy chính thức của GOV.UK; xem `../GLOSSARY.md` và `../SOURCE_REGISTRY.md` §3.

## Core Principles

- Đi theo chuỗi research question → uncertainty cần giảm → method; tham chiếu bảng so sánh tại `../_shared/RESEARCH_RULES.md` §A1 thay vì lặp lại nó.
- Review existing evidence trước khi tuyển người; nếu evidence đã trả lời câu hỏi, không tạo nghiên cứu chỉ vì “quy trình”.
- Hỏi về lần gần nhất, hành vi hiện tại, context và workaround; tránh future promise, leading question và câu hỏi yêu cầu participant thiết kế solution.
- Participant criteria phải gắn với question, không chỉ là danh sách demographic. Recruitment plan phải nói rõ ai có thể không xuất hiện trong sample.
- EVIDENCE — GOV.UK guidance trong registry nêu quy ước 4–8 participants mỗi round; khi cần thêm learning, tăng rounds thay vì phóng to một round. Đây không phải statistical power calculation (`../SOURCE_REGISTRY.md` §3); quy ước này chỉ áp dụng cho nghiên cứu định tính, tuyệt đối không chuyển giao sang survey định lượng.
- EVIDENCE — Registry nêu rule of thumb khoảng một giờ analysis cho hai giờ research; đưa thời gian này vào plan để notes không bị bỏ không xử lý (`../SOURCE_REGISTRY.md` §3).
- EVIDENCE — Home Office guidance trong registry yêu cầu ethics training trong ba tháng và de-identify transcripts trước khi sharing; áp dụng consent, privacy awareness và quy tắc dữ liệu địa phương phù hợp (`../SOURCE_REGISTRY.md` §3).
- Khi triển khai survey, bắt buộc chủ động kiểm soát và ghi nhận các thiên kiến đặc thù (survey-specific bias):
  - Acquiescence bias (thiên vị đồng thuận): xu hướng đồng ý với nhận định có sẵn; tránh dùng câu khẳng định một chiều, nên dùng câu hỏi lựa chọn cân bằng.
  - Self-selection / non-response bias: nhóm có cảm xúc cực đoan hoặc nhiều thời gian rảnh dễ phản hồi hơn; bắt buộc theo dõi response rate và so sánh thuộc tính người phản hồi với toàn thể population.
  - Likert scale design: thang đo thái độ cần cân bằng số lượng lựa chọn tích cực và tiêu cực (thường 5 hoặc 7 điểm), có nhãn rõ ràng cho từng điểm, kèm lựa chọn trung tính và "Không áp dụng" / "Không biết" để tránh ép buộc câu trả lời.
  - Leading & double-barrelled items: cấm câu hỏi dẫn dắt và câu hỏi gộp hai ý trong cùng một câu.
  - Order effects: thứ tự câu hỏi hoặc phương án có thể làm lệch câu trả lời; xáo trộn ngẫu nhiên (randomization) khi thích hợp.
- Không có chuẩn phổ quát bắt buộc phân loại thiên kiến survey này (No universal standard requires this). Đây là thực hành chuyên môn chuẩn mực của ngành nghiên cứu người dùng và là diễn giải của Agent (`../_shared/RESEARCH_RULES.md` §B1–§B2).

## Evidence Requirements

Áp dụng labels, source authority và anti-hallucination tại `../_shared/EVIDENCE_RULES.md`; participant, session, quote, sample size hoặc finding không có record thì không được bịa.

Mỗi research plan phải ghi objective, questions, decision supported, existing evidence, method rationale, participant criteria, recruitment, consent/privacy approach, evidence-capture structure, analysis time và limitations. Nếu không tuyển được đúng group, ghi limitation trước khi fieldwork.

Notes phải dùng participant ID ẩn danh, session/date, method, task/context, verbatim observation hoặc quote có định danh nguồn. De-identify transcript trước sharing theo registry; chỉ thu/giữ data cần cho research objective.

Dữ liệu từ survey phải bao gồm: nguyên văn câu hỏi (wording), sampling frame, phương thức phân phối, tổng số gửi, số phản hồi hợp lệ (sample size n), response rate, phân bố câu trả lời và ghi nhận các giới hạn do self-selection hoặc non-response bias. Không suy diễn kết quả survey thành quy luật phổ quát khi response rate thấp hoặc sample bị lệch.

## Workflow

1. Nhận handoff: decision, uncertainty, Product Decision Brief và existing evidence; bỏ hoặc sửa question đã có evidence đủ.
2. Viết research objective và questions dạng có thể trả lời; đánh dấu generative/evaluative và qualitative/quantitative như phân loại thực hành, không gán taxonomy này cho GOV.UK.
3. Chọn method theo question và ghi rationale cùng method không phù hợp; không mặc định interview.
4. Xác định participant criteria, recruitment approach, sample/round plan và exclusions; lập consent, privacy và data-handling plan trước session.
5. Viết guide hoặc questionnaire theo method đã chọn: với phỏng vấn/usability test, dùng open questions, neutral probes và task/context prompts; với survey, thiết kế câu hỏi đơn ý (single-barrelled), thang đo Likert cân bằng, câu hỏi sàng lọc (screener), xáo trộn thứ tự (randomization) để giảm order effects, tránh leading prompts.
6. Run sessions/survey/observation theo plan; capture evidence bằng IDs ẩn danh và de-identify before sharing.
7. Ghi limitations, allocate analysis time và handoff raw evidence sang `03-research-synthesis`; không gọi raw note là finding.

## Methods

| Method | Hợp cho | Không hợp cho |
|---|---|---|
| Semi-structured interview | Context, motivation, past behaviour và cách người tham gia mô tả workaround. | Không đo prevalence, conversion hoặc dự đoán hành vi tương lai. |
| Contextual inquiry / observation | Current behaviour, environment, handoff và constraint mà recall dễ bỏ sót. | Không phù hợp khi không thể quan sát context thật một cách an toàn/đồng thuận. |
| Moderated usability test | Người dùng có hoàn thành task với solution/prototype cụ thể không. | Không phù hợp để khám phá nhu cầu khi chưa có task/artefact. |
| Survey | Đo câu hỏi định lượng khi sample/recruitment đủ để scope claim; dùng questionnaire cân bằng, kiểm soát bias. | Không thay thế hiểu biết sâu về why/how; không phù hợp khi câu hỏi bị leading/double-barrelled, hoặc tự suy diễn đại diện khi tỷ lệ non-response cao; quy ước 4–8 người của định tính không áp dụng cho survey. |
| Existing-evidence review | Xác định đã biết gì và tránh duplicate research. | Không thay evidence trực tiếp khi dữ liệu cũ sai scope hoặc hết hạn. |

Không method nào là checklist bắt buộc. Chọn method nhỏ nhất giảm được uncertainty có hậu quả lớn nhất, theo `../_shared/RESEARCH_RULES.md` §A1.

## Decision Gates

Chọn method, guide và note format là quyết định vận hành của Agent, trừ khi chúng chạm tiền, personal data, access permission hoặc compliance; khi đó dừng OWNER DECISION theo `../_shared/DECISION_RULES.md` §3.

Dừng trước fieldwork nếu consent/privacy authority, participant access hoặc risk handling chưa rõ. Không đi qua gate chỉ vì deadline; ghi `OWNER INPUT REQUIRED` và điều bị chặn.

## Outputs / Artifacts

Dùng các template sau; mọi placeholder evidence phải giữ source, scope và evidence label.

```markdown
# RESEARCH PLAN
**Research Objective**
<uncertainty to reduce and decision supported>
**Existing Evidence Review**
EVIDENCE — <source, scope, what it answers / does not answer>
**Research Questions**
1. <question about behaviour/context/task, not a preferred solution>
**Method Rationale**
<method; why it fits; method deliberately not used and why>
**Participants and Recruitment**
<criteria, inclusion/exclusion, recruitment channel, missing groups>
**Sample and Rounds**
<4–8 participants per round when applicable; next round trigger; not a power claim>
**Ethics, Consent and Privacy**
<purpose, voluntary participation, recording consent, withdrawal, access, retention, de-identification>
**Evidence Capture**
<note structure, participant IDs, storage/access>
**Analysis and Limitations**
<analysis time, sample/recruitment/timeframe/question limits>
**Owner Decision**
<only if a gate requires approval>
```

```markdown
# RESEARCH QUESTIONS
**Objective**
<decision and uncertainty>
| ID | Research question | Type | Evidence needed | Not answered by this question |
|---|---|---|---|---|
| RQ-1 | | Generative / Evaluative; Qualitative / Quantitative | | |
```

```markdown
# PARTICIPANT CRITERIA
| Criterion | Why it matters to RQ | Include / Exclude | Recruitment signal | Known limitation |
|---|---|---|---|---|
| | | | | |
```

```markdown
# DISCUSSION / INTERVIEW GUIDE
**Opening**
<purpose, consent, recording choice, right to stop>
**Context**
- Tell me about the last time you <relevant situation>.
**Behaviour**
- What did you do first? What happened next?
**Probes**
- What made that difficult or easy?
- What did you try when that did not work?
- Can you show me, or describe the actual context?
**Evaluative Task (if applicable)**
- Please try to <task>; I am testing the product, not you.
**Avoid**
- Do not ask: “Would you use feature X?”
- Do not ask: “This is convenient, right?”
- Do not ask participant to design the screen.
**Close**
<final open question, withdrawal/removal route, thanks>
```

```markdown
# SURVEY QUESTIONNAIRE
**Objective & Target Population**
<uncertainty to reduce, decision supported, and target sampling frame>
**Screener Questions**
- S-1: <qualifying or disqualifying question to ensure target audience criteria>
**Core Questions**
- Q-1 (Single-barrelled, multiple choice): <clear question with exhaustive, mutually exclusive options, randomized order>
  - [ ] Option A
  - [ ] Option B
  - [ ] Other: <open text>
- Q-2 (Balanced Likert scale): <neutral statement or direct question>
  - ( ) 1 - Rất không hài lòng / Strongly disagree
  - ( ) 2 - Không hài lòng / Disagree
  - ( ) 3 - Trung lập / Neutral
  - ( ) 4 - Hài lòng / Agree
  - ( ) 5 - Rất hài lòng / Strongly agree
  - ( ) Không áp dụng / Not applicable
**Avoid**
- Do not ask double-barrelled questions: e.g. "Tính năng này nhanh và dễ dùng không?"
- Do not ask leading questions: e.g. "Bạn thích tính năng mới tiện lợi này ở điểm nào?"
- Do not use unbalanced scales or omit neutral / not-applicable options.
**Limitations to Track**
- Track response rate, self-selection bias, and completion drop-off.
**Close & Privacy Notice**
<data handling notice, voluntary nature, contact info, thanks>
```

```markdown
# RESEARCH NOTES
Session ID: P-<number>
Date: <YYYY-MM-DD>
Method: <method>
Participant criteria met: <yes/no; no personal identity>
Consent / recording: <status>
Question or task: <ID>
OBSERVATION — <verbatim behaviour or quote; timestamp/source>
Context / constraint: <what was observed or reported>
Researcher note: <separate interpretation; no finding label yet>
Data-sharing status: <de-identified before sharing>
```

```markdown
# RESEARCH LIMITATIONS
| Dimension | Limitation | Consequence for interpretation | What would reduce it |
|---|---|---|---|
| Sample | | | |
| Recruitment | | | |
| Missing participants | | | |
| Timeframe | | | |
| Unanswered question | | | |
```

## Handoff / Routing

`02-user-research` owns real-user research execution: protocol, recruitment, consent/privacy, sessions and raw-note custody, including concept/usability testing requested by `05`. Receive the validation question, prototype version, tasks and fidelity limits from `05`; return de-identified observation IDs, protocol, participant scope and limitations. `05` retains solution/prototype and iteration ownership. An explicit Owner assignment may change who executes, but must name one research execution owner and preserve this research contract.

Handoff raw notes, consent/data-handling constraints, question IDs, participant criteria, recruitment limitations and evidence index to `03-research-synthesis` for cross-study synthesis or changed product framing. A bounded single-round evaluation can return directly to `05` for task-level findings/severity with raw IDs; it must not generalise beyond that scope.

Route back to `01-product-discovery` if research exposes a different problem, buyer/user conflict, constraint or premise; do not silently revise the Product Decision Brief. Route to `05-solution-exploration` only when evidence has clarified a problem worth addressing.

## Anti-patterns

- ❌ Mặc định chọn phỏng vấn. / ✅ Chọn method từ research question và từ bất định cần giảm.
- ❌ Hỏi “Anh có dùng X không nếu chúng tôi làm?”. / ✅ Hỏi về lần gần nhất tình huống đó thực sự xảy ra.
- ❌ Nhờ người dùng thiết kế giải pháp hộ. / ✅ Thu behaviour, pain, motivation, workaround và constraint.
- ❌ Coi 4–8 người là bằng chứng thống kê. / ✅ `EVIDENCE` — coi đó là quy ước làm việc cho mỗi vòng, cần học thêm thì chạy thêm vòng; quy ước này không áp dụng cho survey.
- ❌ Dùng câu hỏi gộp hai ý (double-barrelled) hoặc thang đo lệch trong survey. / ✅ Tách mỗi câu một ý đơn, dùng thang đo Likert cân bằng và có lựa chọn trung tính / không áp dụng.
- ❌ Báo cáo kết quả survey mà không nêu response rate hay self-selection bias. / ✅ Báo cáo sampling frame, tỷ lệ phản hồi, phân bố mẫu và ghi nhận rõ các giới hạn đại diện.
- ❌ Chia sẻ transcript còn định danh. / ✅ Khử định danh trước khi chia sẻ và giới hạn quyền truy cập.
- ❌ Gọi ghi chép phiên là finding. / ✅ Bàn giao raw evidence truy ngược được sang synthesis.

## Sources

EVIDENCE — GOV.UK Service Manual, DDaT and Home Office UCD, `../SOURCE_REGISTRY.md` §3, chống đỡ planning, round size, five-step analysis, role context, ethics, training and de-identification. GOV.UK does not publish a named qualitative/quantitative taxonomy; that distinction here is common industry practice.

EVIDENCE — SFIA 9 URCH, `../SOURCE_REGISTRY.md` §1, chống đỡ ranh giới user research là một competency riêng; method selection, templates và facilitation guidance là diễn giải của Agent.

Không có chuẩn phổ quát nào trong `../SOURCE_REGISTRY.md` bao hàm chi tiết bảng câu hỏi survey và phân loại thiên kiến khảo sát (acquiescence bias, self-selection bias, Likert scale design, order effects). Các nội dung này là thực hành chuyên môn chuẩn mực của ngành nghiên cứu người dùng và là diễn giải của Agent (`../_shared/RESEARCH_RULES.md` §B1–§B2).

## Example

ILLUSTRATIVE EXAMPLE — not project data

```markdown
# RESEARCH PLAN
**Research Objective**
Decide whether audit-preparation delay is caused by history assembly or access permission.
**Research Questions**
1. In the last audit, how did analysts assemble approval history?
2. What workaround and constraint appeared when a record was unavailable?
**Method Rationale**
Contextual inquiry: the question concerns current workflow and handoffs. Survey is not selected because prevalence is not the current decision.
**Participants and Recruitment**
Analysts who prepared an audit in the last 90 days; exclude people who only approve records.
**Sample and Rounds**
4–8 participants in one round; open another round if a new workflow theme appears.
**Ethics, Consent and Privacy**
Observe only a demo/de-identified record; participant may stop at any time; transcript de-identified before sharing.
**Limitation**
EVIDENCE GAP — This round cannot estimate how common the workflow is across all customers.
```

```markdown
# SURVEY QUESTIONNAIRE
ILLUSTRATIVE EXAMPLE — not project data
**Objective**: Measure prevalence of audit-preparation delay across tier-1 organizations.
**Target Population**: Regulated organizations with scheduled compliance audits.
**Screener**:
- S-1: Did your team complete a regulatory audit in the last 12 months? (Yes -> continue / No -> exit).
**Core Question**:
- Q-1: How many working days did approval history assembly require?
  - ( ) Less than 1 day
  - ( ) 1–3 days
  - ( ) 4–7 days
  - ( ) More than 7 days
**Limitation**: Self-selection bias: organizations experiencing severe delays may be more likely to respond.
```

## Owner Decision

Present a gate only where research touches budget, personal data, access permission, compliance, or an irreversible trade-off. Use the record shape in `../_shared/DECISION_RULES.md` §4 and leave it PENDING until Owner responds.

```markdown
### D-1 — Approve research access and data handling
Decision status: PENDING
Date: <YYYY-MM-DD>
Decided by:
Question: <May this research access/use the stated participant and data scope?>
Evidence: <labelled constraints and plan>
Options: <A / B>
Trade-offs: <value and risk of each>
Recommendation: <labelled recommendation>
Confidence: HIGH | MEDIUM | LOW — <why>
Would change it: <new consent/privacy/access evidence>
If MODIFIED:
Reopens when:
```
