import type { RawAttendanceLog, MockBatch, MockSyncError } from './sync.types';
export function createSyncFixtures() {
  const batches: MockBatch[] = Array.from({ length: 6 }, (_, i) => ({
    id: i + 1,
    maThietBi: (i % 3) + 1,
    phuongThuc: (['DEVICE', 'DAT', 'CSV', 'EXCEL', 'DEVICE', 'DAT'] as const)[i],
    batDau: '2026-10-' + String(i + 14).padStart(2, '0') + 'T08:00:00',
    ketThuc: i === 5 ? null : '2026-10-' + String(i + 14).padStart(2, '0') + 'T08:02:00',
    tongBanGhi: 10,
    soMoi: i === 2 ? 0 : i === 5 ? 0 : 8,
    soTrung: i === 2 || i === 5 ? 0 : 1,
    soLoi: i === 2 ? 10 : i === 5 ? 0 : 1,
    trangThai: (['SUCCESS', 'PARTIAL', 'FAILED', 'SUCCESS', 'PARTIAL', 'RUNNING'] as const)[i],
    nguoiThucHien: 'HR_DEMO',
    ...(i % 2 ? { tenFile: 'fixture-demo-' + i + '.dat' } : {}),
  }));
  const rawStatuses: Record<number, string> = {};
  const logs: RawAttendanceLog[] = Array.from({ length: 48 }, (_, i) => {
    rawStatuses[i + 1] = i % 2 ? '1' : '0';
    return {
      id: i + 1,
      thoiGianQuet:
        '2026-10-' +
        String((i % 20) + 1).padStart(2, '0') +
        'T' +
        (i % 11 === 0 ? '00:30:00' : i % 2 ? '17:02:00' : '07:54:00'),
      maThietBi: i % 13 === 0 ? null : (i % 3) + 1,
      maNguoiDungMay: String(1007 + (i % 7)) + '  ',
      maNhanVien: i % 7 >= 5 ? null : 'DE' + String((i % 7) + 1).padStart(4, '0'),
      nguon: i === 9 ? 'X' : i % 10 === 0 ? 'M' : 'D',
      loaiSuKien: i === 9 ? 'Z' : i % 2 ? 'O' : 'I',
      maSuKienNguon: 'EV' + String(i % 5).padStart(3, '0'),
      maYeuCauBoSung: i === 3 ? 'BS001' : null,
      lyDo: i === 3 ? 'Lý do bổ sung giả lập để kiểm tra giao diện.' : null,
      createdBy: i % 7 === 0 ? null : 'HR_DEMO',
      createdAt: '2026-10-20T08:10:00',
      dotDongBoId: i % 13 === 0 ? null : (i % 6) + 1,
    };
  });
  logs.push({ ...logs[1], id: 49 });
  rawStatuses[49] = rawStatuses[2];
  const errors: MockSyncError[] = Array.from({ length: 8 }, (_, i) => ({
    id: i + 1,
    dotDongBoId: (i % 6) + 1,
    soDong: i % 4 === 0 ? null : i + 2,
    maNguoiDungMay: i === 1 ? null : String(1007 + i),
    duLieuGoc: 'DEMO ' + String(1007 + i) + '\t2026-10-19 07:54:00\t0\t1\t0',
    maLoi: (
      [
        'INVALID_DATE',
        'MISSING_USER',
        'UNMAPPED_USER',
        'DUPLICATE',
        'INVALID_FORMAT',
        'OTHER',
        'UNMAPPED_USER',
        'DUPLICATE',
      ] as const
    )[i],
    noiDung: [
      'Ngày giờ sai định dạng (mẫu)',
      'Thiếu mã máy (mẫu)',
      'Chưa mapping nhân viên (mẫu)',
      'Dòng trùng (mẫu)',
      'Sai định dạng fixture (mẫu)',
      'Lỗi giả lập khác',
      'Chưa mapping (mẫu)',
      'Trùng dữ liệu (mẫu)',
    ][i],
    trangThai: (['NEW', 'RESOLVED', 'IGNORED'] as const)[i % 3],
  }));
  return { logs, batches, errors, rawStatuses };
}
