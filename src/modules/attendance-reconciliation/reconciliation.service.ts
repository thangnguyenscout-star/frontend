import {
  buildSnapshot,
  createReconciliationFixtures,
  stableIssueKey,
} from './reconciliation.fixtures';
import type {
  Actor,
  AdjustmentPayload,
  ClosingEligibility,
  DieuChinhChamCong,
  DoiSoatCongChiTiet,
  IssueFilters,
  IssueViewModel,
  ReconciliationState,
  RunScope,
  SnapshotViewModel,
} from './reconciliation.types';

const active = (issue: DoiSoatCongChiTiet) => ['OPEN', 'IN_REVIEW'].includes(issue.trangThai);
const nextId = (items: Array<{ id: number }>) => Math.max(0, ...items.map((r) => r.id)) + 1;
const now = () => new Date().toISOString();
const round = (value: number) => Math.round(value * 10000) / 10000;

/** Local adapter only. No transport, persistence or production permissions are changed. */
export function createReconciliationService(
  state: ReconciliationState = createReconciliationFixtures(),
) {
  const period = (id: number) => {
    const value = state.periods.find((p) => p.id === id);
    if (!value) throw new Error('Không tìm thấy kỳ công.');
    return value;
  };
  const actorName = (actor: Actor) =>
    actor.role === 'HOD'
      ? `HOD · ${state.departments.find((d) => d.code === actor.departmentCode)?.head || actor.departmentCode}`
      : `${actor.role} · Nguyễn Minh Anh`;
  function audit(periodId: number, actor: Actor, message: string, issueKey: string | null = null) {
    state.audit.push({
      id: nextId(state.audit),
      periodId,
      issueKey,
      at: now(),
      actor: actorName(actor),
      message,
    });
  }
  function authorize(id: number, actor: Actor, departmentCode?: string | null, hrOnly = false) {
    if (actor.role === 'Payroll' || (hrOnly && actor.role !== 'HR'))
      throw new Error('Vai trò hiện tại chỉ được xem nội dung này.');
    if (actor.role === 'HOD' && (!departmentCode || actor.departmentCode !== departmentCode))
      throw new Error('HOD chỉ được thao tác trên bộ phận đang phụ trách.');
    if (period(id).trangThai === 'CLOSED')
      throw new Error('Kỳ đã chốt. HR cần mở lại kỳ trước khi điều chỉnh.');
    if (state.runs.some((r) => r.kyChamCongId === id && r.trangThai === 'RUNNING'))
      throw new Error('Đang chạy đối soát. Vui lòng chờ hoàn tất.');
  }
  const reason = (value: string) => {
    if (value.trim().length < 8) throw new Error('Vui lòng nhập lý do rõ ràng, ít nhất 8 ký tự.');
    return value.trim();
  };
  const issuePeriod = (issue: DoiSoatCongChiTiet) =>
    state.runs.find((r) => r.id === issue.doiSoatCongId)!.kyChamCongId;
  function currentIssues(id: number) {
    const completedIds = new Set(
      state.runs
        .filter((r) => r.kyChamCongId === id && r.trangThai === 'COMPLETED')
        .map((r) => r.id),
    );
    const byKey = new Map<string, DoiSoatCongChiTiet>();
    // Merge complete results by business key. Incremental runs replace only their own keys.
    for (const issue of state.issues)
      if (completedIds.has(issue.doiSoatCongId)) byKey.set(issue.issueKey, issue);
    return [...byKey.values()].filter((i) => i.trangThai !== 'SUPERSEDED');
  }
  function getIssue(id: number) {
    const issue = state.issues.find((i) => i.id === id);
    if (!issue) throw new Error('Không tìm thấy bất thường.');
    return issue;
  }
  function editableIssue(id: number, actor: Actor) {
    const issue = getIssue(id);
    const pid = issuePeriod(issue);
    authorize(pid, actor, issue.maBoPhan);
    if (!currentIssues(pid).some((i) => i.id === id))
      throw new Error('Kết quả này đã được thay thế. Vui lòng mở kết quả hiện hành.');
    return issue;
  }
  function linkedAdjustments(issue: DoiSoatCongChiTiet) {
    const ids = new Set(state.issues.filter((i) => i.issueKey === issue.issueKey).map((i) => i.id));
    return state.adjustments.filter((a) => ids.has(a.doiSoatChiTietId));
  }
  function view(issue: DoiSoatCongChiTiet): IssueViewModel {
    const employee = state.employees.find((e) => e.code === issue.maNhanVien)!;
    const context = state.contexts[issue.issueKey];
    const run = state.runs.find((r) => r.id === issue.doiSoatCongId)!;
    return {
      issue,
      employeeName: employee.name,
      departmentName:
        state.departments.find((d) => d.code === issue.maBoPhan)?.name || 'Chưa xác định',
      context,
      shift: state.calculations.find((s) => s.id === context.shiftId)!,
      isStale: run.dataVersion !== state.runtime[run.kyChamCongId].dataVersion,
      pendingAdjustment: linkedAdjustments(issue).at(-1) || null,
    };
  }
  function getIssues(filters: IssueFilters) {
    const q = filters.search?.trim().toLocaleLowerCase('vi-VN') || '';
    const rows = filters.runId
      ? state.issues.filter(
          (i) => i.doiSoatCongId === filters.runId && issuePeriod(i) === filters.periodId,
        )
      : currentIssues(filters.periodId);
    return rows
      .map(view)
      .filter(
        (row) =>
          (!filters.departmentCode || row.issue.maBoPhan === filters.departmentCode) &&
          (!filters.employeeCode || row.issue.maNhanVien === filters.employeeCode) &&
          (!filters.date || row.issue.ngayCong === filters.date) &&
          (!filters.code || row.issue.maLoi === filters.code) &&
          (!filters.severity || row.issue.mucDo === filters.severity) &&
          (!filters.status || row.issue.trangThai === filters.status) &&
          (!q ||
            `${row.employeeName} ${row.issue.maNhanVien} ${row.issue.maLoi} ${row.issue.moTa}`
              .toLocaleLowerCase('vi-VN')
              .includes(q)),
      );
  }
  function invalidate(id: number, departmentCode: string | null, message: string) {
    for (const approval of state.approvals) {
      if (
        approval.kyChamCongId === id &&
        approval.maBoPhan === departmentCode &&
        approval.trangThai === 'APPROVED'
      ) {
        approval.trangThai = 'INVALIDATED';
        approval.ghiChu = message;
      }
    }
    if (period(id).trangThai === 'REVIEWED') period(id).trangThai = 'RECONCILING';
  }
  function beginReview(id: number, actor: Actor) {
    const issue = editableIssue(id, actor);
    if (issue.trangThai !== 'OPEN')
      throw new Error('Chỉ bắt đầu xác minh trường hợp mới phát hiện.');
    issue.trangThai = 'IN_REVIEW';
    invalidate(issuePeriod(issue), issue.maBoPhan, 'Bất thường đang được xác minh lại.');
    audit(issuePeriod(issue), actor, 'Bắt đầu xác minh bất thường.', issue.issueKey);
  }
  function validatePayload(issue: DoiSoatCongChiTiet, payload: AdjustmentPayload) {
    reason(payload.reason);
    if (payload.type === 'CHANGE_SHIFT')
      throw new Error('Đổi ca chỉ xem xét trong Phase 0; schema chưa có trường ca đích.');
    if (payload.type === 'OTHER')
      throw new Error('Vui lòng chọn loại điều chỉnh có giá trị kiểm chứng được.');
    const shift = view(issue).shift;
    if (
      payload.type === 'WORK_MINUTES' &&
      (!Number.isInteger(payload.minutes) ||
        payload.minutes! < 0 ||
        payload.minutes! > shift.standardMinutes)
    )
      throw new Error(`Số phút công phải là số nguyên từ 0 đến ${shift.standardMinutes}.`);
    const checkTime = (value: string | null | undefined) => {
      const stamp = value ? Date.parse(value) : NaN;
      if (
        !Number.isFinite(stamp) ||
        stamp < Date.parse(shift.start) - 12 * 3600000 ||
        stamp > Date.parse(shift.end) + 12 * 3600000
      )
        throw new Error('Giờ điều chỉnh phải hợp lệ và nằm trong khoảng ngày/ca được xử lý.');
    };
    if (['ADD_IN', 'CHANGE_IN'].includes(payload.type)) checkTime(payload.newIn);
    if (['ADD_OUT', 'CHANGE_OUT'].includes(payload.type)) checkTime(payload.newOut);
    const inTime = payload.newIn || shift.originalIn;
    const outTime = payload.newOut || shift.originalOut;
    if (inTime && outTime && Date.parse(inTime) >= Date.parse(outTime))
      throw new Error('Giờ ra phải sau giờ vào; ca đêm cần chọn đúng ngày hôm sau.');
  }
  function submitAdjustment(id: number, payload: AdjustmentPayload, actor: Actor) {
    const issue = editableIssue(id, actor);
    if (!active(issue))
      throw new Error('Trường hợp đã kết thúc; cần chạy đối soát mới trước khi tạo đề xuất.');
    if (linkedAdjustments(issue).some((a) => ['PENDING', 'APPROVED'].includes(a.trangThai)))
      throw new Error('Đã có đề xuất đang chờ xử lý.');
    validatePayload(issue, payload);
    const adjustment: DieuChinhChamCong = {
      id: nextId(state.adjustments),
      doiSoatChiTietId: id,
      maNhanVien: issue.maNhanVien,
      ngayCong: issue.ngayCong,
      loaiDieuChinh: payload.type,
      phanCongCaId: issue.phanCongCaId,
      gioInMoi: ['ADD_IN', 'CHANGE_IN'].includes(payload.type) ? payload.newIn! : null,
      gioOutMoi: ['ADD_OUT', 'CHANGE_OUT'].includes(payload.type) ? payload.newOut! : null,
      soPhutDieuChinh: payload.type === 'WORK_MINUTES' ? payload.minutes! : null,
      lyDo: payload.reason.trim(),
      trangThai: 'PENDING',
      nguoiDeXuat: actorName(actor),
      deXuatLuc: now(),
      nguoiDuyet: null,
      duyetLuc: null,
      lyDoTuChoi: null,
      appliedAt: null,
      appliedBy: null,
      rowVer: '0x0000000000000001',
    };
    state.adjustments.push(adjustment);
    issue.trangThai = 'IN_REVIEW';
    invalidate(issuePeriod(issue), issue.maBoPhan, 'Có đề xuất điều chỉnh mới.');
    audit(
      issuePeriod(issue),
      actor,
      `Gửi đề xuất #${adjustment.id}: ${adjustment.lyDo}`,
      issue.issueKey,
    );
    return adjustment;
  }
  function adjustmentForAction(id: number, actor: Actor, status: string) {
    const adjustment = state.adjustments.find((a) => a.id === id);
    if (!adjustment) throw new Error('Không tìm thấy đề xuất.');
    const issue = getIssue(adjustment.doiSoatChiTietId);
    authorize(issuePeriod(issue), actor, issue.maBoPhan);
    if (adjustment.trangThai !== status)
      throw new Error('Trạng thái đề xuất đã thay đổi. Vui lòng kiểm tra lại.');
    return { adjustment, issue, pid: issuePeriod(issue) };
  }
  function approveAdjustment(id: number, actor: Actor) {
    const { adjustment, issue, pid } = adjustmentForAction(id, actor, 'PENDING');
    adjustment.trangThai = 'APPROVED';
    adjustment.nguoiDuyet = actorName(actor);
    adjustment.duyetLuc = now();
    audit(pid, actor, `Phê duyệt đề xuất #${id}; chưa áp dụng vào bản tính.`, issue.issueKey);
  }
  function rejectAdjustment(id: number, value: string, actor: Actor) {
    const explanation = reason(value);
    const { adjustment, issue, pid } = adjustmentForAction(id, actor, 'PENDING');
    adjustment.trangThai = 'REJECTED';
    adjustment.nguoiDuyet = actorName(actor);
    adjustment.duyetLuc = now();
    adjustment.lyDoTuChoi = explanation;
    audit(pid, actor, `Từ chối đề xuất #${id}: ${explanation}`, issue.issueKey);
  }
  function applyAdjustment(id: number, actor: Actor) {
    const { adjustment, issue, pid } = adjustmentForAction(id, actor, 'APPROVED');
    adjustment.trangThai = 'APPLIED';
    adjustment.appliedAt = now();
    adjustment.appliedBy = actorName(actor);
    state.runtime[pid].dataVersion++;
    const current = currentIssues(pid).find((i) => i.issueKey === issue.issueKey)!;
    current.trangThai = 'IN_REVIEW';
    current.resolvedAt = null;
    current.resolvedBy = null;
    invalidate(
      pid,
      issue.maBoPhan,
      'Dữ liệu công thay đổi sau khi áp dụng đề xuất; cần duyệt lại.',
    );
    period(pid).updatedAt = now();
    audit(
      pid,
      actor,
      `Áp dụng đề xuất #${id}; phiên bản dữ liệu ${state.runtime[pid].dataVersion}. Cần tính lại và đối soát lại.`,
      issue.issueKey,
    );
  }
  function acceptIssue(id: number, value: string, actor: Actor) {
    const explanation = reason(value);
    const issue = editableIssue(id, actor);
    if (!active(issue) || issue.mucDo === 'CRITICAL')
      throw new Error('Không thể bỏ qua lỗi nghiêm trọng hoặc trường hợp đã kết thúc.');
    if (linkedAdjustments(issue).some((a) => ['PENDING', 'APPROVED'].includes(a.trangThai)))
      throw new Error('Cần xử lý đề xuất đang chờ trước khi chấp nhận ngoại lệ.');
    issue.trangThai = 'ACCEPTED';
    issue.ghiChuXuLy = explanation;
    issue.resolvedAt = now();
    issue.resolvedBy = actorName(actor);
    invalidate(
      issuePeriod(issue),
      issue.maBoPhan,
      'Kết quả xác nhận ngoại lệ thay đổi; cần duyệt lại.',
    );
    audit(
      issuePeriod(issue),
      actor,
      `Chấp nhận ngoại lệ, giữ cảnh báo và log gốc: ${explanation}`,
      issue.issueKey,
    );
    refreshStatus(issuePeriod(issue));
  }
  function adjustmentPasses(issue: DoiSoatCongChiTiet) {
    const a = linkedAdjustments(issue)
      .filter((a) => a.trangThai === 'APPLIED')
      .at(-1);
    if (!a) return false;
    const { shift, context } = view(issue);
    if (a.loaiDieuChinh !== context.expectedType) return false;
    if (a.loaiDieuChinh === 'WORK_MINUTES')
      return a.soPhutDieuChinh === (context.expectedMinutes ?? shift.standardMinutes);
    if (a.gioInMoi) return Date.parse(a.gioInMoi) === Date.parse(shift.start);
    if (a.gioOutMoi) return Date.parse(a.gioOutMoi) === Date.parse(shift.end);
    return false;
  }
  function recalculate(id: number, actor: Actor, departmentCode?: string) {
    authorize(id, actor, departmentCode, true);
    for (const issue of currentIssues(id)) {
      if (!adjustmentPasses(issue)) continue;
      const { shift, context } = view(issue);
      shift.workedMinutes = context.expectedMinutes ?? shift.standardMinutes;
      shift.nightHours = shift.shift.startsWith('N') ? Math.min(8, shift.workedMinutes / 60) : 0;
      shift.leaveMinutes = 0;
      shift.lateMinutes = 0;
      shift.earlyMinutes = 0;
      if (issue.maLoi === 'A11') shift.overtimeHours = 2;
    }
    state.runtime[id].calculatedVersion = state.runtime[id].dataVersion;
    state.runtime[id].calculatedAt = now();
    audit(
      id,
      actor,
      `Tính lại toàn kỳ với phiên bản ${state.runtime[id].dataVersion}. Log gốc giữ nguyên; chờ đối soát kiểm chứng.`,
    );
  }
  async function runReconciliation(
    id: number,
    scope: { type: RunScope; departmentCode?: string; employeeCode?: string; fail?: boolean },
    actor: Actor,
  ) {
    authorize(id, actor, scope.departmentCode, scope.type === 'PERIOD');
    if (scope.type !== 'PERIOD' && !scope.departmentCode)
      throw new Error('Vui lòng chọn bộ phận cho phạm vi này.');
    if (
      scope.type === 'EMPLOYEE' &&
      !state.employees.some(
        (e) => e.code === scope.employeeCode && e.departmentCode === scope.departmentCode,
      )
    )
      throw new Error('Chọn nhân viên thuộc bộ phận đang xử lý.');
    if (state.runtime[id].calculatedVersion !== state.runtime[id].dataVersion)
      throw new Error('Bản tính đã cũ. Hãy mô phỏng tính lại trước khi đối soát.');
    const affected = currentIssues(id).filter(
      (i) =>
        (scope.type === 'PERIOD' || i.maBoPhan === scope.departmentCode) &&
        (scope.type !== 'EMPLOYEE' || i.maNhanVien === scope.employeeCode),
    );
    const run = {
      id: nextId(state.runs),
      kyChamCongId: id,
      maBoPhan: scope.type === 'PERIOD' ? null : scope.departmentCode!,
      phamVi: scope.type,
      lanChay:
        Math.max(0, ...state.runs.filter((r) => r.kyChamCongId === id).map((r) => r.lanChay)) + 1,
      trangThai: 'RUNNING' as const as 'RUNNING' | 'COMPLETED' | 'FAILED',
      dataVersion: state.runtime[id].dataVersion,
      tongNhanVien: state.employees.filter(
        (e) =>
          (scope.type === 'PERIOD' || e.departmentCode === scope.departmentCode) &&
          (scope.type !== 'EMPLOYEE' || e.code === scope.employeeCode),
      ).length,
      tongBatThuong: affected.length,
      batDauLuc: now(),
      ketThucLuc: null as string | null,
      nguoiChay: actorName(actor),
      loiXuLy: null as string | null,
    };
    state.runs.push(run);
    audit(
      id,
      actor,
      `Bắt đầu đối soát lần ${run.lanChay}, phạm vi ${scope.type}${scope.employeeCode ? ' · ' + scope.employeeCode + ' (bộ lọc demo)' : ''}.`,
    );
    await new Promise((resolve) => setTimeout(resolve, 180));
    // Use stored reference: Vue wraps inserted objects; mutating the raw object bypasses reactivity.
    const storedRun = state.runs.find((r) => r.id === run.id)!;
    storedRun.ketThucLuc = now();
    if (scope.fail) {
      storedRun.trangThai = 'FAILED';
      storedRun.loiXuLy = 'Lỗi kiểm tra dữ liệu mô phỏng. Giữ nguyên kết quả hoàn thành trước đó.';
      audit(id, actor, `Lần đối soát ${run.lanChay} thất bại; không thay thế kết quả hiện hành.`);
      return storedRun;
    }
    let issueId = nextId(state.issues);
    for (const old of affected) {
      const resolved = adjustmentPasses(old);
      const wasAccepted = old.trangThai === 'ACCEPTED';
      const replacement: DoiSoatCongChiTiet = {
        ...old,
        id: issueId++,
        doiSoatCongId: run.id,
        trangThai: resolved
          ? 'RESOLVED'
          : wasAccepted
            ? 'ACCEPTED'
            : old.trangThai === 'RESOLVED'
              ? 'OPEN'
              : old.trangThai,
        resolvedAt: resolved ? now() : wasAccepted ? old.resolvedAt : null,
        resolvedBy: resolved ? actorName(actor) : wasAccepted ? old.resolvedBy : null,
        giaTriThucTe: `${view(old).shift.workedMinutes} phút công`,
        createdAt: now(),
        rowVer: `0x${run.id.toString(16).padStart(16, '0')}`,
      };
      old.trangThai = 'SUPERSEDED';
      state.issues.push(replacement);
    }
    const sourceChanges = state.runtime[id].sourceChanges.filter(
      (change) =>
        (scope.type === 'PERIOD' || change.departmentCode === scope.departmentCode) &&
        (scope.type !== 'EMPLOYEE' ||
          state.calculations.find((s) => s.id === change.shiftId)?.employeeCode ===
            scope.employeeCode),
    );
    for (const change of sourceChanges) {
      const shift = state.calculations.find((s) => s.id === change.shiftId)!;
      state.contexts[change.key] = {
        shiftId: shift.id,
        expectedType: 'WORK_MINUTES',
        expectedMinutes: change.expectedMinutes,
        leave: 'Có xác nhận bổ sung về thời lượng làm việc thực tế; cần đối chiếu công.',
        overtime: 'Không có OT chờ duyệt.',
        holiday: 'Ngày làm việc bình thường.',
        assignment: shift.shift,
        extraLogs: [],
      };
      state.issues.push({
        id: issueId++,
        doiSoatCongId: run.id,
        maNhanVien: shift.employeeCode,
        maBoPhan: shift.departmentCode,
        ngayCong: shift.date,
        phanCongCaId: shift.id,
        maLoi: 'A13',
        mucDo: 'WARNING',
        trangThai: 'OPEN',
        moTa: 'Xác nhận công thay đổi sau HOD duyệt',
        giaTriDuKien: `${change.expectedMinutes} phút công theo xác nhận bổ sung`,
        giaTriThucTe: `${shift.workedMinutes} phút công`,
        issueKey: change.key,
        resolvedAt: null,
        resolvedBy: null,
        ghiChuXuLy: null,
        createdAt: now(),
        rowVer: '0x0000000000000001',
      });
    }
    const consumed = new Set(sourceChanges.map((c) => c.key));
    state.runtime[id].sourceChanges = state.runtime[id].sourceChanges.filter(
      (c) => !consumed.has(c.key),
    );
    storedRun.tongBatThuong += sourceChanges.length;
    storedRun.trangThai = 'COMPLETED';
    if (period(id).trangThai === 'OPEN') period(id).trangThai = 'RECONCILING';
    audit(
      id,
      actor,
      `Hoàn thành lần đối soát ${run.lanChay}; kết quả được hợp nhất theo mã bất thường ổn định.`,
    );
    refreshStatus(id);
    return storedRun;
  }
  function approvalFor(id: number, departmentCode: string) {
    return state.approvals
      .filter((a) => a.kyChamCongId === id && a.maBoPhan === departmentCode)
      .at(-1);
  }
  function departmentEligibility(id: number, departmentCode: string) {
    const errors: string[] = [];
    const runtime = state.runtime[id];
    if (period(id).trangThai === 'CLOSED') errors.push('Kỳ công đã chốt.');
    if (runtime.sources.some((s) => s.important && s.status !== 'READY'))
      errors.push('Nguồn dữ liệu chưa sẵn sàng.');
    if (runtime.calculatedVersion !== runtime.dataVersion) errors.push('Bản tính chưa cập nhật.');
    const rows = currentIssues(id).filter((i) => i.maBoPhan === departmentCode);
    if (rows.some((i) => active(i) && i.mucDo !== 'INFO')) errors.push('Còn bất thường cần xử lý.');
    if (
      rows.some(
        (i) =>
          state.runs.find((r) => r.id === i.doiSoatCongId)!.dataVersion !== runtime.dataVersion,
      )
    )
      errors.push('Kết quả đối soát thuộc phiên bản cũ.');
    if (
      rows.some((i) =>
        linkedAdjustments(i).some((a) => ['PENDING', 'APPROVED'].includes(a.trangThai)),
      )
    )
      errors.push('Còn đề xuất chưa hoàn tất.');
    if (
      !state.runs.some(
        (r) =>
          r.kyChamCongId === id &&
          r.trangThai === 'COMPLETED' &&
          r.dataVersion === runtime.dataVersion &&
          (r.phamVi === 'PERIOD' || r.maBoPhan === departmentCode),
      )
    )
      errors.push('Chưa có lần đối soát hợp lệ.');
    if (state.runs.some((r) => r.kyChamCongId === id && r.trangThai === 'RUNNING'))
      errors.push('Đang chạy đối soát.');
    return errors;
  }
  function approveDepartment(id: number, departmentCode: string, actor: Actor) {
    authorize(id, actor, departmentCode);
    if (!state.departments.some((d) => d.code === departmentCode))
      throw new Error('Bộ phận không hợp lệ.');
    const errors = departmentEligibility(id, departmentCode);
    if (errors.length) throw new Error(errors.join(' '));
    const previous = approvalFor(id, departmentCode);
    if (
      previous?.trangThai === 'APPROVED' &&
      previous.dataVersion === state.runtime[id].dataVersion
    )
      throw new Error('Bộ phận đã được duyệt ở phiên bản hiện hành.');
    state.approvals.push({
      id: nextId(state.approvals),
      kyChamCongId: id,
      maBoPhan: departmentCode,
      lanDuyet: (previous?.lanDuyet || 0) + 1,
      dataVersion: state.runtime[id].dataVersion,
      trangThai: 'APPROVED',
      tongNhanVien: state.employees.filter((e) => e.departmentCode === departmentCode).length,
      nguoiDuyet: actorName(actor),
      duyetLuc: now(),
      ghiChu: null,
      createdAt: now(),
      rowVer: '0x0000000000000001',
    });
    audit(
      id,
      actor,
      `Duyệt công ${departmentCode}, lần ${(previous?.lanDuyet || 0) + 1}, phiên bản ${state.runtime[id].dataVersion}.`,
    );
    refreshStatus(id);
  }
  function getClosingEligibility(id: number): ClosingEligibility {
    const runtime = state.runtime[id],
      issues = currentIssues(id);
    const blockers: ClosingEligibility['blockers'] = [];
    const add = (code: string, label: string, count: number, targetStep: number) => {
      if (count) blockers.push({ code, label, count, targetStep });
    };
    add(
      'SOURCES',
      'Nguồn dữ liệu chưa sẵn sàng',
      runtime.sources.filter((s) => s.important && s.status !== 'READY').length,
      1,
    );
    add(
      'CALCULATION',
      'Bản tính cần được tính lại',
      runtime.calculatedVersion !== runtime.dataVersion ? 1 : 0,
      2,
    );
    add(
      'CRITICAL',
      'Bất thường nghiêm trọng chưa xử lý',
      issues.filter((i) => i.mucDo === 'CRITICAL' && i.trangThai !== 'RESOLVED').length,
      3,
    );
    add(
      'WARNING',
      'Cảnh báo cần xác nhận chưa giải quyết',
      issues.filter((i) => i.mucDo === 'WARNING' && active(i)).length,
      3,
    );
    add(
      'ADJUSTMENTS',
      'Đề xuất đang chờ duyệt hoặc áp dụng',
      state.adjustments.filter(
        (a) =>
          issuePeriod(getIssue(a.doiSoatChiTietId)) === id &&
          ['PENDING', 'APPROVED'].includes(a.trangThai),
      ).length,
      3,
    );
    add(
      'RECONCILIATION',
      'Cần đối soát toàn kỳ ở phiên bản hiện hành',
      !runtime.sourceChanges.length &&
        state.runs.some(
          (r) =>
            r.kyChamCongId === id &&
            r.phamVi === 'PERIOD' &&
            r.trangThai === 'COMPLETED' &&
            r.dataVersion === runtime.dataVersion,
        ) &&
        !issues.some(
          (i) =>
            state.runs.find((r) => r.id === i.doiSoatCongId)!.dataVersion !== runtime.dataVersion,
        )
        ? 0
        : 1,
      2,
    );
    add(
      'RUNNING',
      'Có lần đối soát đang chạy',
      state.runs.filter((r) => r.kyChamCongId === id && r.trangThai === 'RUNNING').length,
      2,
    );
    add(
      'LEAVE_OT',
      'Nghỉ phép hoặc OT chưa được xác nhận',
      issues.filter((i) => ['A10', 'A11'].includes(i.maLoi) && active(i)).length,
      3,
    );
    add(
      'APPROVALS',
      'Bộ phận chưa duyệt đúng phiên bản',
      state.departments.filter((d) => {
        const approval = approvalFor(id, d.code);
        return approval?.trangThai !== 'APPROVED' || approval.dataVersion !== runtime.dataVersion;
      }).length,
      4,
    );
    const shifts = state.calculations.filter((s) => s.periodId === id);
    add(
      'TOTALS',
      'Tổng công chưa nhất quán',
      shifts.filter(
        (s) =>
          !Number.isFinite(s.workedMinutes) ||
          s.workedMinutes < 0 ||
          s.workedMinutes + s.leaveMinutes > s.standardMinutes,
      ).length,
      2,
    );
    add(
      'SNAPSHOT',
      'Chưa đủ dữ liệu tạo snapshot cho nhân viên',
      state.employees.filter((e) => !shifts.some((s) => s.employeeCode === e.code)).length,
      6,
    );
    add(
      'CLOSED',
      'Kỳ đã chốt; chỉ được xem snapshot',
      period(id).trangThai === 'CLOSED' ? 1 : 0,
      6,
    );
    return { canClose: blockers.length === 0, blockers };
  }
  function refreshStatus(id: number) {
    const p = period(id);
    if (p.trangThai === 'CLOSED') return;
    const eligible = getClosingEligibility(id).canClose;
    if (eligible) p.trangThai = 'REVIEWED';
    else if (p.trangThai === 'REVIEWED') p.trangThai = 'RECONCILING';
  }
  function closePeriod(id: number, actor: Actor, confirmedVersion: number) {
    authorize(id, actor, undefined, true);
    const eligibility = getClosingEligibility(id);
    if (confirmedVersion !== state.runtime[id].dataVersion)
      throw new Error('Dữ liệu đã thay đổi sau khi mở xác nhận. Hãy kiểm tra lại.');
    if (!eligibility.canClose) throw new Error(eligibility.blockers.map((b) => b.label).join('; '));
    const p = period(id),
      at = now(),
      version = p.phienBanChot + 1;
    const snapshots = buildSnapshot(state, id, version, at);
    for (const s of snapshots) {
      s.congThucTe = round(s.congThucTe);
      s.congPhep = round(s.congPhep);
    }
    p.trangThai = 'REVIEWED';
    state.closingHistory.push({
      id: nextId(state.closingHistory),
      kyChamCongId: id,
      hanhDong: version === 1 ? 'CLOSE' : 'RECLOSE',
      trangThaiTruoc: 'REVIEWED',
      trangThaiSau: 'CLOSED',
      phienBanChot: version,
      nguoiThucHien: actorName(actor),
      thoiGian: at,
      lyDo: 'Đã kiểm tra đầy đủ điều kiện chốt trong phiên mô phỏng.',
      correlationId: `demo-close-${id}-${version}`,
    });
    state.snapshots.push(...snapshots);
    p.phienBanChot = version;
    p.trangThai = 'CLOSED';
    p.updatedAt = at;
    audit(
      id,
      actor,
      `Chốt kỳ ${p.maKy}; tạo snapshot bất biến phiên bản ${version} cho ${snapshots.length} nhân viên.`,
    );
  }
  function reopenPeriod(id: number, value: string, actor: Actor) {
    if (actor.role !== 'HR') throw new Error('Chỉ HR demo được mở lại kỳ.');
    const explanation = reason(value),
      p = period(id);
    if (p.trangThai !== 'CLOSED') throw new Error('Chỉ mở lại kỳ đã chốt.');
    p.trangThai = 'REOPENED';
    p.updatedAt = now();
    state.runtime[id].dataVersion++;
    for (const a of state.approvals.filter(
      (a) => a.kyChamCongId === id && a.trangThai === 'APPROVED',
    )) {
      a.trangThai = 'INVALIDATED';
      a.ghiChu = 'Kỳ công đã mở lại; cần xác minh và duyệt phiên bản mới.';
    }
    state.closingHistory.push({
      id: nextId(state.closingHistory),
      kyChamCongId: id,
      hanhDong: 'REOPEN',
      trangThaiTruoc: 'CLOSED',
      trangThaiSau: 'REOPENED',
      phienBanChot: p.phienBanChot,
      nguoiThucHien: actorName(actor),
      thoiGian: now(),
      lyDo: explanation,
      correlationId: `demo-reopen-${id}-${state.runtime[id].dataVersion}`,
    });
    audit(id, actor, `Mở lại kỳ: ${explanation}. Snapshot ${p.phienBanChot} được giữ nguyên.`);
  }
  function getSnapshots(
    id: number,
    version?: number,
    departmentCode?: string,
  ): SnapshotViewModel[] {
    return state.snapshots
      .filter(
        (s) =>
          s.kyChamCongId === id &&
          (!version || s.phienBanChot === version) &&
          (!departmentCode || s.maBoPhan === departmentCode),
      )
      .map((snapshot) => ({
        snapshot,
        employeeName: state.employees.find((e) => e.code === snapshot.maNhanVien)!.name,
        departmentName: state.departments.find((d) => d.code === snapshot.maBoPhan)!.name,
        ...state.snapshotDetails[snapshot.id],
      }));
  }
  function handover(id: number, version: number, actor: Actor) {
    const p = period(id);
    if (actor.role !== 'HR' && actor.role !== 'Payroll')
      throw new Error('Chỉ HR hoặc Payroll demo được xác nhận bàn giao.');
    if (
      p.trangThai !== 'CLOSED' ||
      p.phienBanChot !== version ||
      getSnapshots(id, version).length !== state.employees.length
    )
      throw new Error('Chỉ bàn giao snapshot hợp lệ của lần chốt hiện hành.');
    if (state.runtime[id].handoverVersions.includes(version))
      throw new Error('Phiên bản này đã được bàn giao mô phỏng.');
    state.runtime[id].handoverVersions.push(version);
    audit(id, actor, `Mô phỏng bàn giao Payroll snapshot ${version}; không gửi dữ liệu ra ngoài.`);
  }
  function verifySources(id: number, actor: Actor) {
    authorize(id, actor, undefined, true);
    for (const source of state.runtime[id].sources) {
      source.status = 'READY';
      source.updatedAt = now();
    }
    audit(id, actor, 'Mô phỏng kiểm tra đủ các nguồn dữ liệu; các bất thường vẫn cần xử lý riêng.');
    refreshStatus(id);
  }
  function completeDemoData(id: number, actor: Actor) {
    authorize(id, actor, undefined, true);
    verifySources(id, actor);
    for (const issue of currentIssues(id).filter(active)) {
      if (adjustmentPasses(issue)) continue;
      let adjustment = linkedAdjustments(issue)
        .filter((a) => ['PENDING', 'APPROVED'].includes(a.trangThai))
        .at(-1);
      if (!adjustment) {
        const { context, shift } = view(issue);
        adjustment = submitAdjustment(
          issue.id,
          {
            type: context.expectedType,
            reason: 'Hoàn tất kịch bản kiểm chứng dữ liệu mô phỏng.',
            newIn: shift.start,
            newOut: shift.end,
            minutes: context.expectedMinutes ?? shift.standardMinutes,
          },
          actor,
        );
      }
      if (adjustment.trangThai === 'PENDING') approveAdjustment(adjustment.id, actor);
      if (adjustment.trangThai === 'APPROVED') applyAdjustment(adjustment.id, actor);
    }
    recalculate(id, actor);
    audit(
      id,
      actor,
      'Hoàn tất đề xuất và bản tính demo. Vẫn cần chạy đối soát rồi HOD duyệt từng bộ phận.',
    );
  }
  function getOverview(id: number, departmentCode?: string) {
    const rows = getIssues({ periodId: id, departmentCode });
    const shifts = state.calculations.filter(
      (s) => s.periodId === id && (!departmentCode || s.departmentCode === departmentCode),
    );
    const departments = state.departments.filter(
      (d) => !departmentCode || d.code === departmentCode,
    );
    const unresolved = rows.filter((r) => active(r.issue));
    const approved = departments.filter((d) => {
      const a = approvalFor(id, d.code);
      return a?.trangThai === 'APPROVED' && a.dataVersion === state.runtime[id].dataVersion;
    }).length;
    return {
      employees: state.employees.filter(
        (e) => !departmentCode || e.departmentCode === departmentCode,
      ).length,
      shifts: shifts.length,
      calculatedShifts:
        state.runtime[id].calculatedVersion === state.runtime[id].dataVersion ? shifts.length : 0,
      unresolved: unresolved.length,
      critical: unresolved.filter((r) => r.issue.mucDo === 'CRITICAL').length,
      warning: unresolved.filter((r) => r.issue.mucDo === 'WARNING').length,
      approved,
      departments: departments.length,
      workDays: shifts.reduce((t, s) => t + s.workedMinutes / 480, 0),
      overtime: shifts.reduce((t, s) => t + s.overtimeHours, 0),
    };
  }
  function simulateSourceChange(id: number, departmentCode: string, actor: Actor) {
    authorize(id, actor, departmentCode, true);
    if (!state.departments.some((d) => d.code === departmentCode))
      throw new Error('Chọn bộ phận cần mô phỏng thay đổi.');
    const runtime = state.runtime[id];
    runtime.dataVersion++;
    const shift = state.calculations
      .filter((s) => s.periodId === id && s.departmentCode === departmentCode)
      .at(-1)!;
    const key = stableIssueKey(`${id}|${shift.id}|A13|source-${runtime.dataVersion}`);
    const expectedMinutes = Math.max(60, shift.workedMinutes - 60);
    runtime.sourceChanges.push({ departmentCode, shiftId: shift.id, expectedMinutes, key });
    const source = runtime.sources.find((s) => s.code === 'leave')!;
    source.count++;
    source.status = 'CHECK';
    source.updatedAt = now();
    invalidate(
      id,
      departmentCode,
      'Nguồn dữ liệu bộ phận được cập nhật sau khi duyệt. Cần kiểm tra và duyệt lại.',
    );
    audit(
      id,
      actor,
      `Mô phỏng xác nhận công mới của ${departmentCode}: ${expectedMinutes} phút, phiên bản ${runtime.dataVersion}. Cần kiểm tra nguồn, tính lại, đối soát và xử lý bất thường mới; log gốc giữ nguyên.`,
    );
  }
  return {
    state,
    getPeriods: () => state.periods,
    getOverview,
    getIssues,
    currentIssues,
    view,
    beginReview,
    submitAdjustment,
    approveAdjustment,
    rejectAdjustment,
    applyAdjustment,
    acceptIssue,
    recalculate,
    runReconciliation,
    getReconciliationRuns: (id: number, departmentCode?: string) =>
      state.runs
        .filter(
          (r) =>
            r.kyChamCongId === id &&
            (!departmentCode || !r.maBoPhan || r.maBoPhan === departmentCode),
        )
        .slice()
        .reverse(),
    approvalFor,
    departmentEligibility,
    approveDepartment,
    getClosingEligibility,
    closePeriod,
    reopenPeriod,
    getSnapshots,
    handover,
    verifySources,
    completeDemoData,
    simulateSourceChange,
  };
}
