# Output Standards

> Hai thứ: (A) khuôn bắt buộc của mỗi `../SKILL.md`, (B) cách trình bày kết quả cho Owner.
> File này là **hợp đồng** — mọi skill con phải khớp, để 9 skill đọc như một hệ chứ không như 9 tài liệu rời.

## A. Khuôn bắt buộc của SKILL.md

Mỗi `NN-<name>/SKILL.md` phải có đủ các mục sau, **đúng thứ tự này**:

```markdown
# <Skill Name>

## Purpose
Skill này cung cấp năng lực gì. 2–4 câu.

## Use When
Tình huống kích hoạt cụ thể. Viết thành dấu đầu dòng kiểm được, không viết chung chung.

## Do Not Use When
Trường hợp KHÔNG được chạy skill này — kèm skill nên chạy thay.

## Inputs
Required context / Optional context — tách hai nhóm rõ ràng.

## Context Loading
Thông tin nào của dự án phải đọc TRƯỚC khi làm gì. Đây là bước chống bịa:
không đọc thì không biết cái gì đã tồn tại.

## Owner-Friendly Explanation
Giải thích cho một Product Owner không chuyên: đang xảy ra chuyện gì,
vì sao nó quan trọng, cần quyết định gì. Tránh biệt ngữ; buộc phải dùng thì
định nghĩa ngay lần đầu.

## Core Principles

## Evidence Requirements
Bằng chứng gì là đủ để đi tiếp, và thiếu thì ghi gì.

## Workflow
Các bước vận hành, đánh số.

## Methods
Các phương pháp khả dụng.
**Methods KHÔNG phải checklist bắt buộc** — chọn theo vấn đề và theo nhu cầu bằng chứng.
Mỗi method ghi rõ: hợp cho câu hỏi loại nào, và KHÔNG hợp cho loại nào.

## Decision Gates
Điểm nào phải dừng chờ OWNER DECISION (theo `DECISION_RULES.md`).

## Outputs / Artifacts

## Handoff / Routing
Skill nào nên chạy trước, skill nào nên chạy sau, và trong điều kiện nào.

## Anti-patterns
Các lỗi thường gặp, viết dạng "❌ … / ✅ …".

## Sources
KHÔNG dán URL trần. Nêu rõ phần nào của skill dựa trên nguồn nào,
và phần nào là diễn giải của Agent. Đối chiếu `../SOURCE_REGISTRY.md`.

## Example
Ít nhất một ví dụ Product/SaaS thực tế, đi trọn một vòng.
Dữ liệu minh hoạ phải gắn nhãn `ILLUSTRATIVE EXAMPLE — not project data`.

## Owner Decision
Khi có liên quan — khối quyết định theo khuôn `DECISION_RULES.md` §4.
```

### Frontmatter

9 file `NN-*/SKILL.md` là **tài liệu con đọc theo yêu cầu**, không đăng ký làm skill của runtime, nên
**không** cần frontmatter `name`/`description`. Chỉ `../SKILL.md` (router) có frontmatter. Điều
này giữ một điểm vào ổn định cho governance và định tuyến; không giả định skill bên ngoài tồn tại trên mọi host.

### Gắn nhãn bằng chứng trong SKILL.md

Văn hướng dẫn trong `../SKILL.md` **không** gắn nhãn. Chỉ gắn ở template deliverable, ở ví dụ minh hoạ,
và ở câu khẳng định về một nguồn/dữ kiện có thể bị phản bác. Chi tiết: `EVIDENCE_RULES.md` phần mở đầu.

### Nguyên tắc độ dài

Tài liệu phục vụ **cả** AI thực thi **và** người đọc để học. Vì vậy:

- operational — đọc xong biết phải làm gì
- đủ ngắn để thực thi, đủ chi tiết để dạy
- đúng thuật ngữ, có gốc nguồn, giải thích được
- modular, không lặp lại nội dung của `_shared/` — **trỏ tới**, không chép lại
- KHÔNG biến `../SKILL.md` thành giáo trình; tài liệu tham chiếu dài để ở file hỗ trợ riêng

`../SKILL.md` tập trung vào **hành vi và workflow**.

## B. Chuẩn trình bày cho Owner

Khi trình một khuyến nghị hoặc một kết quả cần quyết, dùng khuôn này:

```
WHAT WE KNOW
WHAT WE DO NOT KNOW
WHY IT MATTERS
OPTIONS
TRADE-OFFS
MY RECOMMENDATION
CONFIDENCE
WHAT COULD CHANGE THIS RECOMMENDATION
OWNER DECISION REQUIRED
```

Ba nguyên tắc về giọng điệu:

- **Tránh biệt ngữ tư vấn khi có cách nói đơn giản hơn.** "Chỗ đăng ký đang mất 62% người dùng" tốt hơn
  "conversion funnel exhibits significant attrition at the acquisition stage".
- **Không hạ thấp Owner.** Họ không thiếu năng lực, họ thiếu thời gian đọc. Viết ngắn, không viết dễ dãi.
- **Đủ tự tin để phản biện lập luận yếu**, đồng thời luôn rõ rằng quyền quyết định cuối thuộc về Owner.

`WHAT WE DO NOT KNOW` và `WHAT COULD CHANGE THIS RECOMMENDATION` là hai mục hay bị cắt nhất khi gấp. Cắt
chúng biến một phân tích thành một lời chào hàng.

## C. Mục bắt buộc ở cuối mọi deliverable

```markdown
## Changes to Owner Input
<trước → sau → vì sao>, hoặc `None`

## Dropped / Deferred
<requirement bị bỏ + lý do>, hoặc `None`

## Governance self-check
<5 câu trong `GOVERNANCE.md`, trả lời YES/NO>

## Decision Register
<bảng theo `DECISION_RULES.md` §5 — bỏ qua nếu deliverable không có quyết định nào>
```
