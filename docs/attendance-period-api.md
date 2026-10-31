# Kỳ chấm công — đối chiếu server đang chạy (2026-10-19)

Endpoint đã kết nối: https://localhost:7070/graphql. Introspection HTTP 200.

| Nghiệp vụ | API thực tế |
|---|---|
| Danh sách | danhSachKyChamCong(nam: Short, thang: UnsignedByte, trangThai: String), trả ActionResults.data[] |
| Chi tiết | thongTinKyChamCong(id: Long!) |
| Tạo kỳ | createKyChamCong(input: KyChamCongInput!) |
| Chốt | chotCong(id: Long!), O → C |
| Khóa | khoaCong(id: Long!), C → L |

Frontend dùng Apollo/auth hiện có. Không thay đổi backend hoặc tạo client khác.

## Khác đặc tả

- Backend chỉ có O/C/L; không gọi API trạng thái R hoặc mở lại chưa tồn tại.
- Chưa có server pagination, keyword search, summary, preflight, audit/history, công ngày/tháng theo KyChamCongId hoặc xác nhận bàn giao lương. FE lọc năm/tháng/trạng thái tại server, tìm mã và phân trang tập kỳ trả về tại client; không tải dữ liệu công ngày.
- Dialog chốt ghi rõ không có preflight và yêu cầu người quản trị xác nhận đã đối soát thủ công. Đây là luồng O→C hiện có, **chưa đáp ứng kiểm tra điều kiện chốt của đặc tả Phase 1**. Không hiển thị canClose giả hoặc số lỗi chặn bằng 0.
- Khóa chỉ hiển thị “Đã khóa”, không hiển thị đã chuyển lương. Không có mở lại L hoặc C trên FE.
- Schema không nhận expectedStatus hoặc idempotency key. FE đọc lại trạng thái trước mutation, backend dùng transaction + update theo trạng thái hiện tại; không tự retry mutation. Cần BE bổ sung expected version để phòng cả thay đổi dữ liệu không đổi trạng thái.
- Ngày: giao diện và validation dùng YYYY-MM-DD. Live coercion không nhận date-only hoặc DateTime thiếu offset; adapter gửi YYYY-MM-DDT00:00:00+07:00, không gọi toISOString để đổi ngày. Cần backend bổ sung scalar Date/date-only nếu muốn đúng nguyên văn đặc tả.
- Long không nhận JSON string (đã probe query chi tiết). ID được kiểm tra và gửi literal số nguyên trong document; không chuyển string bigint qua Number. ID số không an toàn sẽ bị từ chối; backend nên trả ID/string để bảo toàn giá trị lớn.
- FE không cho HOD/Staff thao tác quản trị. Vai trò quản lý + quyền approve được chốt/khóa, HR Staff được tạo khi có quyền create. Backend hiện chỉ có Authorize + current username trong service; cần bổ sung RBAC/data scope tại BE trước nghiệm thu.
- Backend chưa có kiểm tra overlap hoặc preflight tính công trong code service đã đối chiếu. FE không tuyên bố các điều kiện này đã bảo đảm.

## Kiểm tra trực tiếp

- Introspection server hoạt động; các operation được validate bằng schema thật.
- Query thongTinKyChamCong với ID JSON string bị scalar Long từ chối; literal Long hoạt động đến bước kiểm tra đăng nhập.
- Các probe DateTime dùng @skip(if:true), không thực thi mutation và không ghi dữ liệu server.
- Chưa có phiên đăng nhập trong terminal nên chưa thử tạo/chốt/khóa dữ liệu thật. Cần kiểm thử tích hợp bằng tài khoản HR và HOD; không dùng tài khoản giả hoặc tự lấy mật khẩu.
