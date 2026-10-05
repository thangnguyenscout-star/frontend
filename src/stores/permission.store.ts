import { defineStore } from 'pinia';
import { useAuthStore } from './auth.store';
export const usePermissionStore = defineStore('permissions', () => {
  const auth = useAuthStore();
  function can(module: string, action = 'view') {
    if (!auth.authenticated) return false;
    if (module === 'dashboard' && action === 'view') return true;
    if (!auth.role) return false;
    if (['Admin', 'Owner', 'HR Manager'].includes(auth.role)) return true;
    if (auth.role === 'HR Staff') return action !== 'approve' && action !== 'delete';
    if (auth.role === 'HOD')
      return (
        [
          'dashboard',
          'employees',
          'attendance',
          'schedules',
          'leave',
          'overtime',
          'night-shift',
        ].includes(module) && ['view', 'approve', 'reject'].includes(action)
      );
    return (
      auth.role === 'Staff' &&
      ['dashboard', 'attendance', 'schedules', 'leave', 'overtime'].includes(module) &&
      ['view', 'create'].includes(action)
    );
  }
  return { can };
});
