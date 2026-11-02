import { afterEach, expect, it } from 'vitest';
import { computed } from 'vue';
import { i18n } from '@/locales';
import { attendanceStatusHeading, attendanceStatusLabel } from './attendance-status';
const initialLocale = i18n.global.locale.value;
afterEach(() => {
  i18n.global.locale.value = initialLocale;
});
it.each([
  ['vi', 'Đi trễ', 'Về sớm', 'Bất thường', 'Tình trạng'],
  ['en', 'Late arrival', 'Early departure', 'Abnormal', 'Status'],
  ['fr', 'Arrivée tardive', 'Départ anticipé', 'Anomalie', 'Statut'],
] as const)(
  'translates attendance status codes and heading in %s',
  (locale, late, early, abnormal, heading) => {
    i18n.global.locale.value = locale;
    expect(attendanceStatusLabel('IN_LATE')).toBe(late);
    expect(attendanceStatusLabel('OUT_EARLY')).toBe(early);
    expect(attendanceStatusLabel('ABNORMAL')).toBe(abnormal);
    expect(attendanceStatusHeading()).toBe(heading);
  },
);
it('normalizes codes and uses translated labels for missing or unknown statuses without exposing raw codes', () => {
  i18n.global.locale.value = 'vi';
  expect(attendanceStatusLabel(' in_late ')).toBe('Đi trễ');
  expect(attendanceStatusLabel('NEW_BACKEND_STATUS')).toBe('Chưa xác định');
  expect(attendanceStatusLabel(null)).toBe('Chưa có thông tin');
  expect(attendanceStatusLabel(' ')).toBe('Chưa có thông tin');
  i18n.global.locale.value = 'en';
  expect(attendanceStatusLabel('NEW_BACKEND_STATUS')).toBe('Unknown status');
});
it('keeps status resources complete across all supported languages', () => {
  const keys = Object.keys(i18n.global.getLocaleMessage('vi').common.attendanceStatus);
  for (const locale of ['vi', 'en', 'fr'] as const) {
    i18n.global.locale.value = locale;
    expect(Object.keys(i18n.global.getLocaleMessage(locale).common.attendanceStatus)).toEqual(keys);
    for (const code of keys.filter((key) => !['label', 'EMPTY', 'UNKNOWN'].includes(key))) {
      expect(i18n.global.te(`common.attendanceStatus.${code}`)).toBe(true);
      expect(attendanceStatusLabel(code)).not.toBe(code);
    }
  }
});
it('updates computed labels immediately when the application language changes', () => {
  i18n.global.locale.value = 'vi';
  const label = computed(() => attendanceStatusLabel('IN_LATE'));
  expect(label.value).toBe('Đi trễ');
  i18n.global.locale.value = 'fr';
  expect(label.value).toBe('Arrivée tardive');
});
