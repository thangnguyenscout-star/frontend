import type { Assignment, Shift } from '@/types/schedule';

function dateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export function buildRotatingSchedule(
  employeeIds: string[],
  start: string,
  end: string,
  shifts: Shift[],
): Assignment[] {
  if (!employeeIds.length || new Set(employeeIds).size !== employeeIds.length)
    throw new Error('Chọn ít nhất một nhân viên, không trùng mã.');
  const first = new Date(`${start}T12:00:00`);
  const last = new Date(`${end}T12:00:00`);
  if (
    Number.isNaN(first.getTime()) ||
    Number.isNaN(last.getTime()) ||
    first > last ||
    (last.getTime() - first.getTime()) / 86400000 + 1 > 366
  )
    throw new Error('Khoảng tự động xếp ca không hợp lệ (tối đa 366 ngày).');

  const weekStart = new Date(first);
  weekStart.setDate(weekStart.getDate() - ((weekStart.getDay() + 6) % 7));
  const weekEnd = new Date(last);
  weekEnd.setDate(weekEnd.getDate() + ((7 - weekEnd.getDay()) % 7));

  const shiftIds = Object.fromEntries(
    ['M', 'E', 'N'].map((code) => {
      const shift = shifts.find((item) => item.active && item.scheduleType === 'ROTATING' && item.code === code);
      if (!shift) throw new Error(`Thiếu ca ${code} đang hoạt động.`);
      return [code, shift.id];
    }),
  ) as Record<'M' | 'E' | 'N', string>;
  const rows: Assignment[] = [];
  let weekIndex = 0;

  for (const weekStartDate = new Date(weekStart); weekStartDate <= weekEnd; weekStartDate.setDate(weekStartDate.getDate() + 7)) {
    for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
      const date = new Date(weekStartDate);
      date.setDate(date.getDate() + dayIndex);
      const working = employeeIds
        .map((employeeId, index) => ({ employeeId, index }))
        .filter(({ index }) => (index + weekIndex) % 7 !== dayIndex)
        .sort((a, b) => (a.index + dayIndex + weekIndex) % employeeIds.length - (b.index + dayIndex + weekIndex) % employeeIds.length);
      let morning = 0;
      let evening = 0;

      for (const employee of working) {
        const preferred = (employee.index + dayIndex + weekIndex) % 2 === 0 ? 'M' : 'E';
        let code: 'M' | 'E' | 'N' = 'N';
        if (preferred === 'M' && morning < 2) {
          code = 'M';
          morning++;
        } else if (preferred === 'E' && evening < 2) {
          code = 'E';
          evening++;
        } else if (morning < 2) {
          code = 'M';
          morning++;
        } else if (evening < 2) {
          code = 'E';
          evening++;
        }
        rows.push({
          id: '',
          employeeId: employee.employeeId,
          date: dateKey(date),
          shiftId: shiftIds[code],
          scheduleType: 'ROTATING',
          status: 'SCHEDULED',
          note: '',
          revision: 0,
          fullTime: true,
        });
      }
      for (const employeeId of employeeIds.filter(
        (_, index) => (index + weekIndex) % 7 === dayIndex,
      )) {
        rows.push({
          id: '',
          employeeId,
          date: dateKey(date),
          shiftId: '',
          scheduleType: 'ROTATING',
          status: 'OFF',
          note: '',
          revision: 0,
          fullTime: true,
        });
      }
    }
    weekIndex++;
  }
  return rows;
}