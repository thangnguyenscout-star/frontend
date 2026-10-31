# Import DAT chấm công

- Dùng dialog hiện có tại `ImportSyncDialog.vue`; chọn file không gửi request.
- Nút **Bắt đầu đồng bộ** chỉ chạy xử lý frontend: kiểm tra header/các dòng, đánh dấu hợp lệ/lỗi/trùng theo máy + mã người dùng máy + thời gian + loại sự kiện, rồi hiển thị preview tối đa 100 dòng.
- Nút **Lưu vào database** gọi mutation GraphQL `ghiNhanMayChamCongTheoLo` theo từng batch tuần tự, tối đa 2.000 rows/request. Không gửi file `.dat` lên server.
- Nếu chọn nhiều file, mỗi file được gửi thành request riêng và tuần tự để số dòng lỗi còn gắn đúng file.
- Khi lỗi mạng hoặc timeout lúc lưu, trạng thái được đánh dấu chưa xác định; file đó không tự gửi lại vì server có thể đã ghi dữ liệu.
- Kết quả server hiển thị `AttendanceInsertResult`, lỗi theo dòng và JSON response.
- Không gọi status polling hoặc preview/confirm/retry API; trạng thái cuối được trả trực tiếp từ mutation GraphQL batch.
