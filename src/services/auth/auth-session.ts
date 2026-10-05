import { shallowRef } from 'vue';
import type { AuthenticationData, AuthUser } from '@/types/authentication';
import { tokenService } from './token.service';

function restoreUser(): AuthUser | null {
  if (!tokenService.get() || !tokenService.getRefresh()) return null;
  try {
    const value = JSON.parse(sessionStorage.getItem('hr-user') || 'null');
    const keys = ['userName', 'maNhanVien', 'loginDateTime'] as const;
    if (!value || !keys.every((key) => value[key] === null || typeof value[key] === 'string'))
      return null;
    if (
      value.roleId !== null &&
      typeof value.roleId !== 'string' &&
      !(typeof value.roleId === 'number' && Number.isInteger(value.roleId))
    )
      return null;
    return {
      userName: value.userName,
      maNhanVien: value.maNhanVien,
      roleId: value.roleId,
      loginDateTime: value.loginDateTime,
    };
  } catch {
    return null;
  }
}
export const sessionUser = shallowRef<AuthUser | null>(restoreUser());
let revision = 0;
let generation = 0;
export const sessionGeneration = () => generation;
export const sessionRevision = () => revision;
export function clearSession() {
  generation++;
  revision++;
  sessionUser.value = null;
  tokenService.clear();
  sessionStorage.removeItem('hr-user');
  sessionStorage.removeItem('hr-role');
}
export function saveSession(data: AuthenticationData, rotation = false) {
  if (!rotation) generation++;
  const user: AuthUser = {
    userName: data.userName ?? null,
    maNhanVien: data.maNhanVien ?? null,
    roleId: data.roleId ?? null,
    loginDateTime: data.loginDateTime ?? null,
  };
  try {
    tokenService.set(data.accessToken);
    tokenService.setRefresh(data.refeshToken);
    sessionStorage.setItem('hr-user', JSON.stringify(user));
    sessionStorage.removeItem('hr-role');
    sessionUser.value = user;
    revision++;
  } catch (error) {
    clearSession();
    throw error;
  }
}
export function expireSession() {
  clearSession();
  window.dispatchEvent(new Event('hr-session-expired'));
}
