# MÀN HÌNH NGHIỆP VỤ CHÍNH – HỒ SƠ NHÂN VIÊN

## 1. Tổng quan

Màn hình quản lý và cập nhật hồ sơ nhân viên khách sạn.
Tai lieu nay la tai lieu update lai giao dien sau khi gen tu stitch va thay doi nghiep vu phu hop voi dac ta yeu cau cua co so du lieu

Màn hình gồm 4 Tab:

1. Thông tin cá nhân
2. Giấy tờ pháp lý
3. Công việc / Hợp đồng lao động
4. Bảo hiểm xã hội và Tài khoản cá nhân

> Tài liệu này tập trung vào đặc tả giao diện Frontend và UI behavior.
> Không bao gồm đặc tả API.

---

# 2. Tab 1 – Thông tin cá nhân

| STT | Thuộc tính | Tên physical | Loại control | Length | Sự kiện | Required | Validation | State | Ghi chú |
|---:|---|---|---|---:|---|---|---|---|---|
| 1 | Mã nhân viên | `MaNhanVien` | Textbox | 10 | | Không | | Disabled | Tự động phát sinh mã nhân viên |
| 2 | Họ | `Ho` | Textbox | 10 | | Có | Character Only | | |
| 3 | Tên đệm | `TenDem` | Textbox | 30 | | Có | Character Only | | |
| 4 | Tên | `Ten` | Textbox | 20 | | Có | Character Only | | |
| 5 | Giới tính | `GioiTinh` | Radio | | | Có | `M`, `F` | | `true = M`, `false = F` |
| 6 | Ngày sinh | `NgaySinh` | DatePicker | | | Có | | | |
| 7 | Nơi sinh | `NoiSinh` | ComboBox | 5 | | Có | | | |
| 8 | Dân tộc | `DanToc` | ComboBox | 5 | | Có | | | |
| 9 | Tôn giáo | `TonGiao` | ComboBox | 5 | | Có | | | |
| 10 | Địa chỉ thường trú | `DiaChiThuongTru` | Textbox | 100 | | Có | | | |
| 11 | Chỗ ở hiện tại | `DiaChiHienTai` | Textbox | 100 | | Không | | | |
| 12 | Email | `Email` | Textbox | 100 | | Không | | | |
| 13 | Số điện thoại | `SoDienThoai` | Textbox | 20 | | Không | | | |
| 14 | Trình độ học vấn | `TrinhDoHocVan` | ComboBox | 5 | | Có | | | |
| 15 | Trình độ chuyên môn | `TrinhDoChuyenMon` | ComboBox | 5 | | Có | | | |
| 19 | Ngày tuyển dụng | `NgayTuyenDung` | DatePicker | | | | | | |

## 2.1. UI behavior

### Mã nhân viên

- Tự động phát sinh.
- Không cho phép người dùng chỉnh sửa.
- State: `Disabled`.

### Họ / Tên đệm / Tên

- Chỉ cho phép nhập ký tự chữ.
- Không cho phép nhập ký tự đặc biệt không hợp lệ.

### Giới tính

Giá trị:

```text
M = Nam
F = Nữ
```

Mapping:

```text
true  -> M
false -> F
```

---

# 3. Tab 2 – Giấy tờ pháp lý

| STT | Thuộc tính | Tên physical | Loại control | Length | Sự kiện | Required | Validation | State | Ghi chú |
|---:|---|---|---|---:|---|---|---|---|---|
| 1 | Căn cước công dân | `CCCD` | Textbox | 20 | | Có | | | |
| 2 | Ngày cấp | `NgayCap` | DatePicker | | | Có | | | |
| 3 | Nơi cấp | `NoiCap` | ComboBox | 5 | | Có | | | |

## 3.1. UI behavior

### CCCD

- Cho phép nhập số.
- Maximum length: `20`.
- Không cho phép vượt quá độ dài quy định.

### Ngày cấp

