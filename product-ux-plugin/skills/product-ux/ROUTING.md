# Routing

> Chín skill trong `product-ux/` **không** phải một waterfall. Vào ở đâu là do bạn đang thiếu gì, không
> phải do đang ở "giai đoạn" nào.

## 1. Vòng lặp mặc định (khái niệm, không phải quy trình bắt buộc)

```
Product Discovery
        ↓
User Research
        ↓
Research Synthesis
        ↓
Product Discovery (cập nhật)
        ↓
Solution Exploration
        ↓
Interaction Design
        ↓
Validation
        ↓
Design Quality
        ↓
Product Delivery
        ↓
Data-Informed Measurement
        ↓
New Evidence
        ↓
Product Discovery / Research
        ↺
```

Sơ đồ này mô tả **dòng chảy của bằng chứng**, không phải lịch trình. Đi tắt là bình thường; đi tắt mà
không biết mình đang thiếu bằng chứng gì mới là vấn đề.

## 2. Bảng định tuyến

| Tình huống | Skill |
|---|---|
| Vấn đề chưa rõ; chưa biết vì sao làm việc này | `01-product-discovery` |
| Hiểu biết về người dùng không đủ để quyết | `02-user-research` |
| Đã có nghiên cứu nhưng chưa rút ra được gì | `03-research-synthesis` |
| Vấn đề đã rõ, cần thiết kế cấu trúc/luồng/trạng thái | `04-interaction-design` |
| Cần khám phá và kiểm thử nhiều giải pháp | `05-solution-exploration` |
| Có dính analytics, metric, hoặc thí nghiệm | `06-data-informed-design` |
| Dính triển khai, bàn giao, release | `07-product-delivery` |
| Dính accessibility, design system, chất lượng, nhất quán | `08-design-quality` |
| Dính stakeholder, workshop, dẫn dắt đội | `09-design-leadership` |

## 3. Các lối vào hay bị chọn sai

**"Funnel tụt 60% ở bước xác minh."** → `06-data-informed-design`, **không phải** `04-interaction-design`.
Con số nói *chuyện gì đang xảy ra*, chưa nói *vì sao*. Nhảy thẳng vào thiết kế lại màn hình là đang thực
hiện phép biến đổi bị cấm `analytics signal → UX diagnosis`.

**"Đã phỏng vấn 8 nhà cung cấp, giúp tôi tìm insight."** → `03-research-synthesis`, **không phải**
`02-user-research`. Dữ liệu đã có; việc còn thiếu là tổng hợp.

**"Tôi muốn làm tính năng so sánh nhà cung cấp cho đám cưới."** → tiền đề chưa được thách thức. Xem §4.

**Đã có prototype, cần test với người dùng.** → `05` sở hữu question/prototype/fidelity và iteration; `02` sở hữu protocol, recruitment, consent, fieldwork và raw observations. `05` có thể tổng hợp một vòng usability giới hạn theo task với raw IDs; synthesis đa nghiên cứu hoặc thay đổi problem framing đi qua `03`. Owner có thể chỉ định executor khác nhưng phải ghi một execution owner và giữ contract research của `02`.

**Workshop để sinh solution options.** → `05` sở hữu solution artifacts; `09` phụ trách facilitation nếu có bất định về participation, conflict hoặc authority. Nếu chỉ thiếu options thì vào `05`; nếu thiếu cách tổ chức contribution/decision thì vào `09`. Không tạo hai owner cho cùng artifact.

## 4. Tích hợp với gstack `/office-hours`

`/office-hours` (đã có sẵn trên máy) làm phần **chẩn đoán ý tưởng**: ép làm rõ nhu cầu có thật, hiện trạng
đang được giải quyết ra sao, cái nêm hẹp nhất, và thách thức tiền đề. Nó **không** trùng với
`01-product-discovery` — nó chạy **trước**, khi còn chưa chắc bài toán có đáng làm hay không.

```
Ý tưởng mới / còn mơ hồ
        ↓
   /office-hours
        ↓
Bối cảnh sản phẩm đã rõ
        ↓
01-product-discovery
```

Chiều ngược lại:

```
01-product-discovery
        ↓
phát hiện tiền đề chưa vững / Owner nhảy thẳng vào giải pháp
        ↓
   route sang /office-hours
```

**Không fork, không ghi đè `/office-hours`.** Nó là một *agent workflow pattern*, không phải nguồn chân lý
về lý thuyết UX — xem `_shared/EVIDENCE_RULES.md` §4.

## 5. External capability routing and dependency registry

