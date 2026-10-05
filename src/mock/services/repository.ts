import { seed } from '../data/seed';
import { ApiError } from '@/services/api/apiErrorHandler';
import type { HrRecord, ListQuery, HistoryEntry } from '@/types/common';
const initialData = seed();
let data = initialData;
try {
  const stored = localStorage.getItem('hotel-hr-data-v1');
  if (stored) data = JSON.parse(stored);
} catch {
  /* Recover with seed data. */
}
const defaultDepartmentSchedules = new Map(
  initialData.departments.map((department) => [department.name, department.workSchedule]),
);
data.departments = (data.departments || []).map((department) => ({
  ...department,
  workSchedule:
    department.workSchedule || defaultDepartmentSchedules.get(department.name) || 'rotatingSchedule',
}));
const history: Record<string, HistoryEntry[]> = JSON.parse(
  sessionStorage.getItem('hotel-hr-history') || '{}',
);
let nextError = 0;
export const simulateError = (status: number) => {
  nextError = status;
};
async function delay() {
  await new Promise((r) => setTimeout(r, 350));
  if (nextError) {
    const code = nextError;
    nextError = 0;
    throw new ApiError(code, code === 422 ? { code: 'required' } : {});
  }
}
function persist() {
  localStorage.setItem('hotel-hr-data-v1', JSON.stringify(data));
  sessionStorage.setItem('hotel-hr-history', JSON.stringify(history));
}
export const repository = {
  async list(module: string, q: ListQuery) {
    await delay();
    let rows = [...(data[module] || [])];
    const search = q.search.toLocaleLowerCase();
    rows = rows.filter((r) =>
      [r.code, r.name, r.employeeId].some((v) =>
        String(v || '')
          .toLocaleLowerCase()
          .includes(search),
      ),
    );
    for (const [k, v] of Object.entries(q.filters)) {
      if (!v) continue;
      rows = rows.filter((r) =>
        k === 'expiration'
          ? !!r.endDate &&
            new Date(String(r.endDate)).getTime() >= Date.now() &&
            new Date(String(r.endDate)).getTime() <= Date.now() + Number(v) * 86400000
          : k === 'startDate'
            ? String(r.startDate) >= v
            : k === 'endDate'
              ? String(r.endDate) <= v
              : String(r[k]) === v,
      );
    }
    rows.sort((a, b) => {
      const x = a[q.sortField],
        y = b[q.sortField];
      return (
        (typeof x === 'number' && typeof y === 'number'
          ? x - y
          : String(x ?? '').localeCompare(String(y ?? ''))) * q.sortOrder
      );
    });
    return {
      items: structuredClone(rows.slice((q.page - 1) * q.pageSize, q.page * q.pageSize)),
      total: rows.length,
      all: structuredClone(rows),
    };
  },
  async get(module: string, id: string) {
    await delay();
    const row = data[module]?.find((r) => r.id === id);
    if (!row) throw new ApiError(404);
    return structuredClone(row);
  },
  async save(module: string, input: HrRecord) {
    await delay();
    if (!input.code || !input.name)
      throw new ApiError(422, {
        ...(!input.code ? { code: 'required' } : {}),
        ...(!input.name ? { name: 'required' } : {}),
      });
    if (data[module].some((r) => r.code === input.code && r.id !== input.id))
      throw new ApiError(409);
    const index = data[module].findIndex((r) => r.id === input.id);
    const row = { ...input, id: input.id || crypto.randomUUID() };
    if (index < 0) data[module].unshift(row);
    else data[module][index] = row;
    const key = module + ':' + row.id;
    (history[key] ??= []).unshift({
      date: new Date().toISOString(),
      action: index < 0 ? 'create' : 'edit',
      code: row.code,
    });
    persist();
    return structuredClone(row);
  },
  async remove(module: string, id: string) {
    await delay();
    data[module] = data[module].filter((r) => r.id !== id);
    persist();
  },
  async history(module: string, id: string) {
    await delay();
    return structuredClone(history[module + ':' + id] || []);
  },
  async overview() {
    await delay();
    return structuredClone(data);
  },
};
