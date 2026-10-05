import { useToast as primeToast } from 'primevue/usetoast';
import { useI18n } from 'vue-i18n';
export function useToast() {
  const toast = primeToast();
  const { t } = useI18n();
  return Object.fromEntries(
    ['success', 'info', 'warning', 'error'].map((kind) => [
      kind,
      (key: string) =>
        toast.add({ severity: kind === 'warning' ? 'warn' : kind, summary: t(key), life: 4000 }),
    ]),
  ) as Record<'success' | 'info' | 'warning' | 'error', (key: string) => void>;
}
