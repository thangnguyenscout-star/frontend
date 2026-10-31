import type { RawAttendanceLog, PreviewRow, AttendanceFrontendRow } from './sync.types';
export const MOCK_SOURCE_LABELS: Record<string, string> = {
  D: 'Thiết bị (demo)',
  M: 'Thủ công (demo)',
};
export const MOCK_EVENT_LABELS: Record<string, string> = {
  I: 'Vào (demo)',
  O: 'Ra (demo)',
  U: 'Không xác định (demo)',
};
export const MOCK_USERS: Record<string, string> = {
  '1007': 'DE0001',
  '1008': 'DE0002',
  '1009': 'DE0003',
  '1010': 'DE0004',
  '1011': 'DE0005',
};
export const resolveCodeLabel = (code: string, map: Record<string, string>) =>
  map[code?.trim()] || 'Chưa xác định (' + (code || '—') + ')';
export function localTimestamp(date = new Date()) {
  return (
    date.getFullYear() +
    '-' +
    String(date.getMonth() + 1).padStart(2, '0') +
    '-' +
    String(date.getDate()).padStart(2, '0') +
    'T' +
    String(date.getHours()).padStart(2, '0') +
    ':' +
    String(date.getMinutes()).padStart(2, '0') +
    ':' +
    String(date.getSeconds()).padStart(2, '0')
  );
}
export function formatLocal(value: string | null | undefined) {
  if (!value) return '—';
  const match = /^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}:\d{2}:\d{2})/.exec(value);
  return match ? match[3] + '/' + match[2] + '/' + match[1] + ' ' + match[4] : value;
}
export function validLocalTimestamp(value: string) {
  const m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})$/.exec(value);
  if (!m) return false;
  const [, y, mo, d, h, mi, s] = m.map(Number);
  if (y < 100 || mo < 1 || mo > 12 || d < 1 || h > 23 || mi > 59 || s > 59) return false;
  const check = new Date(Date.UTC(y, mo - 1, d, h, mi, s));
  return check.getUTCFullYear() === y && check.getUTCMonth() === mo - 1 && check.getUTCDate() === d;
}
export const demoKey = (
  device: number | null,
  user: string | null,
  time: string,
  rawStatus: string,
) => JSON.stringify([device, user?.trim() || '', time, rawStatus]);
export function parseTextFixture(
  text: string,
  format: 'csv' | 'dat',
  header: boolean,
  device: number | null,
  existing: Set<string>,
): PreviewRow[] {
  if (!text.trim()) throw new Error('File rỗng, không có dữ liệu để xem trước.');
  if (text.includes('\0') || text.includes('�'))
    throw new Error('Định dạng chưa hỗ trợ trong prototype. Chỉ đọc fixture văn bản UTF-8.');
  const seen = new Set(existing);
  const lines = text.replace(/^\uFEFF/, '').split(/\r?\n/);
  const result: PreviewRow[] = [];
  for (let i = header ? 1 : 0; i < lines.length; i++) {
    const raw = lines[i];
    if (!raw.trim()) continue;
    const columns = format === 'csv' ? csvFields(raw) : raw.split('\t');
    const user = (columns[1] || '').trim(),
      time = (columns[3] || '').trim().replace(' ', 'T'),
      rawStatus = (columns[2] || '').trim();
    const machine = columns[0] || '';
    const row: PreviewRow = {
      line: i + 1,
      machineNo: machine,
      user,
      time,
      rawStatus,
      raw,
      status: 'valid',
      message: 'Hợp lệ (fixture demo)',
      eventType: columns[4] || '',
    };
    if (columns.length !== 5) {
      row.status = 'error';
      row.errorCode = 'INVALID_FORMAT';
      row.message =
        'Fixture cần đúng 5 cột: mã máy, thời gian, raw status, verify mode, work code.';
    } else if (!user) {
      row.status = 'error';
      row.errorCode = 'MISSING_USER';
      row.message = 'Thiếu mã người dùng máy.';
    } else if (user.length > 6) {
      row.status = 'error';
      row.errorCode = 'INVALID_FORMAT';
      row.message = 'Mã người dùng máy không được vượt 6 ký tự.';
    } else if (!validLocalTimestamp(time)) {
      row.status = 'error';
      row.errorCode = 'INVALID_DATE';
      row.message = 'Ngày giờ không hợp lệ; dùng YYYY-MM-DD HH:mm:ss.';
    } else {
      const key = demoKey(device, user, time, rawStatus);
      if (seen.has(key)) {
        row.status = 'duplicate';
        row.errorCode = 'DUPLICATE';
        row.message = 'Trùng theo khóa heuristic demo.';
      } else if (!MOCK_USERS[user]) {
        row.status = 'unmapped';
        row.errorCode = 'UNMAPPED_USER';
        row.message = 'Chưa mapping; log vẫn được giữ trong state mẫu.';
      }
      seen.add(key);
    }
    result.push(row);
  }
  if (!result.length) throw new Error('Không có dòng dữ liệu sau header.');
  return result;
}
function csvFields(line: string) {
  const fields: string[] = [];
  let field = '',
    quoted = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      if (quoted && line[i + 1] === '"') {
        field += '"';
        i++;
      } else quoted = !quoted;
    } else if (c === ',' && !quoted) {
      fields.push(field);
      field = '';
    } else field += c;
  }
  if (quoted) return [];
  fields.push(field);
  return fields;
}
export const previewCounts = (rows: PreviewRow[]) =>
  rows.reduce(
    (counts, row) => {
      counts[row.status]++;
      return counts;
    },
    { valid: 0, duplicate: 0, error: 0, unmapped: 0 },
  );
