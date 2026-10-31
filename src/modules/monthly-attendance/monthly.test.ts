import { afterEach, describe, expect, it, vi } from 'vitest';
import { print } from 'graphql';
import {
  calendarCells,
  dateKey,
  indexDays,
  numberText,
  statusOf,
  indexAttendance,
  matrixEmployees,
  cellMenuActions,
  monthDates,
  sumDailyAttendance,
} from './monthly.utils';
import type { CalculationContext, DayRow, InputField, TypeRef } from './monthly.types';
const api = vi.hoisted(() => ({
  query: vi.fn(),
  mutate: vi.fn(),
  can: vi.fn(() => true),
  periods: vi.fn(),
}));
vi.mock('@/services/graphql/apollo', () => ({
  apolloClient: { query: api.query, mutate: api.mutate },
}));
vi.mock('@/stores/permission.store', () => ({
  usePermissionStore: () => ({ can: api.can }),
}));
vi.mock('@/modules/attendance-periods/period.service', () => ({
  listPeriods: api.periods,
  exactPeriodId: (v: string | number) => String(v),
}));
vi.mock('@/services/api/privateApi', () => ({
  privateApi: (request: () => Promise<unknown>) => request(),
}));
vi.mock('@/services/auth/token.service', () => ({
  tokenService: { get: () => 'test-access-token' },
}));
import { ApiError } from '@/services/api/apiErrorHandler';
import {
  buildCalculationInput,
  exportMonthlyAttendance,
  getDailyAttendance,
  getMonthlyAttendance,
} from './monthly.service';
const filter = { thang: 10, nam: 2026, maBoPhan: null, maNhanVien: null };
afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});
describe('monthly attendance Excel export REST API', () => {
  function setup(response: Response) {
    vi.stubGlobal('window', { location: { origin: 'https://frontend.example.com' } });
    vi.stubEnv('VITE_API_URL', 'https://backend.example.com/graphql');
    const fetchMock = vi.fn().mockResolvedValue(response);
    vi.stubGlobal('fetch', fetchMock);
    return fetchMock;
  }
  it('downloads binary data from the backend with required filters and authentication', async () => {
    const fetchMock = setup(new Response(new Uint8Array([80, 75, 3, 4])));
    const result = await exportMonthlyAttendance(filter);
    const [url, options] = fetchMock.mock.calls[0];
    expect(String(url)).toBe(
      'https://backend.example.com/api/bang-cham-cong/export-excel?thang=10&nam=2026',
    );
    expect(options).toMatchObject({
      method: 'GET',
      credentials: 'include',
      headers: { Authorization: 'Bearer test-access-token' },
    });
    expect(result.filename).toBe('BangChamCong_2026_10.xlsx');
    expect(Array.from(new Uint8Array(await result.blob.arrayBuffer()))).toEqual([80, 75, 3, 4]);
  });
  it('encodes optional filters and prefers the UTF-8 filename supplied by the server', async () => {
    const filename = 'Bảng chấm công tháng 10.xlsx';
    const fetchMock = setup(
      new Response('excel', {
        headers: {
          'Content-Disposition': `attachment; filename="report.xlsx"; filename*=UTF-8''${encodeURIComponent(filename)}`,
        },
      }),
    );
    const result = await exportMonthlyAttendance({
      ...filter,
      maNhanVien: 'NV&01',
      maBoPhan: 'BP A',
    });
    const url = fetchMock.mock.calls[0][0] as URL;
    expect(url.searchParams.get('manhanvien')).toBe('NV&01');
    expect(url.searchParams.get('mabophan')).toBe('BP A');
    expect(result.filename).toBe(filename);
  });
  it('uses same-origin REST when the GraphQL URL is relative and handles malformed filename encoding', async () => {
    const fetchMock = setup(
      new Response('excel', {
        headers: {
          'Content-Disposition': 'attachment; filename="report.xlsx"; filename*=UTF-8\'\'%ZZ',
        },
      }),
    );
    vi.stubEnv('VITE_API_URL', '/graphql');
    const result = await exportMonthlyAttendance(filter);
    expect((fetchMock.mock.calls[0][0] as URL).origin).toBe('https://frontend.example.com');
    expect(result.filename).toBe('report.xlsx');
  });
  it.each([
    { ...filter, thang: 0 },
    { ...filter, thang: 13 },
    { ...filter, nam: NaN },
    { ...filter, nam: 0 },
  ])('rejects an invalid required month/year before sending the request: %j', async (invalid) => {
    const fetchMock = setup(new Response('excel'));
    await expect(exportMonthlyAttendance(invalid)).rejects.toThrow('Tháng hoặc năm không hợp lệ');
    expect(fetchMock).not.toHaveBeenCalled();
  });
  it('lets the existing private API wrapper refresh an unauthorized session', async () => {
    setup(new Response(null, { status: 401 }));
    await expect(exportMonthlyAttendance(filter)).rejects.toBeInstanceOf(ApiError);
  });
  it.each([400, 200])(
    'surfaces a JSON error instead of downloading it (HTTP %i)',
    async (status) => {
      setup(
        Response.json({ isResults: false, message: 'Không có dữ liệu xuất Excel.' }, { status }),
      );
      await expect(exportMonthlyAttendance(filter)).rejects.toThrow('Không có dữ liệu xuất Excel.');
    },
  );
  it('rejects empty files and reports HTTP failures without JSON', async () => {
    setup(new Response(null));
    await expect(exportMonthlyAttendance(filter)).rejects.toThrow('tệp Excel trống');
    setup(new Response('Bad Gateway', { status: 502 }));
    await expect(exportMonthlyAttendance(filter)).rejects.toThrow('HTTP 502');
  });
});
const row = (day = '2026-10-06', status = 'NORMAL'): DayRow => ({
  maNhanVien: 'NV001',
  ngayChamCong: day,
  thang: 10,
  nam: 2026,
  trangThaiCong: status,
  hienThiCa: 'D',
});
const scalar = (name = 'String', required = false): TypeRef =>
  required
    ? { kind: 'NON_NULL', name: null, ofType: { kind: 'SCALAR', name } }
    : { kind: 'SCALAR', name };