- Sử dụng DatePicker.
- Không cho phép chọn ngày không hợp lệ.

### Nơi cấp

- Sử dụng ComboBox.
- Danh sách lựa chọn hiển thị theo dữ liệu cấu hình.

---

# 4. Tab 3 – Công việc / Hợp đồng lao động

Tab này hiển thị thông tin công việc và hợp đồng lao động hiện tại của nhân viên.

Các thông tin hợp đồng là thông tin hiển thị, không chỉnh sửa trực tiếp tại Tab này.

| STT | Thuộc tính | Tên physical | Loại control | Required | State | Ghi chú |
|---:|---|---|---|---|---|---|
| 1 | Bộ phận | `BoPhan` | FixedText | | Readonly | |
| 2 | Chức vụ | `ChucVu` | FixedText | | Readonly | |
| 3 | Loại Hợp đồng | `LoaiHopDong` | FixedText | | Readonly | |
| 4 | Ngày Ký Hợp đồng | `NgayKyHopDong` | FixedText | | Readonly | |
| 5 | Ngày Bắt đầu Hiệu lực | `NgayBatDauHieuLuc` | FixedText | | Readonly | |
| 6 | Ngày Kết thúc | `NgayKetThuc` | FixedText | | Readonly | |
| 7 | Lương Cơ Bản | `LuongCoBan` | FixedText | | Readonly | |
| 8 | Lương Tổng Nhập | `TongThuNhap` | FixedText | | Readonly | |
| 9 | Mức đóng BHXH | `MucDongBHXH` | FixedText | | Readonly | |
| 10 | Mức đóng Thuế TNCN | `MucDongThueThuNhapCaNhan` | FixedText | | Readonly | |
| 11 | Chi tiết Phụ cấp | | DataGrid | | Readonly | Hiển thị danh sách phụ cấp |
| 12 | Cập nhập điều chỉnh | `btnDieuChinhLuong` | Button | | Enabled | Mở chức năng điều chỉnh lương |

---

## 4.1. DataGrid – Chi tiết phụ cấp

DataGrid hiển thị các khoản phụ cấp của nhân viên.

### Columns

| STT | Column | Ý nghĩa |
|---:|---|---|
| 1 | Mã phụ cấp | Mã định danh loại phụ cấp |
| 2 | Phụ cấp | Tên khoản phụ cấp |
| 3 | Đơn vị | Đơn vị tính |
| 4 | Số tiền phụ cấp | Giá trị phụ cấp |
| 5 | Tổng phụ cấp tháng | Tổng giá trị phụ cấp trong tháng |

### UI requirements

- Hiển thị dạng DataGrid.
- Header rõ ràng.
- Có thể scroll khi có nhiều khoản phụ cấp.
- Số tiền phải được format theo định dạng tiền tệ.
- Không cho phép chỉnh sửa trực tiếp dữ liệu trong DataGrid.
- Hiển thị tổng phụ cấp tháng.

---

## 4.2. Button Cập nhập điều chỉnh

Physical:

```text
btnDieuChinhLuong
```

Event:

```text
Click
```

Behavior:

```text
Click "Cập nhập điều chỉnh"
        ↓
Mở màn hình / Dialog Điều chỉnh lương
        ↓
Hiển thị thông tin lương hiện tại
        ↓
Cho phép nhập thông tin điều chỉnh
```

---

# 5. Tab 4 – Bảo hiểm xã hội và Tài khoản cá nhân

| STT | Thuộc tính | Tên physical | Loại control | Length | Required | Validation | State |
|---:|---|---|---|---:|---|---|---|
| 13 | Số tài khoản Ngân hàng | `SoTaiKhoan` | Textbox | 20 | Có | | |
| 14 | Ngân hàng | `NganHang` | Textbox | 21 | Có | | |
| 15 | Số BHXH | `SoSoBaoHiemXaHoi` | Textbox | 22 | Có | | |
| 16 | Ngày cấp | `NgayCapBHXH` | DatePicker | | Có | | |
| 17 | Số Thẻ BHYT | `SoTheBaoHiemYTe` | Textbox | 24 | Có | | |
| 18 | Ngày cấp | `NgayCapBHYT` | DatePicker | | Có | | |
| 19 | Nơi đăng ký ban đầu | `NoiDangKyBanDau` | Textbox | 100 | Có | | |

