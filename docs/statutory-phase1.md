# BHXH & Thuế TNCN — Phase 0 / Phase 1

## Phạm vi và kết quả audit

Triển khai theo đặc tả HRMS v1.0 đính kèm: chỉ tổ chức điều hướng, menu, quyền và khung landing. Không tạo bảng, SQL, API, store nghiệp vụ, tham số pháp định hay dữ liệu tài chính giả.

| Thành phần                                                         | Quyết định     | Lý do                                                                                                                  |
| ------------------------------------------------------------------ | -------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Vue 3, TypeScript, Vue Router, Pinia, PrimeVue, Vue I18n           | Reuse          | Nền tảng sẵn có                                                                                                        |
| AppShell, AppSidebar, route guard và ForbiddenView                 | Modify / reuse | Một menu cấp cao, giữ layout và cơ chế đăng nhập                                                                       |
| usePermission / permission.store                                   | Reuse          | Hiện dùng quyền module/action theo role; không có permission claims chi tiết trong login response                      |
| constants/modules                                                  | Reuse          | Giữ nguyên định nghĩa domain để không ảnh hưởng seed/những module khác; sidebar thay hai mục cũ bằng một mục pháp định |
| InsuranceListView, InsuranceDetailView, PitListView, PitDetailView | Remove         | Bốn màn bọc generic ModuleListView/ModuleDetailView dùng dữ liệu mẫu, chưa phải chức năng cấu hình BHXH/PIT thật       |
| ModuleListView, ModuleDetailView                                   | Keep           | Đang được nhiều module khác tái sử dụng                                                                                |
| EmployeeTaxInsurancePanel, employee-tax.service, mockEmployeeTax   | Keep           | Thuộc hồ sơ nhân viên hiện hữu; không đổi hành vi ngoài phạm vi Phase 1                                                |
| statutory-navigation.ts                                            | Create         | Một nguồn cấu hình cho 9 card, phần nhóm, route dự kiến, feature flag, permission và menu                              |
| statutory.routes.ts                                                | Create         | Landing, redirect legacy và guard điều hướng pháp định                                                                 |
| StatutoryHome, StatutoryNavigationCard, statutory.css              | Create         | Hai tab, card responsive, breadcrumb, hỗ trợ bàn phím                                                                  |
| locales vi/en/fr common.json                                       | Modify         | Bản dịch menu, landing, card, mô tả và trạng thái                                                                      |

## Điều hướng

- Sidebar có đúng một link `/statutory`, thuộc nhóm Tài chính, active ở `/statutory/**`; không tạo submenu BHXH/PIT.
- `/statutory?section=insurance` hiển thị 5 card BHXH; `?section=pit` hiển thị 4 card Thuế TNCN.
- Tab nằm trong query để giữ trạng thái khi refresh, quay lại hoặc dùng back/forward. Query thiếu/không hợp lệ hoặc nhóm không có quyền được chuẩn hóa về nhóm đầu tiên có quyền.
- `/insurance`, `/insurance/:id` → landing tab insurance; `/pit`, `/pit/:id` → landing tab pit. Không tiếp tục mở danh sách/chi tiết mock cũ.
- Tất cả 9 chức năng nghiệp vụ hiện `enabled=false`: repo chưa có trang cấu hình thật và chưa xác nhận hợp đồng dữ liệu/CRUD cho các phase sau. Card hiển thị nội dung và trạng thái Sắp triển khai, nút disabled; không tạo link chết hoặc route tới trang trống. Không đăng ký 9 route nghiệp vụ giả.
- Khi mở một chức năng ở phase sau: bổ sung trang thật và route có metadata quyền, sau đó mới bật flag tương ứng trong cấu hình.

## Quyền và giới hạn hiện tại

- `STATUTORY_VIEW` ánh xạ thành quyền xem insurance hoặc pit đang có; mỗi mã permission trong cấu hình card ánh xạ sang quyền xem module tương ứng. Adapter từ chối mã permission không nhận diện.
- Quyền kiểm tra riêng trong sidebar, card và route guard. Không dùng enabled như quyền và không cấp quyền mới cho HOD/Staff. Auth guard vẫn chạy trước kiểm tra quyền.
- Role hiện có: Admin, Owner, HR Manager, HR Staff, HOD, Staff. Không tự tạo role Payroll/Accounting hoặc permission cache mới khi backend chưa cung cấp.
- Hệ thống hiện không có danh sách grant chi tiết cho từng card, chi nhánh hay đơn vị trong payload đăng nhập. Cần tích hợp grant/data scope backend khi làm CRUD; Phase 1 không đọc dữ liệu bảo hiểm, thu nhập, MST hay hồ sơ y tế.
- Giữ nguyên nhân sự, hợp đồng, chấm công, nghỉ phép và bảng lương. Không sửa mức BHXH/biểu thuế/giảm trừ đang tồn tại trong phần demo ngoài module này.

## Kiểm thử UI

1. Đăng nhập bằng tài khoản có quyền BHXH/thuế, mở mục BHXH & Thuế TNCN: sidebar chỉ có một mục, không còn menu Bảo hiểm và Thuế riêng.
2. Chuyển hai tab bằng chuột và ArrowLeft/ArrowRight, Home/End. Focus và aria-selected đi theo nhóm; nhìn thấy lần lượt 5/4 card.
3. Refresh trực tiếp `/statutory?section=pit`, dùng back/forward sau khi chuyển nhóm: giữ đúng tab và breadcrumb.
4. Thử các URL cũ có/không có ID: chuyển về đúng nhóm. Truy cập khi chưa đăng nhập về Login; tài khoản không có quyền về Forbidden.
5. Đổi ngôn ngữ Việt/Anh/Pháp: menu, tiêu đề, card và trạng thái đổi theo tài nguyên hiện có.
6. Kiểm tra ở desktop >1100px, tablet 601–1100px và mobile <=600px: card lần lượt 3/2/1 cột, không tạo cuộn ngang toàn trang. Các breakpoint theo kiểu layout dự án.
7. Mở Network khi chuyển nhóm: landing không fetch dữ liệu nghiệp vụ. Tất cả chức năng chưa triển khai có nút disabled, không phát sinh CRUD.

Kiểm thử tự động kiểm tra cấu hình, quyền, sidebar render, tab/breadcrumb render đa ngôn ngữ, keyboard, URL legacy, refresh/deep-link và browser history. Thay đổi responsive được kiểm tra bằng CSS breakpoint và cung cấp hướng dẫn UI trên; không khẳng định có API/data scope nghiệp vụ ở phase này.

## Kết quả kiểm tra

- 31 kiểm thử liên quan đạt (landing, sidebar, route, history và permission).
- `vue-tsc --noEmit` đạt.
- ESLint phần thay đổi đạt, không có lỗi.
- Vite build đạt; đầu ra kiểm tra ở `.tmp/statutory-phase1-build`, không ghi đè `dist`. Có cảnh báo chunk lớn và import refresh-token sẵn có của dự án.
