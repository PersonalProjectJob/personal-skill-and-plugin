---
name: product-ux
description: Frame Product/UX decisions and route discovery, research, synthesis, interaction specifications, solution validation, measurement plans, delivery collaboration, quality-bar decisions, and stakeholder facilitation. Use when the missing output is a decision brief, research or validation plan, evidence synthesis, flow/state specification, measurement plan, or facilitation plan. Concrete screen audits, accessibility testing, token implementation, visual styling, UX copy editing, code fixes and repository delivery operations belong to specialist capabilities; this router checks their availability and preserves the requested scope. The agent recommends; the accountable Owner decides.
---

# Product UX

Router cho bộ chín tài liệu Product UX. Việc của skill này: hiểu mục tiêu, đọc bối cảnh, chọn đúng tài liệu,
nạp nó — **không** làm thay việc của tài liệu chuyên môn.

## Bước 0 — Nạp bắt buộc, trước mọi thứ khác

Đọc đủ bốn file này trước khi tạo deliverable; nội dung đã nạp trong lượt hiện tại được dùng lại:

- `_shared/GOVERNANCE.md` — Agent là cố vấn, Owner quyết định. Kèm 5 câu self-check bắt buộc.
- `_shared/EVIDENCE_RULES.md` — thang 11 nhãn, 6 phép biến đổi bị cấm, thang thẩm quyền nguồn, danh sách cấm bịa.
- `_shared/DECISION_RULES.md` — chuỗi gate, 5 decision status, Decision Register.
- `_shared/OUTPUT_STANDARDS.md` — khuôn deliverable và cách trình bày cho Owner.

Đọc `_shared/RESEARCH_RULES.md` khi chạy 02/03/05, hoặc khi skill khác thực hiện nghiên cứu người dùng/desk research. Khi viện dẫn nguồn, đọc §B của file này và trọn mục nguồn liên quan trong `SOURCE_REGISTRY.md` (cả giới hạn và trạng thái kiểm chứng). Không nạp toàn registry, glossary hoặc routing cho mọi request.

## Bước 1 — Chọn tài liệu

| Người dùng đang thiếu gì | Nạp |
|---|---|
| Chưa rõ vì sao làm việc này; chưa rõ ai được lợi | `01-product-discovery/SKILL.md` |
| Hiểu biết về người dùng không đủ để quyết | `02-user-research/SKILL.md` |
| Đã có dữ liệu nghiên cứu nhưng chưa rút ra được gì | `03-research-synthesis/SKILL.md` |
| Vấn đề đã rõ; cần cấu trúc, luồng, trạng thái, edge case | `04-interaction-design/SKILL.md` |
| Cần sinh nhiều phương án rồi kiểm thử trước khi xây | `05-solution-exploration/SKILL.md` |
| Đã có thiết kế cụ thể, cần kiểm thử với người dùng | `05-solution-exploration/SKILL.md` — vào theo Lối B |
| Có analytics, metric, funnel, hoặc thí nghiệm | `06-data-informed-design/SKILL.md` |
| Bàn giao, cộng tác khi triển khai, design QA, release | `07-product-delivery/SKILL.md` |
| Design system, accessibility, nhất quán, design debt | `08-design-quality/SKILL.md` |
| Stakeholder, workshop, critique, dẫn dắt đội | `09-design-leadership/SKILL.md` |

Không chắc giữa hai mục ⇒ đọc `ROUTING.md`, mục §3 liệt kê ba lối vào hay bị chọn sai.
Cần định nghĩa một thuật ngữ ⇒ `GLOSSARY.md`. Cần kiểm một nguồn ⇒ mục nguồn được viện dẫn trong `SOURCE_REGISTRY.md`.

## Bước 2 — Ba trường hợp KHÔNG chạy tài liệu nào ở đây

1. **Ý tưởng còn mơ hồ, tiền đề chưa được thách thức** ⇒ chạy `/office-hours` trước, rồi quay lại `01`.
   Xem `ROUTING.md` §4.
2. **Rà artefact, accessibility, token, critique hoặc UX copy cụ thể** ⇒ tra `ROUTING.md` §5 theo capability. Kiểm exact skill name trong catalogue của host trước khi dùng. Nếu chưa có specialist phù hợp, nêu capability còn thiếu và bàn giao scope/evidence cần kiểm; tiếp tục phần độc lập. Không coi skill thiếu là đã chạy, không tự chuyển review thành sửa code.
3. **Việc cần làm là code, commit, PR** ⇒ không thuộc phạm vi bộ này. Dùng pipeline của repo (`dispatch`).

## Bước 3 — Ràng buộc áp cho mọi câu trả lời

- Mỗi phát biểu về sản phẩm, người dùng, dữ liệu hoặc thị trường trong deliverable sinh ra mang **đúng một nhãn** theo `_shared/EVIDENCE_RULES.md`. Văn hướng dẫn của SKILL.md không gắn nhãn đại trà. Thiếu bằng chứng ⇒ `EVIDENCE GAP`,
  `ASSUMPTION — NOT YET VALIDATED`, hoặc `OWNER INPUT REQUIRED`. **Không lấp bằng con số hợp lý.**
- Quyết định quan trọng dừng ở `OWNER DECISION` với `Decision status: PENDING`. Khuyến nghị không bao giờ
  tự thành quyết định.
- Không bịa: interview, trích dẫn, analytics, tỉ lệ chuyển đổi, cỡ mẫu, phân khúc khách hàng, chính sách
  công ty, phát hiện nghiên cứu, năng lực đối thủ, ràng buộc kỹ thuật.
- Nguồn không ngang hàng: framework hành nghề (SVPG, Product Talk) **không** được trích bằng ngôn ngữ bắt
  buộc; hướng dẫn nền tảng (Apple HIG, Material) **không** phải luật UX phổ quát; chỉ WCAG là chuẩn — và
  trong WCAG chỉ success criteria, glossary, mục Conformance là **normative**.
- Deliverable kết thúc bằng `## Changes to Owner Input`, `## Dropped / Deferred`,
  `## Governance self-check`, và `## Decision Register` khi có quyết định.

## Bước 4 — Phương pháp không phải nghi thức

Persona, CJM, JTBD, Empathy Map, Service Blueprint, Opportunity Solution Tree, cả năm nhóm HEART — **đều
tuỳ chọn**. Trước khi tạo bất kỳ artefact nào, trả lời: *cái này cải thiện hiểu biết hay cải thiện một
quyết định cụ thể nào?* Không trả lời được ⇒ bỏ qua.

Chọn phương pháp **nhỏ nhất làm giảm được bất định quan trọng nhất**. Đó là nguyên tắc chi phối cả chín
tài liệu.
