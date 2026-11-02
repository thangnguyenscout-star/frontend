# Báo cáo chấm công: Đi muộn / Về sớm

Tab `late` trong `/attendance/reports` dùng `LateEarlyReport.vue`, không dùng dữ liệu mẫu của các tab prototype.

- GraphQL `diMuonVeSom(input: DiMuonVeSomInput!)`: input gồm `thang`, `nam`, `ten`, `maBoPhan`, `pageIndex`, `pageSize`. Trang bắt đầu từ 1, mặc định 20 dòng; giao diện chọn 10/20/50/100. Tên/bộ phận trống gửi null. Tháng 1–12, năm 1753–9998, tên tối đa 100 ký tự. Hợp đồng được đối chiếu với DTO và controller trong HrmsApi.
- Lọc theo mã bộ phận từ danh mục thật `danhSachBoPhan`, không dùng tên/mã mẫu. Chỉ áp dụng bộ lọc khi bấm Xem báo cáo. Đổi trang giữ bộ lọc đã áp dụng; thay số dòng về trang đầu. Dữ liệu và tổng số bản ghi/trang lấy từ máy chủ, không tìm kiếm/lọc/sắp xếp cục bộ trên một trang dữ liệu.
- Hiển thị các trường nhân viên, ngày sinh/giới tính, đơn vị, kỳ, ngày chấm công, ca/giờ ca/ca đêm, giờ vào/ra, phút đi trễ/về sớm và tình trạng do API trả về. Giữ nguyên mã có số 0 đầu và số phút; mã tình trạng giữ ở dữ liệu gốc, nhãn bảng/chi tiết được dịch qua `common.attendanceStatus` trong các file ngôn ngữ vi/en/fr sẵn có. Không suy ra tình trạng từ số phút; mã chưa nhận diện hiển thị nhãn Chưa xác định theo ngôn ngữ hiện tại. Không tạo dữ liệu quẹt thẻ giả.
- Tổng số bản ghi là toàn bộ kết quả máy chủ; thống kê nhân viên và tổng phút chỉ tính trang đang xem, được ghi rõ trong KPI và chân bảng. Dòng tổng là TỔNG TRANG.
- Trạng thái tải/lỗi/rỗng được hiển thị riêng; lỗi xóa kết quả cũ và có nút tải lại. Phản hồi cũ bị bỏ qua khi đổi bộ lọc/trang hoặc rời tab.

## Xuất báo cáo dùng chung

`ReportExportButtons.vue` hiển thị Xuất Excel và Xuất PDF, nhận các định dạng được hỗ trợ và trạng thái đang xuất của tab. Hiện tab `late` bật cả hai định dạng. Các tab khác chưa có hợp đồng API xuất nên nút chưa bật; chức năng CSV mẫu của prototype vẫn được giữ.

- `GET /api/di-muon-ve-som/export-excel` và `GET /api/di-muon-ve-som/export-pdf`, tham số `thang`, `nam`, `ten`, `maBoPhan` lấy từ cùng bộ lọc đã áp dụng. Không gửi phân trang: file gồm toàn bộ kết quả theo bộ lọc, không chỉ trang đang xem.
- Dùng backend origin của `VITE_API_URL`, token Bearer hiện tại và cookie; helper `report-download.ts` đi qua `privateApi` để dùng cơ chế refresh phiên sẵn có khi 401.
- Tải blob từ máy chủ, ưu tiên tên UTF-8 trong Content-Disposition; dự phòng `DiMuonVeSom_YYYY_MM.xlsx/pdf`. Không tạo file Excel/PDF từ dữ liệu mẫu phía frontend.
- Lỗi JSON/HTML, tệp trống và lỗi HTTP không được tải thành file. Chống xuất trùng khi đang chạy; khi rời tab, kết quả xuất đang chờ không kích hoạt tải file cho tab khác.
