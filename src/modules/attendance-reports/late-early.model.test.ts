import { expect, it } from 'vitest';
import { lateEarlyRows, lateEarlyColumns } from './late-early.model';
import type { LateEarlyItem } from './late-early.service';
const item: LateEarlyItem = {
  thang: 10,
  nam: 2026,
  maNhanVien: '000001',
  hoVaTen: 'Nguyễn An',
  ngaySinh: '1990-01-02',
  gioiTinh: 'Nam',
  maBoPhan: '01',
  tenBoPhan: 'Khoa Nội',
  maCa: 'N',
  tenCa: 'Ca đêm',
  gioBatDau: 'PT22H',
  gioKetThuc: '06:00:00',
  tinhCaDem: true,
  ngayChamCong: '2026-10-03',
  gioVao: '22:12:00',
  gioRa: '05:58:00',
  diTre: 12,
  veSom: 2,
  tinhTrang: 'Mã mới',
};
it('preserves employee codes, raw status codes and exact server minutes while displaying local dates and clocks', () => {
  const rows = lateEarlyRows([item], 2, 20);
  expect(rows[0]).toMatchObject({
    code: '000001',
    departmentCode: '01',
    name: 'Nguyễn An',
    date: '03/10/2026',
    birthDate: '02/01/1990',
    scheduledIn: '22:00',
    scheduledOut: '06:00',
    checkIn: '22:12',
    checkOut: '05:58',
    late: 12,
    early: 2,
    night: 'Có',
    status: 'Chưa xác định',
    statusCode: 'Mã mới',
  });
  expect(lateEarlyColumns.filter((column) => column.total).map((column) => column.key)).toEqual([
    'late',
    'early',
  ]);
});
it('handles absent clock, shift and personal data without manufacturing values', () => {
  const rows = lateEarlyRows(
    [
      {
        ...item,
        hoVaTen: '',
        ngaySinh: null,
        gioiTinh: '',
        maCa: null,
        tenCa: null,
        gioBatDau: null,
        gioKetThuc: null,
        tinhCaDem: null,
        ngayChamCong: null,
        gioVao: '',
        gioRa: '',
        tinhTrang: null,
      },
    ],
    1,
    20,
  );
  expect(rows[0]).toMatchObject({
    name: '000001',
    birthDate: '—',
    date: '—',
    scheduledIn: '—',
    checkOut: '—',
    night: '—',
    status: 'Chưa có thông tin',
  });
});
