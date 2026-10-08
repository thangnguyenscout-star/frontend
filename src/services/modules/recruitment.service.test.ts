import { print } from 'graphql';
import { beforeEach, describe, expect, it, vi } from 'vitest';
const { query, mutate } = vi.hoisted(() => ({ query: vi.fn(), mutate: vi.fn() }));
vi.mock('@/services/graphql/apollo', () => ({ apolloClient: { query, mutate } }));
import {
  recruitmentService,
  recruitmentInput,
  mapRecruitment,
  recruitmentId,
  type RecruitmentDto,
} from './recruitment.service';
import { emptyRecruitment as emptyForm, validateRecruitment } from '@/utils/recruitment';
const emptyRecruitment = () => ({
  ...emptyForm(),
  tongThuNhapThoaThuan: 0,
  luongCoBan: 0,
  luongThuViec: 0,
});
describe('recruitment API integration', () => {
  beforeEach(() => {
    query.mockReset();
    mutate.mockReset();
  });
  it('uses server keyword and clears it to null', async () => {
    query.mockResolvedValue({ data: { danhSachTuyenDung: { isResults: true, data: [] } } });
    await recruitmentService.list(' An ');
    expect(query).toHaveBeenLastCalledWith(
      expect.objectContaining({ variables: { keyword: 'An' }, fetchPolicy: 'no-cache' }),
    );
    await recruitmentService.list('  ');
    expect(query).toHaveBeenLastCalledWith(
      expect.objectContaining({ variables: { keyword: null } }),
    );
  });
  it('maps backend names, dates and nullable contact fields', () => {
    const result = mapRecruitment({
      ...emptyRecruitment(),
      id: 42,
      trangThai: 'TIEP_NHAN',
      ngayTiepNhanHoSo: '2026-09-24T00:00:00',
      tenBoPhan: 'IT',
      tenChucVu: 'Developer',
      soDienThoai: null,
      email: null,
      hodApprovedBy: 'manager',
    } as unknown as RecruitmentDto);
    expect(result).toMatchObject({
      id: '42',
      trangThai: '2',
      ngayTiepNhan: '2026-09-24',
      tenBoPhanDuKien: 'IT',
      tenChucVuDuKien: 'Developer',
      soDienThoai: '',
      email: '',
      hodApprovedBy: 'manager',
    });
  });
  it('maps the completed onboarding enum to status 6', () => {
    const result = mapRecruitment({
      ...emptyRecruitment(),
      id: 42,
      trangThai: 'DA_TAO_HO_SO_NHAN_VIEN',
    } as unknown as RecruitmentDto);
    expect(result.trangThai).toBe('6');
  });
  it('does not send workflow or unsupported fields on save', () => {
    const result = recruitmentInput({
      ...emptyRecruitment(),
      ho: ' Nguyen ',
      ngayBatDauLamViec: '2026-09-24',
    });
    expect(result.ho).toBe('Nguyen');
    expect(result).not.toHaveProperty('ngayBatDauLamViec');
    expect(result).not.toHaveProperty('trangThai');
    expect(result).not.toHaveProperty('hodApprovedBy');
  });
  it('rejects a business failure without reporting save success', async () => {
    mutate.mockResolvedValue({
      data: { createTuyenDung: { isResults: false, message: 'Rejected', data: null } },
    });
    await expect(recruitmentService.create(emptyRecruitment())).rejects.toThrow('Rejected');
  });
  it('accepts success with null mutation data', async () => {
    mutate.mockResolvedValue({
      data: { updateTuyenDung: { isResults: true, message: 'OK', data: null } },
    });
    await expect(recruitmentService.update('1', emptyRecruitment())).resolves.toMatchObject({
      isResults: true,
    });
  });
  it('loads positions for the selected department and supports an unfiltered list', async () => {
    query.mockResolvedValue({
      data: {
        danhSachChucVu: {
          isResults: true,
          data: [null, { maChucVu: 'DEV', maBoPhan: 'IT', tenChucVu: 'Developer' }],
        },
      },
    });
    await expect(recruitmentService.getPositions('IT')).resolves.toEqual([
      { value: 'DEV', label: 'Developer' },
    ]);
    expect(query).toHaveBeenLastCalledWith(
      expect.objectContaining({ variables: { maBoPhan: 'IT' } }),
    );
    const document = print(query.mock.calls[0][0].query);
    expect(document).toContain('danhSachChucVu(maBoPhan: $maBoPhan)');
    expect(document).toContain('maBoPhan');
    await recruitmentService.getPositions();
    expect(query).toHaveBeenLastCalledWith(
      expect.objectContaining({ variables: { maBoPhan: null } }),
    );
  });
  it('propagates position catalog failures', async () => {
    query.mockResolvedValue({
      data: { danhSachChucVu: { isResults: false, message: 'Rejected', data: [] } },
    });
    await expect(recruitmentService.getPositions('IT')).rejects.toThrow('Rejected');
  });
  it('loads departments from the list endpoint', async () => {
    query.mockResolvedValueOnce({
      data: { danhSachBoPhan: { isResults: true, data: [{ maBoPhan: 'IT', tenBoPhan: 'IT' }] } },
    });
    query.mockResolvedValueOnce({
      data: {
        danhSachChucVu: { isResults: true, data: [{ maChucVu: 'DEV', tenChucVu: 'Developer' }] },
      },
    });
    await expect(recruitmentService.getCatalogs()).resolves.toEqual({
      departments: [{ value: 'IT', label: 'IT' }],
      positions: [{ value: 'DEV', label: 'Developer' }],
    });
  });
});

