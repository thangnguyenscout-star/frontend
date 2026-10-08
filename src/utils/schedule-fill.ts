import type { Assignment, Shift } from '@/types/schedule';
import { isPastScheduleDate } from '@/utils/schedule-date';
export interface AssignmentPlan {
  employeeId: string;
  date: string;
  shiftId: string;
  fullTime: boolean;
  note: string;
}
export function fillUnassignedPlans(
  employees: { code: string }[],
  dates: string[],
  shift: Shift,
  assignments: Assignment[],
  plans: AssignmentPlan[],
): AssignmentPlan[] {
  const isAdministrativeSunday = (date: string) =>
    shift.scheduleType === 'ADMINISTRATIVE' &&
    new Date(`${date}T12:00:00`).getDay() === 0;
  const result = plans.filter((plan) => !isAdministrativeSunday(plan.date));
  const occupied = new Set([...assignments, ...result].map((a) => `${a.employeeId}:${a.date}`));
  for (const employee of employees) {
    for (const date of dates) {
      if (
        isAdministrativeSunday(date) ||
        isPastScheduleDate(date) ||
        occupied.has(`${employee.code}:${date}`)
      )
        continue;
      result.push({ employeeId: employee.code, date, shiftId: shift.id, fullTime: true, note: '' });
      occupied.add(`${employee.code}:${date}`);
    }
  }
  return result.sort((a, b) => a.date.localeCompare(b.date));
}