> Trong UI nên sử dụng physical name riêng cho ngày cấp BHXH và ngày cấp BHYT để tránh trùng field `NgayCap`.

---

# 6. Layout tổng thể

Màn hình nên sử dụng layout quản lý hồ sơ nhân viên theo dạng:

```text
┌──────────────────────────────────────────────────────────────┐
│                    HỒ SƠ NHÂN VIÊN                           │
├──────────────────────────────────────────────────────────────┤
│ Mã NV: NV000001       Họ tên: Nguyễn Tất Thắng              │
│ Trạng thái: Đang làm việc                                   │
├──────────────────────────────────────────────────────────────┤
│ [Thông tin cá nhân] [Giấy tờ pháp lý]                       │
│ [Công việc/HĐLĐ]    [BHXH & Tài khoản]                      │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│                     TAB CONTENT                              │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│                         [Hủy] [Lưu]                          │
└──────────────────────────────────────────────────────────────┘
```

---

# 7. Header

Header của màn hình hiển thị thông tin nhận diện nhân viên.

### Thành phần

```text
Mã nhân viên
Họ và tên
Bộ phận
Chức vụ
Trạng thái
```

Ví dụ:

```text
NV000001
Nguyễn Tất Thắng
Front Office
Receptionist
Đang làm việc
```

### Trạng thái

Có thể sử dụng Badge:

```text
Đang làm việc
Nghỉ việc
Tạm nghỉ
```

---

# 8. Tab Navigation

Sử dụng Tab Navigation để chuyển đổi giữa các nhóm thông tin.

```text
┌──────────────────┬──────────────────┬────────────────────┬──────────────────────┐
│ Thông tin cá nhân│ Giấy tờ pháp lý  │ Công việc / HĐLĐ  │ BHXH & Tài khoản     │
└──────────────────┴──────────────────┴────────────────────┴──────────────────────┘
```

### Behavior

- Chỉ hiển thị nội dung của Tab đang active.
- Khi chuyển Tab, giữ nguyên dữ liệu người dùng đã nhập.
- Không reset form khi chuyển Tab.
- Nếu form có lỗi validation, hiển thị trạng thái lỗi trên Tab tương ứng.

---

# 9. Form Layout

## Desktop

Ưu tiên bố trí dạng 2 cột:

```text
┌───────────────────────────┬───────────────────────────┐
│ Họ                        │ Tên đệm                   │
├───────────────────────────┼───────────────────────────┤
│ Tên                       │ Giới tính                 │
├───────────────────────────┼───────────────────────────┤
│ Ngày sinh                 │ Nơi sinh                  │
├───────────────────────────┼───────────────────────────┤
│ Dân tộc                   │ Tôn giáo                  │
├───────────────────────────┼───────────────────────────┤
│ Email                     │ Số điện thoại             │
├───────────────────────────┼───────────────────────────┤
│ Trình độ học vấn          │ Trình độ chuyên môn       │
└───────────────────────────┴───────────────────────────┘
```

Các field dài như địa chỉ nên sử dụng full width:

```text
Địa chỉ thường trú
[                                                        ]

Chỗ ở hiện tại
[                                                        ]
```

---

# 10. Action Bar

Cuối màn hình:

```text
[Hủy] [Lưu]
```

### Lưu

```text
Click Lưu
    ↓
Validate toàn bộ form
    ↓
Nếu hợp lệ
    ↓
Hiển thị trạng thái Saving
    ↓
Lưu thành công
    ↓
Hiển thị Success Message
```