describe('recruitment mutation contract', () => {
  beforeEach(() => {
    query.mockReset();
    mutate.mockReset();
  });
  it('sends record ID and a whitelisted edit payload', async () => {
    mutate.mockResolvedValue({ data: { updateTuyenDung: { isResults: true, data: null } } });
    await recruitmentService.update('42', emptyRecruitment());
    expect(mutate.mock.calls[0][0].variables.input).toEqual({
      id: 42,
      ...recruitmentInput(emptyRecruitment()),
    });
    expect(mutate.mock.calls[0][0].variables.input).not.toHaveProperty('maNhanVien');
  });
  it('uses the separate status mutation and propagates workflow rejection', async () => {
    mutate.mockResolvedValue({
      data: {
        updateTuyenDungStatus: { isResults: false, message: 'Không được chuyển trạng thái' },
      },
    });
    await expect(recruitmentService.transition('42', '2')).rejects.toThrow(
      'Không được chuyển trạng thái',
    );
    expect(mutate.mock.calls[0][0].variables.input).toEqual({
      id: 42,
      trangThai: 'TIEP_NHAN',
    });
  });
  it('sends the completed onboarding enum for status 6', async () => {
    mutate.mockResolvedValue({
      data: { updateTuyenDungStatus: { isResults: true, message: 'OK' } },
    });
    await recruitmentService.transition('42', '6');
    expect(mutate.mock.calls[0][0].variables.input).toEqual({
      id: 42,
      trangThai: 'DA_TAO_HO_SO_NHAN_VIEN',
    });
  });
  it('propagates list business failures', async () => {
    query.mockResolvedValue({
      data: { danhSachTuyenDung: { isResults: false, message: 'Không có quyền', data: [] } },
    });
    await expect(recruitmentService.list()).rejects.toThrow('Không có quyền');
  });
  it('rejects non-finite salary values', () => {
    const errors = validateRecruitment({
      ...emptyRecruitment(),
      luongCoBan: NaN,
      luongThuViec: Infinity,
    });
    expect(errors.luongCoBan).toBeTruthy();
    expect(errors.luongThuViec).toBeTruthy();
  });
});

it('serializes DateTime with an explicit Vietnam offset', () => {
  expect(recruitmentInput({ ...emptyRecruitment(), ngayTiepNhan: '2026-09-24' }).ngayTiepNhan).toBe(
    '2026-09-24T00:00:00+07:00',
  );
});
it('rejects IDs that would lose precision', () => {
  expect(() => recruitmentId('9007199254740993')).toThrow();
  expect(recruitmentId('42')).toBe(42);
});

