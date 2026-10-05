export const tokenService = {
  get: () => sessionStorage.getItem('hr-access'),
  set: (token: string) => sessionStorage.setItem('hr-access', token),
  getRefresh: () => sessionStorage.getItem('hr-refresh-session'),
  setRefresh: (token: string) => sessionStorage.setItem('hr-refresh-session', token),
  clear: () => {
    sessionStorage.removeItem('hr-access');
    sessionStorage.removeItem('hr-refresh-session');
  },
};
