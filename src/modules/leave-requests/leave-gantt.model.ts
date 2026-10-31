import {
  leaveEmployeeName,
  type LeaveRequest,
  type LeaveRequestFilter,
} from '@/services/modules/leave-request.service';
import { ganttRange, type LeaveEmployee } from './leave-gantt.service';
const DAY = 86400000;
export function leaveTimestamp(value: string) {
  if (typeof value !== 'string' || !value.trim()) return NaN;
  return Date.parse(
    /(?:Z|[+-]\d{2}:?\d{2})$/i.test(value)
      ? value
      : value + (value.includes('T') ? '' : 'T00:00:00') + '+07:00',
  );
}
export function ganttDays(filter: LeaveRequestFilter) {
  const range = ganttRange(filter);
  return Array.from({ length: range.days }, (_, index) => {
    const date = new Date(range.start + index * DAY + 7 * 3600000);
    const weekday = date.getUTCDay();
    return {
      date: date.toISOString().slice(0, 10),
      label: date.getUTCDate(),
      weekday: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'][weekday],
      weekend: weekday === 0 || weekday === 6,
    };
  });
}
export interface GanttBar {
  request: LeaveRequest;
  start: number;
  end: number;
  lane: number;
  left: number;
  width: number;
}
export interface GanttEmployee {
  employee: LeaveEmployee;
  name: string;
  bars: GanttBar[];
  height: number;
}
export interface GanttGroup {
  code: string;
  name: string;
  employees: GanttEmployee[];
  requests: number;
}
export function buildLeaveGantt(
  employees: LeaveEmployee[],
  requests: LeaveRequest[],
  filter: LeaveRequestFilter,
  onlyWithLeave = false,
): { groups: GanttGroup[]; invalid: number } {
  const range = ganttRange(filter);
  const roster = new Map(employees.map((person) => [person.maNhanVien, person]));
  // Keep requests whose employee no longer appears in the employee catalog visible.
  for (const row of requests)
    if (!roster.has(row.maNhanVien)) roster.set(row.maNhanVien, { ...row, gioiTinh: null });
  const groups = new Map<string, GanttGroup>();
  const byEmployee = new Map<string, LeaveRequest[]>();
  for (const row of requests)
    if (!filter.tinhTrang || row.tinhTrang === filter.tinhTrang)
      byEmployee.set(row.maNhanVien, [...(byEmployee.get(row.maNhanVien) || []), row]);
  let invalid = 0;
  for (const employee of roster.values()) {
    if (
      (filter.maBoPhan && employee.maBoPhan !== filter.maBoPhan) ||
      (filter.maNhanVien && employee.maNhanVien !== filter.maNhanVien)
    )
      continue;
    const bars: GanttBar[] = [];
    for (const request of byEmployee.get(employee.maNhanVien) || []) {
      const start = leaveTimestamp(request.tuNgay),
        end = leaveTimestamp(request.denNgay);
      if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) {
        invalid++;
        continue;
      }
      if (start >= range.end || end <= range.start) continue;
      const clippedStart = Math.max(start, range.start),
        clippedEnd = Math.min(end, range.end);
      bars.push({
        request,
        start: clippedStart,
        end: clippedEnd,
        lane: 0,
        left: ((clippedStart - range.start) / (range.end - range.start)) * 100,
        width: ((clippedEnd - clippedStart) / (range.end - range.start)) * 100,
      });
    }
    bars.sort(
      (a, b) =>
        a.start - b.start ||
        a.end - b.end ||
        String(a.request.id).localeCompare(String(b.request.id)),
    );
    const laneEnds: number[] = [];
    for (const bar of bars) {
      let lane = laneEnds.findIndex((end) => end <= bar.start);
      if (lane < 0) lane = laneEnds.length;
      bar.lane = lane;
      laneEnds[lane] = bar.end;
    }
    if (onlyWithLeave && !bars.length) continue;
    const code = employee.maBoPhan || '';
    if (!groups.has(code))
      groups.set(code, {
        code,
        name: employee.tenBoPhan || code || 'Chưa phân bộ phận',
        employees: [],
        requests: 0,
      });
    const group = groups.get(code)!;
    group.employees.push({
      employee,
      name: leaveEmployeeName(employee),
      bars,
      height: Math.max(52, laneEnds.length * 26 + 14),
    });
    group.requests += bars.length;
  }
  const result = [...groups.values()].sort((a, b) => a.name.localeCompare(b.name, 'vi'));
  for (const group of result)
    group.employees.sort(
      (a, b) =>
        a.name.localeCompare(b.name, 'vi') ||
        a.employee.maNhanVien.localeCompare(b.employee.maNhanVien),
    );
  return { groups: result, invalid };
}
