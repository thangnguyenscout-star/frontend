import { defineStore } from 'pinia';
import { computed } from 'vue';
import { authService, resolveRole } from '@/services/auth/auth.service';
import { publicApi } from '@/services/api/publicApi';
import { saveSession, sessionUser } from '@/services/auth/auth-session';
import type { LoginAccountInput } from '@/types/authentication';

export const useAuthStore = defineStore('auth', () => {
  const user = sessionUser;
  const role = computed(() => resolveRole(user.value?.roleId ?? null));
  const authenticated = computed(() => !!user.value);
  const userName = computed(() => user.value?.userName ?? null);
  const maNhanVien = computed(() => user.value?.maNhanVien ?? null);
  const roleId = computed(() => user.value?.roleId ?? null);
  const loginDateTime = computed(() => user.value?.loginDateTime ?? null);
  async function login(input: LoginAccountInput) {
    const result = await publicApi.login(input);
    if (result.isResults && result.data) saveSession(result.data);
    return result;
  }
  function logout() {
    user.value = null;
    authService.logout();
  }
  return {
    user,
    role,
    authenticated,
    isAuthenticated: authenticated,
    userName,
    maNhanVien,
    roleId,
    loginDateTime,
    login,
    logout,
  };
});
