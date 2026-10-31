import { beforeEach, expect, it, vi } from 'vitest';
import { print } from 'graphql';
const { query } = vi.hoisted(() => ({ query: vi.fn() }));
vi.mock('@/services/graphql/apollo', () => ({ apolloClient: { query } }));
import { getMonthlyScheduleReport, MONTHLY_SCHEDULE_REPORT } from './schedule-report.service';
beforeEach(() => query.mockReset());
it('queries the selected month and sorts API day columns without mutating the response', async () => {
  const data = {
    nam: 2026,
    thang: 10,
    soNgayTrongThang: 31,
    cotNgay: [
      { ngayTrongThang: 2, ngay: '2026-10-02' },
      { ngayTrongThang: 1, ngay: '2026-10-01' },
    ],
    nhanVien: [
      {
        maNhanVien: '000001',
        hoVaTen: 'Name',
        soNgayCongThucTe: 23.5,
        soNgayCongTieuChuan: 26,
        soNgayPhep: 1,
        soNgayCongHuongLuong: 24.5,
        cacNgay: [{ ngayTrongThang: 1, giaTri: 'AL' }],
      },
    ],
  };
  query.mockResolvedValueOnce({ data: { baoCaoCaLamViecThang: { isResults: true, data } } });
  const result = await getMonthlyScheduleReport(2026, 10);
  expect(query).toHaveBeenCalledWith({
    query: MONTHLY_SCHEDULE_REPORT,
    variables: { nam: 2026, thang: 10 },
    fetchPolicy: 'no-cache',
    errorPolicy: 'none',
  });
  expect(result.cotNgay.map((day) => day.ngayTrongThang)).toEqual([1, 2]);
  expect(data.cotNgay[0].ngayTrongThang).toBe(2);
  expect(result.nhanVien[0]).toMatchObject({
    maNhanVien: '000001',
    soNgayCongThucTe: 23.5,
    soNgayCongTieuChuan: 26,
    soNgayPhep: 1,
    soNgayCongHuongLuong: 24.5,
  });
});
it('accepts empty monthly data and historical reports', async () => {
  query.mockResolvedValueOnce({
    data: {
      baoCaoCaLamViecThang: {
        isResults: true,
        data: { nam: 2020, thang: 2, soNgayTrongThang: 29, cotNgay: [], nhanVien: [] },
      },
    },
  });
  expect((await getMonthlyScheduleReport(2020, 2)).nhanVien).toEqual([]);
});
it.each([
  [1999, 1],
  [2101, 1],
  [2026, 0],
  [2026, 13],
  [2026, 1.5],
])('rejects invalid period %s/%s', async (year, month) => {
  await expect(getMonthlyScheduleReport(year, month)).rejects.toThrow();
  expect(query).not.toHaveBeenCalled();
});
it('reports business and transport errors without substituting local data', async () => {
  query.mockResolvedValueOnce({
    data: { baoCaoCaLamViecThang: { isResults: false, message: 'Rejected', data: null } },
  });
  await expect(getMonthlyScheduleReport(2026, 10)).rejects.toThrow('Rejected');
  query.mockRejectedValueOnce(new Error('Offline'));
  await expect(getMonthlyScheduleReport(2026, 10)).rejects.toThrow('Offline');
});

it('requests the updated workday fields without removed legacy fields', () => {
  const document = print(MONTHLY_SCHEDULE_REPORT);
  const employeeFields = document
    .match(/nhanVien\s*\{([\s\S]*?)cacNgay/)![1]
    .trim()
    .split(/\s+/);
  expect(employeeFields).toEqual(
    expect.arrayContaining([
      'soNgayCongThucTe',
      'soNgayCongTieuChuan',
      'soNgayPhep',
      'soNgayCongHuongLuong',
    ]),
  );
  expect(employeeFields).not.toContain('cong');
  expect(employeeFields).not.toContain('congHuongLuong');
});
