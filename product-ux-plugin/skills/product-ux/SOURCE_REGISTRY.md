# Source Registry

> Kiểm chứng ngày **2026-09-07** bằng fetch trực tiếp nguồn gốc. Mỗi mục ghi rõ **được phép chống đỡ tuyên
> bố gì** và **KHÔNG được coi là chống đỡ gì** — cột thứ hai mới là cột ngăn sai sót.
> Thang thẩm quyền: `_shared/EVIDENCE_RULES.md` §4. Quy tắc dùng nguồn: `_shared/RESEARCH_RULES.md` §B.

**Trạng thái kiểm chứng** — `VERIFIED` (đã fetch được trang gốc) · `PARTIAL` (một phần từ snippet, cần kiểm
lại) · `NO VERSION PUBLISHED` (nguồn không công bố phiên bản/ngày — tính chất của nguồn, không phải lỗi
kiểm chứng).

---

## 1. SFIA 9

| | |
|---|---|
| Tổ chức | SFIA Foundation |
| Loại | Professional competency framework |
| Phiên bản | **SFIA 9 — công bố tháng 10/2024** |
| URL | `sfia-online.org/en/sfia-9` · `/all-skills-a-z` · `/responsibilities` |
| Trạng thái | **VERIFIED** |
| Skill dùng | 01, 02, 03, 04, 05, 07, 08, 09 |

Năm mã liên quan **đều còn trong SFIA 9**, không mã nào bị đổi tên hay gỡ:

- **UNAN — User experience analysis**: hiểu bối cảnh sử dụng, đặc tả yêu cầu/mục tiêu trải nghiệm.
- **HCEV — User experience design**: tạo concept và prototype cho tương tác và trải nghiệm.
- **USEV — User experience evaluation**: kiểm định sản phẩm/dịch vụ theo mục tiêu, metric, target UX.
- **URCH — User research**: nhận diện hành vi, nhu cầu, động cơ bằng phương pháp quan sát.
- **BPTS — User acceptance testing**: kiểm định tiêu chí chấp nhận đã thoả mãn chưa.

**Responsibility levels: 7 mức** — 1 Follow · 2 Assist · 3 Apply · 4 Enable · 5 Ensure/advise ·
6 Initiate/influence · 7 Set strategy/inspire/mobilise. Mỗi skill chỉ định nghĩa ở **một số** mức.

**Chống đỡ được**: ranh giới giữa bốn skill UX riêng biệt (phân tích / thiết kế / đánh giá / nghiên cứu);
UAT (BPTS) **tách khỏi** UX evaluation (USEV); từ vựng chung về mức trách nhiệm.
**KHÔNG chống đỡ**: hướng dẫn phương pháp cụ thể (SFIA định nghĩa skill, không định nghĩa kỹ thuật); chức
danh và thang lương; suy ra "người ở mức N phải làm hoạt động X"; thiết kế tổ chức.

---

## 2. UK DfE — Design Skills Framework

| | |
|---|---|
| Tổ chức | UK Department for Education, Design profession |
| Loại | Official guidance / competency framework |
| Phiên bản | **NO VERSION PUBLISHED** |
| URL | `design.education.gov.uk/professions/framework` |
| Trạng thái | **VERIFIED** |
| Skill dùng | 04, 05, 09 |

⚠️ Đường dẫn `/design-skills-framework` **trả 404** — không trích đường dẫn đó.

Bảy capability area (đủ, không thiếu không thừa): Design communication · Designing strategically ·
Designing together · Designing for everyone · Evidence-based design · Iterative design · Leading design.

Cấu trúc là **ma trận**: 7 capability × cấp bậc (HEO, SEO, G7, G6 Lead, G6 Head of Profession); mỗi ô có ví
dụ riêng cho **hai loại designer: service designer và interaction designer**.

**Chống đỡ được**: bộ từ vựng 7 năng lực thiết kế; năng lực mở rộng theo cấp bậc; service design và
interaction design là hai thực hành phân biệt.
**KHÔNG chống đỡ**: điều gì mang tính toàn chính phủ Anh (đây là framework riêng của DfE, không phải
GDS/DDaT); năng lực user research (framework DDaT riêng — mục 3).

---

