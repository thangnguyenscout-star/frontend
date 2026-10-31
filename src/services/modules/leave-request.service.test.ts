import { beforeEach, expect, it, vi } from 'vitest';
import { print } from 'graphql';
const { query, mutate } = vi.hoisted(() => ({ query: vi.fn(), mutate: vi.fn() }));
vi.mock('@/services/graphql/apollo', () => ({ apolloClient: { query, mutate } }));
import {
  getLeaveRequests,
  getLeaveWorkShift,
  LEAVE_WORK_SHIFT,
  buildLeaveRequestInput,
  createLeaveRequest,
  CREATE_LEAVE_REQUEST,
  leaveDateTime,
  leaveEmployeeName,
  leaveRequestInput,
  leaveRequestStatuses,
  LEAVE_REQUEST_HISTORY,
} from './leave-request.service';
const filter = { thang: null, nam: null, maBoPhan: null, maNhanVien: null, tinhTrang: null };
const workShiftResult = (data: unknown) => ({
  data: { caLamViecDonNghiPhep: { isResults: true, data } },
});
it('queries the selected employee and calendar date and normalizes the shift hours', async () => {
  query.mockResolvedValueOnce(
    workShiftResult({ maCa: 'N', gioBatDau: 'PT22H', gioKetThuc: '06:00:00', quaDem: true }),
  );
  await expect(getLeaveWorkShift('NV01', '2099-10-10')).resolves.toEqual({
    code: 'N',
    startTime: '22:00',
    endTime: '06:00',
    overnight: true,
  });
  expect(query).toHaveBeenCalledExactlyOnceWith({
    query: LEAVE_WORK_SHIFT,
    variables: { maNhanVien: 'NV01', ngay: '2099-10-10' },
    fetchPolicy: 'no-cache',
    errorPolicy: 'none',
  });
  expect(print(LEAVE_WORK_SHIFT)).toContain('$ngay: Date!');
});
it('returns no shift only for successful unassigned results', async () => {
  query
    .mockResolvedValueOnce(workShiftResult(null))
    .mockResolvedValueOnce(workShiftResult({ maCa: null }));
  await expect(getLeaveWorkShift('NV01', '2099-10-10')).resolves.toBeNull();
  await expect(getLeaveWorkShift('NV01', '2099-10-11')).resolves.toBeNull();
  query.mockResolvedValueOnce({
    data: { caLamViecDonNghiPhep: { isResults: false, message: 'ACCESS_DENIED' } },
  });
  await expect(getLeaveWorkShift('NV01', '2099-10-10')).rejects.toThrow('ACCESS_DENIED');
  query.mockResolvedValueOnce(
    workShiftResult({ maCa: 'D', gioBatDau: 'bad', gioKetThuc: '16:00', quaDem: false }),
  );
  await expect(getLeaveWorkShift('NV01', '2099-10-10')).rejects.toThrow('không hợp lệ');
});
const response = (items: unknown[] = []) => ({
  data: {
    lichSuNhanVienNghiPhep: {
      isResults: true,
      data: { pageIndex: 2, pageSize: 20, totalRecords: 35, totalPages: 2, items },
    },
  },
});
beforeEach(() => {
  query.mockReset();
  mutate.mockReset();
});
it('sends all five filters inside the typed input and uses server pagination metadata', async () => {
  const row = { id: '9007199254740993', maNhanVien: '000001', tinhTrang: 'A', soNgayNghi: 0.5 };
  query.mockResolvedValue(response([null, row]));
  const input = {
    thang: 10,
    nam: 2026,
    maBoPhan: 'BP01',
    maNhanVien: '000001',
    tinhTrang: 'A',
  };
  await expect(getLeaveRequests(input, 2, 20)).resolves.toEqual({
    pageIndex: 2,
    pageSize: 20,
    totalRecords: 35,
    totalPages: 2,
    items: [row],
  });
  expect(query).toHaveBeenCalledWith({
    query: LEAVE_REQUEST_HISTORY,
    variables: { input: { ...input, pageIndex: 2, pageSize: 20 } },
    fetchPolicy: 'no-cache',
    errorPolicy: 'none',
  });
  const document = print(LEAVE_REQUEST_HISTORY);
  expect(document).toContain('$input: LichSuNhanVienNghiPhepInput');
  for (const field of [
    'ngaySinh',
    'maChucVu',
    'tenChucVu',
    'ngayDangKyLichNghi',
    'lyDoNghi',
    'ngayDuyet',
    'nguoiDuyetDon',
    'tinhTrang',
    'pageIndex',
    'totalPages',
  ])
    expect(document).toContain(field);
});
it('defaults optional filters to null and pageIndex/pageSize to 1/20', async () => {
  query.mockResolvedValue(response());
  await getLeaveRequests(filter);
  expect(query.mock.calls[0][0].variables.input).toEqual({ ...filter, pageIndex: 1, pageSize: 20 });
  expect(leaveRequestInput({ ...filter, maNhanVien: '', maBoPhan: ' ', tinhTrang: '' })).toEqual({
    ...filter,
    pageIndex: 1,
    pageSize: 20,
  });
  expect(leaveRequestInput({ ...filter, thang: 10 }).thang).toBe(10);
  expect(leaveRequestInput({ ...filter, nam: 2026 }).nam).toBe(2026);
  expect(leaveRequestInput({ ...filter, nam: '' as unknown as null }).nam).toBeNull();
  expect(query.mock.calls[0][0].variables.input).not.toHaveProperty('tuNgay');
  expect(query.mock.calls[0][0].variables.input).not.toHaveProperty('denNgay');
});
it('rejects invalid months, years and pagination before calling the API', async () => {
  for (const period of [
    { thang: 0 },
    { thang: 13 },
    { thang: 1.5 },
    { nam: 0 },
    { nam: 10000 },
    { nam: 2026.5 },
    { nam: NaN },
  ])
    await expect(getLeaveRequests({ ...filter, ...period })).rejects.toThrow();
  await expect(getLeaveRequests(filter, 0)).rejects.toThrow();
  await expect(getLeaveRequests(filter, 1, 101)).rejects.toThrow();
  expect(query).not.toHaveBeenCalled();
});
it('surfaces business and transport failures and rejects malformed pagination', async () => {
  query.mockResolvedValueOnce({
    data: { lichSuNhanVienNghiPhep: { isResults: false, message: 'ACCESS_DENIED' } },
  });
  await expect(getLeaveRequests(filter)).rejects.toThrow('ACCESS_DENIED');
  query.mockResolvedValueOnce({
    data: { lichSuNhanVienNghiPhep: { isResults: true, data: { pageIndex: 1, items: [] } } },
  });
  await expect(getLeaveRequests(filter)).rejects.toThrow('phân trang');
  query.mockRejectedValueOnce(new Error('Offline'));
  await expect(getLeaveRequests(filter)).rejects.toThrow('Offline');
});
it('uses the confirmed N/A/C status codes and formats names, decimal days and UTC+07 times', () => {
  expect(leaveRequestStatuses.map((s) => [s.code, s.label])).toEqual([
    ['N', 'Tạo mới'],
    ['A', 'Đã duyệt'],
    ['C', 'Hủy đơn'],
  ]);
  expect(leaveEmployeeName({ hoTen: null, ho: 'Nguyễn', tenDem: 'Văn', ten: 'An' })).toBe(
    'Nguyễn Văn An',
  );
  expect(leaveDateTime('2026-10-01')).toBe('01/10/2026');
  expect(leaveDateTime('2026-09-30T18:30:00Z')).toContain('01:30');
  expect(leaveDateTime(null)).toBe('—');
});

