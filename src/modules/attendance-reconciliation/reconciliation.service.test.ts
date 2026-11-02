import { beforeEach, describe, expect, it, vi } from 'vitest';
import { reactive } from 'vue';
import { createReconciliationFixtures, stableIssueKey } from './reconciliation.fixtures';
import { createReconciliationService } from './reconciliation.service';
import type { Actor, IssueViewModel } from './reconciliation.types';

const hr: Actor = { role: 'HR', departmentCode: '' };
const hod: Actor = { role: 'HOD', departmentCode: 'FO' };
const payroll: Actor = { role: 'Payroll', departmentCode: '' };
let service: ReturnType<typeof createReconciliationService>;
beforeEach(() => {
  service = createReconciliationService();
});
function propose(row: IssueViewModel = service.getIssues({ periodId: 1 })[0]) {
  return service.submitAdjustment(
    row.issue.id,
    {
      type: row.context.expectedType,
      reason: 'Đã xác minh bằng lịch ca và xác nhận bộ phận.',
      newIn: row.shift.start,
      newOut: row.shift.end,
      minutes: row.shift.standardMinutes,
    },
    hr,
  );
}
async function ready() {
  service.completeDemoData(1, hr);
  await service.runReconciliation(1, { type: 'PERIOD' }, hr);
  for (const d of service.state.departments)
    service.approveDepartment(1, d.code, { role: 'HOD', departmentCode: d.code });
}
describe('fixtures and projection', () => {
  it('has deterministic, DB-aligned fixtures and distinct shift keys', () => {
    expect(service.state.employees).toHaveLength(24);
    expect(service.state.departments).toHaveLength(3);
    expect(service.getIssues({ periodId: 1 })).toHaveLength(36);
    expect(new Set(service.state.issues.map((i) => i.maLoi)).size).toBe(13);
    expect(service.state.issues.every((i) => /^[a-f\d]{64}$/.test(i.issueKey))).toBe(true);
    expect(createReconciliationFixtures().issues).toEqual(service.state.issues);
    expect(stableIssueKey('NV1|2026-10-30|1|A02')).not.toBe(stableIssueKey('NV1|2026-10-30|2|A02'));
    expect(service.state.issues.find((i) => i.maLoi === 'A12')!.phanCongCaId).toBeNull();
    for (const row of service.getIssues({ periodId: 1, code: 'A08' })) {
      expect(row.shift.end.slice(0, 10)).not.toBe(row.shift.start.slice(0, 10));
      expect(Date.parse(row.shift.end)).toBeGreaterThan(Date.parse(row.shift.start));
    }
    const secondShift = service.state.calculations.find((s) => s.id === 19999)!;
    expect(
      service.state.calculations.filter(
        (s) =>
          s.employeeCode === secondShift.employeeCode &&
          s.date === secondShift.date &&
          s.periodId === 1,
      ),
    ).toHaveLength(2);
  });
  it('keeps KPI, department filters and issue filters consistent', () => {
    const multiShift = service.getIssues({ periodId: 1, employeeCode: 'NV011', date: '2026-10-29' });
    expect(multiShift).toHaveLength(2);
    expect(new Set(multiShift.map(r => r.issue.phanCongCaId)).size).toBe(2);
    const all = service.getOverview(1);
    expect(all.unresolved).toBe(36);
    expect(
      service.state.departments.reduce((t, d) => t + service.getOverview(1, d.code).unresolved, 0),
    ).toBe(all.unresolved);
    const rows = service.getIssues({
      periodId: 1,
      departmentCode: 'FO',
      severity: 'CRITICAL',
      search: 'NV001',
      date: '2026-10-30',
    });
    expect(rows).toHaveLength(1);
    expect(rows[0].issue.maLoi).toBe('A02');
    expect(rows[0].issue.ngayCong).toBe('2026-10-30');
    expect(service.getIssues({ periodId: 2 })).toHaveLength(0);
  });
  it('ignores failed and cancelled runs when projecting current issues', async () => {
    const original = service.currentIssues(1).map((i) => i.id);
    const result = await service.runReconciliation(1, { type: 'PERIOD', fail: true }, hr);
    expect(result.trangThai).toBe('FAILED');
    expect(result.loiXuLy).toBeTruthy();
    expect(service.currentIssues(1).map((i) => i.id)).toEqual(original);
    expect(service.getClosingEligibility(1).canClose).toBe(false);
  });
  it('merges incremental results without dropping the other departments', async () => {
    const old = service.getIssues({ periodId: 1, departmentCode: 'HK' }).map((r) => r.issue.id);
    await service.runReconciliation(1, { type: 'INCREMENTAL', departmentCode: 'FO' }, hr);
    expect(service.currentIssues(1)).toHaveLength(36);
    expect(service.getIssues({ periodId: 1, departmentCode: 'HK' }).map((r) => r.issue.id)).toEqual(
      old,
    );
    expect(service.state.issues.filter((i) => i.trangThai === 'SUPERSEDED')).toHaveLength(16);
    expect(new Set(service.currentIssues(1).map((i) => i.issueKey)).size).toBe(36);
  });
});
describe('adjustment lifecycle and validation', () => {
  it('requires approval, separate application, recalculation and rerun without altering original logs', async () => {
    const row = service.getIssues({ periodId: 1 })[0];
    const rawLogs = service.state.calculations.map((s) => [s.originalIn, s.originalOut]);
    service.beginReview(row.issue.id, hr);
    expect(row.issue.trangThai).toBe('IN_REVIEW');
    const a = propose(row);
    expect(a.trangThai).toBe('PENDING');
    expect(() => service.applyAdjustment(a.id, hr)).toThrow();
    service.approveAdjustment(a.id, hod);
    expect(a.trangThai).toBe('APPROVED');
    expect(row.issue.trangThai).toBe('IN_REVIEW');
    service.applyAdjustment(a.id, hr);
    expect(a.trangThai).toBe('APPLIED');
    expect(a.appliedAt).toBeTruthy();
    expect(service.state.runtime[1].dataVersion).toBe(101);
    expect(service.getIssues({ periodId: 1 })[0].isStale).toBe(true);
    await expect(service.runReconciliation(1, { type: 'PERIOD' }, hr)).rejects.toThrow('tính lại');
    service.recalculate(1, hr);
    expect(row.issue.trangThai).toBe('IN_REVIEW');
    await service.runReconciliation(1, { type: 'PERIOD' }, hr);
    const current = service.currentIssues(1).find((i) => i.issueKey === row.issue.issueKey)!;
    expect(current.trangThai).toBe('RESOLVED');
    expect(row.issue.trangThai).toBe('SUPERSEDED');
    expect(service.state.calculations.map((s) => [s.originalIn, s.originalOut])).toEqual(rawLogs);
  });
  it('does not resolve an approved and applied value that fails the new reconciliation', async () => {
    const row = service.getIssues({ periodId: 1 })[0];
    const a = service.submitAdjustment(
      row.issue.id,
      {
        type: 'ADD_OUT',
        newOut: '2026-10-31T05:00:00+07:00',
        reason: 'Xác nhận giờ ra chưa đúng thời điểm kết thúc ca.',
      },
      hr,
    );
    service.approveAdjustment(a.id, hr);
    service.applyAdjustment(a.id, hr);
    service.recalculate(1, hr);
    await service.runReconciliation(1, { type: 'PERIOD' }, hr);
    expect(
      service.currentIssues(1).find((i) => i.issueKey === row.issue.issueKey)!.trangThai,
    ).not.toBe('RESOLVED');
  });
  it('requires explanations for rejection and accepting warnings; never accepts critical errors', () => {
    const a = propose();
    expect(() => service.rejectAdjustment(a.id, '', hr)).toThrow('lý do');
    service.rejectAdjustment(a.id, 'Chưa đủ căn cứ xác minh giờ ra.', hr);
    expect(a.trangThai).toBe('REJECTED');
    expect(service.currentIssues(1)[0].trangThai).toBe('IN_REVIEW');
    expect(() => service.acceptIssue(1, 'Đã xác minh rõ ràng.', hr)).toThrow('nghiêm trọng');
    const warning = service.currentIssues(1).find((i) => i.mucDo === 'WARNING')!;
    expect(() => service.acceptIssue(warning.id, '', hr)).toThrow('lý do');
    service.acceptIssue(warning.id, 'Ngoại lệ đã được bộ phận giải trình hợp lệ.', hr);
    expect(warning.trangThai).toBe('ACCEPTED');
    expect(warning.ghiChuXuLy).toBeTruthy();
  });
  it('rejects invalid values, duplicate pending proposals and unsupported shift payloads', () => {
    expect(() =>
      service.submitAdjustment(
        1,
        { type: 'ADD_OUT', newOut: 'invalid', reason: 'Đã có đầy đủ căn cứ.' },
        hr,
      ),
    ).toThrow();
    expect(() =>
      service.submitAdjustment(
        1,
        { type: 'WORK_MINUTES', minutes: NaN, reason: 'Đã có đầy đủ căn cứ.' },
        hr,
      ),
    ).toThrow();
    expect(() =>
      service.submitAdjustment(
        1,
        { type: 'CHANGE_SHIFT', reason: 'Chuyển ca theo xác nhận bộ phận.' },
        hr,
      ),
    ).toThrow('schema');
    const a = propose();
    expect(() => propose()).toThrow('đang chờ');
    service.approveAdjustment(a.id, hr);
    expect(() => service.approveAdjustment(a.id, hr)).toThrow('Trạng thái');
  });
  it('enforces role scope and locks closed periods even when methods are invoked directly', () => {
    expect(() => service.beginReview(1, payroll)).toThrow('chỉ được xem');
    expect(() =>
      service.submitAdjustment(
        1,
        { type: 'WORK_MINUTES', minutes: 480, reason: 'Đã xác minh đủ thông tin.' },
        { role: 'HOD', departmentCode: 'HK' },
      ),
    ).toThrow('phụ trách');
    expect(() => service.verifySources(1, hod)).toThrow('chỉ được xem');
    expect(() => service.recalculate(2, hr)).toThrow('đã chốt');
    expect(() => service.reopenPeriod(2, 'Cần kiểm tra dữ liệu mới.', hod)).toThrow('Chỉ HR');
  });
});
describe('closing, versions and snapshot integrity', () => {
  it('does not duplicate a correction already applied when completing the demo', () => {
    const a = propose();
    service.approveAdjustment(a.id, hr);
    service.applyAdjustment(a.id, hr);
    service.completeDemoData(1, hr);
    expect(service.state.adjustments).toHaveLength(36);
    expect(service.state.runtime[1].dataVersion).toBe(136);
    expect(service.currentIssues(1)[0].trangThai).toBe('IN_REVIEW');
  });
  it('cannot close before all blockers are satisfied; shortcut still requires reconciliation and HOD approvals', async () => {
    expect(() => service.closePeriod(1, hr, 100)).toThrow();
    service.completeDemoData(1, hr);
    expect(service.getClosingEligibility(1).blockers.map((b) => b.code)).toContain(
      'RECONCILIATION',
    );
    expect(() => service.approveDepartment(1, 'FO', hod)).toThrow();
    await service.runReconciliation(1, { type: 'PERIOD' }, hr);
    expect(service.getClosingEligibility(1).blockers.map((b) => b.code)).toEqual(['APPROVALS']);
    for (const d of service.state.departments) service.approveDepartment(1, d.code, hr);
    expect(service.getClosingEligibility(1).canClose).toBe(true);
    expect(service.state.periods[0].trangThai).toBe('REVIEWED');
  });
  it('invalidates old approvals when another correction is applied', async () => {
    await ready();
    service.simulateSourceChange(1, 'FO', hr);
    expect(service.approvalFor(1, 'FO')!.trangThai).toBe('INVALIDATED');
    expect(service.getClosingEligibility(1).canClose).toBe(false);
    expect(
      service.getClosingEligibility(1).blockers.find((b) => b.code === 'APPROVALS')!.count,
    ).toBe(3);
    expect(service.state.periods[0].trangThai).toBe('RECONCILING');
  });
  it('closes, hands over, reopens and recloses without modifying any earlier snapshot', async () => {
    await ready();
    const version = service.state.runtime[1].dataVersion;
    expect(() => service.closePeriod(1, hr, version - 1)).toThrow('thay đổi');
    service.closePeriod(1, hr, version);
    expect(service.getSnapshots(1, 1)).toHaveLength(24);
    const original = JSON.stringify(service.getSnapshots(1, 1));
    service.handover(1, 1, payroll);
    expect(service.state.runtime[1].handoverVersions).toContain(1);
    expect(() => service.handover(1, 1, payroll)).toThrow('đã được bàn giao');
    expect(() => service.reopenPeriod(1, '', hr)).toThrow('lý do');
    service.reopenPeriod(1, 'Bổ sung xác nhận cuối kỳ của bộ phận.', hr);
    expect(service.state.periods[0].trangThai).toBe('REOPENED');
    expect(() => service.handover(1, 1, payroll)).toThrow('snapshot hợp lệ');
    expect(service.getClosingEligibility(1).canClose).toBe(false);
    service.recalculate(1, hr);
    await service.runReconciliation(1, { type: 'PERIOD' }, hr);
    for (const d of service.state.departments) service.approveDepartment(1, d.code, hr);
    service.closePeriod(1, hr, service.state.runtime[1].dataVersion);
    expect(service.getSnapshots(1, 2)).toHaveLength(24);
    expect(JSON.stringify(service.getSnapshots(1, 1))).toBe(original);
    expect(
      service.state.closingHistory.filter((h) => h.kyChamCongId === 1).map((h) => h.hanhDong),
    ).toEqual(['CLOSE', 'REOPEN', 'RECLOSE']);
    expect(service.state.periods[0].phienBanChot).toBe(2);
  });
  it('blocks mutation during asynchronous runs and keeps reactive run status current', async () => {
    service = createReconciliationService(reactive(createReconciliationFixtures()));
    const promise = service.runReconciliation(1, { type: 'PERIOD' }, hr);
    expect(service.state.runs.at(-1)!.trangThai).toBe('RUNNING');
    expect(() => propose()).toThrow('Đang chạy');
    await promise;
    expect(service.state.runs.at(-1)!.trangThai).toBe('COMPLETED');
  });
  it('detects changed source data after reopening and reflects the correction in v2 while keeping v1 unchanged', async () => {
    await ready();
    service.closePeriod(1, hr, service.state.runtime[1].dataVersion);
    const old = JSON.stringify(service.getSnapshots(1, 1));
    const oldTotal = service
      .getSnapshots(1, 1)
      .reduce((total, s) => total + s.snapshot.congThucTe, 0);
    service.reopenPeriod(1, 'Bổ sung xác nhận nghỉ trong ca của bộ phận.', hr);
    service.simulateSourceChange(1, 'FO', hr);
    service.verifySources(1, hr);
    service.recalculate(1, hr);
    const failed = await service.runReconciliation(1, { type: 'PERIOD', fail: true }, hr);
    expect(failed.trangThai).toBe('FAILED');
    expect(service.state.runtime[1].sourceChanges).toHaveLength(1);
    await service.runReconciliation(1, { type: 'PERIOD' }, hr);
    const newIssue = service.getIssues({ periodId: 1, status: 'OPEN' });
    expect(newIssue).toHaveLength(1);
    expect(newIssue[0].issue.maLoi).toBe('A13');
    expect(newIssue[0].context.expectedMinutes).toBe(420);
    expect(service.getClosingEligibility(1).canClose).toBe(false);
    service.completeDemoData(1, hr);
    await service.runReconciliation(1, { type: 'PERIOD' }, hr);
    for (const d of service.state.departments) service.approveDepartment(1, d.code, hr);
    service.closePeriod(1, hr, service.state.runtime[1].dataVersion);
    const newTotal = service
      .getSnapshots(1, 2)
      .reduce((total, s) => total + s.snapshot.congThucTe, 0);
    expect(newTotal).toBeCloseTo(oldTotal - 0.125);
    expect(JSON.stringify(service.getSnapshots(1, 1))).toBe(old);
  });
  it('never uses network or persistence while completing the end-to-end scenario', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockImplementation(() => {
      throw new Error('Unexpected network request');
    });
    try {
      await ready();
      service.closePeriod(1, hr, service.state.runtime[1].dataVersion);
      expect(fetchSpy).not.toHaveBeenCalled();
    } finally {
      fetchSpy.mockRestore();
    }
    const issueStatuses = new Set(service.state.issues.map((i) => i.trangThai));
    expect(
      [...issueStatuses].every((s) =>
        ['OPEN', 'IN_REVIEW', 'RESOLVED', 'ACCEPTED', 'SUPERSEDED'].includes(s),
      ),
    ).toBe(true);
    expect(service.state.audit.length).toBeGreaterThan(100);
  });
});
