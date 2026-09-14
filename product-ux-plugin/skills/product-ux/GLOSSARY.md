# Glossary

> Chỉ chứa thuật ngữ mà **nhầm lẫn giữa chúng gây ra quyết định sai**. Đây không phải từ điển UX.
> Mỗi mục ưu tiên nêu ranh giới với thuật ngữ hay bị lẫn.

## Sản phẩm & kết quả

**Output** — thứ đội ngũ tạo ra (một màn hình, một tính năng, một release).
**Outcome** — thay đổi trong hành vi người dùng hoặc kết quả kinh doanh nhờ output đó; đo được. Giao "3 tính
năng" là output; "giảm 20% tỉ lệ bỏ dở onboarding" là outcome. Đội chỉ cam kết được output, nhưng chỉ outcome
mới trả lời câu "có đáng làm không".

**Business goal / Product goal / User goal** — ba thứ khác nhau và thường xung đột. Một đề xuất chỉ phục vụ
hai trong ba thường là chỗ ẩn của trade-off chưa nói ra.

**Buyer vs User** — người trả tiền và người dùng hằng ngày. Trong B2B/SaaS thường là hai người khác nhau với
tiêu chí khác nhau. Lẫn hai vai này là nguồn sai lệch lớn nhất khi định nghĩa "người dùng".

**Problem statement** — phát biểu *ai, trong hoàn cảnh nào, gặp trở ngại gì, hệ quả gì*. Không chứa giải pháp;
câu nào có động từ "thêm/xây/làm" là giải pháp trá hình.

**Opportunity** — nhu cầu, pain, hoặc mong muốn của người dùng, chưa gắn giải pháp. Một opportunity sinh ra
được nhiều solution.

**MVP** — phiên bản nhỏ nhất đủ để **học được điều cần học** hoặc giao được giá trị thật; không phải "bản rút
gọn của kế hoạch đầy đủ".

**Four Big Risks** (SVPG — practitioner framework, không phải chuẩn): Value, Usability, Feasibility, Viability.
Dùng để hỏi *rủi ro nào chưa được giải quyết*, không dùng như bốn ô phải điền.

## Bằng chứng & nghiên cứu

Thang đầy đủ ở `_shared/EVIDENCE_RULES.md` §1. Ở đây chỉ nhắc ba ranh giới hay bị vượt:

**Finding vs Insight** — finding nói *chuyện gì đã xảy ra*; insight nói *vì sao, và do đó phải cân nhắc gì*.
**Assumption vs Hypothesis** — assumption là điều đang tin; hypothesis **kiểm được**, phải nêu được cách làm
nó sai. **Recommendation vs Decision** — chỉ Owner tạo ra decision.

**Generative vs Evaluative research** — generative tìm hiểu vấn đề và bối cảnh (chưa có giải pháp); evaluative
kiểm một giải pháp đã có. Chọn sai loại là lý do phổ biến khiến nghiên cứu "không dùng được".

**Qualitative vs Quantitative** — định tính trả lời *vì sao / như thế nào*; định lượng trả lời *bao nhiêu / bao
thường xuyên*. Không suy tỉ lệ từ 5 người phỏng vấn.
⚠️ Đây là cách phân loại thông dụng trong ngành. **GOV.UK không dùng khuôn phân loại này** — bên đó tách theo
cấu trúc tài liệu (mục user research vs mục measuring success), không đặt tên taxonomy qual/quant. Đừng gán
cách gọi này cho GOV.UK.

**Contextual inquiry** — quan sát người dùng làm việc thật trong môi trường thật, kèm hỏi tại chỗ. Khác phỏng
vấn ở chỗ dựa vào hành vi quan sát được, không dựa vào trí nhớ người kể.

**Saturation** — điểm mà người tham gia tiếp theo không còn mang lại chủ đề mới. Là căn cứ dừng, không phải
con số cố định. Quy ước GOV.UK: 4–8 người mỗi vòng, cần thêm thì **tăng số vòng**, không phóng to một vòng.

**Affinity mapping / Thematic analysis** — gom mẩu bằng chứng thành chủ đề. Ràng buộc bắt buộc: mỗi chủ đề
phải **truy ngược** được về mẩu gốc (evidence traceability). Chủ đề không truy ngược được là ý kiến của người
tổng hợp. GOV.UK tách rõ **observation** (nguyên văn, chưa diễn giải) khỏi **finding** (câu tóm lược).

**Persona / JTBD / CJM / Empathy Map / Service Blueprint** — đều **tuỳ chọn**. Chỉ tạo khi cải thiện một quyết
định cụ thể (`_shared/RESEARCH_RULES.md` §A6).

## Cấu trúc & tương tác

**Information Architecture (IA)** — cách thông tin được tổ chức, đặt tên, phân nhóm, điều hướng.
**Taxonomy** — hệ thống phân loại và đặt tên bên trong IA.
**Mental model** — cách người dùng *tin* rằng hệ thống hoạt động. Lệch giữa mental model và cấu trúc thật là
nguồn của phần lớn lỗi điều hướng.