const leaveTypes = [
  { id: 'NP', workType: '0', active: true },
  { id: 'D', workType: 'C', active: true },
] as import('@/types/schedule').Shift[];
const leaveForm = {
  fromDate: '2099-10-10',
  fromTime: '12:00',
  toDate: '2099-10-11',
  toTime: '16:00',
  leaveTypeId: 'NP',
  reason: '  Việc gia đình  ',
};
it('creates a normal leave request without loading or updating assignments', async () => {
  const input = buildLeaveRequestInput('NV01', leaveForm, leaveTypes);
  expect(input).toEqual({
    maNhanVien: 'NV01',
    tuNgay: '2099-10-10T12:00:00+07:00',
    denNgay: '2099-10-11T16:00:00+07:00',
    loaiNghiPhep: 'NP',
    lyDoNghi: 'Việc gia đình',
  });
  mutate.mockResolvedValueOnce({
    data: { taoNhanVienNghiPhep: { isResults: true, message: 'OK' } },
  });
  await expect(createLeaveRequest(input)).resolves.toMatchObject({ isResults: true });
  expect(mutate).toHaveBeenCalledExactlyOnceWith({
    mutation: CREATE_LEAVE_REQUEST,
    variables: { input },
    errorPolicy: 'none',
  });
  expect(query).not.toHaveBeenCalled();
});
it('requires an employee, a reason and an active leave type', () => {
  expect(() => buildLeaveRequestInput('', leaveForm, leaveTypes)).toThrow('nhân viên');
  expect(() => buildLeaveRequestInput('NV01', { ...leaveForm, reason: ' ' }, leaveTypes)).toThrow(
    'lý do',
  );
  expect(() =>
    buildLeaveRequestInput('NV01', { ...leaveForm, leaveTypeId: 'D' }, leaveTypes),
  ).toThrow('loại nghỉ');
  expect(() =>
    buildLeaveRequestInput(
      'NV01',
      leaveForm,
      leaveTypes.map((type) => ({ ...type, active: false })),
    ),
  ).toThrow('loại nghỉ');
});
it('surfaces leave creation business and transport failures', async () => {
  const input = buildLeaveRequestInput('NV01', leaveForm, leaveTypes);
  mutate.mockResolvedValueOnce({
    data: { taoNhanVienNghiPhep: { isResults: false, message: 'Không được phép' } },
  });
  await expect(createLeaveRequest(input)).rejects.toThrow('Không được phép');
  mutate.mockRejectedValueOnce(new Error('Offline'));
  await expect(createLeaveRequest(input)).rejects.toThrow('Offline');
});
