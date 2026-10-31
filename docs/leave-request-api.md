# Danh sách đơn nghỉ phép

Route `/leave` dùng `lichSuNhanVienNghiPhep(input: LichSuNhanVienNghiPhepInput)` qua Apollo/session hiện có. Màn không còn gọi danh sách mock `ModuleListView` cho đơn nghỉ phép.

- Bộ lọc: `thang`, `nam`, `maBoPhan`, `maNhanVien`, `tinhTrang`. Mặc định là tháng/năm hiện tại theo Asia/Bangkok; các bộ lọc còn lại là `null`. Nút Đặt lại cũng trở về tháng hiện tại. Tháng là số nguyên 1–12, năm là số nguyên 1–9999; có thể xóa từng bộ lọc để gửi `null`. Không còn nhập hoặc gửi `tuNgay`, `denNgay` trong input lịch sử đơn nghỉ phép. Hai trường này trong dữ liệu từng đơn vẫn được giữ để hiển thị.
- Phân trang từ máy chủ: `pageIndex` bắt đầu từ **1**, mặc định **20** dòng; các lựa chọn 10/20/50/100. Thay bộ lọc hoặc số dòng quay về trang đầu. Giữ bản sao bộ lọc đã áp dụng khi đổi trang; không lọc/sắp xếp cục bộ trên một trang dữ liệu. API chưa có input sắp xếp nên các cột không bật sort.
- Hiển thị `totalRecords`, `totalPages`, `items` từ API. Chặn response cũ ghi đè request mới; lỗi tải xóa dữ liệu cũ và cho thử lại. Các danh mục lỗi được báo riêng, không biến kết quả lỗi thành dữ liệu mẫu.
- Trạng thái được xác nhận: `N` = Tạo mới, `A` = Đã duyệt, `C` = Hủy đơn. Mã mới chưa ánh xạ hiển thị nguyên giá trị máy chủ.
- Ngày giờ hiển thị theo UTC+07 (Asia/Bangkok). Giữ nguyên số ngày nghỉ do máy chủ trả về, kể cả số thập phân; không tự suy ra từ chênh lệch ngày.

## Hai chế độ hiển thị

- **Danh sách**: phân trang máy chủ như trước.
- **Biểu đồ Gantt**: tải danh mục `danhSachNhanVien(keyword: null)` với các trường mã, họ tên, họ/tên đệm/tên, giới tính, ngày sinh, bộ phận và chức vụ theo query được cung cấp. Danh mục được dùng cho cả lựa chọn nhân viên và các dòng trên biểu đồ; không cần lấy thêm các trường hồ sơ riêng tư khác. Nút Tải lại trong Gantt tải mới cả danh mục nhân viên và đơn nghỉ.
- Sau khi có danh mục nhân viên, tải **tất cả trang** `lichSuNhanVienNghiPhep` theo bộ lọc đã áp dụng, yêu cầu 100 dòng/trang và theo `totalPages` máy chủ trả về. Hiển thị tiến độ; không vẽ các kết quả đang tải dở. Hủy việc tải thêm trang khi đổi mode/bộ lọc. Phát hiện bản ghi lặp, số lượng thiếu hoặc metadata thay đổi và yêu cầu tải lại.
- Hai mode dùng chung bộ lọc; mặc định là danh sách và tháng/năm hiện tại. Gantt tự tính từ ngày đầu đến ngày cuối tháng đã chọn, gồm cả tháng nhuận. Nếu chỉ chọn năm thì hiển thị cả năm (tối đa 366 ngày). Gantt yêu cầu chọn năm để xác định trục thời gian; mode danh sách vẫn có thể tìm với tháng/năm là `null`.
- Gantt nhóm theo mã bộ phận, sắp nhân viên theo tên; hiển thị mã và chức vụ, bao gồm người chưa có đơn. Có tùy chọn chỉ xem nhân viên có đơn, thu gọn nhóm, đổi độ rộng cột ngày, tô cuối tuần và đánh dấu hôm nay. Nhân viên không còn trong danh mục nhưng có đơn được bổ sung từ thông tin đơn để không làm mất thanh nghỉ.
- Thanh thời gian theo UTC+07, cắt theo cửa sổ ngày đang xem và giữ chính xác phần ngày/giờ. Thời điểm kết thúc là biên loại trừ: kết thúc 00:00 không tô sang ngày kế tiếp. Các đơn chồng thời gian xếp nhiều hàng, không ghi đè nhau. N xanh dương, A xanh lá, C xám gạch; đơn hủy được phân biệt rõ. Nhấn thanh mở chi tiết đơn đang có.
- Không tự tính lại `soNgayNghi`; độ rộng thanh thể hiện thời gian, số ngày nghỉ vẫn lấy từ API. Dữ liệu thời gian không hợp lệ được đếm và cảnh báo. Biểu đồ chỉ xem, không thay đổi thời gian bằng kéo/thả.

