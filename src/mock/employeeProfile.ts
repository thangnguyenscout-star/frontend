export interface EmployeeProfileField {
  key: string;
  label: string;
  tab: number;
  kind?: 'date' | 'select' | 'gender';
  required?: boolean;
  max?: number;
  numeric?: boolean;
  letters?: boolean;
  wide?: boolean;
  options?: string[];
}

const places = ['TP. Hồ Chí Minh', 'Hà Nội', 'Đà Nẵng', 'Cần Thơ', 'Huế'];
export const employeeProfileFields: EmployeeProfileField[] = [
  { key: 'code', label: 'Mã nhân viên', tab: 0, max: 10, wide: true },
  { key: 'lastName', label: 'Họ', tab: 0, required: true, max: 10, letters: true },
  { key: 'middleName', label: 'Tên đệm', tab: 0, required: true, max: 30, letters: true },
  { key: 'firstName', label: 'Tên', tab: 0, required: true, max: 20, letters: true },
  { key: 'gender', label: 'Giới tính', tab: 0, kind: 'gender', required: true },
  { key: 'birthDate', label: 'Ngày sinh', tab: 0, kind: 'date', required: true },
  { key: 'birthPlace', label: 'Nơi sinh', tab: 0, kind: 'select', required: true, options: places },
  {
    key: 'ethnicity',
    label: 'Dân tộc',
    tab: 0,
    kind: 'select',
    required: true,
    options: ['Kinh', 'Tày', 'Thái', 'Hoa', 'Khmer'],
  },
  {
    key: 'religion',
    label: 'Tôn giáo',
    tab: 0,
    kind: 'select',
    required: true,
    options: ['Không', 'Phật giáo', 'Công giáo', 'Tin Lành', 'Cao Đài'],
  },
  { key: 'address', label: 'Địa chỉ thường trú', tab: 0, required: true, max: 100, wide: true },
  { key: 'currentAddress', label: 'Chỗ ở hiện tại', tab: 0, max: 100, wide: true },
  { key: 'email', label: 'Email', tab: 0, max: 100 },
  { key: 'phone', label: 'Số điện thoại', tab: 0, max: 20 },
  {
    key: 'education',
    label: 'Trình độ học vấn',
    tab: 0,
    kind: 'select',
    required: true,
    options: ['THPT', 'Trung cấp', 'Cao đẳng', 'Đại học', 'Sau đại học'],
  },
  {
    key: 'specialization',
    label: 'Trình độ chuyên môn',
    tab: 0,
    kind: 'select',
    required: true,
    options: [
      'Quản trị khách sạn',
      'Nghiệp vụ lễ tân',
      'Nghiệp vụ buồng phòng',
      'Kế toán',
      'Công nghệ thông tin',
    ],
  },
  { key: 'startDate', label: 'Ngày tuyển dụng', tab: 0, kind: 'date' },
  {
    key: 'identityNumber',
    label: 'Căn cước công dân',
    tab: 1,
    required: true,
    max: 20,
    numeric: true,
  },
  { key: 'identityIssuedDate', label: 'Ngày cấp', tab: 1, kind: 'date', required: true },
  {
    key: 'identityIssuedPlace',
    label: 'Nơi cấp',
    tab: 1,
    kind: 'select',
    required: true,
    options: ['Cục Cảnh sát QLHC về TTXH', ...places],
  },
  {
    key: 'bankAccount',
    label: 'Số tài khoản ngân hàng',
    tab: 3,
    required: true,
    max: 20,
    numeric: true,
  },
  { key: 'bank', label: 'Ngân hàng', tab: 3, required: true, max: 21 },
  { key: 'insuranceNumber', label: 'Số BHXH', tab: 3, required: true, max: 22, numeric: true },
  { key: 'insuranceIssuedDate', label: 'Ngày cấp BHXH', tab: 3, kind: 'date', required: true },
  {
    key: 'healthInsuranceNumber',
    label: 'Số thẻ BHYT',
    tab: 3,
    required: true,
    max: 24,
    numeric: true,
  },
  {
    key: 'healthInsuranceIssuedDate',
    label: 'Ngày cấp BHYT',
    tab: 3,
    kind: 'date',
    required: true,
  },
  {
    key: 'healthcareProvider',
    label: 'Nơi đăng ký ban đầu',
    tab: 3,
    required: true,
    max: 100,
    wide: true,
  },
];

export const employeeAllowanceMock = [
  { code: 'PC01', name: 'Ăn ca', unit: 'Tháng', amount: 600000, total: 600000 },
  { code: 'PC02', name: 'Đi lại', unit: 'Tháng', amount: 400000, total: 400000 },
  { code: 'PC03', name: 'Nhà ở', unit: 'Tháng', amount: 500000, total: 500000 },
];
