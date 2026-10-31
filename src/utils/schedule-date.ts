export function systemToday(): string {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
export function isPastScheduleDate(date: string): boolean {
  return date < systemToday();
}

// DateTime responses may be serialized in UTC; schedules use the calendar day in UTC+07.
export function scheduleDate(value: string): string {
  if (!/^\d{4}-\d{2}-\d{2}T.*(?:Z|[+-]\d{2}:?\d{2})$/i.test(value)) return value.slice(0, 10);
  const timestamp = Date.parse(value);
  if (!Number.isFinite(timestamp)) return '';
  return new Date(timestamp + 7 * 60 * 60 * 1000).toISOString().slice(0, 10);
}
