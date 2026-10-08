import type { DocumentNode } from 'graphql';
import { MASTER_CODES } from '@/graphql/employee/employee.documents';
import { validContractDate } from '@/utils/contract';
import { apolloClient } from '@/services/graphql/apollo';
import {
  RECRUITMENT_LIST,
  RECRUITMENT_DETAIL,
  RECRUITMENT_DEPARTMENTS,
  RECRUITMENT_POSITIONS,
  CREATE_RECRUITMENT,
  UPDATE_RECRUITMENT,
  UPDATE_RECRUITMENT_STATUS,
  CONFIRM_NHAN_VIEC,
  RECRUITMENT_FOR_EMPLOYEE,
  CREATE_EMPLOYEE_FROM_RECRUITMENT,
} from '@/graphql/recruitment/recruitment.documents';
import type {
  RecruitmentInput,
  RecruitmentRecord,
  RecruitmentStatus,
  RecruitmentCatalogs,
  RecruitmentDto,
  RecruitmentCreateInput,
  RecruitmentApiStatus,
  RecruitmentEmployeeSource,
} from '@/types/recruitment';
interface Response<T> {
  isResults?: boolean;
  message?: string;
  data: T;
}
export type { RecruitmentDto } from '@/types/recruitment';
const statusEnums: Record<RecruitmentStatus, RecruitmentApiStatus> = {
  '1': 'TUYEN_DUNG',
  '2': 'TIEP_NHAN',
  '3': 'KHONG_TUYEN',
  '4': 'KHONG_NHAN_VIEC',
  '5': 'DA_NHAN_VIEC',
  '6': 'DA_TAO_HO_SO_NHAN_VIEN',
};
const day = (value: string | null | undefined) => (value ? value.slice(0, 10) : null);
export function mapRecruitment(record: RecruitmentDto): RecruitmentRecord {
  recruitmentId(record.id);
  const status = Object.entries(statusEnums).find(
    ([code, name]) => code === String(record.trangThai) || name === record.trangThai,
  )?.[0];
  if (!status) throw new Error('Trạng thái tuyển dụng không hợp lệ: ' + record.trangThai);
  return {
    ...record,
    id: String(record.id),
    hoTen: record.hoTen || [record.ho, record.tenDem, record.ten].filter(Boolean).join(' '),
    gioiTinh: record.gioiTinh || '',
    tiepNhan: record.tiepNhan === true,
    maBoPhanDuKien: record.maBoPhanDuKien || '',
    maChucVuDuKien: record.maChucVuDuKien || '',
    ngaySinh: day(record.ngaySinh),
    trangThai: status as RecruitmentStatus,
    ngayTiepNhan: day(record.ngayTiepNhanHoSo),
    ngayBatDauLamViec: day(record.ngayBatDauLamViec),
    tenBoPhanDuKien: record.tenBoPhan || record.maBoPhanDuKien || '—',
    tenChucVuDuKien: record.tenChucVu || record.maChucVuDuKien || '—',
    soCCCD: record.soCCCD || '',
    ngayCap: day(record.ngayCap),
    noiCap: record.noiCap || '',
    soDienThoai: record.soDienThoai || '',
    email: record.email || '',
    ho: record.ho || '',
    tenDem: record.tenDem || '',
    ten: record.ten || '',
  };
}
export function recruitmentId(value: string | number): number {
  if (typeof value === 'string' && !/^\d+$/.test(value)) throw new Error('ID hồ sơ không hợp lệ.');
  const id = Number(value);
  if (!Number.isSafeInteger(id) || id <= 0)
    throw new Error('ID hồ sơ vượt phạm vi số nguyên an toàn hoặc không hợp lệ.');
  return id;
}
function salary(value: number | null): number {
  if (value == null || !Number.isFinite(value) || value < 0)
    throw new Error('Thu nhập phải là số hợp lệ, lớn hơn hoặc bằng 0.');
  return value;
}
export function recruitmentInput(input: RecruitmentInput): RecruitmentCreateInput {
  return {
    ngayTiepNhan: input.ngayTiepNhan ? input.ngayTiepNhan + 'T00:00:00+07:00' : null,
    ho: input.ho.trim(),
    tenDem: input.tenDem.trim(),
    ten: input.ten.trim(),
    gioiTinh: input.gioiTinh,
    soCCCD: input.soCCCD.trim() || null,
    ngayCap: input.ngayCap ? input.ngayCap + 'T00:00:00+07:00' : null,
    noiCap: input.noiCap.trim() || null,
    soDienThoai: input.soDienThoai.trim() || null,
    email: input.email.trim() || null,
    tongThuNhapThoaThuan: salary(input.tongThuNhapThoaThuan),
    luongCoBan: salary(input.luongCoBan),
    luongThuViec: salary(input.luongThuViec),
    maBoPhanDuKien: input.maBoPhanDuKien,
    maChucVuDuKien: input.maChucVuDuKien,
  };
}
async function query<T>(
  document: DocumentNode,
  field: string,
  variables = {},
  checkResult = true,
): Promise<T> {
  const response = await apolloClient.query<Record<string, Response<T>>>({
    query: document,
    variables,
    fetchPolicy: 'no-cache',
    errorPolicy: 'none',
  });
  const result = response.data?.[field];
  if (!result || (checkResult && result.isResults !== true) || result.data == null)
    throw new Error(result?.message || 'Không thể tải dữ liệu tuyển dụng.');
  return result.data;
}
async function mutate(document: DocumentNode, field: string, input: object) {
  const response = await apolloClient.mutate<Record<string, Response<unknown>>>({
    mutation: document,
    variables: { input },
    errorPolicy: 'none',
  });
  const result = response.data?.[field];
  if (result?.isResults !== true)
    throw new Error(result?.message || 'Không thể lưu hồ sơ tuyển dụng.');
  return result;
}
export const recruitmentService = {
  async getIssuePlaces(): Promise<{ value: string; label: string }[]> {
    const items = await query<({ maKey: string; tenGiaTri: string } | null)[]>(
      MASTER_CODES,
      'danhSachMasterCode',
      { phanLoai: '03' },
    );
    return items
      .filter((item) => item !== null)
      .map((item) => ({ value: item.maKey, label: item.tenGiaTri }));
  },
  async getPositions(maBoPhan: string | null = null): Promise<RecruitmentCatalogs['positions']> {
    const positions = await query<
      ({ maChucVu: string; maBoPhan: string; tenChucVu: string } | null)[]
    >(RECRUITMENT_POSITIONS, 'danhSachChucVu', { maBoPhan: maBoPhan || null });
    return positions
      .filter((item) => item !== null)
      .map((item) => ({ value: item.maChucVu, label: item.tenChucVu }));
  },
  async getCatalogs(maBoPhan: string | null = null): Promise<RecruitmentCatalogs> {
    const [departments, positions] = await Promise.all([
      query<({ maBoPhan: string; tenBoPhan: string } | null)[]>(
        RECRUITMENT_DEPARTMENTS,
        'danhSachBoPhan',
      ),
      recruitmentService.getPositions(maBoPhan),
    ]);
    return {
      departments: departments
        .filter((x) => x !== null)
        .map((x) => ({ value: x.maBoPhan, label: x.tenBoPhan })),
      positions,
    };
  },
  async list(keyword = '') {
    return (
      await query<(RecruitmentDto | null)[]>(RECRUITMENT_LIST, 'danhSachTuyenDung', {
        keyword: keyword.trim() || null,
      })
    )
      .filter((record): record is RecruitmentDto => record !== null)
      .map(mapRecruitment);
  },
  async getDetail(id: string) {
    return mapRecruitment(
      await query<RecruitmentDto>(RECRUITMENT_DETAIL, 'thongTinTuyenDung', {
        id: recruitmentId(id),
      }),
    );
  },
  getEmployeeSource: (id: string) =>
    query<RecruitmentEmployeeSource>(RECRUITMENT_FOR_EMPLOYEE, 'tuyenDungForNhanVien', {
      id: recruitmentId(id),
    }),
  async createEmployeeFromRecruitment(id: string) {
    const source = await recruitmentService.getEmployeeSource(id);
    if (recruitmentId(source.tuyenDungId) !== recruitmentId(id))
      throw new Error('TUYENDUNG_INVALID_INPUT');
    if (!source.maNhanVien?.trim()) throw new Error('TIEPNHAN_EMPLOYEE_CODE_REQUIRED');
    return mutate(CREATE_EMPLOYEE_FROM_RECRUITMENT, 'taoNhanVienTuTuyenDung', {
      tuyenDungId: recruitmentId(id),
      thongTinNhanVien: {
        maNhanVien: source.maNhanVien,
        ho: source.ho,
        tenDem: source.tenDem,
        ten: source.ten,
        gioiTinh: source.gioiTinh,
        ngaySinh: source.ngaySinh,
        noiSinh: '03001',
        email: source.email,
        soDienThoai: source.soDienThoai,
        danToc: '01001',
        tonGiao: '02000',
        diaChiThuongTru: '-',
        diaChiLienHe: '-',
        trinhDoHocVan: '04004',
        trinhDoChuyenMon: '05001',
        cccd: source.soCCCD,
        ngayCap: source.ngayCap,
        noiCap: source.noiCap,
        ngayTuyenDung: source.ngayBatDauLamViec,
      },
    });
  },
  create: (input: RecruitmentInput) =>
    mutate(CREATE_RECRUITMENT, 'createTuyenDung', recruitmentInput(input)),
  update: (id: string, input: RecruitmentInput) =>
    mutate(UPDATE_RECRUITMENT, 'updateTuyenDung', {
      id: recruitmentId(id),
      ...recruitmentInput(input),
    }),
  async confirmStart(record: RecruitmentRecord, startDate: string) {
    if (!validContractDate(startDate)) throw new Error('Vui lòng chọn ngày nhận việc hợp lệ.');
    if (!['1', '2'].includes(record.trangThai))
      throw new Error('Hồ sơ không còn ở trạng thái có thể nhận việc.');
    return mutate(CONFIRM_NHAN_VIEC, 'confirmNhanViec', {
      id: recruitmentId(record.id),
      ngayBatDauLamViec: startDate + 'T00:00:00+07:00',
    });
  },
  transition: (id: string, status: RecruitmentStatus) =>
    mutate(UPDATE_RECRUITMENT_STATUS, 'updateTuyenDungStatus', {
      id: recruitmentId(id),
      trangThai: statusEnums[status],
    }),
};
