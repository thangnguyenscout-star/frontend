/** Normalize API TimeSpan / clock values to a local clock time for scheduling. */
export function scheduleTime(value: string | null | undefined): string {
  if (!value) return '';
  const text = value.trim();
  const duration = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(?:\.\d+)?)S)?$/i.exec(text);
  const clock = /^(\d{1,2}):(\d{2})(?::\d{2}(?:\.\d+)?)?$/.exec(text);
  if (!clock && (!duration || !duration.slice(1).some((v) => v !== undefined))) return '';
  const hours = Number(clock ? clock[1] : duration?.[1] || 0);
  const minutes = Number(clock ? clock[2] : duration?.[2] || 0);
  const seconds = Number(duration?.[3] || 0);
  if (hours > 23 || minutes > 59 || seconds >= 60) return '';
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}
