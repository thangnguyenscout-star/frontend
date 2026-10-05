import { clearSession } from './auth-session';
import { refreshSession } from './refresh-token.service';
import { authentication } from './authentication.service';
import { apolloClient } from '../graphql/apollo';
export const roleNames = {
  '0': 'Admin',
  '1': 'Owner',
  '2': 'HR Manager',
  '3': 'HR Staff',
  '4': 'HOD',
  '5': 'Staff',
} as const;
export type Role = (typeof roleNames)[keyof typeof roleNames];
export const roles: Role[] = Object.values(roleNames);
export function resolveRole(roleId: string | number | null): Role | null {
  if (roleId === null) return null;
  const code = String(roleId).trim();
  if (Object.hasOwn(roleNames, code)) return roleNames[code as keyof typeof roleNames];
  // Preserve sessions created before the backend switched to numeric role IDs.
  if (code === 'ADMIN' || code === 'HR Admin') return 'Admin';
  if (code === 'Employee') return 'Staff';
  return roles.includes(code as Role) ? (code as Role) : null;
}
export const authService = {
  login: authentication,
  refresh: refreshSession,
  logout() {
    clearSession();
    void apolloClient.clearStore().catch(() => undefined);
  },
};