export function existingKeys(logs: RawAttendanceLog[], rawStatuses: Record<number, string>) {
  return new Set(
    logs.map((log) =>
      demoKey(log.maThietBi, log.maNguoiDungMay, log.thoiGianQuet, rawStatuses[log.id] || ''),
    ),
  );
}
export function validateFile(file: Pick<File, 'name' | 'size'>) {
  if (!/\.(dat|txt|csv|xlsx|xls)$/i.test(file.name))
    throw new Error('Chỉ hỗ trợ DAT, TXT, CSV, XLSX, XLS.');
  if (file.size === 0) throw new Error('File rỗng.');
  if (file.size > 10 * 1024 * 1024) throw new Error('Dung lượng file tối đa 10 MB.');
}



const ATTENDANCE_DAT_HEADER = [
  'MaThietBi',
  'MaNguoiDungMay',
  'MaNhanVien',
  'ThoiGianQuet',
  'LoaiSuKien',
];

function validAttendanceTimestamp(value: string): boolean {
  const match = /^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2}):(\d{2})$/.exec(value);
  if (!match) return false;
  const [, yearText, monthText, dayText, hourText, minuteText, secondText] = match;
  const year = Number(yearText), month = Number(monthText), day = Number(dayText);
  const hour = Number(hourText), minute = Number(minuteText), second = Number(secondText);
  if (month < 1 || month > 12 || day < 1 || hour > 23 || minute > 59 || second > 59) return false;
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
}

export function parseAttendanceDatRows(text: string, seenKeys = new Set<string>()): AttendanceFrontendRow[] {
  if (!text.trim()) throw new Error('File DAT rỗng.');
  if (text.includes('\0') || text.includes('\uFFFD'))
    throw new Error('File DAT không đọc được theo encoding UTF-8.');

  const lines = text.replace(/^\uFEFF/, '').split(/\r?\n/);
  const header = (lines[0] ?? '').split('\t').map((value) => value.trim());
  if (
    header.length !== ATTENDANCE_DAT_HEADER.length ||
    header.some((value, index) => value !== ATTENDANCE_DAT_HEADER[index])
  )
    throw new Error(
      'Header DAT không đúng định dạng MaThietBi, MaNguoiDungMay, MaNhanVien, ThoiGianQuet, LoaiSuKien.',
    );

  const rows: AttendanceFrontendRow[] = [];
  for (let index = 1; index < lines.length; index++) {
    const raw = lines[index];
    if (!raw.trim()) continue;
    const columns = raw.split('\t');
    const machineValue = (columns[0] ?? '').trim();
    const parsedMachineNo = /^\d+$/.test(machineValue) ? Number(machineValue) : Number.NaN;
    const machineNo = Number.isSafeInteger(parsedMachineNo) && parsedMachineNo <= 2147483647 ? parsedMachineNo : 0;
    const user = (columns[1] ?? '').trim() || null;
    const time = (columns[3] ?? '').trim() || null;
    const eventType = (columns[4] ?? '').trim() || null;
    const rawStatus = (columns[2] ?? '').trim() || null;
    let status: AttendanceFrontendRow['status'] = 'VALID';
    let message: string | null = null;
    if (columns.length !== 5) {
      status = 'INVALID';
      message = 'Dòng phải có đúng 5 cột phân tách bằng tab.';
    } else if (!machineNo) {
      status = 'INVALID';
      message = 'MaThietBi phải là số nguyên dương trong giới hạn Int32.';
    } else if (!user) {
      status = 'INVALID';
      message = 'Thiếu MaNguoiDungMay.';
    } else if (!time || !validAttendanceTimestamp(time)) {
      status = 'INVALID';
      message = 'ThoiGianQuet không đúng định dạng ngày giờ hợp lệ.';
    } else if (!eventType) {
      status = 'INVALID';
      message = 'Thiếu LoaiSuKien.';
    }

    if (status === 'VALID') {
      const key = JSON.stringify([machineNo, user, time!.replace('T', ' '), eventType]);
      if (seenKeys.has(key)) {
        status = 'DUPLICATE';
        message = 'Trùng trong các file đang chọn theo máy, mã người dùng máy, thời gian và loại sự kiện.';
      } else {
        seenKeys.add(key);
      }
    }

    rows.push({
      line: index + 1,
      machineNo,
      user,
      time,
      eventType,
      rawStatus,
      raw,
      status,
      message,
    });
  }
  if (!rows.length) throw new Error('File DAT không có dòng dữ liệu.');
  return rows;
}