## 3. GOV.UK Service Manual · DDaT · Home Office UCD

| | |
|---|---|
| Tổ chức | UK GDS / Cabinet Office; UK Home Office |
| Loại | Official guidance |
| Phiên bản | Living guidance, **NO VERSION PUBLISHED** |
| Trạng thái | **VERIFIED** |
| Skill dùng | 02, 03 |

URL đã fetch: `ddat-capability-framework.service.gov.uk/role/user-researcher` ·
`gov.uk/service-manual/user-research/plan-user-research-for-your-service` · `.../plan-round-of-user-research` ·
`.../capturing-research-questions` · `.../using-moderated-usability-testing` · `.../analyse-a-research-session` ·
`.../sharing-user-research-findings` · `gov.uk/service-manual/measuring-success` ·
`design.homeoffice.gov.uk/user-research` (+ `/ethics`, `/participant-recruitment`, `/professional-standards`).

- **Cỡ mẫu mỗi vòng: 4–8 người.** Cần nhiều hơn thì **tăng số vòng**, không phóng to một vòng.
- **Phân tích 5 bước**: trích observation (nguyên văn, chưa diễn giải) → gom chủ đề bằng affinity diagram →
  rút finding (câu tóm lược ngắn) → quyết định hành động → chia sẻ.
- Quy tắc ngón tay cái: **~1 giờ phân tích cho mỗi 2 giờ nghiên cứu**.
- Vai user researcher (DDaT): 7 skill, 6 cấp, chấm theo 4 bậc thành thạo (awareness / working / practitioner
  / expert).
- Home Office: đào tạo ethics bắt buộc trong 3 tháng; xử lý GDPR; **khử định danh transcript trước khi chia
  sẻ**; mục tiêu hoà nhập ~1/5 người tham gia là người khuyết tật; chuẩn tiếp cận **WCAG 2.2 mức AA**.

⚠️ **Đính chính**: GOV.UK **không** có khuôn phân loại chính thức "qualitative vs quantitative". Việc tách là
theo cấu trúc tài liệu (mục user research vs mục measuring success), không phải taxonomy được đặt tên.
**Không gán cách gọi đó cho GOV.UK.**

**Chống đỡ được**: quy ước khu vực công Anh về lập kế hoạch nghiên cứu, cỡ mẫu mỗi vòng, quy trình biến
nghiên cứu thành insight, đạo đức và đồng thuận, nghiên cứu theo pha.
**KHÔNG chống đỡ**: giá trị thống kê (4–8 là quy ước làm việc, không phải tính toán power); thực hành
product analytics thương mại; phương pháp luận hàn lâm.

---

## 4. Scrum Guide

| | |
|---|---|
| Tổ chức | Ken Schwaber & Jeff Sutherland |
| Loại | Practitioner framework (văn bản định nghĩa chính thức của Scrum) |
| Phiên bản | **Scrum Guide 2020 — tháng 11/2020.** Hiện hành, chưa có bản mới hơn |
| URL | `scrumguides.org/scrum-guide.html` |
| Trạng thái | **VERIFIED** |
| Skill dùng | 07 |

- **3 accountabilities**: Product Owner, Scrum Master, Developers. (Bản 2020 đổi "roles" → "accountabilities".)
- **5 events**: Sprint (khung chứa), Sprint Planning, Daily Scrum, Sprint Review, Sprint Retrospective.
- **3 artifacts**: Product Backlog, Sprint Backlog, Increment.

⚠️ **Scrum Guide KHÔNG định nghĩa vai designer / UX / researcher nào.** "Developers" là từ cố ý bao trùm mọi
chuyên môn. Mọi phát biểu "Scrum quy định design phải…" đều không có căn cứ trong guide.

⚠️ **Backlog refinement KHÔNG phải Scrum event** — không nằm trong 5 event. Guide mô tả nó là **hoạt động
diễn ra liên tục** để thêm chi tiết (mô tả, thứ tự, kích cỡ) và chia nhỏ hạng mục.