### Hủy

```text
Click Hủy
    ↓
Nếu có thay đổi chưa lưu
    ↓
Hiển thị Confirm Dialog
    ↓
Xác nhận
    ↓
Discard changes
```

---

# 11. Validation UI

## Required

Field Required phải:

- Có dấu `*` trên label.
- Hiển thị message khi bỏ trống.
- Không cho phép submit khi validation không hợp lệ.

Ví dụ:

```text
Họ *
[_____________________]

Vui lòng nhập Họ.
```

## Character Only

Áp dụng cho:

```text
Ho
TenDem
Ten
```

## Numeric

Áp dụng cho các field số:

```text
CCCD
SoTaiKhoan
SoSoBaoHiemXaHoi
SoTheBaoHiemYTe
```

## Email

Field:

```text
Email
```

Phải kiểm tra định dạng email hợp lệ.

---

# 12. Responsive

## Desktop

- Hiển thị đầy đủ 4 Tab.
- Form ưu tiên 2 cột.
- DataGrid hiển thị đầy đủ columns.

## Tablet

- Form chuyển thành 1–2 cột tùy kích thước.
- DataGrid cho phép horizontal scroll.

## Mobile

- Tab Navigation có thể scroll ngang.
- Form chuyển thành 1 cột.
- Action buttons giữ kích thước dễ thao tác.
- DataGrid cho phép scroll ngang.

---

# 13. Component Structure – Vue 3

```text
src/
├── views/
│   └── employees/
│       └── EmployeeCreateView.vue
│
├── components/
│   └── employees/
│       ├── EmployeeHeader.vue
│       ├── EmployeeTabs.vue
│       ├── EmployeePersonalTab.vue
│       ├── EmployeeLegalTab.vue
│       ├── EmployeeContractTab.vue
│       ├── EmployeeAllowanceGrid.vue
│       ├── EmployeeInsuranceTab.vue
│       └── EmployeeActionBar.vue
│
├── validations/
│   └── employeeValidation.ts
│
├── types/
│   └── employee.ts
│
└── mock/
    └── employeeMock.ts
```

---

# 14. Mock Data

Giai đoạn hiện tại chỉ sử dụng Mock Data để dựng giao diện.

Ví dụ:

```json
{
  "maNhanVien": "NV000001",
  "ho": "Nguyen",
  "tenDem": "Tat",
  "ten": "Thang",
  "gioiTinh": "M",
  "ngaySinh": "1990-01-01",
  "noiSinh": "Da Nang",
  "danToc": "Kinh",
  "tonGiao": "None",
  "diaChiThuongTru": "Da Nang",
  "diaChiHienTai": "Da Nang",
  "email": "example@email.com",
  "soDienThoai": "0900000000",
  "trinhDoHocVan": "Dai hoc",
  "trinhDoChuyenMon": "Cong nghe thong tin",
  "ngayTuyenDung": "2026-01-01"
}
```

---

# 15. Yêu cầu cho Stitch / UI Generator

Khi generate giao diện:

- Sử dụng Vue 3.
- Giao diện quản lý nghiệp vụ nhan su.
- Thiết kế theo phong cách Windows 11.
- Sử dụng sidebar + header theo layout hệ thống HR hiện tại.
- Màn hình Employee Detail phải là Business UI, không phải landing page.
- Ưu tiên Form, Tabs, DataGrid, Dialog và Action Bar.
- Khoảng cách giữa các field rõ ràng.
- Label và input phải dễ đọc.
- Required field có dấu `*`.
- Error message hiển thị ngay dưới field.
- Readonly/Disabled field phải có visual distinction.
- Tiền tệ hiển thị có phân cách hàng nghìn.
- Date hiển thị thống nhất theo format `dd/MM/yyyy`.
- Không tạo API thật.
- Sử dụng Mock Data.
- Không thêm các màn hình hoặc chức năng ngoài phạm vi đặc tả.