**User flow vs Task flow** — user flow là đường đi xuyên sản phẩm cho một mục tiêu (có thể nhiều nhánh); task
flow là chuỗi bước cho một tác vụ cụ thể. Trộn hai thứ khiến sơ đồ vừa thiếu nhánh vừa quá chi tiết.

**Happy path / Alternative path / Error path** — thiết kế chỉ có happy path là chưa xong. Mỗi hành động quan
trọng phải xét: thành công, sai dữ liệu nhập, không có dữ liệu, trùng lặp, thiếu quyền, lỗi hệ thống, lỗi
mạng, người dùng huỷ, và **cách hồi phục**.

**State** — trạng thái một màn/thành phần có thể ở: empty, loading, error, partial, success, disabled,
read-only. **State matrix** liệt kê chúng để không sót.

**Affordance** — dấu hiệu thị giác cho biết một thứ tương tác được và tương tác thế nào.

**Fidelity** — độ chi tiết của prototype. Nguyên tắc: **fidelity phải khớp câu hỏi đang kiểm**. Kiểm cấu trúc
thì bản vẽ thô là đủ; đẩy lên high-fidelity làm người kiểm góp ý về màu sắc thay vì về luồng.

## Đo lường

**Event / Event property / User property** — hành động được ghi nhận; thuộc tính mô tả hành động đó; thuộc
tính mô tả người thực hiện. Hành vi triển khai riêng của từng công cụ phải tách khỏi khái niệm chung
(`SOURCE_REGISTRY.md`).

**Metric vs KPI** — metric là bất kỳ đại lượng đo được; KPI là metric đã được chọn làm thước đo thành công.
**Baseline** là giá trị hiện tại; **target** là giá trị muốn đạt. Không có baseline thì không đọc được kết quả.

**Funnel / Conversion / Drop-off** — chuỗi bước; tỉ lệ đi hết; tỉ lệ rời ở mỗi bước. **Drop-off cao không đồng
nghĩa UI tệ** — có thể là sai đối tượng, sai kỳ vọng, hoặc bước đó vốn nên lọc bớt.

**Segmentation vs Cohort** — segment nhóm theo thuộc tính (gói, quốc gia, vai trò); cohort nhóm theo **thời
điểm chung** (cùng đăng ký tuần 32) rồi theo dõi theo thời gian. Dùng segment để đọc retention theo thời gian
là sai công cụ.

**Retention / Activation / Adoption / Engagement / Churn** — quay lại; đạt giá trị đầu tiên; bắt đầu dùng một
tính năng; mức độ dùng; rời bỏ. Bốn cái đầu hay bị dùng lẫn — định nghĩa cụ thể cho sản phẩm của bạn trước khi đo.

**HEART** (Google, framework đã công bố): Happiness, Engagement, Adoption, Retention, Task Success; đi kèm
tiến trình **Goals → Signals → Metrics**. Là công cụ **chọn** metric, không phải năm ô bắt buộc điền.

**Hypothesis / Experiment / Success metric / Guardrail metric** — guardrail là metric không được xấu đi khi
theo đuổi success metric. Thí nghiệm không có guardrail dễ "thắng" bằng cách đẩy thiệt hại sang chỗ khác.

**A/B test** — so sánh hai biến thể trên các nhóm phân bổ ngẫu nhiên **đồng thời**. Khác **before/after
comparison**, vốn không loại được yếu tố thời gian (mùa vụ, chiến dịch, thay đổi khác cùng lúc).

**Correlation vs Causation** — cùng biến thiên không chứng minh cái này gây ra cái kia. Chỉ thiết kế thí
nghiệm mới cho phép kết luận nhân quả.

## Bàn giao & vận hành

**Owner vs Scrum Product Owner** — Owner trong bộ này là người chịu trách nhiệm quyết định cuối cho câu hỏi đang xét. Product Owner là accountability chính thức của Scrum. Hai vai có thể do cùng hoặc khác người đảm nhiệm; không suy thẩm quyền design, compliance, ngân sách hay release từ chức danh. Ghi người có thẩm quyền cụ thể trong Decision Register; xin làm rõ nếu authority chưa được cung cấp.

Định nghĩa Scrum lấy theo **Scrum Guide 2020** (bản chính thức hiện hành). Ba điểm phải nói đúng:

**Scrum định nghĩa 3 accountabilities** (Product Owner, Scrum Master, Developers), **5 events** (Sprint, Sprint
Planning, Daily Scrum, Sprint Review, Sprint Retrospective), **3 artifacts** (Product Backlog, Sprint Backlog,
Increment). Bản 2020 đổi chữ "roles" thành "accountabilities".

