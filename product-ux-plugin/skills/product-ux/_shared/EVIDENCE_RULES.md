# Evidence Rules

> Thang bằng chứng dùng chung cho mọi skill trong `product-ux/`.
>
> **Nhãn áp cho cái gì — đọc kỹ, đây là chỗ dễ hiểu quá tay.** Nhãn áp cho **phát biểu về sản phẩm,
> người dùng, dữ liệu, hoặc thị trường** trong **tài liệu mà skill sinh ra** (brief, research plan,
> findings, đề xuất). Mỗi phát biểu loại đó mang **đúng một** nhãn; không nhãn coi như chưa viết xong.
>
> Nhãn **KHÔNG** áp cho văn hướng dẫn của chính các file `../SKILL.md` trong bộ này — cả tài liệu vốn đã
> là hướng dẫn, dán `RECOMMENDATION` lên từng dòng chỉ thêm nhiễu chứ không thêm thông tin. Trong
> `../SKILL.md`, chỉ gắn nhãn ở đúng ba chỗ: (a) template deliverable, (b) ví dụ minh hoạ, (c) câu
> khẳng định về một nguồn hoặc một dữ kiện có thể bị phản bác (`EVIDENCE`, `OWNER INPUT REQUIRED`,
> `EVIDENCE GAP`, `ASSUMPTION`).

## 1. Thang bằng chứng

| Nhãn | Định nghĩa | Điều kiện được dùng |
|---|---|---|
| `FACT` | Thông tin đã kiểm chứng trực tiếp | Truy được về nguồn cụ thể, không qua diễn giải |
| `EVIDENCE` | Dữ liệu hoặc nghiên cứu chống đỡ cho một tuyên bố | Nêu được nguồn + phạm vi (n=, khoảng thời gian, segment) |
| `OBSERVATION` | Điều quan sát được trong nghiên cứu hoặc trong hành vi sản phẩm | Mô tả cái đã thấy, chưa giải thích |
| `FINDING` | Kết quả có ý nghĩa rút ra từ evidence | Chỉ ra được evidence nào dẫn tới nó |
| `PATTERN` | Hành vi hoặc finding lặp lại | Nêu được số lần lặp và trên tập nào |
| `INSIGHT` | Giải thích sâu hơn về hành vi/bối cảnh, kèm hệ quả | Nói được "vì vậy thì sao" — không có hệ quả thì đó vẫn là FINDING |
| `ASSUMPTION` | Điều đang tin nhưng chưa được kiểm chứng | Bắt buộc kèm `NOT YET VALIDATED` |
| `INFERENCE` | Diễn giải logic dựa trên evidence sẵn có | Nêu được bước suy luận, để người khác bác được |
| `HYPOTHESIS` | Dự đoán **kiểm được** | Phải nêu được cách làm nó sai |
| `RECOMMENDATION` | Lời khuyên chuyên môn của Agent | Không bao giờ được viết như đã chốt |
| `DECISION` | Do Owner (hoặc người có thẩm quyền) xác nhận rõ ràng | Chỉ Owner mới tạo được nhãn này |

`INSIGHT` vs `FINDING` là chỗ hay lẫn nhất: FINDING nói *chuyện gì đã xảy ra*, INSIGHT nói *vì sao, và
điều đó buộc ta cân nhắc gì*. Không nói được vế sau thì đừng nâng nhãn lên.

## 2. Sáu phép biến đổi bị cấm

Không bao giờ chuyển hoá các cặp sau nếu không có bằng chứng chống đỡ:

```
assumption          →  fact
correlation         →  causation
analytics signal    →  UX diagnosis
competitor pattern  →  user need
user request        →  validated requirement
single observation  →  pattern
```

Cặp `analytics signal → UX diagnosis` là cặp bị vi phạm nhiều nhất trong thực tế: một funnel drop-off nói
rằng **người dùng dừng ở đây**, nó không nói **vì UI tệ**. Xem `06-data-informed-design`.

## 3. Khi thiếu bằng chứng

Dùng đúng một trong ba ký hiệu, viết thẳng vào deliverable tại chỗ thiếu:

