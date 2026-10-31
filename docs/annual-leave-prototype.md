# Prototype quản lý phép năm

Màn hình `/leave/annual`, menu **Nghỉ phép → Quản lý phép năm**. Chưa gọi API và chưa thay đổi SQL. Dữ liệu minh họa được lưu trong localStorage tại `hrms-annual-leave-prototype-v1`; nút khôi phục chỉ thay dữ liệu của prototype này.

## Phạm vi

- Chính sách: xem, thêm, sửa, ngừng áp dụng; các trường cấu hình theo `ChinhSachNghiPhep`, giữ riêng giá trị chưa thiết lập (`null`) và `false`/`0`.
- Số dư: lọc theo năm, bộ phận, trạng thái; thêm, cập nhật số liệu mẫu, cộng/trừ phép bằng số ngày có dấu và lý do; khởi tạo nhiều nhân viên từ chính sách, bỏ qua dòng đã có.
- Bảng kiểu Excel: cột cố định, nhóm tiêu đề, sắp xếp, tìm kiếm, tổng cộng, phân trang, xuất CSV mẫu; hồ sơ phép hiển thị chi tiết và thời điểm cập nhật.
- Giao diện ghi được dành cho Admin, Owner, HR Manager, HR Staff có quyền `leave/update`. Các vai trò có quyền xem chỉ đọc dữ liệu minh họa. Quyền phía client không thay thế phân quyền backend.

## Ánh xạ DDL

- Giữ nguyên tên `soNgayPhepDaSieuDung` tương ứng cột `SoNgayPhepDaSieuDung` trong DDL, dù có thể là lỗi chính tả. Khi API có tên khác cần ánh xạ tại adapter.
- `TongPhepDuocCap` = cơ bản + thâm niên + chuyển sang + điều chỉnh.
- `SoNgayPhepConLai` = tổng được cấp − đã sử dụng − chờ duyệt − phép cũ hết hạn. Không gửi các cột computed khi tích hợp API.
- Tính số học theo đơn vị 0,1 ngày để tránh sai số dấu phẩy động. `DECIMAL(4,1)` có tối đa 999,9; phép điều chỉnh cho phép số âm. Các trường ngày phép còn lại được kiểm tra không âm trong prototype; số dư cuối cùng có thể âm và được cảnh báo.
- Các cột nullable giữ ngữ nghĩa SQL: một thành phần `null` khiến tổng liên quan chưa xác định. Bảng hiển thị `—`, tổng bảng chỉ cộng các giá trị xác định.
- Mỗi mã nhân viên (6 ký tự trong danh mục mẫu) chỉ có một số dư mỗi năm. Nhân viên và năm không đổi khi sửa dòng đã tạo.
- Cấu hình tinyint từ 0–255 hoặc null; tháng hết dùng phép cũ 1–12 hoặc null. Tên chính sách tối đa 100, ghi chú tối đa 255 ký tự. Audit chính sách sử dụng `HR.DEMO`; thời điểm lưu mẫu do frontend sinh.

## Các giới hạn cố ý

DDL chưa có khóa liên kết chính sách với nhân viên/số dư. Chính sách chỉ là mẫu để lấy **phép cơ bản** khi khởi tạo; không tự gán quan hệ chính sách, tính thâm niên, phân bổ theo tháng, tích lũy ngày, chuyển năm hoặc tự động hết hạn. Giá trị mặc định 12 ngày, 60 tháng và 5 ngày chuyển là ví dụ UI, không phải quy định áp dụng.

Không thể xác định số phép cũ còn chưa dùng chỉ từ tổng số ngày đã sử dụng. Ngày hạn đã qua chỉ gắn nhãn cần rà soát, không tự trừ hết số chuyển sang. Form số liệu cho phép nhập số ngày dùng/chờ duyệt nhằm mô phỏng; chưa đồng bộ đơn nghỉ phép.

`GhiChu` chỉ lưu lý do gần nhất; DDL chưa có bảng lịch sử điều chỉnh nên prototype không giả lập một audit log bền vững. Tương lai cần API audit riêng nếu muốn lịch sử đầy đủ. Không xóa chính sách/số dư trên màn; chính sách dùng trạng thái ngừng áp dụng.

## Tích hợp API sau

Thay `annual-leave.repository.ts` bằng adapter theo hợp đồng API thực tế; giữ các computed từ máy chủ là nguồn dữ liệu chuẩn. Thay danh mục nhân viên mẫu bằng employee API. Backend cần kiểm tra quyền, unique nhân viên/năm, tính toán số dư, giao dịch khi cấp hàng loạt, kiểm soát ghi đồng thời và audit người thực hiện. Không dùng localStorage prototype làm dữ liệu nghiệp vụ.