**Chống đỡ được**: tập tối thiểu chính xác của accountabilities/events/artifacts; lập luận rằng Scrum **cố ý
im lặng** về thực hành thiết kế nên quy trình UX phải do đội tự thiết kế; đính chính lỗi gọi refinement là
ceremony.
**KHÔNG chống đỡ**: dual-track agile, tách discovery/delivery, story point, estimation, velocity, sprint
zero, refinement như buổi họp định kỳ — **không thứ nào có trong guide**; tuyên bố về SAFe/LeSS/Nexus.

---

## 5. WCAG 2.2

| | |
|---|---|
| Tổ chức | W3C / WAI — Accessibility Guidelines Working Group |
| Loại | **Standard** (W3C Recommendation) |
| Trạng thái | ⚠️ **PARTIAL — xem cảnh báo** |
| Skill dùng | 04, 07, 08 |

**Vì sao PARTIAL**: mọi URL `w3.org` trả **HTTP 403 + Cloudflare challenge** trong môi trường này; không
trang `w3.org` nào được fetch trọn vẹn. Đã fetch được `w3c.github.io/wcag/guidelines/22/` — **Editor's
Draft** (06/09/2026), là bản W3C công bố nhưng **không phải** bản Recommendation.

Từ **snippet tìm kiếm, chưa fetch trọn trang — kiểm lại trước khi trích như số đã xác minh**: WCAG 2.2 thành
W3C Recommendation **05/10/2023**, cập nhật **12/12/2024**; duyệt thành **ISO/IEC 40500:2025** ngày 21/10/2025.

Đã xác nhận trong bản Editor's Draft fetch được:

- **Conformance levels: A / AA / AAA, cộng dồn.** AA đòi đủ A + AA; AAA đòi đủ A + AA + AAA. Tuyên bố
  conformance **theo từng trang**; cho phép conforming alternate version.
- **Normative** (tạo ra yêu cầu): success criteria · định nghĩa trong glossary · mục Conformance.
- **Informative** (không tạo yêu cầu): tài liệu *Understanding* · **toàn bộ Techniques**, cả sufficient lẫn
  advisory. **Không dùng một technique KHÔNG phải là vi phạm WCAG.**
- **WCAG 3.0 chỉ ở dạng Working Draft** ("an incomplete draft"), nhãn trưởng thành nội bộ Placeholder →
  Exploratory → Developing → Mature. **Không được trích như một yêu cầu.**

**Chống đỡ được**: cấu trúc A/AA/AAA; AA là mức thường lấy làm đích pháp lý/mua sắm công; ranh giới
normative/informative; success criteria là phát biểu kiểm được, độc lập công nghệ.
**KHÔNG chống đỡ**: coi bất kỳ Technique nào là bắt buộc; coi WCAG 3.0 là chuẩn hiện hành; đánh đồng
conformance với "dùng được cho người khuyết tật"; giá trị thiết kế cụ thể (màu, khoảng cách) vượt quá điều
một success criterion thực sự nói.

---

## 6. Google HEART

| | |
|---|---|
| Tác giả | Kerry Rodden, Hilary Hutchinson, Xin Fu — Google |
| Loại | **Research paper** (CHI note, có phản biện) |
| Xuất bản | **Proceedings of CHI 2010, ACM Press** — 10–15/04/2010, Atlanta, Georgia, USA |
| URL | `research.google/pubs/measuring-the-user-experience-on-a-large-scale-...` · PDF `static.googleusercontent.com/.../36299.pdf` |
| Trạng thái | **VERIFIED** — đã trích xuất và đọc toàn văn PDF |
| Skill dùng | 06 |

Năm nhóm: **Happiness** (metric thái độ: hài lòng, thẩm mỹ, khả năng giới thiệu, cảm nhận dễ dùng) ·
**Engagement** (mức độ dấn thân: tần suất, cường độ, chiều sâu tương tác) · **Adoption** (bao nhiêu người
dùng MỚI bắt đầu dùng trong một khoảng thời gian) · **Retention** (bao nhiêu người của kỳ trước còn ở lại
kỳ sau) · **Task Success** (hiệu quả, hiệu suất, tỉ lệ lỗi).

**Goals → Signals → Metrics**: nêu mục tiêu (dùng HEART để **gợi** việc phát biểu mục tiêu, và ở bước này
đừng lo liệu có tìm được signal/metric hay không) → xác định signal biểu hiện thành công/thất bại trong hành
vi hoặc thái độ (phải **nhạy và đặc hiệu** với mục tiêu) → dựng metric theo dõi được.