## Tạo đơn trong sidebar

Nút **Tạo đơn xin phép** mở Drawer bên phải; chọn nhân viên từ danh mục thật, rồi nhập thông tin trong `LeaveRequestForm` thuộc module Nghỉ phép. Form và service tạo đơn độc lập với dialog chỉnh ca.

Form tạo đơn: chọn ngày và phần ca nghỉ; giờ bắt đầu/kết thúc được tính tự động, sau đó chọn loại nghỉ và nhập lý do. Không hiển thị bảng/nút tải phân công, không gọi API phân công hoặc kiểm tra lịch ca trước khi gửi. Dùng danh mục loại nghỉ và mutation `taoNhanVienNghiPhep` hiện có, chỉ gửi `maNhanVien`, `tuNgay`, `denNgay`, `loaiNghiPhep`, `lyDoNghi`; backend quyết định trạng thái và xử lý liên quan. Module lịch làm việc không còn tab/lịch nghỉ phép hoặc thao tác tạo đơn; việc tạo và theo dõi đơn tập trung tại `/leave`. Chưa tạo mutation phê duyệt/hủy vì chưa có hợp đồng API cho các thao tác này. Không thể đóng Drawer hoặc đổi nhân viên trong khi gửi đơn. Lưu thành công đóng Drawer và tải lại trang đầu theo bộ lọc đang áp dụng; thất bại giữ form và lỗi.

### Chọn ngày và phần ca khi tạo đơn

- Mặc định bật **Nghỉ 1 ngày**. Ngày và phần ca ở khu vực Đến ngày bị khóa và đồng bộ với Từ ngày. Có ba lựa chọn: **Nguyên ca**, **Nửa ca đầu**, **Nửa ca cuối**. Hai ô giờ luôn disabled, chỉ hiển thị kết quả tính tự động.
- Khi chọn ngày, gọi `caLamViecDonNghiPhep(maNhanVien: String!, ngay: Date!)`, lấy `maCa`, `gioBatDau`, `gioKetThuc`, `quaDem`. Một ngày chỉ cần tải ca một lần; đổi phần ca tính lại từ ca đã tải. Đổi ngày/nhân viên tải lại, bỏ phản hồi cũ. Lỗi API chặn gửi đơn và có nút thử lại.
- Nghỉ 1 ngày: nguyên ca lấy giờ bắt đầu/kết thúc; nửa ca đầu lấy giờ bắt đầu đến giờ kết thúc trừ 4 giờ; nửa ca cuối lấy giờ bắt đầu cộng 4 giờ đến giờ kết thúc.
- Bỏ chọn Nghỉ 1 ngày: Đến ngày phải sau Từ ngày, mặc định chuyển sang ngày kế tiếp. Tải ca riêng cho từng ngày đầu/cuối. Mỗi combobox chỉ còn **Nguyên ca** và **Nửa ca**. Từ ngày: nguyên ca lấy giờ bắt đầu, nửa ca lấy giờ bắt đầu cộng 4 giờ. Đến ngày: nguyên ca lấy giờ kết thúc, nửa ca lấy giờ bắt đầu cộng 4 giờ.
- Kết quả thành công nhưng không có ca (`data: null` hoặc không có `maCa`): nghỉ một ngày chọn nguyên ca dùng **00:00–08:00**, các lựa chọn nửa ca giữ **00:00–04:00**. Nghỉ nhiều ngày dùng **00:00** tại mỗi đầu ngày chưa phân ca, dù chọn nguyên ca hay nửa ca. Lỗi tải hoặc dữ liệu giờ không hợp lệ không được coi là chưa phân ca.
- `quaDem` được dùng để tính ngày giờ thực tế: có thể gửi ngày kết thúc hoặc ngày bắt đầu của nửa ca cuối là ngày kế tiếp. Ngày chọn trong giao diện vẫn là ngày của ca; khoảng ngày giờ thực tế được hiển thị thêm khi khác ngày chọn. Payload tạo đơn vẫn giữ năm trường như trên, với DateTime UTC+07.

Nút tạo đơn theo quyền `leave/create`. Với vai trò Staff, danh sách nhân viên tạo đơn chỉ có mã nhân viên của phiên hiện tại; backend vẫn phải kiểm tra quyền/phạm vi dữ liệu. Module prototype phép năm giữ nguyên. Query lịch sử nghỉ phép cũ dùng riêng cho lịch phân ca đã được gỡ.
