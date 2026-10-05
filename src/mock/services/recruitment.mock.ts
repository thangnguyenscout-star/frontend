import type {
  RecruitmentCatalogs,
  RecruitmentInput,
  RecruitmentRecord,
  RecruitmentStatus,
} from '@/types/recruitment';
import { validateRecruitment } from '@/utils/recruitment';

const storageKey = 'hr-recruitment-ui-v3';
const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value));
const wait = () => new Promise((resolve) => setTimeout(resolve, 100));

const catalogs: RecruitmentCatalogs = {
  departments: [
    { value: 'IT', label: 'Công nghệ thông tin' },
    { value: 'HR', label: 'Nhân sự' },
    { value: 'FO', label: 'Lễ tân' },
    { value: 'FB', label: 'Ẩm thực' },
  ],
  positions: [
    { value: 'DEV1', label: 'Lập trình viên' },
    { value: 'HR01', label: 'Chuyên viên nhân sự' },
    { value: 'REC1', label: 'Nhân viên lễ tân' },
    { value: 'FBS1', label: 'Nhân viên phục vụ' },
  ],
};

const catalogLabel = (key: keyof RecruitmentCatalogs, value: string) =>
  catalogs[key].find((item) => item.value === value)?.label || value;
const decorate = (input: RecruitmentInput) => ({
  hoTen: [input.ho, input.tenDem, input.ten].filter(Boolean).join(' '),
  tenBoPhanDuKien: catalogLabel('departments', input.maBoPhanDuKien),
  tenChucVuDuKien: catalogLabel('positions', input.maChucVuDuKien),
});

function seed(): RecruitmentRecord[] {
  const source = [
    ['Nguyễn', 'Văn', 'An', 'M', 'IT', 'DEV1', '1'],
    ['Trần', 'Minh', 'Anh', 'F', 'HR', 'HR01', '2'],
    ['Lê', 'Văn', 'Bình', 'M', 'IT', 'DEV1', '3'],
  ] as const;
  return source.map((item, index) => {
    const input: RecruitmentInput = {
      ngayTiepNhan: '2026-09-' + String(22 - index * 2).padStart(2, '0'),
      ho: item[0],
      tenDem: item[1],
      ten: item[2],
      gioiTinh: item[3],
      soCCCD: '',
      ngayCap: null,
      noiCap: '',
      soDienThoai: '090123456' + index,
      email: item[2].toLowerCase() + '@example.com',
      tongThuNhapThoaThuan: 20000000 - index * 2000000,
      luongCoBan: 12000000 - index * 1000000,
      luongThuViec: 17000000 - index * 2000000,
      maBoPhanDuKien: item[4],
      maChucVuDuKien: item[5],
      ngayBatDauLamViec: index < 2 ? '2026-10-0' + (1 + index * 4) : null,
    };
    return {
      ...input,
      ...decorate(input),
      id: String(index + 1),
      tiepNhan: item[6] === '2',
      trangThai: item[6],
      createdAt: new Date().toISOString(),
      createdBy: 'mock-user',
      updatedAt: null,
      updatedBy: null,
    };
  });
}
function write(rows: RecruitmentRecord[]) {
  localStorage.setItem(storageKey, JSON.stringify(rows));
}
function read() {
  const stored = localStorage.getItem(storageKey);
  if (stored) return JSON.parse(stored) as RecruitmentRecord[];
  const rows = seed();
  write(rows);
  return rows;
}
function find(rows: RecruitmentRecord[], id: string) {
  const record = rows.find((item) => item.id === id);
  if (!record) throw Error('Không tìm thấy hồ sơ tuyển dụng.');
  return record;
}
function clean(input: RecruitmentInput): RecruitmentInput {
  return {
    ...clone(input),
    ho: input.ho.trim(),
    tenDem: input.tenDem.trim(),
    ten: input.ten.trim(),
    email: input.email.trim(),
    soDienThoai: input.soDienThoai.trim(),
  };
}
function check(input: RecruitmentInput) {
  if (Object.keys(validateRecruitment(input)).length) throw Error('Thông tin hồ sơ không hợp lệ.');
}

export const recruitmentMock = {
  async catalogs() {
    await wait();
    return clone(catalogs);
  },
  async list() {
    await wait();
    return clone(read());
  },
  async detail(id: string) {
    await wait();
    return clone(find(read(), id));
  },
  async create(value: RecruitmentInput) {
    await wait();
    const input = clean(value);
    check(input);
    const record: RecruitmentRecord = {
      ...input,
      ...decorate(input),
      id: String(Date.now()),
      tiepNhan: false,
      trangThai: '1',
      createdAt: new Date().toISOString(),
      createdBy: 'mock-user',
      updatedAt: null,
      updatedBy: null,
    };
    write([record, ...read()]);
    return clone(record);
  },
  async update(id: string, value: RecruitmentInput) {
    await wait();
    const input = clean(value);
    check(input);
    const rows = read();
    const record = find(rows, id);
    const state = { trangThai: record.trangThai, tiepNhan: record.tiepNhan };
    Object.assign(record, input, decorate(input), state, {
      updatedAt: new Date().toISOString(),
      updatedBy: 'mock-user',
    });
    write(rows);
    return clone(record);
  },
  async transition(id: string, next: RecruitmentStatus) {
    await wait();
    const rows = read();
    const record = find(rows, id);
    if ((next === '4' || next === '5') && record.trangThai !== '2')
      throw Error('Trạng thái hiện tại không cho phép thao tác này.');
    record.trangThai = next;
    record.tiepNhan = next === '2' || next === '5';
    record.updatedAt = new Date().toISOString();
    record.updatedBy = 'mock-user';
    write(rows);
    return clone(record);
  },
  async confirmOnboard(id: string, date: string) {
    await wait();
    const rows = read();
    const record = find(rows, id);
    if (record.trangThai !== '2' || !date) throw Error('Không thể xác nhận nhận việc.');
    record.trangThai = '5';
    record.tiepNhan = true;
    record.ngayBatDauLamViec = date;
    record.updatedAt = new Date().toISOString();
    record.updatedBy = 'mock-user';
    write(rows);
    return clone(record);
  },
};

