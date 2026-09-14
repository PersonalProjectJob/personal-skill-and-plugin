# product-ux

Bộ chín tài liệu Product UX vận hành dưới một router duy nhất, với ba lớp quy tắc dùng chung: quyền hạn
(Owner quyết định), kỷ luật bằng chứng (phát biểu về sản phẩm/người dùng/dữ liệu/thị trường trong deliverable có nhãn), và cổng quyết định (khuyến nghị không tự
thành quyết định).

## Nguyên tắc chi phối

> Không làm nghi thức UX vì nó có trong sơ đồ quy trình.
> Chọn **phương pháp nhỏ nhất làm giảm được bất định quan trọng nhất**.
> Dùng bằng chứng để soi quyết định; dùng phán đoán chuyên môn ở chỗ bằng chứng không quyết được.
> Quyền quyết định sản phẩm luôn thuộc về Owner.

## Kiến trúc

```
product-ux/
├── SKILL.md              ← skill DUY NHẤT được runtime đăng ký (router)
├── README.md
├── ROUTING.md            ← vòng lặp, bảng định tuyến, tích hợp /office-hours, map sang skill đã có
├── GLOSSARY.md           ← chỉ thuật ngữ mà nhầm lẫn gây quyết định sai
├── SOURCE_REGISTRY.md    ← 12 nguồn, kiểm chứng 2026-09-07, kèm ranh giới "không chống đỡ được gì"
├── _shared/
│   ├── GOVERNANCE.md
│   ├── EVIDENCE_RULES.md
│   ├── DECISION_RULES.md
│   ├── RESEARCH_RULES.md
│   └── OUTPUT_STANDARDS.md
├── 01-product-discovery/SKILL.md
├── 02-user-research/SKILL.md
├── 03-research-synthesis/SKILL.md
├── 04-interaction-design/SKILL.md
├── 05-solution-exploration/SKILL.md
├── 06-data-informed-design/SKILL.md
├── 07-product-delivery/SKILL.md
├── 08-design-quality/SKILL.md
└── 09-design-leadership/SKILL.md
```

### Vì sao là router chứ không phải 9 skill phẳng

Runtime chỉ nạp skill ở `<skills-root>/<tên>/SKILL.md` (một cấp). Chín file `NN-*/SKILL.md` nằm ở cấp hai
nên **không** được đăng ký làm skill — đó là chủ ý, và mang lại ba thứ:

1. Không thêm 9 mục vào danh sách skill (mỗi mục tốn context ở **mọi** phiên, kể cả phiên không dùng tới).
2. `_shared/` được dùng chung tự nhiên, không phải nhân bản chín lần.
3. **Giữ một điểm vào ổn định** để áp cùng governance và chọn tài liệu theo uncertainty. Khả năng skill ngoài phụ thuộc host; không dựa kiến trúc vào giả định tên skill khác đang tồn tại.

Đánh đổi: chín tài liệu con không tự xuất hiện trong danh sách skill; phải vào qua `/product-ux`.

## Trạng thái xây dựng

| Phase | Nội dung | Trạng thái |
|---|---|---|
| A — Audit | Kiểm kê skill đã có, phân tích chồng lấn | ✅ xong (kết quả nhúng trong `ROUTING.md` §5) |
| B — Research | Kiểm chứng 12 nguồn gốc, dựng SOURCE_REGISTRY | ✅ xong 2026-09-07 |
| C — Architecture | `_shared/` ×5, ROUTING, GLOSSARY, SOURCE_REGISTRY, router | ✅ Owner approved; Phase E sửa theo phê duyệt 2026-09-07 |
| D — Build 9 skills | Chín `NN-*/SKILL.md` | ✅ xong |
| E — Cross review | Ma trận chồng lấn, thuật ngữ, định tuyến | ✅ HIGH/MEDIUM đã sửa và verify; còn E-10 LOW ở thông báo verifier |
| F — Adversarial review | Chấm 10 chiều, dưới 8 phải sửa | ⏸ |

## Cài đặt (4 bước — bước 4 không script nào làm hộ)

Chỉ cài sau Phase F và Owner approval của bộ đầy đủ. Trước khi cài, kiểm dependency registry và fallback trong `ROUTING.md` §5 trên từng host.

1. Canonical nằm ở repo skill (thư mục này).
2. Thêm một dòng vào `<repo-root>/harness/ROUTER.md`.
3. `scripts/sync-agent-skills.ps1 -ManagedSkill product-ux` → 4 target (Claude / Codex / Gemini / Cursor).
4. **Tạo tay** junction `~/.gemini/config/skills/product-ux` — script không phủ skill root của Antigravity.

Verify bằng cả hai: `sync-agent-skills.ps1 -ManagedSkill product-ux -CheckOnly` **và**
`Test-Path "$HOME\.gemini\config\skills\product-ux\SKILL.md"`. `-CheckOnly` xanh cả 4 target vẫn không
chứng minh Antigravity có skill.

Chế độ cài mặc định là **junction**, nên sửa file ở repo là mọi agent thấy ngay; chỉ chạy lại sync khi
**thêm hoặc xoá** skill.

## Bảo trì

- `SOURCE_REGISTRY.md` có ba mục ghi rõ **cần kiểm lại** (ngày WCAG 2.2, conversion window của Amplitude,
  phiên bản HIG/M3 — cái sau không tồn tại công khai). Kiểm lại khi có dịp, đừng lặng lẽ nâng chúng thành
  số đã xác minh.
- Ba nguồn không có phiên bản (Apple HIG, Material Design 3, Amplitude docs) — trích kèm **ngày truy xuất**.
- Thêm nguồn mới ⇒ phải điền đủ cả hai cột: *chống đỡ được gì* và *KHÔNG chống đỡ được gì*. Cột thứ hai
  mới là cột ngăn sai sót.
