import { describe, it, expect, vi, beforeAll } from 'vitest';
const storage = () => {
  const data = new Map<string, string>();
  return {
    getItem: (k: string) => data.get(k) ?? null,
    setItem: (k: string, v: string) => data.set(k, v),
    removeItem: (k: string) => data.delete(k),
  };
};
vi.stubGlobal('localStorage', storage());
vi.stubGlobal('sessionStorage', storage());
let repository: (typeof import('./repository'))['repository'];
let simulateError: (typeof import('./repository'))['simulateError'];
beforeAll(async () => {
  ({ repository, simulateError } = await import('./repository'));
});
const query = { page: 1, pageSize: 10, search: '', filters: {}, sortField: 'code', sortOrder: 1 };
describe('mock repository', () => {
  it('paginates and filters before counting', async () => {
    const page = await repository.list('contracts', query);
    expect(page.items).toHaveLength(10);
    expect(page.total).toBe(36);
    const filtered = await repository.list('contracts', {
      ...query,
      filters: { department: 'Front Office' },
    });
    expect(filtered.total).toBe(6);
    expect(filtered.items.every((r) => r.department === 'Front Office')).toBe(true);
  });
  it('seeds department schedule types for assignment defaults', async () => {
    const page = await repository.list('departments', { ...query, pageSize: 20 });
    expect(page.all.find((department) => department.name === 'Human Resources')?.workSchedule).toBe(
      'administrativeSchedule',
    );
    expect(page.all.find((department) => department.name === 'Front Office')?.workSchedule).toBe(
      'rotatingSchedule',
    );
  });
  it('persists CRUD and rejects duplicate codes', async () => {
    const input = { id: '', code: 'TEST-001', name: 'Test Employee', status: 'draft' };
    const row = await repository.save('contracts', input);
    expect((await repository.get('contracts', row.id)).code).toBe(input.code);
    await expect(repository.save('contracts', input)).rejects.toMatchObject({ status: 409 });
    await repository.save('contracts', { ...row, status: 'active' });
    expect((await repository.get('contracts', row.id)).status).toBe('active');
    await repository.remove('contracts', row.id);
    await expect(repository.get('contracts', row.id)).rejects.toMatchObject({ status: 404 });
  });
  it('simulates one-shot errors and supports retry', async () => {
    simulateError(503);
    await expect(repository.list('contracts', query)).rejects.toMatchObject({ status: 503 });
    expect((await repository.list('contracts', query)).total).toBe(36);
  });
});
