# Decision Rules

> Chuẩn hoá decision gate cho mọi skill trong `product-ux/`. Mục đích: Owner luôn giữ quyền quyết định
> sản phẩm, và agent không bao giờ đi qua một quyết định quan trọng bằng cách im lặng.

## 1. Chuỗi gate

```
Evidence
    ↓
Analysis
    ↓
Options
    ↓
Trade-offs
    ↓
Agent Recommendation
    ↓
OWNER DECISION
    ↓
Proceed
```

Bốn ràng buộc về chuỗi này:

- **Không bỏ bước Options.** Một khuyến nghị không có phương án thay thế thì Owner không quyết được gì —
  họ chỉ có thể đồng ý. Tối thiểu 2 phương án thực chất; "làm" và "không làm" chỉ tính là 2 phương án khi
  "không làm" thực sự được phân tích.
- **Trade-offs phải có mặt trái.** Mọi phương án đều có cái giá; phương án nào bạn viết mà không tìm ra
  nhược điểm nào, tức là bạn chưa phân tích nó.
- **Recommendation phải nêu rõ mức tin cậy** và **điều gì có thể lật ngược nó**.
- **`Proceed` chỉ mở khoá sau `APPROVED` hoặc `MODIFIED`.**

## 2. Decision status

```
PENDING     — đã trình bày, chờ Owner
APPROVED    — Owner đồng ý nguyên trạng
MODIFIED    — Owner đồng ý nhưng có sửa; phải ghi lại nội dung sửa
REJECTED    — Owner không đồng ý; phải ghi lý do nếu Owner có nêu
DEFERRED    — hoãn; phải ghi điều kiện để mở lại
```

`MODIFIED` là trạng thái hay bị bỏ sót nhất. Khi Owner nói "được, nhưng làm B thay vì A", đó **không phải**
`APPROVED` — ghi `MODIFIED` kèm nội dung sửa, nếu không lần đọc lại sau vài tuần sẽ tưởng agent đã đề xuất B.

## 3. Quyết định nào bắt buộc qua gate

Bắt buộc khi thoả **bất kỳ** điều nào:

- Thay đổi business goal, product goal, hoặc định nghĩa thành công
- Thay đổi phạm vi MVP, hoặc thứ tự ưu tiên giữa các cơ hội
- Đánh đổi giữa các nhóm người dùng (được lợi nhóm này, thiệt nhóm kia)
- Quyết định dựa trên bằng chứng có `EVIDENCE GAP` ở chỗ then chốt
- Việc khó đảo ngược: đổi mô hình dữ liệu, đổi cấu trúc điều hướng chính, đổi mô hình giá, đổi mô hình quyền
- Bất cứ điều gì chạm tới tiền, dữ liệu cá nhân, quyền truy cập, hoặc tuân thủ

Không bắt buộc khi: chọn phương pháp nghiên cứu, chọn định dạng artefact, đặt tên nội bộ, sắp xếp nội dung
tài liệu. Những thứ này agent tự quyết và **nói rõ đã quyết gì** — hỏi Owner từng cái là làm phiền, không
phải cẩn thận.

## 4. Decision record

Mỗi quyết định quan trọng ghi thành một khối:

```
### D-<n> — <tên quyết định ngắn>

Decision status: PENDING | APPROVED | MODIFIED | REJECTED | DEFERRED
Date:            <YYYY-MM-DD>
Decided by:      <Owner / tên người có thẩm quyền>   (bỏ trống khi PENDING)

Question:        <câu hỏi cần quyết, một câu>
Evidence:        <bằng chứng chính, kèm nhãn theo EVIDENCE_RULES.md>
Options:         <A / B / C, mỗi cái một dòng>
Trade-offs:      <mỗi phương án được gì, mất gì>
Recommendation:  <phương án đề xuất>
Confidence:      HIGH | MEDIUM | LOW  — <vì sao ở mức đó>
Would change it: <phát hiện gì sẽ lật ngược khuyến nghị này>
If MODIFIED:     <Owner đã sửa gì>
Reopens when:    <chỉ dùng cho DEFERRED>
```

`Would change it` là trường quan trọng nhất và cũng dễ bỏ trống nhất. Một khuyến nghị không nói được cái gì
sẽ lật ngược nó thì không phải phân tích — đó là ý kiến.

## 5. Decision Register

Mọi deliverable có ít nhất một quyết định phải kết thúc bằng bảng này, để Owner nhìn một chỗ là thấy hết
những gì đang chờ mình:

```markdown
## Decision Register

| ID | Quyết định | Status | Chờ ai | Chặn việc gì |
|----|-----------|--------|--------|--------------|
| D-1 | ... | PENDING | Owner | ... |
| D-2 | ... | APPROVED | — | — |
```

Cột `Chặn việc gì` cho biết cái giá của việc chưa quyết. Không có gì bị chặn ⇒ nhiều khả năng đó không phải
quyết định quan trọng, cân nhắc tự quyết theo §3.

## 6. Sau khi Owner quyết

- `APPROVED` / `MODIFIED` ⇒ cập nhật record (status, date, decided by, nội dung sửa) rồi mới `Proceed`.
- `REJECTED` ⇒ **không** đề xuất lại cùng một phương án với cách diễn đạt khác. Được phép quay lại khi có
  bằng chứng mới, và phải nói rõ bằng chứng mới đó là gì.
- `DEFERRED` ⇒ ghi `Reopens when`, và không âm thầm làm tiếp phần phụ thuộc vào nó.

Quyết định đã `APPROVED` là dữ kiện đầu vào của các skill sau — chúng thừa kế, không mở lại, trừ khi có
bằng chứng mới đủ mạnh và nói rõ ra.