```
EVIDENCE GAP — <cần bằng chứng gì, để quyết định được điều gì>
ASSUMPTION — NOT YET VALIDATED
OWNER INPUT REQUIRED — <cần Owner cho biết gì>
```

Không được lấp khoảng trống bằng con số hợp lý, ví dụ ngành, hay "thường thì". Một `EVIDENCE GAP` được
ghi rõ có giá trị hơn một con số trông đáng tin.

## 4. Thang thẩm quyền của nguồn

Khi các nguồn xung đột, dùng thứ tự sau trừ khi bối cảnh đòi khác — và **nói rõ khi đi chệch**:

1. Owner-confirmed business facts and constraints
2. Actual product analytics / behavioural data
3. Actual user research
4. Internal product documentation
5. Formal standards / specifications
6. Official platform or government guidance
7. Peer-reviewed / primary research
8. Established professional frameworks
9. Practitioner frameworks
10. Competitive evidence
11. Agent inference

Không coi mọi nguồn là ngang thẩm quyền. Phân biệt bắt buộc giữ nguyên trong tài liệu:

- **WCAG** là đặc tả tiêu chuẩn (W3C Recommendation).
- **Scrum Guide** là văn bản định nghĩa chính thức của Scrum.
- **Apple HIG** là hướng dẫn nền tảng của Apple — không phải luật UX phổ quát.
- **Material Design** là hướng dẫn của Google cho Material/Android — không phải chuẩn phổ quát.
- **Google HEART** là một framework đo lường UX đã công bố, dùng để **chọn** metric, không phải checklist bắt buộc.
- **SVPG Four Big Risks** là framework của giới hành nghề (practitioner), không phải chuẩn.
- **Teresa Torres Opportunity Solution Tree** là framework Continuous Discovery của giới hành nghề, không bắt buộc.
- **Amplitude docs** mô tả khái niệm analytics **và** hành vi riêng của Amplitude — phải tách hai thứ đó.
- **gstack `/office-hours`** là một workflow pattern của agent, **không** phải chuẩn UX của ngành.

Chi tiết từng nguồn: `../SOURCE_REGISTRY.md`.

## 5. Anti-hallucination — danh sách cấm bịa

Không bao giờ tự nghĩ ra:

- interviews
- quotes
- analytics
- conversion rates
- sample sizes
- customer segments
- company policies
- research findings
- competitor capabilities
- technical constraints

Thiếu thứ nào thì dùng `UNKNOWN`, `EVIDENCE GAP`, hoặc `OWNER INPUT REQUIRED`. Ví dụ minh hoạ do agent
tự dựng chỉ được phép tồn tại khi gắn nhãn `ILLUSTRATIVE EXAMPLE — not project data` ngay tại chỗ.

## 6. Ví dụ đi hết một thang

Bối cảnh: onboarding của một sản phẩm SaaS.

```
FACT
Analytics shows 62% drop-off at the Invite Partner step.
(source: product analytics, 2026-08-01 → 2026-08-31, n = 4,182 sessions, all plans)

OBSERVATION
In 6 of 9 moderated sessions, participants paused and re-read the step before leaving it.

PATTERN
The pause happened only for participants who had not yet completed their own profile.

FINDING
Invite Partner has the largest single drop-off in onboarding, concentrated in users
who have not finished their own setup.

INSIGHT
Users appear to treat inviting someone else as a commitment they are not ready to make
before their own account feels real — so the step reads as premature rather than as difficult.

ASSUMPTION — NOT YET VALIDATED
Users consider this step too early rather than too complicated.

HYPOTHESIS
If Invite Partner can be skipped and resumed later, onboarding completion increases,
without reducing the eventual invite rate within 14 days.

RECOMMENDATION
Test a deferred invitation flow. Guardrail metric: 14-day invite rate must not drop.

OWNER DECISION REQUIRED
Decision status: PENDING
```

Đọc ngược thang này là cách nhanh nhất để bắt lỗi: nếu xoá dòng `FACT` mà `RECOMMENDATION` vẫn đứng
được, thì khuyến nghị đó đang không dựa trên bằng chứng nào cả.
