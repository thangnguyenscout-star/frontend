import { useConfirm as primeConfirm } from 'primevue/useconfirm';
import { useI18n } from 'vue-i18n';
export function useConfirm() {
  const confirm = primeConfirm();
  const { t } = useI18n();
  return (
    accept: () => void,
    options: { message?: string; acceptLabel?: string; reject?: () => void } = {},
  ) =>
    confirm.require({
      header: t('confirm'),
      message: options.message ?? t('confirmMessage'),
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: options.acceptLabel ?? t('confirm'),
      rejectLabel: t('cancel'),
      accept,
      reject: options.reject,
    });
}