⚠️ **Bài báo nói thẳng đây là công cụ CHỌN, không phải checklist**: không phải lúc nào cũng thích hợp dùng
metric từ mọi nhóm, nhưng đối chiếu framework giúp **ra quyết định tường minh** về việc bao gồm hay loại trừ
từng nhóm. Ví dụ của chính bài: Engagement có thể vô nghĩa trong bối cảnh doanh nghiệp nơi người dùng buộc
phải dùng sản phẩm để làm việc — khi đó đội có thể tập trung vào Happiness hoặc Task Success.

**Chống đỡ được**: định nghĩa 5 nhóm; trình tự Goals→Signals→Metrics; lập luận rằng metric kiểu PULSE quá
thấp tầng hoặc quá gián tiếp để đánh giá thay đổi UI; HEART là công cụ chọn, đòi quyết định include/exclude
tường minh cho từng nhóm; Engagement nên báo cáo theo người dùng, không theo tổng số.
**KHÔNG chống đỡ**: rằng phải đo đủ 5 nhóm cho mọi sản phẩm (bài báo nói ngược lại); rằng metric thay thế
được nghiên cứu định tính — bài nêu rõ metric **bổ sung chứ không thay thế** phương pháp nghiên cứu UX hiện
có, và chủ yếu hữu ích để **đánh giá sản phẩm đã ra mắt**, không thay được nghiên cứu giai đoạn sớm; rằng
HEART là chuẩn, maturity model, hay bộ benchmark; rằng bất kỳ ngưỡng cụ thể nào là khuyến nghị (ví dụ
"5+ ngày/tuần" là metric Gmail tự chọn, không phải chuẩn mực).

---

## 7. SVPG — Silicon Valley Product Group

| | |
|---|---|
| Tác giả | Marty Cagan / SVPG |
| Loại | **Practitioner framework** — không phải chuẩn, không phản biện, không có thẩm quyền quy phạm |
| Ngày | *Four Big Risks* đăng 2017-12-04, sửa 2023-07-13 · *Product Operating Model* đăng 2023-02-10, sửa 2024-07-11 · *Discovery vs Delivery* đăng 2015-10-22, sửa 2025-03-06 |
| URL | `svpg.com/four-big-risks/` · `/the-product-operating-model-an-introduction/` · `/discovery-vs-delivery/` |
| Trạng thái | **VERIFIED** |
| Skill dùng | 01, 05 |

**Four Big Risks** — tên và định nghĩa đúng theo SVPG:
1. **Value risk** — khách hàng có mua không, người dùng có chọn dùng không
2. **Usability risk** — người dùng có tự hiểu được cách dùng không
3. **Feasibility risk** — kỹ sư có dựng được với thời gian, kỹ năng, công nghệ đang có không
4. **Business viability risk** — giải pháp có chạy được với các mặt khác của doanh nghiệp không

**Product Operating Model**: mô hình khái niệm dựa trên các nguyên lý đầu tiên mà các công ty sản phẩm hàng
đầu tin là đúng; xoay quanh việc **đạt outcome thay vì chỉ tạo ra output**; ba chiều — cách xây (phát hành
nhỏ, thường xuyên), cách giải bài toán (giao outcome thay vì giao tính năng; giải pháp phải valuable, usable,
feasible, viable), cách chọn bài toán để giải (product vision + chiến lược dựa trên insight).

**Discovery vs Delivery**: discovery xác định **giải pháp đúng để xây**; delivery tạo bản triển khai bền
vững, tin cậy được. SVPG nhấn mạnh đây là **hai hoạt động của MỘT đội liên chức năng**; tách thành đội
discovery riêng và đội delivery riêng bị nêu đích danh là anti-pattern.