**Scrum Guide KHÔNG định nghĩa vai trò Product Designer, UX, hay researcher.** "Developers" là từ cố ý bao
trùm mọi chuyên môn trong đội. Mọi phát biểu kiểu "Scrum yêu cầu designer phải…" đều không có căn cứ trong
guide. Cách designer cộng tác với đội Scrum là *thực hành sản phẩm*, phải mô tả tách bạch.

**Backlog refinement KHÔNG phải một Scrum event.** Nó không nằm trong 5 event. Guide mô tả nó là **hoạt động
diễn ra liên tục** để thêm chi tiết (mô tả, thứ tự, kích cỡ) và chia nhỏ hạng mục. Gọi nó là "ceremony" hay
"buổi họp bắt buộc" là sai nguồn.

Tương tự, **không** có trong Scrum Guide: dual-track agile, discovery/delivery split, story point, velocity,
sprint zero. Chúng là thực hành của ngành, phải gắn nhãn như vậy.

**Discovery vs Delivery** — discovery giảm bất định về *nên làm gì*; delivery xây thứ đã quyết. Chạy song
song, không nối tiếp. (Khái niệm của giới hành nghề, không phải của Scrum.)

**Acceptance criteria** — điều kiện kiểm được để coi một hạng mục là xong. Khác **Definition of Done**, vốn áp
cho mọi hạng mục.

**Design QA** — đối chiếu bản dựng thực tế với thiết kế và đặc tả tương tác, trước khi phát hành. Khác **UAT**
(người dùng/đại diện nghiệp vụ xác nhận đáp ứng nhu cầu thật). SFIA tách UAT (BPTS) khỏi UX evaluation (USEV)
thành hai skill riêng.

**Design debt** — khoảng lệch tích tụ giữa sản phẩm thật và hệ thống thiết kế/chuẩn đã thống nhất. Giống nợ
kỹ thuật: có lãi.

## Chất lượng & tiếp cận

**Design token / Component / Variant / Pattern** — giá trị thiết kế nguyên tử có tên; đơn vị UI tái dùng; biến
thể có kiểm soát của một component; cách giải quyết lặp lại cho một bài toán.

**WCAG conformance levels** — ba mức **A / AA / AAA**, **cộng dồn**: AA đòi đủ A + AA; AAA đòi đủ A + AA + AAA.
Conformance tuyên bố **theo từng trang**. AA là mức thường được lấy làm đích trong mua sắm công và pháp lý.

**Normative vs Informative trong WCAG** — ranh giới này hay bị nói sai và nó quyết định cái gì là *yêu cầu*:

- **Normative** (tạo ra yêu cầu): các success criteria, định nghĩa trong glossary, và mục Conformance.
- **Informative** (không tạo yêu cầu): tài liệu *Understanding*, và **toàn bộ Techniques** — cả sufficient lẫn
  advisory. Techniques là ví dụ cách đạt một criterion, không phải bản thân yêu cầu. **Không dùng một
  technique không phải là vi phạm WCAG.**

**Năm thứ phải để riêng, không gộp thành "chuẩn"**: yêu cầu normative của WCAG · thực hành tốt về UX ·
hướng dẫn Apple HIG · hướng dẫn Material · quy ước design system của đội.

**Heuristic evaluation** — chuyên gia rà giao diện theo bộ nguyên tắc. Rẻ và nhanh, nhưng **không thay thế**
usability test với người dùng thật: nó tìm vi phạm nguyên tắc, không tìm chỗ người thật bị kẹt.

**Severity** — mức nghiêm trọng của một phát hiện usability, dùng để xếp thứ tự sửa. Không có severity thì
danh sách phát hiện trở thành danh sách mong muốn.

## Dẫn dắt & cộng tác

**Contribution / Recommendation / Approval / Decision ownership** — bốn thứ khác nhau: góp ý; khuyến nghị
chuyên môn; phê duyệt; và **thẩm quyền quyết định**. Nhập nhèm bốn thứ này là gốc của hầu hết tranh cãi
stakeholder.

**Consensus** — đồng thuận có giá trị nhưng **không phải lúc nào cũng cần**. Người chịu trách nhiệm quyết định
vẫn giữ thẩm quyền; đi tìm đồng thuận tuyệt đối là một cách trì hoãn.

**Design critique vs Design review** — critique là góp ý khám phá giữa đồng nghiệp để cải thiện phương án;
review là đánh giá có cổng, dẫn tới một quyết định. Chạy nhầm loại khiến buổi họp không ra kết luận.

**Design principles** — nguyên tắc do đội thống nhất để phân xử đánh đổi. Nguyên tắc nào không giúp **loại bỏ**
được phương án nào thì không phải nguyên tắc, chỉ là khẩu hiệu.

**Responsibility level** — SFIA dùng thang **7 mức** (Follow, Assist, Apply, Enable, Ensure/advise,
Initiate/influence, Set strategy/inspire/mobilise) làm từ vựng chung về mức trách nhiệm. Dùng để nói về phạm
vi trách nhiệm, **không** dùng để suy ra chức danh hay mức lương.
