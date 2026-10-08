import { describe, expect, it, vi } from 'vitest';
const { query } = vi.hoisted(() => ({ query: vi.fn() }));
vi.mock('@/services/graphql/apollo', () => ({ apolloClient: { query } }));
import {
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
              gioBatDau: '22:00:00',
              gioKetThuc: '06:00:00',
              quaNgay: true,
              ghiChu: 'Qua đêm',
              trangThai: '1',
              ngayBatDau: '2026-10-06',
              ngayKetThuc: '2026-10-07',
              nguonPhanCong: 'MANUAL',
            },
          ],
        },
      },
    });
    const result = await getScheduleAssignments('2026-10-05', '2026-10-11');
    expect(query).toHaveBeenLastCalledWith({
      query: PHAN_CONG_CA,
      variables: { tuNgay: '2026-10-05T00:00:00+07:00', denNgay: '2026-10-11T23:59:59.999+07:00' },
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
