import { describe, expect, it, vi } from 'vitest';
const { query, mutate } = vi.hoisted(() => ({ query: vi.fn(), mutate: vi.fn() }));
vi.mock('@/services/graphql/apollo', () => ({ apolloClient: { query, mutate } }));
import {
  createScheduleAssignment,
  getEmployeesMissingSchedule,
  getScheduleAssignments,
  NHAN_VIEN_CHUA_XEP_CA,
  PHAN_CONG_CA,
} from './schedule-assignment.service';
describe('employees missing schedule API', () => {
  it('queries employees and normalizes their scheduled dates', async () => {
    query.mockResolvedValueOnce({
      data: {
        nhanVienChuaXepCa: {
          isResults: true,
          data: [
            null,
            {
              maNhanVien: 'NV01',
              hoTen: 'Nguyen Van A',
              maBoPhan: 'BP01',
              tenBoPhan: 'Khoa A',
              maChucVu: 'CV01',
              tenChucVu: 'Bac si',
              danhSachNgayXepCa: ['2026-10-06T00:00:00Z', null, 'invalid'],
            },
          ],
        },
      },
    });
    expect(await getEmployeesMissingSchedule('2026-10-06', '2026-10-12')).toEqual([
      {
        maNhanVien: 'NV01',
        hoTen: 'Nguyen Van A',
        maBoPhan: 'BP01',
        tenBoPhan: 'Khoa A',
        maChucVu: 'CV01',
        tenChucVu: 'Bac si',
        danhSachNgayXepCa: ['2026-10-06'],
      },
    ]);
    expect(query).toHaveBeenLastCalledWith({
      query: NHAN_VIEN_CHUA_XEP_CA,
      variables: {
        tuNgay: '2026-10-06T00:00:00+07:00',
        denNgay: '2026-10-12T23:59:59.999+07:00',
      },
      fetchPolicy: 'no-cache',
      errorPolicy: 'none',
    });
  });

  it('surfaces API failures', async () => {
    query.mockResolvedValueOnce({
      data: { nhanVienChuaXepCa: { isResults: false, message: 'Lỗi tải nhân viên', data: null } },
    });
    await expect(getEmployeesMissingSchedule('2026-10-06', '2026-10-12')).rejects.toThrow(
      'Lỗi tải nhân viên',
    );
  });
});

describe('assignment calendar API', () => {
  it('maps employee, calendar date and shift symbol independently of shift ID', async () => {
    query.mockResolvedValueOnce({
      data: {
        phanCongCa: {
          isResults: true,
          data: [
            null,
            {
              id: 12,
              maNhanVien: 'NV01',
              ngayLamViec: '2026-10-06T00:00:00Z',
              maCa: 'CA003',
              tenCa: 'Ca đêm',
              kyHieuCa: 'N',
              thoiGianBatDau: '2026-10-06T22:00:00+07:00',
              thoiGianKetThuc: '2026-10-07T06:00:00+07:00',
              quaNgay: true,
              ghiChu: 'Qua đêm',
              trangThai: '1',
              nguonPhanCong: 'MANUAL',
            },
          ],
        },
      },
    });
    const result = await getScheduleAssignments('2026-10-05', '2026-10-11');
    expect(query).toHaveBeenLastCalledWith({
      query: PHAN_CONG_CA,
      variables: {
        tuNgay: '2026-10-05T00:00:00+07:00',
        denNgay: '2026-10-11T23:59:59.999+07:00',
        maBoPhan: null,
      },
      fetchPolicy: 'no-cache',
      errorPolicy: 'none',
    });
    expect(result.assignments[0]).toMatchObject({
      id: '12',
      employeeId: 'NV01',
      date: '2026-10-06',
      shiftId: 'CA003',
      shiftSymbol: 'N',
      startTime: '22:00',
      endTime: '06:00',
      crossDay: true,
      endDate: '2026-10-07',
      apiStatus: '1',
    });
    expect(result.shifts[0]).toMatchObject({ id: 'CA003', code: 'N', name: 'Ca đêm' });
  });
  it('accepts an empty calendar without manufacturing assignments', async () => {
    query.mockResolvedValueOnce({ data: { phanCongCa: { isResults: true, data: [] } } });
    expect(await getScheduleAssignments('2026-10-05', '2026-10-11')).toEqual({
      assignments: [],
      shifts: [],
    });
  });
  it('surfaces API failures instead of substituting browser schedules', async () => {
    query.mockResolvedValueOnce({
      data: { phanCongCa: { isResults: false, message: 'Lỗi phân công', data: null } },
    });
    await expect(getScheduleAssignments('2026-10-05', '2026-10-11')).rejects.toThrow(
      'Lỗi phân công',
    );
  });
});