const field = (name: string, type = 'String', required = false): InputField => ({
  name,
  type: scalar(type, required),
  defaultValue: null,
});
const person: CalculationContext = {
  filter,
  employee: { maNhanVien: 'NV001' },
  day: row(),
  kyChamCongId: '12',
};
describe('calendar and daily attendance', () => {
  it('places October 1 2026 on Thursday and includes all 31 days', () => {
    const cells = calendarCells(2026, 10);
    expect(cells[3]).toBe('2026-10-01');
    expect(cells.filter(Boolean)).toHaveLength(31);
    expect(cells).toHaveLength(35);
  });
  it('handles leap February without timezone shifts', () => {
    expect(calendarCells(2024, 2).filter(Boolean)).toHaveLength(29);
    expect(dateKey('2026-10-06T00:00:00+07:00')).toBe('2026-10-06');
    expect(() => dateKey('2026-02-30')).toThrow();
  });
  it('distinguishes missing data from unexpected attendance status', () => {
    expect(statusOf().abnormal).toBe(false);
    expect(statusOf(row('2026-10-06', 'NEW_STATUS')).abnormal).toBe(true);
    expect(statusOf(row('2026-10-06', 'LEAVE_VACATION')).label).toBe('Nghỉ lễ');
  });
  it('rejects duplicate days and another employee instead of overwriting', () => {
    expect(() => indexDays([row(), row()])).toThrow('nhiều bản ghi');
    expect(() => indexDays([row()], 'OTHER')).toThrow('nhân viên khác');
  });
  it('keeps zero and missing totals different and only converts time units', () => {
    expect(numberText(0)).toBe('0');
    expect(numberText(null)).toBe('—');
    expect(numberText(90, true)).toBe('1,5');
  });
});
describe('calculation scope', () => {
  it('maps only schema fields and uses selected employee, date and period', () => {
    const fields = [
      field('kyChamCongId', 'Long', true),
      field('maNhanVien', 'String', true),
      field('ngayChamCong', 'DateTime', true),
      field('previewOnly', 'Boolean'),
      field('debug', 'Boolean'),
    ];
    expect(buildCalculationInput('person', person, fields)).toEqual({
      kyChamCongId: 12,
      maNhanVien: 'NV001',
      ngayChamCong: '2026-10-06T00:00:00+07:00',
      previewOnly: false,
      debug: false,
    });
  });
  it('preserves LocalDate date-only inputs', () => {
    expect(
      buildCalculationInput('person', person, [
        field('thang', 'Int'),
        field('nam', 'Int'),
        field('maNhanVien'),
        field('ngayLamViec', 'LocalDate'),
      ]).ngayLamViec,
    ).toBe('2026-10-06');
  });
  it('refuses silently broadening a filtered batch calculation', () => {
    expect(() =>
      buildCalculationInput(
        'batch',
        { filter: { ...filter, maNhanVien: 'NV001' }, kyChamCongId: 12 },
        [field('kyChamCongId', 'Long')],
      ),
    ).toThrow('không hỗ trợ lọc nhân viên');
    expect(() =>
      buildCalculationInput('month', { filter: { ...filter, maBoPhan: 'HC' } }, [
        field('thang', 'Int'),
        field('nam', 'Int'),
      ]),
    ).toThrow('không hỗ trợ bộ phận');
  });
  it('rejects unknown required fields and unsafe numeric period IDs', () => {
    expect(() =>
      buildCalculationInput('person', person, [
        field('kyChamCongId', 'Long'),
        field('maNhanVien'),
        field('ngay'),
        field('unknown', 'String', true),
      ]),
    ).toThrow('unknown');
    expect(() =>
      buildCalculationInput('person', { ...person, kyChamCongId: '9223372036854775807' }, [
        field('kyChamCongId', 'Long'),
        field('maNhanVien'),
        field('ngay'),
      ]),
    ).toThrow('số an toàn');
  });
  it('sends explicit null for optional filters so server defaults cannot change scope', () => {
    expect(
      buildCalculationInput('month', { filter }, [
        field('thang', 'Int'),
        field('nam', 'Int'),
        { ...field('maBoPhan'), defaultValue: '"HC"' },
      ]),
    ).toEqual({ thang: 10, nam: 2026, maBoPhan: null });
  });
});
describe('API results', () => {
  it('requests all six daily summary fields and preserves decimal values', async () => {
    const dailyRow = {
      ...row(),
      ngayNghiPhep: 0.5,
      ngayNghiHuongLuong: 0.25,
      nghiLe: 1,
      ngayNghiKhongHuongLuong: 0,
      otNgayLe: 1.5,
      otNgayThuong: 2.75,
    };
    api.query.mockResolvedValueOnce({
      data: { bangTongHopNgay: { isResults: true, data: [dailyRow] } },
    });
    await expect(getDailyAttendance(filter)).resolves.toEqual([dailyRow]);
    const query = print(api.query.mock.lastCall![0].query);
    for (const field of [
      'ngayNghiPhep',
      'ngayNghiHuongLuong',
      'nghiLe',
      'ngayNghiKhongHuongLuong',
      'otNgayLe',
      'otNgayThuong',
    ])
      expect(query).toContain(field);
  });
  it('does not treat isResults false as success', async () => {
    api.query.mockResolvedValueOnce({
      data: {
        bangCongThang: { isResults: false, message: 'Lỗi kỳ', data: [] },
      },
    });
    await expect(getMonthlyAttendance(filter)).rejects.toThrow('Lỗi kỳ');
  });
  it('escapes employee filters and rejects cross-employee daily payloads', async () => {
    api.query.mockResolvedValueOnce({
      data: { bangTongHopNgay: { isResults: true, data: [row()] } },
    });
    await expect(getDailyAttendance({ ...filter, maNhanVien: 'OTHER"CODE' })).rejects.toThrow(
      'nhân viên khác',
    );
  });
});

