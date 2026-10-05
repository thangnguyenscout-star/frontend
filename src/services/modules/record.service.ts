import { repository, simulateError } from '@/mock/services/repository';
import { privateApi } from '../api/privateApi';
import type { HrRecord, ListQuery } from '@/types/common';
// Replace this adapter with typed GraphQL operations once the server contract is available.
export const recordService = {
  list: (m: string, q: ListQuery) => privateApi(() => repository.list(m, q)),
  get: (m: string, id: string) => privateApi(() => repository.get(m, id)),
  save: (m: string, r: HrRecord) => privateApi(() => repository.save(m, r)),
  remove: (m: string, id: string) => privateApi(() => repository.remove(m, id)),
  history: (m: string, id: string) => privateApi(() => repository.history(m, id)),
  overview: () => privateApi(() => repository.overview()),
  simulateError,
};
