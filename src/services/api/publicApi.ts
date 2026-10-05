import { authService } from '../auth/auth.service';
export const publicApi = { login: authService.login, refresh: authService.refresh };
