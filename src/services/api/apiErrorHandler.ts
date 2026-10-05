import { getApiErrorMessage } from '@/utils/error-message';
export class ApiError extends Error {
  constructor(
    public status: number,
    public fields: Record<string, string> = {},
  ) {
    super(`errors.${status}`);
  }
}
export const apiErrorKey = (error: unknown) =>
  error instanceof ApiError ? error.message : getApiErrorMessage(error);