**Chống đỡ được**: cách đặt tên chuẩn của bốn rủi ro; lập trường rằng cả bốn nên được xử lý trong discovery
chứ không đẩy sang delivery; khung outcome-over-output; discovery/delivery là phân chia **hoạt động** chứ
không phải phân chia **đội**; như bằng chứng về **thực hành có ảnh hưởng trong ngành**.
**KHÔNG chống đỡ**: bất kỳ tuyên bố nào rằng đây là chuẩn/đặc tả/yêu cầu tuân thủ; tuyên bố định lượng kiểu
"đội dùng mô hình này hiệu quả hơn X%" (không có nghiên cứu công bố); tính phổ quát sang bối cảnh khác (ngành
bị quản lý chặt, phần cứng, agency, công cụ nội bộ không phải quần thể SVPG khái quát từ đó); Four Big Risks
như một **phân loại rủi ro đầy đủ** — rủi ro đạo đức, pháp lý, quyền riêng tư, an ninh, khả năng tiếp cận
đều **không** nằm trong bốn cái đó.

---

## 8. Teresa Torres / Product Talk

| | |
|---|---|
| Tác giả | Teresa Torres |
| Loại | **Practitioner framework** — không phải chuẩn |
| Ngày | *Continuous Discovery* (glossary) đăng 2025-10-25, sửa 2026-09-01 · *Opportunity Solution Trees* đăng 2023-12-06, sửa 2026-08-05 |
| URL | `producttalk.org/glossary-discovery-continuous-discovery/` · `producttalk.org/opportunity-solution-trees/` |
| Trạng thái | **VERIFIED** |
| Skill dùng | 01, 03 |

⚠️ `/2021/08/opportunity-solution-tree/` **301-redirect** — trích URL canonical ở trên.

**Continuous Discovery**: điểm chạm **hằng tuần** với khách hàng, do chính đội đang xây sản phẩm thực hiện,
qua các hoạt động nghiên cứu nhỏ, nhằm theo đuổi một outcome mong muốn. **Nhịp hằng tuần nằm trong định
nghĩa**, không phải một khuyến nghị. Ba điều kiện: đội tự tiếp xúc khách hàng (không qua báo cáo hay
persona); nghiên cứu là hoạt động nhỏ, vừa sức xen kẽ việc thiết kế và code; hướng tới một outcome.

**Opportunity Solution Tree** — bốn tầng: **Outcome** (gốc) → **Opportunities** (nhu cầu, pain point, mong
muốn của khách hàng mà nếu đáp ứng sẽ đẩy outcome) → **Solutions** → **Assumption tests**.
Phép thử của Torres để biết một thứ có thật là opportunity hay là solution trá hình: **có nhiều hơn một cách
để đáp ứng nó không?** Chỉ có một cách ⇒ đó là solution.

**Chống đỡ được**: cấu trúc Outcome → Opportunity → Solution → Assumption test; định nghĩa opportunity là nhu
cầu chưa được đáp ứng, phân biệt với solution; định nghĩa continuous discovery theo điểm chạm hằng tuần.
**KHÔNG chống đỡ**: rằng đây là chuẩn hay yêu cầu của ngành; tuyên bố về hiệu quả (không có nghiên cứu đối
chứng; tài liệu gắn thương mại với sách và khoá học trả phí); rằng nhịp hằng tuần đã được kiểm chứng thực
nghiệm là tối ưu (đó là ranh giới định nghĩa Torres vạch ra, không phải kết quả đo được); rằng OST là cấu
trúc discovery duy nhất hợp lệ.

---

## 9. Amplitude Documentation

| | |
|---|---|
| Tổ chức | Amplitude, Inc. |
| Loại | **Tool documentation** — nhà cung cấp viết, mô tả hành vi của MỘT sản phẩm |
| Phiên bản | **NO VERSION PUBLISHED**, không có ngày cập nhật trên trang — ngày truy xuất 2026-09-07 |
| URL | `amplitude.com/docs/data/data-planning-playbook` · `/analytics/charts/funnel-analysis/funnel-analysis-get-the-most` · `/analytics/behavioral-cohorts` · `/analytics/charts/retention-analysis/retention-analysis-interpret` · `/analytics/charts/event-segmentation` |
| Trạng thái | **VERIFIED** (trừ một mục — xem dưới) |
| Skill dùng | 06 |

Tách **khái niệm chung** khỏi **hành vi riêng của Amplitude** — đây là lý do mục này tồn tại:

