# Hotel HR Frontend

Frontend prototype theo `hr-hotel.md`, Vue 3 + TypeScript + Vite + PrimeVue, Pinia, Router và Vue I18n. Không có backend.

## Chạy dự án

```bash
cd frontend
npm install
npm run dev
```

Mở http://127.0.0.1:5173. Dùng tài khoản demo **user01 / user01@** (hoặc bấm **Điền tự động**), chọn **HR Admin** để xem toàn bộ phân hệ. Đăng nhập vẫn dùng dịch vụ session mock hiện có; trang đầu tiên là `/dashboard`.

```bash
npm run build
npm run lint
npm test
```

Nếu PowerShell chặn npm.ps1, dùng `npm.cmd` thay cho `npm`.

## Các màn hình

- Đăng nhập, dashboard, không có quyền truy cập, cảnh báo/hết phiên.
- Hợp đồng: danh sách, KPI, 13 cột, bộ lọc, tạo/sửa, chi tiết 5 tab, gia hạn, chấm dứt, in.
- Nhân viên: danh sách và chi tiết theo tab, liên kết hợp đồng.
- Phòng ban, chức danh, loại hợp đồng, loại phụ cấp.
- Chấm công, lịch làm việc, nghỉ phép, tăng ca, ca đêm.
- Bảng lương, bảo hiểm, thuế TNCN, phí phục vụ, báo cáo.
- Các phân hệ có tìm kiếm, lọc, phân trang, sắp xếp, chọn dòng, chọn cột, xuất CSV và biểu mẫu theo cấu hình.

## Kiến trúc

`views/<module>` → `views/shared` + components → composables → services/modules → privateApi → mock/services → mock/data.

`constants/modules.ts` khai báo cột, trường và tab cho từng phân hệ. Các page entry riêng tái sử dụng màn hình cấu hình để tránh sao chép logic. Components common không import dữ liệu mock. Các view không gọi fetch/Apollo trực tiếp.

`services/graphql/apollo.ts` chuẩn bị Apollo và access token; `graphql/queries/contracts.ts` chỉ là operation minh họa. Adapter đang sử dụng mock; cần bổ sung operations theo schema backend thật và thay adapter ở `services/modules/record.service.ts`. Đổi biến môi trường một mình chưa kích hoạt backend.

## Demo và kiểm tra

- Dữ liệu mẫu được lưu trong localStorage với khóa `hotel-hr-data-v1`; xóa khóa này để reset.
- Mở nút Tùy chọn (...) ở danh sách để chọn lỗi 400/401/403/404/409/422/429/500/503. Lỗi mô phỏng áp dụng một lần, Retry hoạt động bình thường.
- 401 thử refresh một lần. Refresh session là marker demo trong sessionStorage, không phải credential thật.
- Cảnh báo sau 8 phút không hoạt động; đăng xuất sau 10 phút. Theo dõi chuột, bàn phím, click, touch và điều hướng tập trung.
- Chuyển Việt/Anh/Pháp trên header; mặc định tiếng Việt.
- Phân quyền chỉ điều khiển giao diện demo, không thay thế kiểm soát truy cập ở backend.

## Giới hạn prototype

Đã truy cập dự án Stitch `759285066999206078` qua MCP, tải HTML và ảnh tham chiếu, rồi đối chiếu các màn hình nghiệp vụ. Các biến thể trùng tên được tích hợp vào route và tab hiện có; không thêm framework, không đổi cây thư mục hay lớp API.

Các phân hệ không có thiết kế riêng vẫn tái sử dụng bảng/form cấu hình. Lịch ca có lưới tuần và dialog phân ca; bảng lương có drawer/dialog phiếu lương và tổng hợp các khoản mock. Chưa triển khai thuật toán pháp lý payroll, PIT, BHXH, chia service charge hay báo cáo chuyên sâu. Dashboard tổng hợp dữ liệu mock. Tab phụ cấp hiện hiển thị chênh lệch tổng thu nhập/lương cơ bản, chưa có bảng chi tiết từng khoản. Upload tài liệu chỉ tồn tại khi trang chi tiết đang mở; không tải lên máy chủ. Gia hạn cập nhật thời hạn hợp đồng hiện tại và ghi lịch sử thay đổi.

