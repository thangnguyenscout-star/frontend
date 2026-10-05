import type {
  Contract,
  ContractAction,
  ContractCatalogs,
  ContractInput,
  ContractStatus,
} from '@/types/contract';
import {
  calculateMonthlyAllowance,
  calculateProbationSalary,
  calculateSocialInsuranceContribution,
  calculateTotalAllowance,
  calculateTotalIncome,
  emptyContract,
  getContractActions,
  hasContractErrors,
  nextContractStatus,
  validateContract,
} from '@/utils/contract';
// Review-only mock backend. One storage write commits master and detail together.
const storageKey = 'hr-contracts-master-detail-review-v3';
const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value));
const catalogs: ContractCatalogs = {
  employees: [
    'Nguyễn Minh Anh',
    'Trần Quốc Bảo',
    'Lê Thu Hà',
    'Phạm Hoàng Nam',
    'Võ Ngọc Lan',
    'Đặng Thanh Tùng',
    'Bùi Phương Thảo',
    'Đỗ Đức Huy',
  ].map((name, i) => ({
    value: 'NV' + String(i + 1).padStart(4, '0'),
    label: 'NV' + String(i + 1).padStart(4, '0') + ' - ' + name,
  })),
  types: [
    { value: 'HD001', label: 'Hợp đồng xác định thời hạn' },
    { value: 'HD002', label: 'Hợp đồng không xác định thời hạn' },
    { value: 'HD003', label: 'Hợp đồng thử việc' },
  ],
  departments: [
    { value: '01', label: 'Lễ tân' },
    { value: '02', label: 'Buồng phòng' },
    { value: '03', label: 'Ẩm thực' },
    { value: '04', label: 'Nhân sự' },
  ],
  positions: [
    { value: 'CV01', label: 'Nhân viên' },
    { value: 'CV02', label: 'Trưởng ca' },
    { value: 'CV03', label: 'Trưởng bộ phận' },
  ],
  allowances: [
    { value: '001', label: 'Phụ cấp ăn ca' },
    { value: '002', label: 'Phụ cấp đi lại' },
    { value: '003', label: 'Phụ cấp trách nhiệm' },
    { value: '004', label: 'Phụ cấp điện thoại' },
  ],
};
function labels(input: ContractInput) {
  const label = (key: keyof ContractCatalogs, code: string) =>
    catalogs[key].find((item) => item.value === code)?.label || code;
  return {
    hoTen: label('employees', input.maNhanVien).split(' - ').slice(1).join(' - '),
    tenLoaiHopDong: label('types', input.maLoaiHopDong),
    tenBoPhan: label('departments', input.maBoPhan),
    tenChucVu: label('positions', input.maChucVu),
  };
}
function seed(): Contract[] {
  return Array.from({ length: 15 }, (_, i) => {
    const input: ContractInput = {
      ...emptyContract(),
      maNhanVien: catalogs.employees[i % 8].value,
      soHopDongLaoDong: 'HĐ-2026-' + String(i + 1).padStart(3, '0'),
      maLoaiHopDong: catalogs.types[i % 3].value,
      maChucVu: catalogs.positions[i % 3].value,
      maBoPhan: catalogs.departments[i % 4].value,
      ngayKyHopDong: '2026-09-01',
      ngayBatDau: '2026-10-01',
      ngayKetThuc: i % 3 === 1 ? null : '2027-09-30',
      luongCoBan: 8000000 + i * 500000,
      tongThuNhap: 8800000 + i * 500000,
      tongPhuCap: 800000,
      luongThuViec: (8800000 + i * 500000) * 0.85,
      mucDongBHXH: (8000000 + i * 500000) * 0.08,
      ghiChu: 'Hồ sơ mẫu dùng để review giao diện.',
      phuCaps: [
        {
          maPhuCap: '001',
          tenPhuCap: 'Phụ cấp ăn ca',
          soTienPhuCap: 500000,
          donViTinhThoiGian: '07001',
          soTienPhuCapThang: 500000,
        },
        {
          maPhuCap: '002',
          tenPhuCap: 'Phụ cấp đi lại',
          soTienPhuCap: 300000,
          donViTinhThoiGian: '07001',
          soTienPhuCapThang: 300000,
        },
      ],
    };
    return {
      ...input,
      ...labels(input),
      id: 'HD2026' + String(i + 1).padStart(9, '0'),
      trangThaiHopDong: String((i % 5) + 1) as ContractStatus,
    };
  });
}
function read(): Contract[] {
  const raw = localStorage.getItem(storageKey);
  if (!raw) {
    const rows = seed();
    write(rows);
    return rows;
  }
  const rows: unknown = JSON.parse(raw);
  if (!Array.isArray(rows)) throw new Error('Dữ liệu review hợp đồng không hợp lệ.');
  return rows as Contract[];
}
function write(rows: Contract[]) {
  localStorage.setItem(storageKey, JSON.stringify(rows));
}
const wait = () => new Promise((resolve) => setTimeout(resolve, 180));
function find(rows: Contract[], id: string) {
  const row = rows.find((item) => item.id === id);
  if (!row) throw new Error('Không tìm thấy hợp đồng.');
  return row;
}
export const contractMock = {
  async catalogs() {
    await wait();
    return clone(catalogs);
  },
  async list(keyword = '') {
    await wait();
    const search = keyword.trim().toLocaleLowerCase('vi');
    return clone(
      read().filter((row) =>
        [row.id, row.soHopDongLaoDong, row.maNhanVien, row.hoTen].some((value) =>
          value.toLocaleLowerCase('vi').includes(search),
        ),
      ),
    );
  },
  async detail(id: string) {
    await wait();
    return clone(find(read(), id));
  },
  async create(input: ContractInput) {
    await wait();
    if (hasContractErrors(validateContract(input)))
      throw new Error('Thông tin hợp đồng hoặc phụ cấp không hợp lệ.');
    for (const [field, category] of [
      ['maNhanVien', 'employees'],
      ['maLoaiHopDong', 'types'],
      ['maBoPhan', 'departments'],
      ['maChucVu', 'positions'],
    ] as const) {
      if (!catalogs[category].some((item) => item.value === input[field]))
        throw new Error('Danh mục hợp đồng không hợp lệ.');
    }
    if (
      input.phuCaps.some((row) => !catalogs.allowances.some((item) => item.value === row.maPhuCap))
    )
      throw new Error('Danh mục phụ cấp không hợp lệ.');
    const rows = read();
    const number = input.soHopDongLaoDong.trim();
    if (rows.some((row) => row.soHopDongLaoDong.toLowerCase() === number.toLowerCase()))
      throw new Error('Số hợp đồng đã tồn tại.');
    let sequence = rows.length + 1;
    while (rows.some((row) => row.id === 'HD2026' + String(sequence).padStart(9, '0'))) sequence++;
    const calculatedAllowances = input.phuCaps.map((item) => ({
      ...clone(item),
      soTienPhuCapThang: calculateMonthlyAllowance(item.soTienPhuCap, item.donViTinhThoiGian),
      tenPhuCap: catalogs.allowances.find((option) => option.value === item.maPhuCap)!.label,
    }));
    const totalAllowance = calculateTotalAllowance(calculatedAllowances);
    const totalIncome = calculateTotalIncome(input.luongCoBan, totalAllowance);
    const row: Contract = {
      ...clone(input),
      ...labels(input),
      tongPhuCap: totalAllowance,
      tongThuNhap: totalIncome,
      luongThuViec: calculateProbationSalary(totalIncome),
      mucDongBHXH: calculateSocialInsuranceContribution(input.luongCoBan),
      id: 'HD2026' + String(sequence).padStart(9, '0'),
      soHopDongLaoDong: number,
      trangThaiHopDong: '1',
      phuCaps: calculatedAllowances,
    };
    write([row, ...rows]);
    return { message: 'Tạo hợp đồng thành công.', data: clone(row) };
  },
  async transition(id: string, action: ContractAction) {
    await wait();
    const rows = read();
    const row = find(rows, id);
    row.trangThaiHopDong = nextContractStatus(row.trangThaiHopDong, action);
    write(rows);
    return { message: 'Cập nhật trạng thái hợp đồng thành công.' };
  },
  async proposal(id: string) {
    await wait();
    const row = find(read(), id);
    if (!getContractActions(row.trangThaiHopDong).proposal)
      throw new Error('Chỉ lập tờ trình khi hợp đồng chờ duyệt.');
    return clone(row);
  },
};
