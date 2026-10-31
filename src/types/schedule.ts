export type ScheduleType = 'ADMINISTRATIVE' | 'ROTATING';
export interface Shift {
  id: string;
  code: string;
  name: string;
  scheduleType: ScheduleType;
  startTime: string;
  endTime: string;
  crossDay: boolean;
  displayColor: string;
  active: boolean;
  workType?: string;
}
export interface Assignment {
  id: string;
  employeeId: string;
  employeeName?: string;
  departmentCode?: string | null;
  locked?: boolean;
  date: string;
  shiftId: string;
  scheduleType: ScheduleType;
  status: 'SCHEDULED' | 'OFF' | 'LEAVE';
  note: string;
  revision: number;
  shiftSymbol?: string;
  shiftName?: string;
  apiStatus?: string | number | null;
  assignmentSource?: string | null;
  startDate?: string;
  endDate?: string;
  /** Legacy assignments default to a full shift. */
  fullTime?: boolean;
  leaveTypeId?: string | null;
  startTime?: string;
  endTime?: string;
  crossDay?: boolean;
}
export interface ScheduleTemplate {
  id: string;
  name: string;
  scheduleType: ScheduleType;
  department: string;
  active: boolean;
  kind: 'WEEK' | 'CYCLE';
  days: string[];
  note: string;
}
export interface SwapRequest {
  id: string;
  code: string;
  assignmentId: string;
  targetAssignmentId: string;
  shiftId: string;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
  createdAt: string;
  sourceSnapshot?: Assignment;
  targetSnapshot?: Assignment;
  sourceRevision: number;
  targetRevision: number;
  decision: string;
}
export interface ScheduleData {
  shifts: Shift[];
  assignments: Assignment[];
  templates: ScheduleTemplate[];
  swaps: SwapRequest[];
  history: { assignmentId: string; date: string; action: string }[];
}
