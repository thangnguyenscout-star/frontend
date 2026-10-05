# Tích hợp hợp đồng lao động V1

Nguồn: đặc tả Frontend API Integration Specification V1 do người dùng cung cấp.

## Đã triển khai

- Sáu operation GraphQL trong `src/graphql/queries/contracts.ts`; service dùng Apollo/session hiện có, không fallback mock.
- Danh sách có filter, phân trang và sắp xếp phía backend; detail luôn gọi `thongTinHopDong(id)`.
- Tạo hợp đồng và phụ cấp bằng payload whitelist, không gửi ID/audit/name fields.
- Chuyển trạng thái qua dialog xác nhận; khóa thao tác khi gửi và tải lại detail/list sau thành công.
- `/contracts/expiry` gọi API không truyền ngày, cảnh báo theo 0–7, 8–15, 16–30 ngày; không cập nhật trạng thái tự động.
- Tuyển dụng → mở hồ sơ → Tạo hợp đồng thử việc (chỉ trạng thái 5).
  Dialog tải lại detail tuyển dụng, gọi một mutation, hiển thị ID backend trả về và refresh danh sách/detail tuyển dụng.
- Validation ngày, số tiền, phụ cấp; mapping lỗi nghiệp vụ; lỗi exception không hiển thị stack trace.

## Các điểm cần backend cung cấp để hoàn thiện cấu hình

- Đặc tả chưa có bảng mã/trình tự trạng thái. UI cho nhập mã và dùng tên backend trả về khi có; không áp dụng workflow 1–5 của mock cũ.
- Loại hợp đồng dùng danhSachMasterCode với phanLoai = '07'; bộ phận/chức vụ dùng danhSachBoPhan/danhSachChucVu. Combobox hiển thị tên và chọn mã, có tìm kiếm và tải lại khi lỗi.
- Bộ phận mới là lựa chọn trên form: CreateHopDongInput V1 chưa có maBoPhan nên không gửi trường này. Phụ cấp vẫn nhập mã trực tiếp.
- Session hiện có chỉ trả roleId, không trả danh sách permission.
  `useContractPermission` ánh xạ bốn mã quyền sang chính sách role hiện có; HOPDONG_STATUS_UPDATE dùng quyền approve.
  Backend vẫn phải kiểm tra quyền. Cần đổi adapter khi có permission claims thật.
- Schema snapshot `docs/graphql-schema.local.json` chưa chứa sáu API hợp đồng mới.
  Operation được viết theo đặc tả; chưa kiểm chứng end-to-end với backend đang chạy.
- Không thực hiện sửa/gia hạn/thanh lý/đính kèm/lịch sử hợp đồng hoặc tự tạo nhân viên riêng.
- Các component/utility mock cũ còn được giữ cho code legacy nhưng không nằm trong luồng hợp đồng vừa tích hợp.

## Kiểm chứng

- 19 test hợp đồng kiểm tra API payload, paging/filter/sort, lỗi, ngày, tiền, phụ cấp và một mutation thử việc.
- Build production và kiểm tra ESLint trên các file thay đổi.
- Bộ test toàn dự án: 108 pass / 7 fail. Bảy lỗi nằm ở test schema tuyển dụng do tên
  `__SearchResult`, `__SchemaDefinition` trong snapshot dùng tiền tố dành riêng của GraphQL;
  snapshot và test tuyển dụng đó không được sửa trong thay đổi này.