| Khái niệm | Chung hay riêng |
|---|---|
| Event — hành động người dùng thực hiện trong sản phẩm | **CHUNG** |
| Event property — thuộc tính của một lần xảy ra cụ thể | **CHUNG**; trần số lượng và công cụ taxonomy là riêng |
| User property — đặc điểm mô tả người dùng | **PHẦN LỚN CHUNG**, nhưng áp cho **event về sau**, **không hồi tố** lên event lịch sử ⇒ **RIÊNG AMPLITUDE** |
| Funnel analysis — chuỗi bước; không hoàn thành tính là "dropped off" | **CHUNG** |
| Funnel order modes — This Order / Any Order / Exact Order | **RIÊNG AMPLITUDE** |
| Conversion window | **RIÊNG AMPLITUDE**. ⚠️ Số default/max **UNVERIFIED** — trang gốc không nêu, trang được cho là có trả 404. Không trích số |
| Segmentation | **CHUNG**; module "Segment By"/"Group By" là UI riêng |
| Behavioral cohort — nhóm theo **hành vi quan sát được** | **CHUNG** về khái niệm; cơ chế riêng: tính lại động mỗi lần chart được tạo; gói Plus giới hạn 5 cohort |
| Retention analysis | **CHUNG** |
| Retention calculation types — N-Day · Unbounded · Bracket | N-day vs unbounded là chung; **cách đặt tên và biến thể Bracket là riêng Amplitude** |

⚠️ **Không bao giờ trích một con số retention mà không nói dùng cách tính nào** — ba cách cho ra giá trị khác
nhau từ cùng một dữ liệu.

**Chống đỡ được**: cách **Amplitude** định nghĩa và tính; hướng dẫn tracking plan cho một triển khai
Amplitude; cảnh báo con số retention vô nghĩa nếu không nêu cách tính; việc user property áp về sau.
**KHÔNG chống đỡ**: rằng đây là định nghĩa chuẩn của ngành — đây là định nghĩa nhà cung cấp, **khác đáng kể**
GA4/Mixpanel/PostHog; tuyên bố về việc **nên** đo gì (tài liệu tham chiếu, không phải hướng dẫn phương pháp);
benchmark ("retention tốt là X%"); tính khả chuyển của order mode hay Bracket sang công cụ khác.

---

## 10. Apple Human Interface Guidelines

| | |
|---|---|
| Tổ chức | Apple Inc. |
| Loại | **Official guidance** (hướng dẫn nền tảng của chính hãng) |
| Phiên bản | **NO VERSION PUBLISHED** — Apple không công bố phiên bản/ngày. Truy xuất 2026-09-07 |
| URL | `developer.apple.com/design/human-interface-guidelines` |
| Trạng thái | **VERIFIED** (nội dung); phiên bản/ngày không tồn tại công khai |
| Skill dùng | 04, 08 |

Nền tảng: **iOS · iPadOS · macOS · tvOS · visionOS · watchOS · games**.
Sáu mục cấp cao: Getting started · Foundations · Patterns · Components · Inputs · Technologies.

**Chống đỡ được**: quy ước nền tảng Apple — hành vi và hình thức component hệ thống, điều hướng đúng chất nền
tảng, SF Symbols, Dynamic Type, Dark Mode, safe area, kỳ vọng tiếp cận **trên nền tảng Apple**; dự đoán kỳ
vọng thiết kế của App Review.
**KHÔNG chống đỡ**: luật UX phổ quát; Android, Windows, web nói chung; lập luận nhất quán đa nền tảng (HIG và
Material **mâu thuẫn** ở điều hướng, hành vi back, vị trí control, typography); **không** phải chuẩn tiếp cận
(WCAG và EN 301 549 mới là chuẩn); không phải bằng chứng thực nghiệm; không phải trích dẫn ổn định vì không
có phiên bản.

---

## 11. Material Design 3

| | |
|---|---|
| Tổ chức | Google |
| Loại | **Official guidance** (design system của hãng + thư viện mã nguồn mở) |
| Phiên bản | Thế hệ **M3**, nhánh hiện hành **M3 Expressive**. **Không có số phiên bản semantic.** Thông báo trên trang chủ đề ngày **19/05/2026** (Google I/O 2026). Truy xuất 2026-09-07 |
| URL | `m3.material.io` (+ `/get-started`, `/foundations`, `/styles`, `/components`, `/blog`, `/develop`) |
| Trạng thái | **VERIFIED**; không có số phiên bản để ghi |
| Skill dùng | 04, 08 |