Dữ liệu mẫu không phải hồ sơ nhân sự thật. Không đưa dữ liệu sản xuất vào prototype này.

## Kết quả kiểm tra

- TypeScript (`vue-tsc --noEmit`): đạt.
- ESLint: đạt.
- Vite production build: đạt, artifact trong `dist/`.
- Vitest: 5/5 kiểm thử đạt (CRUD/conflict/filter/pagination/retry và inactivity session).
- Đã kiểm tra trên Edge headless: login, dashboard, danh sách nhân viên/hợp đồng, chi tiết nhân viên/hợp đồng, lịch ca, payroll, service charge; chuyển các tab hồ sơ, validation form, lưu phân ca và mở payslip. Không ghi nhận lỗi JavaScript trong các luồng đã kiểm tra.

## Ánh xạ Stitch → Vue (17/09/2026)

Project: [759285066999206078](https://stitch.withgoogle.com/projects/759285066999206078).

| Screen Stitch | Screen ID | Route / thành phần |
| --- | --- | --- |
| Đăng nhập | `b0b5d2bc727b4d81a7cb143b3a04e8d0` | `/login` |
| Dashboard Tổng quan Nhân sự | `027143fe95584014966f36a626fc9e45`, `969b37d2bcb84627bcff57e34cae3cd4` | `/dashboard` |
| Hồ sơ nhân viên | `101c1176e31e4aedb6ef71c88084544e`, `18b9fb7c3fc24701aacd83cefafb9140` | `/employees`, drawer tóm tắt |
| Thêm mới nhân viên | `c5452415eb8344b3a543f3e4f9f8e907` | Nút Thêm nhân viên mới, form 5 bước |
| Hồ sơ nhân viên chi tiết | `dbbb0c837f644b1da5074e1f81ce2263` | `/employees/:id`, tab cá nhân |
| Grand Hotel HR Management | `e7ac3e1f8ddc4949ab60a7a2a8965088` | Cùng hồ sơ chi tiết, tài liệu và lối tắt |
| Hồ sơ — Hợp đồng lao động | `dbf9f6132b7447b7935296ec556b6e0d` | Tab Hợp đồng lao động |
| Hồ sơ — Thuế & BHXH | `8603a88726a148f8bd91b721ed94a900` | Tab Thuế & BHXH |
| Hồ sơ — Lịch làm việc | `c5b586187b1c40dfb1701bb7f1f30d8e` | Tab Lịch làm việc |
| Hồ sơ — Chấm công | `aa50513c0bb14472a1d9de1135f6a053` | Tab Chấm công |
| Danh sách Hợp đồng lao động | `fe391547f6354759b09f0ca9ee77c13d` | `/contracts`, drawer hợp đồng |
| Untitled Prototype | `1f8b09fa580040d08ef2f3dd7acbc527` | Biến thể danh sách hợp đồng, dùng chung `/contracts` |
| Chi tiết Hợp đồng lao động | `b075bf7ab09f4595915fb2216a271d5a` | `/contracts/:id` |
| Xếp ca làm việc | `1f271d9fc2c6477798b7f6ced7323e5a`, `94c92653c1f845308adb106446a82c33` | `/schedules` |
| Tính lương & Service Charge | `fb7554e8747641b199c0e0e406eda861`, `344c7a11492542d7bc158de59d1a5ecd` | `/payroll`, `/service-charge`, dialog payslip |

Các mục `hr.md` (`12178819651763763279`), `employee.md` (`7425863944225492154`), `hop-dong-lao-dong.md` (`3024630357553399657`) là tài liệu tham chiếu, không phải route riêng. Logo (`78b2f0b0628b43b38525eef530dd1097`) được dùng trong shell/login. Ảnh portrait (`3552de72bfb948c3b9a6713a0109aa2b`) là asset tham chiếu; avatar nhân viên vẫn lấy chữ viết tắt từ dữ liệu hiện có.

### File tạo mới

- `public/stitch-logo.png`
- `public/stitch-login-background.jpg`

### File chỉnh sửa

- `src/assets/styles/main.css`
- `src/views/auth/LoginView.vue`
- `src/views/dashboard/DashboardView.vue`
- `src/views/employees/EmployeeDetailView.vue`
- `src/views/schedules/ScheduleListView.vue`
- `src/views/payroll/PayrollListView.vue`
- `src/views/service-charge/ServiceChargeListView.vue`
- `src/views/shared/ModuleDetailView.vue`
- `src/views/shared/ModuleListView.vue`
- `src/components/common/AppForm.vue`
- `src/components/common/AppDataTable.vue`
- `src/components/contracts/ContractKpis.vue`
- `src/components/layout/AppHeader.vue`
- `src/components/layout/AppSidebar.vue`
- `src/constants/modules.ts`
- `src/mock/data/seed.ts`
- `src/locales/vi/common.json`
- `src/locales/en/common.json`
- `src/locales/fr/common.json`
- `README.md`

### Tái sử dụng và dữ liệu

Không tạo component mới. Tái sử dụng AppShell, AppSidebar, AppHeader, AppButton, AppDataTable, AppForm, AppDrawer, AppStatusBadge, AppLoading, AppErrorState, ContractKpis cùng Dialog/Select/InputText của PrimeVue. Giữ useRecords, useRecordDetail, recordService, repository và session/permission stores.

Mock được bổ sung trong `src/mock/data/seed.ts`: hồ sơ, thông tin công việc/BHYT/ngân hàng, lưới lịch ca tuần, các khoản thu nhập/khấu trừ. Không gọi API nhân sự thật. Tích hợp GraphQL sau này qua `src/services/modules/record.service.ts`, không gọi API trực tiếp từ view.

### Validation

- Trim các trường chuỗi trước khi lưu; kiểm tra các trường bắt buộc theo cấu hình hiện có.
- Email hợp lệ, kể cả khi người dùng đang ở bước khác của form.
- Giá trị số phải hữu hạn và không âm.
- Ngày kết thúc không trước ngày bắt đầu.
- Form nhân viên tự quay về bước chứa lỗi khi lưu.
- Đăng nhập kiểm tra tài khoản demo từ thiết kế; giữ nguyên mock session và vai trò.
- Tài liệu đính kèm tối đa 5 MB, chỉ lưu khi trang chi tiết đang mở.

### Phạm vi và giới hạn

- Giao diện dùng PrimeVue/PrimeIcons và dữ liệu mock hiện có nên một số biểu tượng, số liệu, dòng dữ liệu khác ảnh Stitch. Các phần không có dữ liệu hiển thị trống hoặc dấu gạch, không giả vờ đồng bộ SAP/VssID/ký số.
- Xuất dữ liệu vẫn là CSV; In / Lưu PDF dùng hộp thoại in của trình duyệt. Không gửi email/phiếu lương thật.
- Xếp ca có chuyển tuần, lọc bộ phận, sửa ô và gửi trạng thái chờ duyệt trong mock. AI xếp ca, kéo-thả, kiểm tra pháp lý thời gian nghỉ và phê duyệt phía máy chủ chưa được triển khai.
- Tính toán lại bảng lương chỉ cộng/trừ các khoản đã có trong mock; không tự suy diễn công thức thuế/BHXH. Phân bổ Service Charge dùng giá trị mock có sẵn.
- Giữ nghiệp vụ gia hạn hiện tại: cập nhật hợp đồng và ghi lịch sử; chưa tạo phiên bản hợp đồng pháp lý mới. Tab phụ cấp vẫn thể hiện tổng phụ cấp, chưa có CRUD từng khoản.
- Các màn hình riêng mới dùng nhãn tiếng Việt theo Stitch; phần dịch Anh/Pháp đầy đủ cho nhãn mới chưa hoàn thiện.
- Dữ liệu localStorage đã lưu trước đó được giữ nguyên; trường mới chưa có sẽ trống. Có thể kiểm tra seed mới trong phiên trình duyệt riêng mà không xóa dữ liệu đang dùng.


Kiểm tra bổ sung: tạo nhân viên qua form 5 bước (trim + email không hợp lệ ở bước khác), drawer xem nhanh, trạng thái danh sách rỗng; 22 route danh sách/chi tiết dùng chung; viewport 1366×900 và 1920×900 không tràn ngang toàn trang. Lưới/bảng rộng cuộn bên trong vùng dữ liệu. Bản build và lint cuối đạt, 5/5 test Vitest đạt.
