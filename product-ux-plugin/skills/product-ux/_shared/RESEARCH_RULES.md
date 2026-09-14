# Research Rules

> Áp cho cả **nghiên cứu người dùng** (skill 02, 03, 05) và **nghiên cứu nguồn/desk research** (mọi skill
> khi viện dẫn framework hay tiêu chuẩn).

## Phần A — Nghiên cứu người dùng

### A1. Phương pháp đi theo câu hỏi, không đi theo thói quen

Thứ tự bắt buộc: **research question → uncertainty cần giảm → phương pháp**. Không bao giờ ngược lại.

> **Hard rule: KHÔNG mặc định phỏng vấn cho mọi câu hỏi.**

Phỏng vấn giỏi ở việc tìm hiểu bối cảnh, động cơ, và cách người ta đang xoay xở. Nó **kém** ở việc đo tỉ lệ,
đo mức độ phổ biến, và dự đoán hành vi tương lai. Chọn phỏng vấn cho một câu hỏi định lượng là đã sai từ
trước khi tuyển người tham gia.

Đối chiếu nhanh:

| Câu hỏi thuộc dạng | Phương pháp hợp | Phương pháp SAI thường bị chọn |
|---|---|---|
| Bao nhiêu người / bao nhiêu lần | analytics, survey đủ cỡ mẫu | phỏng vấn 5 người rồi suy ra tỉ lệ |
| Vì sao họ làm vậy | phỏng vấn, contextual inquiry | đọc funnel rồi tự đoán |
| Họ có làm được không | usability test theo tác vụ | hỏi "anh thấy dễ dùng không" |
| Họ đang xoay xở thế nào | quan sát, contextual inquiry | hỏi họ mô tả lại từ trí nhớ |
| Cái này có đáng làm không | evidence hiện có + product risk | hỏi người dùng có thích không |

### A2. Không bắt người dùng thiết kế hộ

> **Hard rule: KHÔNG yêu cầu người dùng thiết kế giải pháp cho đội sản phẩm.**

"Anh muốn màn này trông thế nào?" cho ra ý kiến, không cho ra bằng chứng. Ưu tiên thu thập bằng chứng về:

- past behaviour — họ đã thực sự làm gì
- current behaviour — họ đang làm gì
- context — làm trong hoàn cảnh nào, cùng ai, dưới ràng buộc gì
- pain — chỗ nào tốn công, tốn thời gian, gây sai sót
- motivation — họ đang cố đạt được gì
- workaround — họ tự chế cách gì để lách (tín hiệu mạnh nhất về nhu cầu chưa được đáp ứng)
- constraint — cái gì họ không thể thay đổi

`user request → validated requirement` là một trong sáu phép biến đổi bị cấm (`EVIDENCE_RULES.md` §2).
Yêu cầu của người dùng là **dữ liệu về vấn đề của họ**, không phải đặc tả.

### A3. Câu hỏi dẫn dắt

Không hỏi dạng khẳng định cài sẵn ("Tính năng này tiện đúng không?"). Không hỏi giả định tương lai ("Anh có
dùng không nếu chúng tôi làm X?") — câu trả lời cho loại câu này không dự đoán được hành vi. Hỏi về lần gần
nhất họ thực sự gặp tình huống đó.

### A4. Đạo đức và riêng tư

- Nêu rõ mục đích, cách dữ liệu được dùng, và quyền dừng bất cứ lúc nào — trước khi bắt đầu.
- Ghi âm/ghi hình chỉ khi có đồng ý rõ ràng.
- Trong deliverable, mặc định **ẩn danh** người tham gia (`P1`, `P2`…). Không đưa tên thật, email, số điện
  thoại, hay dữ liệu tài khoản vào tài liệu nghiên cứu.
- Không trích nội dung nhạy cảm khi nó không cần cho phát hiện.

### A5. Giới hạn phải được viết ra

Mọi output nghiên cứu có mục `## Limitations`, nêu tối thiểu: cỡ mẫu, người tham gia được tuyển thế nào,
ai **không** có trong mẫu, khoảng thời gian, và câu hỏi nào dữ liệu này **không** trả lời được.

Thiếu mục này thì phát hiện sẽ bị đọc rộng hơn phạm vi nó chống đỡ được — đó là cách một nghiên cứu 5 người
biến thành "người dùng muốn X".

### A6. Artefact là tuỳ chọn, không phải nghi thức

Persona, Customer Journey Map, Jobs To Be Done, Empathy Map, Service Blueprint đều **không bắt buộc**.
Trước khi tạo bất kỳ cái nào, trả lời: *artefact này cải thiện hiểu biết hay cải thiện một quyết định cụ
thể nào?* Không trả lời được ⇒ bỏ qua.

Cấm tuyệt đối: persona hư cấu dựng thuần từ giả định. Nếu vẫn cần một persona tạm để trao đổi, gắn nhãn
`ASSUMPTION-BASED PERSONA — NOT YET VALIDATED` ngay trong artefact.

## Phần B — Nghiên cứu nguồn

### B1. Chín quy tắc chất lượng nguồn

1. Ưu tiên nguồn gốc (primary source).
2. Kiểm phiên bản/ngày hiện hành, không dùng số nhớ được.
3. Không chép bản tóm tắt thứ cấp khi bản gốc còn truy cập được.
4. Ghi nguồn vào `../SOURCE_REGISTRY.md`.
5. Trích nguồn liên quan trong mục `## Sources` của SKILL.md.
6. Tách bạch **quy tắc lấy từ nguồn** và **diễn giải của Agent**.
7. Hai framework uy tín mâu thuẫn nhau ⇒ ghi lại sự bất đồng.
8. **Không âm thầm hoà giải** hướng dẫn mâu thuẫn.
9. Nói rõ chỗ nào cần phán đoán chuyên môn vì bằng chứng không quyết được.

### B2. Khi không có chuẩn phổ quát

Viết đúng khuôn này thay vì phát biểu như thể có luật:

```
No universal standard requires this.
Recommended practice based on: <nguồn/framework>.
```

Đối chiếu:

- ❌ "UX process requires Personas."
- ✅ "Personas are an optional synthesis artefact. Use them when meaningful user segments need to be
  represented and the artefact improves a product/design decision."

### B3. Không nâng cấp thẩm quyền của nguồn

Framework của giới hành nghề không được viết như tiêu chuẩn. Hướng dẫn nền tảng của một hãng không được
viết như luật chung. Thang thẩm quyền đầy đủ: `EVIDENCE_RULES.md` §4.
