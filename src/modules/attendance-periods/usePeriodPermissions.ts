import { computed } from 'vue';
import { useAuth } from '@/composables/useAuth';
import { usePermission } from '@/composables/usePermission';
export function usePeriodPermissions() {
  const auth = useAuth(),
    permission = usePermission();
  const manager = computed(() => ['Admin', 'Owner', 'HR Manager'].includes(auth.role || ''));
  return {
    canCreate: computed(
      () =>
        ['Admin', 'Owner', 'HR Manager', 'HR Staff'].includes(auth.role || '') &&
        permission.can('attendance', 'create'),
    ),
    canClose: computed(() => manager.value && permission.can('attendance', 'approve')),
    canLock: computed(() => manager.value && permission.can('attendance', 'approve')),
  };
}
