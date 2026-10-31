import { useToast as primeToast } from 'primevue/usetoast';
import { useI18n } from 'vue-i18n';
import { getApiErrorMessage } from '@/utils/error-message';
export function useToast() {
  const toast = primeToast();
  const { t, te } = useI18n();
  const show = (kind: 'success' | 'info' | 'warning' | 'error', value: unknown) => {
    const summary =
      typeof value === 'string' && te(value)
        ? t(value)
        : kind === 'error'
          ? getApiErrorMessage(value)
          : String(value);
    toast.add({ severity: kind === 'warning' ? 'warn' : kind, summary, life: 4000 });
  };
  return {
    success: (key: string) => show('success', key),
    info: (key: string) => show('info', key),
    warning: (key: string) => show('warning', key),
    error: (error: unknown) => show('error', error),
  };
}
