import { beforeEach, expect, it, vi } from 'vitest';
const { query } = vi.hoisted(() => ({ query: vi.fn() }));
vi.mock('@/services/graphql/apollo', () => ({ apolloClient: { query } }));
import { getScheduleExchangeAssignments } from './schedule-exchange-assignment.service';
import { LOAD_DANH_SACH_NGAY } from './schedule-exchange-assignment.service';

beforeEach(() => vi.resetAllMocks());

it('sends plain dates to loadDanhSachNgay when reloading exchange candidates', async () => {
  query.mockResolvedValueOnce({
    data: {
      loadDanhSachNgay: {
        isResults: true,
        data: [
          null,
          {
            id: '12',
            maNhanVien: 'NV01',
            hoTen: 'Employee',
            ngayLamViec: '2026-10-26',
            maCa: 'M',
            tenCa: 'Morning',
            thoiGianBatDau: '2026-10-26T08:00:00',
            thoiGianKetThuc: '2026-10-26T16:00:00',
            nguonPhanCong: 'S',
            maLoaiNghiPhep: null,
          },
        ],
      },
    },
  });
  const result = await getScheduleExchangeAssignments('2026-10-26', 'BP01');
  expect(query).toHaveBeenCalledWith({
    query: LOAD_DANH_SACH_NGAY,
    variables: { selectedNgay: '2026-10-26', maBoPhan: 'BP01' },
    fetchPolicy: 'no-cache',
    errorPolicy: 'none',
  });
  expect(result.assignments[0]).toMatchObject({
    id: '12',
    employeeId: 'NV01',
    date: '2026-10-26',
    startTime: '08:00',
    endTime: '16:00',
    assignmentSource: 'S',
    leaveTypeId: null,
  });
});

it('accepts an empty list and defaults the department to null', async () => {
  query.mockResolvedValueOnce({ data: { loadDanhSachNgay: { isResults: true, data: [] } } });
  expect(await getScheduleExchangeAssignments('2026-10-26')).toEqual({
    assignments: [],
    shifts: [],
  });
  expect(query.mock.calls[0][0].variables).toEqual({
    selectedNgay: '2026-10-26',
    maBoPhan: null,
  });
});

it('surfaces API failures', async () => {
  query.mockResolvedValueOnce({
    data: { loadDanhSachNgay: { isResults: false, message: 'Load failed', data: null } },
  });
  await expect(getScheduleExchangeAssignments('2026-10-26')).rejects.toThrow('Load failed');
});

it('declares selectedNgay as a required String and forwards it to loadDanhSachNgay', () => {
  const document = LOAD_DANH_SACH_NGAY.loc!.source.body;
  expect(document).toContain('$selectedNgay: String!');
  expect(document).toContain('loadDanhSachNgay(selectedNgay: $selectedNgay, maBoPhan: $maBoPhan)');
  expect(document).not.toMatch(/tuNgay|denNgay|DateTime/);
});