describe('confirm start date', () => {
  const record = () => ({
    ...emptyRecruitment(),
    id: '42',
    trangThai: '2' as const,
    hoTen: 'Nguyen An',
    tenBoPhanDuKien: 'IT',
    tenChucVuDuKien: 'Developer',
    tiepNhan: true,
  });
  beforeEach(() => {
    query.mockReset();
    mutate.mockReset();
  });
  it('confirms the selected date with a single confirmNhanViec mutation', async () => {
    mutate.mockResolvedValueOnce({ data: { confirmNhanViec: { isResults: true, data: null } } });
    await expect(recruitmentService.confirmStart(record(), '2026-09-28')).resolves.toMatchObject({
      isResults: true,
    });
    expect(mutate).toHaveBeenCalledTimes(1);
    expect(mutate.mock.calls[0][0].variables.input).toEqual({
      id: 42,
      ngayBatDauLamViec: '2026-09-28T00:00:00+07:00',
    });
    expect(print(mutate.mock.calls[0][0].mutation)).toContain(
      'mutation ConfirmNhanViec($input: ConfirmNhanViecInput!)',
    );
    expect(print(mutate.mock.calls[0][0].mutation)).toContain('confirmNhanViec(input: $input)');
  });
  it.each(['', '2026-02-30', 'invalid'])(
    'rejects invalid date %s without calling the API',
    async (date) => {
      await expect(recruitmentService.confirmStart(record(), date)).rejects.toThrow(
        'ngày nhận việc',
      );
      expect(mutate).not.toHaveBeenCalled();
    },
  );
  it('propagates confirmation rejection without further mutations', async () => {
    mutate.mockResolvedValueOnce({
      data: { confirmNhanViec: { isResults: false, message: 'Rejected' } },
    });
    await expect(recruitmentService.confirmStart(record(), '2026-09-28')).rejects.toThrow(
      'Rejected',
    );
    expect(mutate).toHaveBeenCalledTimes(1);
  });
  it('propagates transport errors without reporting partial success', async () => {
    mutate.mockRejectedValueOnce(new Error('Network error'));
    await expect(recruitmentService.confirmStart(record(), '2026-09-28')).rejects.toThrow(
      'Network error',
    );
    expect(mutate).toHaveBeenCalledTimes(1);
  });
  it('rejects an already started record', async () => {
    await expect(
      recruitmentService.confirmStart({ ...record(), trangThai: '5' }, '2026-09-28'),
    ).rejects.toThrow('trạng thái');
    expect(mutate).not.toHaveBeenCalled();
  });
});

describe('recruitment identity fields', () => {
  beforeEach(() => {
    query.mockReset();
    mutate.mockReset();
  });
  it.each(['create', 'update'] as const)(
    'includes identity fields in the %s mutation',
    async (action) => {
      const field = action === 'create' ? 'createTuyenDung' : 'updateTuyenDung';
      mutate.mockResolvedValue({ data: { [field]: { isResults: true, data: null } } });
      const form = {
        ...emptyRecruitment(),
        soCCCD: ' 001234567890 ',
        ngayCap: '2024-02-29',
        noiCap: ' 03001 ',
      };
      if (action === 'create') await recruitmentService.create(form);
      else await recruitmentService.update('42', form);
      expect(mutate.mock.calls[0][0].variables.input).toMatchObject({
        soCCCD: '001234567890',
        ngayCap: '2024-02-29T00:00:00+07:00',
        noiCap: '03001',
      });
    },
  );
  it('sends null for empty optional identity fields', () => {
    expect(recruitmentInput(emptyRecruitment())).toMatchObject({
      soCCCD: null,
      ngayCap: null,
      noiCap: null,
    });
  });
  it('loads identity fields for editing without losing leading zeroes', async () => {
    query.mockResolvedValue({
      data: {
        thongTinTuyenDung: {
          isResults: true,
          data: {
            ...emptyRecruitment(),
            id: 42,
            trangThai: 'TUYEN_DUNG',
            soCCCD: '001234567890',
            ngayCap: '2024-02-29T00:00:00+07:00',
            noiCap: '03001',
          },
        },
      },
    });
    expect(await recruitmentService.getDetail('42')).toMatchObject({
      soCCCD: '001234567890',
      ngayCap: '2024-02-29',
      noiCap: '03001',
    });
    const document = print(query.mock.calls[0][0].query);
    for (const field of ['soCCCD', 'ngayCap', 'noiCap']) expect(document).toContain(field);
  });
  it('loads issue places from MasterCode category 03 and stores keys', async () => {
    query.mockResolvedValue({
      data: {
        danhSachMasterCode: {
          isResults: true,
          data: [null, { maKey: '03001', tenGiaTri: 'Hà Nội' }],
        },
      },
    });
    expect(await recruitmentService.getIssuePlaces()).toEqual([
      { value: '03001', label: 'Hà Nội' },
    ]);
    expect(query).toHaveBeenCalledWith(expect.objectContaining({ variables: { phanLoai: '03' } }));
  });
  it('rejects invalid issue dates while allowing empty and leap-day dates', () => {
    expect(
      validateRecruitment({ ...emptyRecruitment(), ngayCap: '2025-02-29' }).ngayCap,
    ).toBeTruthy();
    expect(
      validateRecruitment({ ...emptyRecruitment(), ngayCap: '2024-02-29' }).ngayCap,
    ).toBeUndefined();
    expect(validateRecruitment(emptyRecruitment()).ngayCap).toBeUndefined();
  });
});

