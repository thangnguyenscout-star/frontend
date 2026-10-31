import { expect, it } from 'vitest';
import {
  parseTextFixture,
  previewCounts,
  demoKey,
  formatLocal,
  validateFile,
  resolveCodeLabel,
  MOCK_EVENT_LABELS,
  parseAttendanceDatRows,
} from './sync.utils';
const parse = (text: string) => parseTextFixture(text, 'dat', false, 1, new Set<string>());
it('parses the exact DAT fixture without timezone conversion and categorizes each row once', () => {
  const rows = parse(
    [
      '1\t1007\t0\t2026-10-01 07:54:00\t0',
      '1\t1007\t0\t2026-10-01 07:54:00\t0',
      '1\t\t0\tbad\t0',
      '1\t9999\t0\t2026-10-01 08:00:00\t0',
      '1\t1008\t0\t2026-02-30 08:00:00\t0',
    ].join('\n'),
  );
  expect(rows.map((row) => row.status)).toEqual([
    'valid',
    'duplicate',
    'error',
    'unmapped',
    'error',
  ]);
  expect(previewCounts(rows)).toEqual({ valid: 1, duplicate: 1, error: 2, unmapped: 1 });
  expect(rows[0].time).toBe('2026-10-01T07:54:00');
  expect(formatLocal(rows[0].time)).toBe('01/10/2026 07:54:00');
});
it('recognizes duplicate log keys while allowing different raw status or devices', () => {
  const existing = new Set([demoKey(1, '1007', '2026-10-01T07:54:00', '0')]);
  expect(
    parseTextFixture('1\t1007\t0\t2026-10-01 07:54:00\t0', 'dat', false, 1, existing)[0].status,
  ).toBe('duplicate');
  expect(
    parseTextFixture('1\t1007\t1\t2026-10-01 07:54:00\t0', 'dat', false, 1, existing)[0].status,
  ).toBe('valid');
  expect(
    parseTextFixture('1\t1007\t0\t2026-10-01 07:54:00\t0', 'dat', false, 2, existing)[0].status,
  ).toBe('valid');
});
it('supports CSV quoting and optional headers while preserving original line numbers', () => {
  const rows = parseTextFixture(
    'machine,user,status,time,work\n1,"1007",0,"2026-10-01 07:54:00",0',
    'csv',
    true,
    null,
    new Set(),
  );
  expect(rows[0]).toMatchObject({ line: 2, status: 'valid', user: '1007' });
  expect(parse('1\t1007\t0\twrong\t0')[0].errorCode).toBe('INVALID_DATE');
});
it('rejects binary/empty unsupported fixtures and marks invalid columns explicitly', () => {
  expect(() => parse('')).toThrow();
  expect(() => parse('binary\0payload')).toThrow('Định dạng chưa hỗ trợ');
  expect(parse('random data')[0].errorCode).toBe('INVALID_FORMAT');
  expect(parse('1\t1007\t0\t2026-10-01 24:00:00\t0')[0].status).toBe('error');
});
it('validates file extensions and 10 MB limit', () => {
  for (const name of ['a.dat', 'a.txt', 'a.csv', 'a.xlsx', 'a.xls'])
    expect(() => validateFile({ name, size: 1024 })).not.toThrow();
  for (const file of [
    { name: 'a.exe', size: 1 },
    { name: 'a.dat', size: 0 },
    { name: 'a.dat', size: 10 * 1024 * 1024 + 1 },
  ])
    expect(() => validateFile(file)).toThrow();
});
it('preserves unknown codes and nullable timestamps without inventing meanings', () => {
  expect(resolveCodeLabel('Z', MOCK_EVENT_LABELS)).toBe('Chưa xác định (Z)');
  expect(formatLocal(null)).toBe('—');
  expect(formatLocal('2026-10-20T00:30:00')).toBe('20/10/2026 00:30:00');
});

it('maps the confirmed DAT columns to the AttendanceFrontendRow request shape', () => {
  expect(parseAttendanceDatRows(
    'MaThietBi\tMaNguoiDungMay\tMaNhanVien\tThoiGianQuet\tLoaiSuKien\r\n 7 \t 000123 \t E0001 \t 2026-10-01 08:00:00 \t I ',
  )).toEqual([{
    line: 2,
    machineNo: 7,
    user: '000123',
    time: '2026-10-01 08:00:00',
    eventType: 'I',
    rawStatus: 'E0001',
    raw: ' 7 \t 000123 \t E0001 \t 2026-10-01 08:00:00 \t I ',
    status: 'VALID',
    message: null,
  }]);
});

it('rejects unknown DAT headers and preserves physical source line numbers', () => {
  expect(() => parseAttendanceDatRows('wrong\theader')).toThrow('Header DAT');
  const [row] = parseAttendanceDatRows(
    'MaThietBi\tMaNguoiDungMay\tMaNhanVien\tThoiGianQuet\tLoaiSuKien\n\n7\t1\tE1\t2026-10-01 08:00:00\tI',
  );
  expect(row.line).toBe(3);
});





it('marks duplicate and malformed rows during frontend processing', () => {
  const header = 'MaThietBi\tMaNguoiDungMay\tMaNhanVien\tThoiGianQuet\tLoaiSuKien';
  const rows = parseAttendanceDatRows(
    `${header}\n7\t000123\tE0001\t2026-10-01 08:00:00\tI\n7\t000123\tE9999\t2026-10-01 08:00:00\tI\n7\t\tE1\tbad\tI`,
  );
  expect(rows.map(row => row.status)).toEqual(['VALID', 'DUPLICATE', 'INVALID']);
  expect(rows[1].message).toContain('Trùng');
  expect(rows[2].message).toContain('Thiếu MaNguoiDungMay');
});
