import { beforeEach, expect, it, vi } from 'vitest';
const { add } = vi.hoisted(() => ({ add: vi.fn() }));
vi.mock('primevue/usetoast', () => ({ useToast: () => ({ add }) }));
vi.mock('vue-i18n', async (importOriginal) => {
  const actual = await importOriginal<typeof import('vue-i18n')>();
  return { ...actual, useI18n: () => i18n.global };
});
import { i18n } from '@/locales';
import { useToast } from './useToast';
import en from '@/locales/en/system.json';
import fr from '@/locales/fr/system.json';
import viMessages from '@/locales/vi/system.json';
beforeEach(() => {
  add.mockClear();
  i18n.global.locale.value = 'vi';
});
it.each([
  ['en', en],
  ['fr', fr],
  ['vi', viMessages],
] as const)('shows translated API errors in %s', (locale, messages) => {
  i18n.global.locale.value = locale;
  const toast = useToast();
  for (const error of [
    'XEPCA_SWAP_SCHEDULE_CONFLICT',
    new Error('XEPCA_SWAP_SCHEDULE_CONFLICT'),
    { graphQLErrors: [{ extensions: { code: 'XEPCA_SWAP_SCHEDULE_CONFLICT' } }] },
  ]) {
    toast.error(error);
    expect(add).toHaveBeenLastCalledWith({
      severity: 'error',
      summary: messages.XEPCA_SWAP_SCHEDULE_CONFLICT,
      life: 4000,
    });
  }
});
it('keeps local messages readable and uses a translated fallback for unknown codes', () => {
  const toast = useToast();
  toast.error('Vui l?ng ch?n ng?y h?p l?.');
  expect(add.mock.lastCall?.[0].summary).toBe('Vui l?ng ch?n ng?y h?p l?.');
  toast.error('FUTURE_ERROR');
  expect(add.mock.lastCall?.[0].summary).toBe(i18n.global.t('common.COMMON_UNKNOWN_ERROR'));
});
it('preserves existing translation keys and warning severity', () => {
  const toast = useToast();
  toast.error('system.ACCESS_DENIED');
  expect(add.mock.lastCall?.[0].summary).toBe(viMessages.ACCESS_DENIED);
  toast.warning('common.COMMON_REQUIRED');
  expect(add.mock.lastCall?.[0]).toMatchObject({
    severity: 'warn',
    summary: i18n.global.t('common.COMMON_REQUIRED'),
  });
  toast.success('?? l?u ph?n c?ng ca.');
  expect(add.mock.lastCall?.[0]).toMatchObject({
    severity: 'success',
    summary: '?? l?u ph?n c?ng ca.',
  });
});
