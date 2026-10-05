import { isPastScheduleDate } from '@/utils/schedule-date';
import { privateApi } from '@/services/api/privateApi';
import { recordService } from './record.service';
import { scheduleCatalog } from '@/mock/data/schedule';
import { usePermissionStore } from '@/stores/permission.store';
import type {
  Assignment,
  ScheduleData,
  ScheduleTemplate,
  SwapRequest,
  Shift,
} from '@/types/schedule';
const key = 'hotel-shift-scheduling-v2';
let state: ScheduleData | undefined;
function authorize(action: string) {
  if (!usePermissionStore().can('schedules', action))
    throw new Error('Bạn không có quyền thực hiện thao tác này.');
}
async function read(): Promise<ScheduleData> {
  if (state) return state;
  const saved = localStorage.getItem(key);
  if (saved) {
    state = JSON.parse(saved) as ScheduleData;
    const administrativeShift = state.shifts.find(
      (shift) => shift.id === 'HC' || shift.code === 'HC',
    );
    if (administrativeShift) {
      administrativeShift.code = 'D';
      administrativeShift.name = 'Ca D · Hành chính';
    }
    return state;
  }
  const legacy = await recordService.list('schedules', {
    page: 1,
    pageSize: 1000,
    search: '',
    filters: {},
    sortField: 'date',
    sortOrder: 1,
  });
  state = {
    shifts: structuredClone(scheduleCatalog),
    templates: [],
    swaps: [],
    history: [],
    assignments: legacy.all.map((r) => {
      const shift = scheduleCatalog.find(
        (s) => `${s.startTime}–${s.endTime}` === r.shift || s.code === r.shift,
      );
      return {
        id: r.id,
        employeeId: String(r.employeeId),
        date: String(r.date),
        shiftId: shift?.id || '',
        scheduleType: shift?.scheduleType || 'ROTATING',
        status:
          r.shift === 'OFF'
            ? 'OFF'
            : ['AL', 'SL'].includes(String(r.shift))
              ? 'LEAVE'
              : 'SCHEDULED',
        note: String(r.note || ''),
        revision: 1,
      };
    }),
  };
  return state;
}
function commit(next: ScheduleData) {
  localStorage.setItem(key, JSON.stringify(next));
  state = next;
  return structuredClone(next);
}
export function conflicts(data: ScheduleData, rows: Assignment[]) {
  const issues: { row: Assignment; existing: Assignment; reason: string }[] = [];
  const window = (a: Assignment) => {
    const s = data.shifts.find((s) => s.id === a.shiftId);
    if (!s || a.status !== 'SCHEDULED') return;
    return [
      Date.parse(`${a.date}T${a.startTime || s.startTime}:00`),
      Date.parse(`${a.date}T${a.endTime || s.endTime}:00`) +
        ((a.crossDay ?? s.crossDay) ? 86400000 : 0),
    ];
  };
  rows.forEach((row, index) => {
    for (const existing of [
      ...data.assignments.filter((a) => a.id !== row.id),
      ...rows.slice(0, index),
    ]) {
      if (row.employeeId !== existing.employeeId) continue;
      const a = window(row),
        b = window(existing);
      if (row.date === existing.date || (a && b && a[0] < b[1] && b[0] < a[1]))
        issues.push({
          row,
          existing,
          reason:
            existing.status === 'LEAVE'
              ? 'Nhân viên đang nghỉ phép'
              : row.date === existing.date
                ? 'Đã có phân công trong ngày'
                : 'Ca chồng lấn thời gian, có thể qua đêm',
        });
    }
  });
  return issues;
}
export const scheduleService = {
  load: () =>
    privateApi(async () => {
      authorize('view');
      return structuredClone(await read());
    }),
  assign: (rows: Assignment[], shifts: Shift[] = []) =>
    privateApi(async () => {
      authorize(rows.length > 1 ? 'bulk' : rows[0]?.id ? 'edit' : 'create');
      if (rows.some((row) => isPastScheduleDate(row.date)))
        throw new Error('Không được phân công ngày trong quá khứ.');
      const stored = await read();
      const current = {
        ...stored,
        shifts: [
          ...stored.shifts.filter((s) => !shifts.some((item) => item.id === s.id)),
          ...shifts,
        ],
      };
      if (!rows.length) throw new Error('Chưa có phân công để lưu.');
      if (conflicts(current, rows).length)
        throw new Error('Lịch có xung đột. Hãy kiểm tra nhân viên, ngày và ca hiện có.');
      const next = structuredClone(current);
      for (const row of rows) {
        const old = current.assignments.find((a) => a.id === row.id);
        if (row.id && (!old || old.revision !== row.revision))
          throw new Error('Lịch gốc đã thay đổi. Vui lòng tải lại.');
        if (
          row.status === 'SCHEDULED' &&
          !current.shifts.some(
            (s) => s.id === row.shiftId && s.active && s.scheduleType === row.scheduleType,
          )
        )
          throw new Error('Ca không hoạt động hoặc không phù hợp loại lịch.');
        const saved = {
          ...row,
          id: row.id || crypto.randomUUID(),
          revision: (old?.revision || 0) + 1,
        };
        next.assignments = [...next.assignments.filter((a) => a.id !== saved.id), saved];
        next.history.push({
          assignmentId: saved.id,
          date: new Date().toISOString(),
          action: old ? 'Sửa phân công' : 'Tạo phân công',
        });
      }
      return commit(next);
    }),
  template: (template: ScheduleTemplate) =>
    privateApi(async () => {
      authorize(template.id ? 'edit' : 'create');
      const next = structuredClone(await read());
      if (
        !template.name.trim() ||
        !template.days.length ||
        (template.kind === 'WEEK' && template.days.length !== 7)
      )
        throw new Error('Nhập tên mẫu và cấu hình đầy đủ các ngày.');
      if (
        template.days.some(
          (id) =>
            id !== 'OFF' &&
            !next.shifts.some(
              (s) => s.id === id && s.active && s.scheduleType === template.scheduleType,
            ),
        )
      )
        throw new Error('Mẫu có ca không hợp lệ.');
      const saved = { ...template, id: template.id || crypto.randomUUID() };
      next.templates = [...next.templates.filter((t) => t.id !== saved.id), saved];
      return commit(next);
    }),
  request: (
    request: Pick<SwapRequest, 'assignmentId' | 'targetAssignmentId' | 'shiftId' | 'reason'>,
  ) =>
    privateApi(async () => {
      authorize('create');
      const next = structuredClone(await read());
      const source = next.assignments.find((a) => a.id === request.assignmentId),
        target = next.assignments.find((a) => a.id === request.targetAssignmentId);
      if (!source || source.status !== 'SCHEDULED' || !request.reason.trim())
        throw new Error('Chọn ca đã phân công và nhập lý do.');
      if (
        request.targetAssignmentId &&
        (!target || target.employeeId === source.employeeId || target.status !== 'SCHEDULED')
      )
        throw new Error('Chọn ca của nhân viên khác.');
      if (!target && !next.shifts.some((s) => s.id === request.shiftId && s.active))
        throw new Error('Chọn ca muốn đổi.');
      if (
        next.swaps.some(
          (s) =>
            s.status === 'PENDING' &&
            [s.assignmentId, s.targetAssignmentId].some(
              (id) => id && [source.id, target?.id].includes(id),
            ),
        )
      )
        throw new Error('Ca đã có yêu cầu chờ duyệt.');
      next.swaps.push({
        ...request,
        id: crypto.randomUUID(),
        code: 'DC' + String(next.swaps.length + 1).padStart(5, '0'),
        status: 'PENDING',
        createdAt: new Date().toISOString(),
        sourceSnapshot: { ...source },
        targetSnapshot: target ? { ...target } : undefined,
        sourceRevision: source.revision,
        targetRevision: target?.revision || 0,
        decision: '',
      });
      return commit(next);
    }),
  decide: (id: string, approved: boolean, reason: string) =>
    privateApi(async () => {
      authorize(approved ? 'approve' : 'reject');
      const next = structuredClone(await read());
      const request = next.swaps.find((s) => s.id === id);
      if (!request || request.status !== 'PENDING')
        throw new Error('Yêu cầu đã xử lý hoặc không tồn tại.');
      if (!approved && !reason.trim()) throw new Error('Nhập lý do từ chối.');
      if (approved) {
        const source = next.assignments.find((a) => a.id === request.assignmentId),
          target = next.assignments.find((a) => a.id === request.targetAssignmentId);
        if (
          !source ||
          source.revision !== request.sourceRevision ||
          (request.targetAssignmentId && (!target || target.revision !== request.targetRevision))
        )
          throw new Error('Lịch gốc đã thay đổi; yêu cầu không còn hợp lệ.');
        const changed = [
          { ...source, shiftId: target?.shiftId || request.shiftId, revision: source.revision + 1 },
        ];
        if (target)
          changed.push({ ...target, shiftId: source.shiftId, revision: target.revision + 1 });
        changed.forEach((a) => {
          const shift = next.shifts.find((s) => s.id === a.shiftId && s.active);
          if (!shift) throw new Error('Ca không còn hoạt động.');
          a.scheduleType = shift.scheduleType;
        });
        const remaining = {
          ...next,
          assignments: next.assignments.filter((a) => !changed.some((c) => c.id === a.id)),
        };
        const issues = conflicts(remaining, changed);
        if (issues.length)
          throw new Error(
            issues
              .map(
                (i) =>
                  `${i.row.employeeId} · ${i.row.date}: ${i.row.shiftId} xung đột ${i.existing.shiftId} (${i.reason})`,
              )
              .join('\n'),
          );
        next.assignments = [...remaining.assignments, ...changed];
        changed.forEach((a) =>
          next.history.push({
            assignmentId: a.id,
            date: new Date().toISOString(),
            action: 'Duyệt đổi ca ' + request.code,
          }),
        );
      }
      request.status = approved ? 'APPROVED' : 'REJECTED';
      request.decision = reason;
      return commit(next);
    }),
};