describe('create employee from recruitment', () => {
  const source = {
    tuyenDungId: 42,
    maNhanVien: '000042',
    ho: 'Nguyễn',
    tenDem: 'Văn',
    ten: 'An',
    hoTen: 'Nguyễn Văn An',
    gioiTinh: 'M',
    email: 'an@example.com',
    soDienThoai: '0901234567',
    soCCCD: '001234567890',
    ngayCap: '2024-02-29T00:00:00+07:00',
    noiCap: '03001',
    maBoPhan: 'IT',
    maChucVu: 'DEV',
    ngayTiepNhan: '2026-09-01T00:00:00+07:00',
    ngayBatDauLamViec: '2026-10-01T00:00:00+07:00',
    trangThai: '5',
  };
  beforeEach(() => {
    query.mockReset();
    mutate.mockReset();
  });
  it('loads fresh source before mapping the employee creation payload', async () => {
    query.mockResolvedValue({ data: { tuyenDungForNhanVien: { isResults: true, data: source } } });
    mutate.mockResolvedValue({
      data: { taoNhanVienTuTuyenDung: { isResults: true, message: 'OK' } },
    });
    await expect(recruitmentService.createEmployeeFromRecruitment('42')).resolves.toMatchObject({
      isResults: true,
    });
    expect(query).toHaveBeenCalledWith(
      expect.objectContaining({ variables: { id: 42 }, fetchPolicy: 'no-cache' }),
    );
    expect(query.mock.invocationCallOrder[0]).toBeLessThan(mutate.mock.invocationCallOrder[0]);
    expect(mutate.mock.calls[0][0].variables.input).toEqual({
      tuyenDungId: 42,
      thongTinNhanVien: {
        maNhanVien: '000042',
        ho: 'Nguyễn',
        tenDem: 'Văn',
        ten: 'An',
        gioiTinh: 'M',
        ngaySinh: null,
        noiSinh: null,
        email: source.email,
        soDienThoai: source.soDienThoai,
        cccd: '001234567890',
        ngayCap: source.ngayCap,
        noiCap: '03001',
        ngayTuyenDung: source.ngayBatDauLamViec,
      },
    });
  });
  it('does not create an employee when loading source fails', async () => {
    query.mockResolvedValue({
      data: { tuyenDungForNhanVien: { isResults: false, message: 'TUYENDUNG_NOT_READY' } },
    });
    await expect(recruitmentService.createEmployeeFromRecruitment('42')).rejects.toThrow(
      'TUYENDUNG_NOT_READY',
    );
    expect(mutate).not.toHaveBeenCalled();
  });
  it.each([
    { ...source, tuyenDungId: 43 },
    { ...source, maNhanVien: null },
  ])('rejects invalid source before mutation', async (data) => {
    query.mockResolvedValue({ data: { tuyenDungForNhanVien: { isResults: true, data } } });
    await expect(recruitmentService.createEmployeeFromRecruitment('42')).rejects.toThrow();
    expect(mutate).not.toHaveBeenCalled();
  });
  it('propagates employee creation failure without completing onboarding', async () => {
    query.mockResolvedValue({ data: { tuyenDungForNhanVien: { isResults: true, data: source } } });
    mutate.mockResolvedValue({
      data: { taoNhanVienTuTuyenDung: { isResults: false, message: 'EMPLOYEE_CREATE_FAILED' } },
    });
    await expect(recruitmentService.createEmployeeFromRecruitment('42')).rejects.toThrow(
      'EMPLOYEE_CREATE_FAILED',
    );
    expect(mutate).toHaveBeenCalledTimes(1);
  });
});
