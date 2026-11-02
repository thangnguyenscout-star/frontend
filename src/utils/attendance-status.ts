import { i18n } from '@/locales';

export function attendanceStatusLabel(value: string | null | undefined): string {
  const code = value?.trim().toUpperCase();
  if (!code) return i18n.global.t('common.attendanceStatus.EMPTY');
  const key = `common.attendanceStatus.${code}`;
  return i18n.global.t(i18n.global.te(key) ? key : 'common.attendanceStatus.UNKNOWN');
}
export function attendanceStatusHeading(): string {
  return i18n.global.t('common.attendanceStatus.label');
}