describe('employee by date spreadsheet', () => {
  it('sums all six decimals separately per employee within the displayed month', () => {
    const values = {
      ngayNghiPhep: 0.5,
      ngayNghiHuongLuong: 0.25,
      nghiLe: 1,
      ngayNghiKhongHuongLuong: 0.75,
      otNgayLe: 1.5,
      otNgayThuong: 2.75,
    };
    const totals = sumDailyAttendance(
      [
        { ...row(), ...values },
        { ...row('2026-10-07'), ...values },
        { ...row(), ...values, maNhanVien: 'NV002' },
        { ...row('2026-09-30'), ...values },
        { ...row('2026-11-01'), ...values },
      ],
      filter,
    );
    expect(totals.get('NV001')).toEqual({
      ngayNghiPhep: 1,
      ngayNghiHuongLuong: 0.5,
      nghiLe: 2,
      ngayNghiKhongHuongLuong: 1.5,
      otNgayLe: 3,
      otNgayThuong: 5.5,
    });
    expect(totals.get('NV002')).toEqual(values);
  });
  it('treats missing daily values as zero without propagating invalid numbers', () => {
    const totals = sumDailyAttendance(
      [row(), { ...row('2026-10-07'), ngayNghiPhep: null, otNgayLe: NaN, otNgayThuong: Infinity }],
      filter,
    );
    expect(totals.get('NV001')).toEqual({
      ngayNghiPhep: 0,
      ngayNghiHuongLuong: 0,
      nghiLe: 0,
      ngayNghiKhongHuongLuong: 0,
      otNgayLe: 0,
      otNgayThuong: 0,
    });
    expect(sumDailyAttendance([], filter).size).toBe(0);
  });
  it('allows different employees on the same date and rejects duplicate employee/day', () => {
    const a = row();
    const b = { ...row(), maNhanVien: 'NV002' };
    expect(indexAttendance([a, b]).size).toBe(2);
    expect(() => indexAttendance([a, a])).toThrow('nhiều bản ghi');
  });
  it('includes employees without attendance and filters by department', () => {
    const catalog = [
      { maNhanVien: 'NV001', hoTen: 'An', maBoPhan: 'HC' },
      { maNhanVien: 'NV002', hoTen: 'Bình', maBoPhan: 'DD' },
    ];
    expect(matrixEmployees(catalog, [], filter)).toHaveLength(2);
    expect(
      matrixEmployees(catalog, [], { ...filter, maBoPhan: 'DD' }).map((e) => e.maNhanVien),
    ).toEqual(['NV002']);
  });
  it('hides unusable menu actions rather than rendering placeholders', () => {
    expect(cellMenuActions(row('2026-10-06', 'ATTENDANCE_ABNORMAL'), true)).toEqual([
      'recalculate',
    ]);
    expect(cellMenuActions(row(), true)).toEqual([]);
    expect(cellMenuActions(row('2026-10-06', 'CHECK_YOUR_LOG_WORK'), false)).toEqual([]);
    expect(cellMenuActions(undefined, true)).toEqual([]);
  });
  it('loads all employees with null employee filter', async () => {
    api.query.mockResolvedValueOnce({
      data: {
        bangTongHopNgay: { isResults: true, data: [row(), { ...row(), maNhanVien: 'NV002' }] },
      },
    });
    await expect(getDailyAttendance(filter)).resolves.toHaveLength(2);
  });
});

it('generates only the selected month and uses its actual day count', () => {
  for (const [year, month, count] of [
    [2025, 2, 28],
    [2024, 2, 29],
    [2026, 4, 30],
    [2026, 10, 31],
  ]) {
    const dates = monthDates(year, month);
    expect(dates).toHaveLength(count);
    expect(dates[0]).toBe(year + '-' + String(month).padStart(2, '0') + '-01');
    expect(dates.at(-1)).toBe(year + '-' + String(month).padStart(2, '0') + '-' + count);
    expect(
      dates.every((date) => date.startsWith(year + '-' + String(month).padStart(2, '0') + '-')),
    ).toBe(true);
  }
});