Các tên trong bảng dưới được kiểm qua frontmatter ngày 2026-09-07. Có file trên máy chưa chứng minh runtime đã đăng ký: trước khi gọi, kiểm exact name trong catalogue của host và đọc skill đó. Không tự suy tên, tự cài skill hoặc chuyển một request review thành sửa code.

| Capability | Exact skill name | Skill directory | Claude | Codex | Antigravity | Scope / fallback |
|---|---|---|---|---|---|---|
| Chẩn đoán premise | `office-hours` | `office-hours` | PRESENT | PRESENT | PRESENT | Nếu thiếu, giữ premise là câu hỏi trong 01, nêu capability gap; không giả vờ workflow đã chạy. |
| Apple platform review | `apple-hig` | `apple-hig` | PRESENT | PRESENT | PRESENT | Chỉ dùng cho Apple/platform intent phù hợp. |
| Token/component mechanics | `ckm:design-system` | `design-system` | PRESENT | PRESENT | MISSING | Nếu host thiếu, gửi scope/docs/version và câu hỏi cho system owner; 08 vẫn làm quality-bar/governance phần độc lập. |
| Hướng thị giác | `ui-ux-pro-max` | `ui-ux-pro-max` | PRESENT | PRESENT | PRESENT | Dùng cho yêu cầu chọn style/visual direction; kết quả không chứng minh WCAG conformance. |
| Pipeline triển khai | `dispatch` | `dispatch` | PRESENT | PRESENT | PRESENT | Chỉ tiếp tục implementation khi user yêu cầu; hành động theo scope và quyền của repo. |

PRESENT = đọc được entrypoint và exact frontmatter name ở skill root của host; MISSING = chưa thấy entrypoint tại root đó, không có nghĩa capability không thể được cung cấp cách khác. Claude/Codex dùng root skills tương ứng; Antigravity dùng config/skills. Host khác hoặc bản cài khác phải kiểm lại, không thừa kế trạng thái bảng này.

| Capability chưa có exact skill được xác nhận | Cách xử lý |
|---|---|
| Accessibility review trên artefact cụ thể | Tìm specialist phù hợp trong catalogue hiện tại; kiểm scope và quyền thực thi trước khi dùng. Nếu không có, bàn giao page/build/task, target, evidence cần thu và retest owner; giữ EVIDENCE GAP cho phần chưa kiểm. |
| Screen critique | Tìm capability review chỉ báo cáo phù hợp với artefact. Nếu thiếu, bàn giao artefact/question/bar cho reviewer; 09 vẫn hỗ trợ rationale và decision mechanics. |
| UX copy review | Tìm capability biên tập copy trong catalogue hoặc bàn giao text/context/constraints cho content owner; không gọi tên skill chưa xác minh. |

Các capability trong bảng thứ hai là mô tả công việc, **không phải tên skill để gọi**. Tên gần giống không đủ để thay thế: `design-review` và `qa` có workflow sửa code/commit nên không tự động dùng cho report-only critique. Chỉ chọn specialist có contract phù hợp request; thiếu specialist chỉ chặn phần phụ thuộc.

Pipeline rules là file, không phải skill. Đọc [plan-workflow](../harness/rules/plan-workflow.mdc) cho quy trình plan và [commit-pr](../harness/rules/commit-pr.mdc) cho commit/PR khi task liên quan; lời chuyển giao không tự cấp quyền thực hiện. Resolve các parent-relative rule link từ canonical directory của package (target của junction/symlink); nếu bản copy không kèm harness, dùng router/rule của repo đích và ghi rule còn thiếu, không đoán đường dẫn.

Ranh giới: `08-design-quality` xác định quality bar/authority và tổng hợp findings; specialist thực thi audit cụ thể. `07-product-delivery` cộng tác và bàn giao theo pipeline repo. Skill ngoài không tự thừa kế quyền sửa code hay thay quyết định Owner từ bộ này.

Preflight khi triển khai trên host: resolve exact skill name và entrypoint cho route cần dùng; kiểm các rule link trên còn tồn tại; thiếu dependency thì dùng fallback tương ứng và ghi phần chưa thực hiện. Không cài hoặc copy skill giữa host chỉ để làm bảng xanh.

## 6. Router

`SKILL.md` là skill **duy nhất** được runtime đăng ký. Việc của nó:

1. hiểu mục tiêu người dùng
2. đọc bối cảnh sẵn có
3. xác định skill Product UX đúng
4. nạp bốn rule nền ở `SKILL.md` Bước 0; nạp research/source/routing/glossary theo câu hỏi cần xử lý
5. **không** làm thay việc của skill chuyên môn

Chín file con không đăng ký riêng; router giữ governance tập trung và tránh thêm chín entrypoint vào catalogue. Tên/khả năng của skill ngoài luôn được kiểm theo host ở §5.