⚠️ **Trạng thái hỗ trợ từng thư viện — hay bị nói sai**: **Jetpack Compose** là nền tảng khuyến nghị cho
Android, nhận cập nhật Material sớm nhất · **Flutter** được đội Flutter duy trì, cập nhật định kỳ ·
**Android Views (MDC-Android)** ở **chế độ bảo trì**, chỉ sửa lỗi nghiêm trọng · **Material Web** ở **chế độ
bảo trì**, không còn cập nhật tính năng.

**Chống đỡ được**: quy ước thiết kế Material/Android; kiến trúc và cách đặt tên token M3; color role và
dynamic color; đặc tả component và state của M3; trạng thái hỗ trợ của từng thư viện.
**KHÔNG chống đỡ**: chuẩn thiết kế phổ quát; giao diện iOS (nơi xung đột với HIG); **tuân thủ khả năng tiếp
cận** — WCAG và EN 301 549 mới là chuẩn, dùng component M3 **không** tự động đạt conformance; tuyên bố thực
nghiệm về M3 Expressive.

---

## 12. gstack `/office-hours`

| | |
|---|---|
| Nguồn | skill cục bộ, `~/.claude/skills/office-hours/SKILL.md`, v2.0.0, 1697 dòng |
| Loại | **Agent workflow reference** — KHÔNG phải chuẩn UX của ngành |
| Trạng thái | **VERIFIED** (đọc trực tiếp trên máy 2026-09-07) |
| Skill dùng | 01 (định tuyến vào/ra) |

Hai chế độ: *startup mode* (sáu câu hỏi ép làm rõ nhu cầu thật, hiện trạng, tính cụ thể, cái nêm hẹp nhất,
quan sát, độ phù hợp tương lai) và *builder mode* (brainstorm design-thinking cho dự án phụ). Lưu ra design doc.

**Chống đỡ được**: cách một agent chất vấn tiền đề trước khi vào discovery; điểm nối vào `01-product-discovery`.
**KHÔNG chống đỡ**: bất kỳ tuyên bố nào về lý thuyết UX hay Product. Không fork, không ghi đè.

---

## Ghi chú xuyên suốt

**Mười hai nguồn KHÔNG ngang hàng nhau.** Một bài báo có phản biện (HEART, CHI 2010) · một chuẩn (WCAG) · một
framework năng lực nghề (SFIA) · hai bộ hướng dẫn chính phủ (DfE, GOV.UK/Home Office) · hai bộ hướng dẫn nền
tảng của hãng (HIG, M3 — chỉ có thẩm quyền **trên nền tảng của chính họ**) · một tài liệu công cụ (Amplitude
— chỉ có thẩm quyền về hành vi của Amplitude) · hai framework hành nghề (SVPG, Product Talk — có ảnh hưởng,
có động cơ thương mại, **không** có hậu thuẫn thực nghiệm) · một văn bản định nghĩa framework (Scrum Guide) ·
một workflow agent (office-hours).

⚠️ **Không skill nào được trích SVPG hay Product Talk bằng ngôn ngữ bắt buộc** ("phải", "yêu cầu", "theo chuẩn").

**Ba nguồn không có phiên bản và không có ngày**: Apple HIG, Material Design 3, Amplitude docs. Trích chúng
phải kèm **ngày truy xuất**, không kèm số phiên bản, và cần kiểm lại định kỳ.

**HIG và M3 mâu thuẫn nhau về cấu trúc.** Mọi quy tắc khẳng định có MỘT mẫu đúng duy nhất cho điều hướng,
hành vi back, hay vị trí control xuyên cả hai nền tảng đều **không được nguồn nào chống đỡ**.

**Ba mục cần kiểm lại**: (1) ngày Recommendation và ngày cập nhật WCAG 2.2 — hiện chỉ từ snippet vì `w3.org`
chặn bot trong môi trường này; (2) default/max conversion window của Amplitude — trang gốc không nêu;
(3) phiên bản/ngày của HIG và M3 — **không tồn tại công khai**, là tính chất của nguồn chứ không phải thiếu
sót khi kiểm.
