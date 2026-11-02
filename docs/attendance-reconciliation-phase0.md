# Đối soát & Chốt công — Phase 0

Menu: **Chấm công → Đối soát & Chốt công**. Route: `/attendance/reconciliation`, alias `/cham-cong/doi-soat-chot-cong`. Dùng layout và permission guard `attendance` hiện hữu.

Prototype sử dụng PrimeVue, Pinia và các wrapper/toast có sẵn. Không thêm dependency, API, storage, migration hay thay đổi backend. Dữ liệu chỉ nằm trong bộ nhớ của store; tải lại trang khởi tạo lại fixtures.

## Dữ liệu và quy tắc

- 24 nhân viên, 3 bộ phận, 36 bất thường thuộc 13 tình huống, kỳ 10/2026 đang đối soát và kỳ 09/2026 đã chốt.
- Bảy entity TypeScript ánh xạ camelCase theo đặc tả SQL. Ngữ cảnh ca, log gốc, trạng thái stale, nhật ký demo và chi tiết giờ snapshot nằm riêng trong ViewModel/runtime.
- Chỉ dùng enum DB cho issue, adjustment, approval, run và lịch sử chốt. `issueKey` hex 64 ký tự ổn định theo nhân viên/ngày/phân công ca/mã lỗi; không gộp các ca cùng ngày.
- Đề xuất: `PENDING → APPROVED → APPLIED`. Áp dụng tăng phiên bản dữ liệu nhưng chưa giải quyết issue. HR tính lại rồi chạy đối soát mới để kiểm chứng giá trị; giá trị không đạt vẫn còn bất thường. Log gốc không bị chỉnh sửa.
- Lần chạy hoàn thành hợp nhất theo issue key; các kết quả trước được giữ và đánh dấu `SUPERSEDED`. Run incremental không làm mất các bộ phận khác. Run thất bại/hủy không thay thế projection hiện hành.
- Mỗi lần HOD duyệt tạo bản ghi mới với lần duyệt và phiên bản. Thay đổi dữ liệu vô hiệu hóa duyệt bộ phận bị ảnh hưởng. Vì Phase 0 dùng phiên bản toàn kỳ, các duyệt bộ phận khác ở phiên bản cũ cũng cần xác nhận lại trước chốt.
- Checklist được tính tập trung từ dữ liệu nguồn, bản tính, kết quả đối soát toàn kỳ, bất thường, đề xuất, phép/OT, phê duyệt và tổng công. Tiến độ workflow chỉ là số bước hoàn tất / 6, không cho phép vượt checklist.
- HR chốt tạo snapshot mới cho từng nhân viên; mở lại cần lý do, tăng phiên bản dữ liệu và yêu cầu tính/đối soát/duyệt lại. Chốt lại tạo snapshot v2; v1 không bị ghi đè.
- Payroll chỉ đọc và mô phỏng nhận snapshot hiện hành của kỳ đã chốt. CSV dùng `src/utils/export.ts`, có nhãn demo, không gửi tới Payroll.

## Kịch bản kiểm tra

1. HR chọn kỳ 10/2026, mở lỗi A02 thiếu OUT, chọn giờ OUT đúng ngày kết thúc ca (ca đầu tiên qua đêm) và nhập lý do.
2. Gửi đề xuất, chuyển HOD Lễ tân hoặc HR phê duyệt, sau đó áp dụng riêng. Bất thường vẫn đang xác minh, bản tính cần tính lại.
3. HR đến bước 2, tính lại, chạy đối soát toàn kỳ. Lỗi được giải quyết nếu giá trị đề xuất đúng.
4. Mở **Công cụ demo → Hoàn tất dữ liệu demo** để rút ngắn xử lý các trường hợp còn lại. Tiếp tục chạy đối soát toàn kỳ rồi duyệt từng bộ phận ở bước 4.
5. HR mở bước 5, xem checklist, xác nhận phạm vi và chốt. Xem snapshot v1, xuất CSV hoặc mô phỏng bàn giao Payroll.
6. HR mở lại kỳ với lý do. Chọn một bộ phận, dùng **Mô phỏng cập nhật nguồn**, kiểm tra nguồn rồi tính/đối soát lại: hệ thống phát hiện một bất thường A13 mới, xác nhận thời lượng ca giảm 60 phút. Xử lý đề xuất phút công, tính/đối soát và duyệt lại, chốt để tạo v2. Chọn và so sánh snapshot v1/v2: tổng công của nhân viên liên quan thay đổi; v1 giữ nguyên.
7. Sau HOD duyệt, chọn một bộ phận và **Mô phỏng cập nhật nguồn** để kiểm tra invalidation/stale. **Mô phỏng lỗi lần chạy** kiểm tra thông báo lỗi và việc giữ projection hợp lệ.

## Giới hạn Phase 0

Chấm công được mô phỏng theo các fixture có kết quả mong đợi; đây chưa phải engine tính công production. Đổi ca chỉ xem xét vì schema chưa có ca đích. Giờ đêm/giờ lễ trong snapshot là dữ liệu UI demo, không giả định đã có trong bảng SQL. Phân quyền demo chỉ tác động dữ liệu mock; không thay đổi vai trò đăng nhập hoặc quyền backend.

Kiểm tra: `node node_modules/vitest/vitest.mjs run src/modules/attendance-reconciliation`, `node node_modules/vue-tsc/bin/vue-tsc.js --noEmit`, ESLint module và Vite build theo cấu hình repo.

## Các file triển khai

- `src/constants/attendance.ts`: thêm một menu trong module chấm công.
- `src/router/index.ts`: thêm route và alias, dùng guard `attendance` hiện hữu.
- `src/modules/attendance-reconciliation/AttendanceReconciliationWorkspace.vue`: bộ lọc, KPI, workflow, duyệt bộ phận, chốt/mở lại, snapshot và lịch sử.
- `AttendanceIssuesPanel.vue`, `IssueResolutionDrawer.vue`, `reconciliation.css`: bảng/filter, drawer xử lý và giao diện responsive.
- `reconciliation.types.ts`, `reconciliation.fixtures.ts`, `reconciliation.service.ts`, `useReconciliation.ts`: mapping entity, fixtures xác định, adapter nghiệp vụ và store trong bộ nhớ.
- `reconciliation.service.test.ts`, `reconciliation.page.test.ts`: kiểm thử nghiệp vụ và component.

## Kết quả kiểm chứng khi triển khai

- 20 kiểm thử module mới và 10 kiểm thử chấm công/router liên quan đều đạt (30/30).
- TypeScript toàn dự án và Vite production build đều đạt. Vite còn cảnh báo chunk lớn của ứng dụng hiện hữu.
- ESLint module mới và menu không có lỗi/cảnh báo. Kiểm tra `eslint src --quiet` còn 3 lỗi ngoài phạm vi thay đổi: `ContractKpis.vue:75` (v-if/v-for), `ScheduleListView.vue:950,1000` (biến/hàm chưa dùng).
- Đã kiểm tra render SSR và state chuyển vai trò/kỳ, nhưng chưa kiểm tra trực quan trên trình duyệt: runtime điều khiển trình duyệt/Windows không khởi động được do lỗi môi trường sandbox.