it('restores Saturday from UTC API responses for assignments and scheduled dates', async () => {
  query.mockResolvedValueOnce({
    data: {
      phanCongCa: {
        isResults: true,
        data: [
          {
            id: 99,
            toanCa: false,
            maLoaiNghiPhep: 'NP',
            maNhanVien: 'NV01',
            ngayLamViec: '2026-10-09T17:00:00Z',
            thoiGianBatDau: '2026-10-10T22:00:00Z',
            thoiGianKetThuc: '2026-10-11T06:00:00Z',
            maCa: 'N',
            tenCa: 'Night',
            quaNgay: true,
          },
        ],
      },
    },
  });
  const result = await getScheduleAssignments('2026-10-05', '2026-10-11');
  expect(result.assignments[0]).toMatchObject({
    date: '2026-10-10',
    startDate: '2026-10-10',
    endDate: '2026-10-11',
  });
  query.mockResolvedValueOnce({
    data: {
      nhanVienChuaXepCa: {
        isResults: true,
        data: [{ maNhanVien: 'NV01', danhSachNgayXepCa: ['2026-10-09T17:00:00Z'] }],
      },
    },
  });
  expect(
    (await getEmployeesMissingSchedule('2026-10-05', '2026-10-11'))[0].danhSachNgayXepCa,
  ).toEqual(['2026-10-10']);
});

it('requests only the replacement DateTime fields for assignment intervals', () => {
  const document = PHAN_CONG_CA.loc!.source.body;
  expect(document).toContain('thoiGianBatDau');
  expect(document).toContain('thoiGianKetThuc');
  expect(document).not.toMatch(/\b(ngayBatDau|ngayKetThuc|gioBatDau|gioKetThuc)\b/);
});

it('preserves backend wall-clock hours and ignores a blank padded leave code', async () => {
  query.mockResolvedValueOnce({
    data: {
      phanCongCa: {
        isResults: true,
        data: [
          {
            id: '123',
            maNhanVien: 'NV01',
            ngayLamViec: '2026-10-13T00:00:00Z',
            maCa: 'N',
            tenCa: 'Night',
            kyHieuCa: 'N',
            thoiGianBatDau: '2026-10-13T22:00:00Z',
            thoiGianKetThuc: '2026-10-14T06:00:00Z',
            toanCa: true,
            maLoaiNghiPhep: '     ',
            quaNgay: true,
          },
        ],
      },
    },
  });
  const result = await getScheduleAssignments('2026-10-13', '2026-10-14');
  expect(result.assignments[0]).toMatchObject({
    startDate: '2026-10-13',
    endDate: '2026-10-14',
    startTime: '22:00',
    endTime: '06:00',
    fullTime: true,
    leaveTypeId: null,
    crossDay: true,
  });
});

describe('create assignment API', () => {
  const input = {
    maBoPhan: 'BP1',
    maChucVu: 'CV1',
    maNhanVien: 'NV1',
    ngayLamViec: '2099-10-13T00:00:00+07:00',
    maCa: 'N',
    gioBatDau: 'PT22H0M',
    gioKetThuc: 'PT6H0M',
    ghiChu: 'Ghi chú "ca đêm"',
  };
  it('sends all create fields safely and returns the created assignment', async () => {
    const result = { isResults: true, message: 'Đã tạo', data: { id: '123' } };
    mutate.mockResolvedValueOnce({ data: { createPhanCongCa: result } });
    expect(await createScheduleAssignment(input)).toEqual(result);
    const { print, parse, Kind } = await import('graphql');
    const document = parse(print(mutate.mock.lastCall![0].mutation));
    const operation = document.definitions[0];
    if (operation.kind !== Kind.OPERATION_DEFINITION) throw new Error('Expected mutation');
    const field = operation.selectionSet.selections[0];
    if (field.kind !== Kind.FIELD) throw new Error('Expected field');
    expect(field.name.value).toBe('createPhanCongCa');
    const value = field.arguments![0].value;
    if (value.kind !== Kind.OBJECT) throw new Error('Expected input');
    expect(
      Object.fromEntries(
        value.fields.map((f) => [
          f.name.value,
          f.value.kind === Kind.STRING ? f.value.value : null,
        ]),
      ),
    ).toEqual(input);
    expect(print(document)).toContain('maNhanVienThaThe');
    expect(print(document)).toContain('isLocked');
  });
  it('surfaces backend and missing response failures', async () => {
    mutate.mockResolvedValueOnce({
      data: { createPhanCongCa: { isResults: false, message: 'Đã có ca' } },
    });
    await expect(createScheduleAssignment(input)).rejects.toThrow('Đã có ca');
    mutate.mockResolvedValueOnce({ data: null });
    await expect(createScheduleAssignment(input)).rejects.toThrow('Không thể tạo phân công ca.');
  });
});
