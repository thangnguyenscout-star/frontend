export function scheduleRange(anchor: string, view: string): { from: string; to: string } {
  const start = new Date(`${anchor}T12:00:00`);
  if (view === 'week') start.setDate(start.getDate() - ((start.getDay() + 6) % 7));
  if (view === 'month') start.setDate(1);
  const end = new Date(start);
  if (view === 'week') end.setDate(end.getDate() + 6);
  if (view === 'month') end.setMonth(end.getMonth() + 1, 0);
  const key = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  return { from: key(start), to: key(end) };
}
