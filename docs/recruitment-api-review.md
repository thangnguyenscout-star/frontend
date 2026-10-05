# Recruitment — kết quả đối chiếu schema thực tế

Nguồn: introspection https://localhost:7070/graphql, ngày 24/09/2026. HTTP bị đóng kết nối; HTTPS hoạt động với chứng chỉ phát triển. Snapshot: graphql-schema.local.json.

| Operation | Hợp đồng thực tế |
| --- | --- |
| danhSachTuyenDung | keyword: String; data: [TuyenDungDto] |
| thongTinTuyenDung | id: Long! |
| createTuyenDung | input: TuyenDungCreateInput! |
| updateTuyenDung | input: TuyenDungUpdateInput! |
| updateTuyenDungStatus | input: UpdateTuyenDungStatusInput! gồm id: Long!, trangThai: TuyenDungStatus! |
| danhSachBoPhan | keyword: String; data: [BoPhanDto] |
| danhSachChucVu | keyword: String; data: [ChucVuDto] |

thongTinBoPhan(maBoPhan: String!) trả một đối tượng, không phải danh sách. Đã chuyển dropdown sang danhSachBoPhan.

DTO/input trong src/types/recruitment.ts đã đồng bộ tên trường và nullability với schema:
- Long dùng number trên wire, string cho ID ở giao diện. Chặn ID ngoài Number.MAX_SAFE_INTEGER để tránh gửi ID bị làm tròn. Cần scalar string/lossless JSON nếu BE có ID lớn hơn phạm vi này.
- Decimal! dùng number trong UI/payload; chặn null, NaN, Infinity và số âm. JavaScript number không bảo toàn toàn bộ độ chính xác Decimal; cần thống nhất giải pháp nếu nghiệp vụ dùng số tiền vượt độ chính xác JS.
- DateTime cần múi giờ. Ngày tiếp nhận gửi YYYY-MM-DDT00:00:00+07:00 theo ngày nghiệp vụ Việt Nam.
- Input có ngayBatDauLamViec: DateTime (nullable/optional). Giữ trường này chỉ đọc, không gửi trong create/update theo đặc tả nghiệp vụ đã cung cấp.
- gioiTinh là String!, không phải enum. UI giữ M/F/O; schema chưa chứng minh các mã này là quy ước BE.
- DTO trangThai là String!, input trạng thái dùng enum: TUYEN_DUNG, TIEP_NHAN, KHONG_TUYEN, KHONG_NHAN_VIEC, DA_NHAN_VIEC, DA_TAO_HO_SO_NHAN_VIEN (DaTaoHoSoNhanVien = 6).
- ngaySinh là DateTime!; ba trường thu nhập Decimal!; họ/tên đệm/tên/họ tên, mã bộ phận/chức vụ là String!; tiepNhan là Boolean!.
- Mutation trả ActionResultsOfInt64 với data: Long!.

Xác minh:
- Kiểm tra tĩnh cả 7 GraphQL documents bằng buildClientSchema + validate trên snapshot.
- Query nghiệp vụ thực tế trả AUTH_NOT_AUTHENTICATED. Chưa kiểm tra response nghiệp vụ, phân quyền hoặc mutation có đăng nhập; không gửi mutation để thử.
- Chưa thể suy ra từ schema: độ dài chuỗi, quy tắc bắt buộc không rỗng, ma trận chuyển trạng thái, mã giới tính, quy ước múi giờ nghiệp vụ. Giữ validation hiện có.

Ứng dụng đọc endpoint từ VITE_GRAPHQL_URL. Khi chạy trực tiếp với BE này, cấu hình https://localhost:7070/graphql và tin cậy chứng chỉ phát triển trong trình duyệt. Không tắt kiểm tra TLS của ứng dụng; bỏ xác minh chứng chỉ chỉ dùng cho lệnh introspection localhost.
