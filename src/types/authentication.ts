export interface LoginAccountInput {
  userName: string;
  password: string;
}
export interface BusinessError {
  code: string;
  field?: string | null;
  message?: string | null;
}
export interface AuthenticationData {
  userName: string | null;
  maNhanVien: string | null;
  loginDateTime: string | null;
  roleId: string | number | null;
  accessToken: string;
  refeshToken: string;
}
export type AuthUser = Omit<AuthenticationData, 'accessToken' | 'refeshToken'>;
export interface AuthenticationResponse {
  isResults: boolean;
  data: AuthenticationData | null;
  errors: BusinessError[];
}
