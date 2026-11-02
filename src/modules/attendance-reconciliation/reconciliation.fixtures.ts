import type {
  ReconciliationState,
  AdjustmentType,
  Severity,
  CongThangSnapshot,
} from './reconciliation.types';

export const DEMO_NOTICE = 'Dữ liệu mô phỏng — chưa lưu lên hệ thống';
const seedTime = '2026-10-31T02:00:00.000Z';
export function stableIssueKey(value: string): string {
  // Deterministic 32-byte mock identifier, kept stable across reconciliation runs.
  return Array.from({ length: 8 }, (_, seed) => {
    let hash = 2166136261 ^ seed;
    for (const char of value) hash = Math.imul(hash ^ char.charCodeAt(0), 16777619);
    return (hash >>> 0).toString(16).padStart(8, '0');
  }).join('');
}
export function buildSnapshot(
  state: ReconciliationState,
  periodId: number,
  version: number,
  at: string,
): CongThangSnapshot[] {
  return state.employees.map((employee, i) => {
    const shifts = state.calculations.filter(
      (s) => s.periodId === periodId && s.employeeCode === employee.code,
    );
    const sum = (
      key:
        | 'standardMinutes'
        | 'workedMinutes'
        | 'leaveMinutes'
        | 'holidayDays'
        | 'overtimeHours'
        | 'lateMinutes'
        | 'earlyMinutes'
        | 'nightHours',
    ) => shifts.reduce((total, s) => total + s[key], 0);
    const id = periodId * 100000 + version * 1000 + i;
    state.snapshotDetails[id] = {
      regularHours: sum('workedMinutes') / 60,
      nightHours: sum('nightHours'),
      holidayHours: sum('holidayDays') * 8,
    };
    return {
      id,
      kyChamCongId: periodId,
      phienBanChot: version,
      maNhanVien: employee.code,
      maBoPhan: employee.departmentCode,
      congChuan: sum('standardMinutes') / 480,
      congThucTe: sum('workedMinutes') / 480,
      congPhep: sum('leaveMinutes') / 480,
      congLe: sum('holidayDays'),
      gioOT: sum('overtimeHours'),
      phutDiMuon: sum('lateMinutes'),
      phutVeSom: sum('earlyMinutes'),
      dataVersion: state.runtime[periodId].dataVersion,
      chotLuc: at,
      nguoiChot: 'HR · Nguyễn Minh Anh',
    };
  });
}
export function createReconciliationFixtures(): ReconciliationState {
  const state: ReconciliationState = {
    periods: [
      {
        id: 1,
        maKy: '10/2026',
        tuNgay: '2026-10-01',
        denNgay: '2026-10-31',
        trangThai: 'RECONCILING',
        phienBanChot: 0,
        createdAt: seedTime,
        updatedAt: null,
        rowVer: '0x0000000000000100',
      },
      {
        id: 2,
        maKy: '09/2026',
        tuNgay: '2026-09-01',
        denNgay: '2026-09-30',
        trangThai: 'CLOSED',
        phienBanChot: 1,
        createdAt: '2026-09-01T01:00:00Z',
        updatedAt: '2026-10-01T03:00:00Z',
        rowVer: '0x0000000000000090',
      },
    ],
    departments: [
      { code: 'FO', name: 'Lễ tân', head: 'Trần Hoàng Nam' },
      { code: 'HK', name: 'Buồng phòng', head: 'Lê Thu Hà' },
      { code: 'FB', name: 'Nhà hàng', head: 'Phạm Quốc Huy' },
    ],
    employees: [],
    runs: [],
    issues: [],
    adjustments: [],
    approvals: [],
    closingHistory: [],
    snapshots: [],
    calculations: [],
    contexts: {},
    runtime: {},
    audit: [],
    snapshotDetails: {},
  };
  const names = [
    'Nguyễn Minh Anh',
    'Trần Thị Ngọc',
    'Lê Hoàng Phúc',
    'Phạm Thu Trang',
    'Võ Thanh Tùng',
    'Đặng Mỹ Linh',
    'Bùi Quốc Bảo',
    'Đỗ Hải Yến',
    'Nguyễn Văn Khánh',
    'Trần Thanh Mai',
    'Lê Đức Huy',
    'Phạm Ngọc Hân',
    'Vũ Anh Tuấn',
    'Hoàng Thùy Dương',
    'Đinh Minh Khang',
    'Dương Bảo Châu',
    'Ngô Thành Đạt',
    'Hồ Phương Thảo',
    'Phan Gia Hưng',
    'Huỳnh Kim Ngân',
    'Mai Tiến Dũng',
    'Lý Như Quỳnh',
    'Đoàn Nhật Minh',
    'Tạ Thanh Tâm',
  ];
  state.employees = names.map((name, i) => ({
    code: 'NV' + String(i + 1).padStart(3, '0'),
    name,
    departmentCode: state.departments[Math.floor(i / 8)].code,
  }));
  for (const period of state.periods) {
    const month = period.id === 1 ? '10' : '09';
    state.runtime[period.id] = {
      calculatedAt: period.id === 1 ? seedTime : '2026-10-01T02:00:00Z',
      sourceChanges: [],
      dataVersion: period.id === 1 ? 100 : 90,
      calculatedVersion: period.id === 1 ? 100 : 90,
      handoverVersions: period.id === 2 ? [1] : [],
      sources: [
        ['shifts', 'Phân công ca', 528, 'Lịch ca đã được phân cho 24 nhân viên.'],
        [
          'logs',
          'Log máy chấm công',
          1042,
          'Log gốc chỉ đọc; thiếu log được xử lý bằng đề xuất riêng.',
        ],
        ['leave', 'Nghỉ phép', 12, 'Cần xác minh trường hợp nghỉ phép nhưng vẫn có log.'],
        ['holidays', 'Ngày lễ', 2, 'Danh mục ngày lễ và ngày nghỉ theo kỳ.'],
        [
          'ot',
          'Đăng ký tăng ca',
          18,
          'Các trường hợp OT chưa duyệt được theo dõi trong danh sách bất thường.',
        ],
        ['employees', 'Hồ sơ nhân viên', 24, 'Mã nhân viên và bộ phận đã được đối chiếu.'],
      ].map(([code, label, count, description]) => ({
        code: String(code),
        label: String(label),
        count: Number(count),
        description: String(description),
        status: code === 'leave' && period.id === 1 ? 'CHECK' : 'READY',
        important: true,
        updatedAt: seedTime,
      })),
    };
    for (const [employeeIndex, employee] of state.employees.entries()) {
      for (let dayIndex = 0; dayIndex < 22; dayIndex++) {
        const day = dayIndex < 20 ? dayIndex + 1 : dayIndex === 20 ? 29 : 30;
        const date = `2026-${month}-${String(day).padStart(2, '0')}`;
        const night = employeeIndex % 7 === 0 && day === 30;
        const nextDay = period.id === 1 ? '2026-10-31' : '2026-10-01';
        const start = `${date}T${night ? '22' : '08'}:00:00+07:00`;
        const end = `${night ? nextDay : date}T${night ? '06' : '17'}:00:00+07:00`;
        state.calculations.push({
          id: period.id * 10000 + employeeIndex * 100 + dayIndex,
          periodId: period.id,
          employeeCode: employee.code,
          departmentCode: employee.departmentCode,
          date,
          shift: night ? 'N · Ca đêm' : 'HC · Hành chính',
          start,
          end,
          originalIn: start,
          originalOut: end,
          standardMinutes: 480,
          workedMinutes: 480,
          leaveMinutes: 0,
          overtimeHours: employeeIndex % 5 === 0 && day === 15 ? 2 : 0,
          holidayDays: 0,
          lateMinutes: 0,
          earlyMinutes: 0,
          nightHours: night ? 8 : 0,
        });
      }
    }
  }
  const cases: Array<[string, string, Severity, AdjustmentType]> = [
    ['A02', 'Thiếu giờ ra', 'CRITICAL', 'ADD_OUT'],
    ['A01', 'Thiếu giờ vào', 'CRITICAL', 'ADD_IN'],
    ['A03', 'Không có log chấm công', 'CRITICAL', 'WORK_MINUTES'],
    ['A04', 'Log trùng cần xác minh', 'WARNING', 'WORK_MINUTES'],
    ['A05', 'Đi muộn 20 phút', 'WARNING', 'CHANGE_IN'],
    ['A06', 'Về sớm 30 phút', 'WARNING', 'CHANGE_OUT'],
    ['A07', 'Làm khác ca được phân', 'WARNING', 'WORK_MINUTES'],
    ['A08', 'Ca đêm qua ngày cần xác nhận', 'WARNING', 'WORK_MINUTES'],
    ['A09', 'Nhiều ca trong ngày', 'INFO', 'WORK_MINUTES'],
    ['A10', 'Nghỉ phép nhưng có log', 'WARNING', 'WORK_MINUTES'],
    ['A11', 'Tăng ca chưa được duyệt', 'WARNING', 'WORK_MINUTES'],
    ['A12', 'Có log nhưng chưa phân ca', 'CRITICAL', 'WORK_MINUTES'],
    ['A13', 'Dữ liệu thay đổi sau HOD duyệt', 'WARNING', 'WORK_MINUTES'],
  ];
  for (let i = 0; i < 36; i++) {
    const employee = state.employees[i === 35 ? 10 : i % 24];
    let shift = state.calculations.find(
      (s) =>
        s.periodId === 1 &&
        s.employeeCode === employee.code &&
        s.date === (i < 24 ? '2026-10-30' : '2026-10-29'),
    )!;
    if (i === 34) {
      shift = {
        ...shift,
        id: 19999,
        shift: 'T · Ca tối bổ sung',
        start: '2026-10-29T18:00:00+07:00',
        end: '2026-10-29T22:00:00+07:00',
        originalIn: '2026-10-29T18:00:00+07:00',
        originalOut: '2026-10-29T22:00:00+07:00',
        standardMinutes: 240,
        workedMinutes: 240,
      };
      state.calculations.push(shift);
    }
    const [code, description, severity, type] = cases[i % cases.length];
    if (code === 'A08') {
      const nextDay = new Date(shift.date + 'T12:00:00Z');
      nextDay.setUTCDate(nextDay.getUTCDate() + 1);
      shift.shift = 'N · Ca đêm';
      shift.start = shift.date + 'T22:00:00+07:00';
      shift.end = nextDay.toISOString().slice(0, 10) + 'T06:00:00+07:00';
      shift.originalIn = shift.start;
      shift.originalOut = shift.end;
      shift.nightHours = 8;
    }
    if (code === 'A02' || code === 'A03') shift.originalOut = null;
    if (code === 'A01' || code === 'A03') shift.originalIn = null;
    if (severity === 'CRITICAL') shift.workedMinutes = code === 'A03' ? 0 : 240;
    if (code === 'A05') {
      shift.originalIn = shift.start.replace('08:00', '08:20');
      shift.lateMinutes = 20;
      shift.workedMinutes = 460;
    }
    if (code === 'A06') {
      shift.originalOut = shift.end.replace('17:00', '16:30');
      shift.earlyMinutes = 30;
      shift.workedMinutes = 450;
    }
    if (code === 'A10') {
      shift.leaveMinutes = 480;
      shift.workedMinutes = 0;
    }
    const key = stableIssueKey(`${employee.code}|${shift.date}|${shift.id}|${code}`);
    state.contexts[key] = {
      shiftId: shift.id,
      expectedType: type,
      leave:
        code === 'A10'
          ? 'Có đơn nghỉ phép đã duyệt; cần xác nhận ngày làm thực tế.'
          : 'Không có đơn nghỉ phép trong ngày.',
      overtime: code === 'A11' ? 'Đề xuất OT 2 giờ đang chờ phê duyệt.' : 'Không có OT chờ duyệt.',
      holiday: 'Ngày làm việc bình thường.',
      assignment:
        code === 'A12'
          ? 'Chưa phân ca; cần xác nhận công hợp lệ.'
          : code === 'A09'
            ? 'Có nhiều ca; đối soát riêng theo mã phân công.'
            : shift.shift,
      extraLogs: code === 'A04' ? [shift.start, shift.start.replace(':00:00', ':01:00')] : [],
    };
    state.issues.push({
      id: i + 1,
      doiSoatCongId: 1,
      maNhanVien: employee.code,
      maBoPhan: employee.departmentCode,
      ngayCong: shift.date,
      phanCongCaId: code === 'A12' ? null : shift.id,
      maLoi: code,
      mucDo: severity,
      trangThai: 'OPEN',
      moTa: description,
      giaTriDuKien: `${shift.standardMinutes} phút công; ${shift.shift}`,
      giaTriThucTe: `${shift.workedMinutes} phút công`,
      issueKey: key,
      resolvedAt: null,
      resolvedBy: null,
      ghiChuXuLy: null,
      createdAt: seedTime,
      rowVer: '0x0000000000000001',
    });
  }
  for (const p of state.periods) {
    const shifts = state.calculations.filter((s) => s.periodId === p.id);
    state.runtime[p.id].sources.find((s) => s.code === 'shifts')!.count = shifts.length;
    state.runtime[p.id].sources.find((s) => s.code === 'logs')!.count =
      shifts.reduce(
        (count, shift) => count + Number(!!shift.originalIn) + Number(!!shift.originalOut),
        0,
      ) +
      Object.values(state.contexts)
        .filter((c) => shifts.some((s) => s.id === c.shiftId))
        .reduce((count, c) => count + c.extraLogs.length, 0);
  }
  state.runs = [
    {
      id: 1,
      kyChamCongId: 1,
      maBoPhan: null,
      phamVi: 'PERIOD',
      lanChay: 1,
      trangThai: 'COMPLETED',
      dataVersion: 100,
      tongNhanVien: 24,
      tongBatThuong: 36,
      batDauLuc: seedTime,
      ketThucLuc: '2026-10-31T02:00:08Z',
      nguoiChay: 'HR · Nguyễn Minh Anh',
      loiXuLy: null,
    },
    {
      id: 2,
      kyChamCongId: 2,
      maBoPhan: null,
      phamVi: 'PERIOD',
      lanChay: 1,
      trangThai: 'COMPLETED',
      dataVersion: 90,
      tongNhanVien: 24,
      tongBatThuong: 0,
      batDauLuc: '2026-10-01T02:00:00Z',
      ketThucLuc: '2026-10-01T02:00:08Z',
      nguoiChay: 'HR · Nguyễn Minh Anh',
      loiXuLy: null,
    },
    {
      id: 3,
      kyChamCongId: 1,
      maBoPhan: 'FO',
      phamVi: 'DEPARTMENT',
      lanChay: 2,
      trangThai: 'FAILED',
      dataVersion: 100,
      tongNhanVien: 8,
      tongBatThuong: 0,
      batDauLuc: '2026-10-31T03:00:00Z',
      ketThucLuc: '2026-10-31T03:00:02Z',
      nguoiChay: 'HOD · Trần Hoàng Nam',
      loiXuLy:
        'Lần chạy mô phỏng thất bại: thiếu dữ liệu phân ca. Kết quả hoàn thành trước đó vẫn được sử dụng.',
    },
    {
      id: 4,
      kyChamCongId: 1,
      maBoPhan: 'HK',
      phamVi: 'DEPARTMENT',
      lanChay: 3,
      trangThai: 'CANCELLED',
      dataVersion: 100,
      tongNhanVien: 8,
      tongBatThuong: 0,
      batDauLuc: '2026-10-31T04:00:00Z',
      ketThucLuc: '2026-10-31T04:00:01Z',
      nguoiChay: 'HR · Nguyễn Minh Anh',
      loiXuLy: 'Đã hủy lần chạy mô phỏng; không thay thế kết quả cũ.',
    },
  ];
  state.approvals.push({
    id: 1,
    kyChamCongId: 1,
    maBoPhan: 'FO',
    lanDuyet: 1,
    dataVersion: 99,
    trangThai: 'INVALIDATED',
    tongNhanVien: 8,
    nguoiDuyet: 'Trần Hoàng Nam',
    duyetLuc: seedTime,
    ghiChu: 'Log được cập nhật sau khi duyệt; cần đối soát và duyệt lại ở phiên bản 100.',
    createdAt: seedTime,
    rowVer: '0x0000000000000099',
  });
  for (const [i, department] of state.departments.entries())
    state.approvals.push({
      id: 2 + i,
      kyChamCongId: 2,
      maBoPhan: department.code,
      lanDuyet: 1,
      dataVersion: 90,
      trangThai: 'APPROVED',
      tongNhanVien: 8,
      nguoiDuyet: department.head,
      duyetLuc: '2026-10-01T02:30:00Z',
      ghiChu: null,
      createdAt: '2026-10-01T02:30:00Z',
      rowVer: '0x0000000000000090',
    });
  state.snapshots = buildSnapshot(state, 2, 1, '2026-10-01T03:00:00Z');
  state.closingHistory.push({
    id: 1,
    kyChamCongId: 2,
    hanhDong: 'CLOSE',
    trangThaiTruoc: 'REVIEWED',
    trangThaiSau: 'CLOSED',
    phienBanChot: 1,
    nguoiThucHien: 'HR · Nguyễn Minh Anh',
    thoiGian: '2026-10-01T03:00:00Z',
    lyDo: 'Đã đối chiếu đầy đủ dữ liệu tháng 09/2026.',
    correlationId: 'demo-close-2-1',
  });
  state.audit.push({
    id: 1,
    periodId: 1,
    issueKey: null,
    at: seedTime,
    actor: 'Hệ thống mô phỏng',
    message:
      'Đối soát toàn kỳ hoàn thành: 36 bất thường trên 24 nhân viên. Phê duyệt Lễ tân phiên bản 99 không còn hiệu lực.',
  });
  return state;
}
