import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createSSRApp } from 'vue';
import { renderToString } from '@vue/server-renderer';
import { print } from 'graphql';
import type { LeaveRequest } from '@/services/modules/leave-request.service';
const api = vi.hoisted(() => ({ query: vi.fn(), list: vi.fn() }));
vi.mock('@/services/graphql/apollo', () => ({ apolloClient: { query: api.query } }));
vi.mock('@/services/modules/leave-request.service', async (original) => ({
  ...(await original<object>()),
  getLeaveRequests: api.list,
}));
import {
  getGanttLeaveRequests,
  getLeaveEmployees,
  ganttRange,
  LEAVE_EMPLOYEES,
  type LeaveEmployee,
} from './leave-gantt.service';
import { buildLeaveGantt, ganttDays } from './leave-gantt.model';
import Chart from './LeaveGantt.vue';
const filter = {
  thang: 10,
  nam: 2026,
  maBoPhan: null,
  maNhanVien: null,
  tinhTrang: null,
};
const people: LeaveEmployee[] = [
  {
    maNhanVien: 'NV01',
    hoTen: 'Nguyễn Văn An',
    ho: null,
    tenDem: null,
    ten: null,
    gioiTinh: 'M',
    ngaySinh: null,
    maBoPhan: 'BP01',
    tenBoPhan: 'Khoa Nội',
    maChucVu: 'CV01',
    tenChucVu: 'Điều dưỡng',
  },
  {
    maNhanVien: 'NV02',
    hoTen: 'Trần Thị Bình',
    ho: null,
    tenDem: null,
    ten: null,
    gioiTinh: 'F',
    ngaySinh: null,
    maBoPhan: 'BP01',
    tenBoPhan: 'Khoa Nội',
    maChucVu: 'CV02',
    tenChucVu: 'Bác sĩ',
  },
];
const request = (
  id: string,
  from = '2026-10-01T08:00:00+07:00',
  to = '2026-10-02T00:00:00+07:00',
): LeaveRequest => ({
  ...people[0],
  id,
  tuNgay: from,
  denNgay: to,
  ngayDangKyLichNghi: null,
  soNgayNghi: 0.5,
  lyDoNghi: 'Việc gia đình',
  ngayDuyet: null,
  nguoiDuyetDon: null,
  tinhTrang: 'N',
});
const page = (index: number, items: LeaveRequest[], total = 3) => ({
  pageIndex: index,
  pageSize: 2,
  totalRecords: total,
  totalPages: 2,
  items,
});
beforeEach(() => {
  api.query.mockReset();
  api.list.mockReset();
});
describe('Gantt API loading', () => {
  it('requests exactly the employee fields needed by the chart with keyword null', async () => {
    api.query.mockResolvedValue({
      data: { danhSachNhanVien: { isResults: true, data: [null, ...people] } },
    });
    expect(await getLeaveEmployees()).toEqual(people);
    expect(api.query).toHaveBeenCalledWith({
      query: LEAVE_EMPLOYEES,
      variables: { keyword: null },
      fetchPolicy: 'no-cache',
      errorPolicy: 'none',
    });
    const document = print(LEAVE_EMPLOYEES);
    for (const name of [
      'maNhanVien',
      'hoTen',
      'ho',
      'tenDem',
      'ten',
      'gioiTinh',
      'ngaySinh',
      'maBoPhan',
      'tenBoPhan',
      'maChucVu',
      'tenChucVu',
    ])
      expect(document).toContain(name);
    expect(document).not.toContain('cccd');
  });
  it('loads every server page before returning chart data', async () => {
    api.list
      .mockResolvedValueOnce(page(1, [request('1'), request('2')]))
      .mockResolvedValueOnce(page(2, [request('3')]));
    const progress = vi.fn();
    expect(await getGanttLeaveRequests(filter, { onProgress: progress })).toHaveLength(3);
    expect(api.list).toHaveBeenNthCalledWith(1, filter, 1, 100);
    expect(api.list).toHaveBeenNthCalledWith(2, filter, 2, 100);
    expect(progress).toHaveBeenLastCalledWith(3, 3);
  });
  it('stops loading more pages after the selected filter or mode changes', async () => {
    let current = true;
    api.list.mockImplementationOnce(async () => {
      current = false;
      return page(1, [request('1'), request('2')]);
    });
    expect(await getGanttLeaveRequests(filter, { isCurrent: () => current })).toBeNull();
    expect(api.list).toHaveBeenCalledTimes(1);
  });
  it('rejects incomplete, duplicate or changing datasets rather than drawing a partial chart', async () => {
    api.list
      .mockResolvedValueOnce(page(1, [request('1'), request('2')]))
      .mockResolvedValueOnce(page(2, [request('2')]));
    await expect(getGanttLeaveRequests(filter)).rejects.toThrow('trùng');
    api.list
      .mockResolvedValueOnce(page(1, [request('1'), request('2')]))
      .mockResolvedValueOnce(page(2, [], 4));
    await expect(getGanttLeaveRequests(filter)).rejects.toThrow('thay đổi');
    api.list
      .mockResolvedValueOnce(page(1, [request('1'), request('2')]))
      .mockResolvedValueOnce(page(2, []));
    await expect(getGanttLeaveRequests(filter)).rejects.toThrow('đủ dữ liệu');
  });
});
describe('Gantt timeline layout', () => {
  it('derives month/year boundaries including leap years and requires a year for the chart', () => {
    expect(ganttDays({ ...filter, thang: 2, nam: 2024 })).toHaveLength(29);
    expect(ganttDays({ ...filter, thang: 2, nam: 2026 })).toHaveLength(28);
    expect(ganttDays({ ...filter, thang: null, nam: 2024 })).toHaveLength(366);
    expect(ganttDays({ ...filter, thang: null })).toHaveLength(365);
    expect(ganttRange({ ...filter, thang: 12 })).toMatchObject({
      from: '2026-12-01',
      to: '2026-12-31',
      days: 31,
    });
    expect(ganttDays(filter)[0].weekday).toBe('T5');
    expect(() => ganttRange({ ...filter, nam: null })).toThrow('chọn năm');
  });
  it('includes employees with no requests and keeps department/employee filters aligned', () => {
    const model = buildLeaveGantt(people, [request('1')], filter);
    expect(model.groups[0].employees).toHaveLength(2);
    expect(
      model.groups[0].employees.find((r) => r.employee.maNhanVien === 'NV02')?.bars,
    ).toHaveLength(0);
    expect(buildLeaveGantt(people, [request('1')], filter, true).groups[0].employees).toHaveLength(
      1,
    );
    expect(buildLeaveGantt(people, [], { ...filter, maBoPhan: 'OTHER' }).groups).toEqual([]);
    expect(
      buildLeaveGantt(people, [], { ...filter, maNhanVien: 'NV02' }).groups[0].employees,
    ).toHaveLength(1);
  });
  it('clips crossing-month requests and treats midnight endpoints as exclusive', () => {
    const requests = [
      request('1', '2026-09-30T18:00:00Z', '2026-10-02T00:00:00+07:00'),
      request('2', '2026-09-29T08:00:00+07:00', '2026-10-01T00:00:00+07:00'),
    ];
    const bars = buildLeaveGantt(people, requests, filter).groups[0].employees.find(
      (e) => e.employee.maNhanVien === 'NV01',
    )!.bars;
    expect(bars).toHaveLength(1);
    expect(bars[0].left).toBeCloseTo((1 / (31 * 24)) * 100);
    expect(bars[0].width).toBeCloseTo((23 / (31 * 24)) * 100);
  });
  it('uses exact partial-day positions and stacks overlapping intervals without hiding them', () => {
    const requests = [
      request('1', '2026-10-01T08:00:00+07:00', '2026-10-01T12:00:00+07:00'),
      request('2', '2026-10-01T10:00:00+07:00', '2026-10-01T13:00:00+07:00'),
      request('3', '2026-10-01T12:00:00+07:00', '2026-10-01T17:00:00+07:00'),
    ];
    const bars = buildLeaveGantt(people, requests, filter).groups[0].employees.find(
      (e) => e.employee.maNhanVien === 'NV01',
    )!.bars;
    expect(bars.map((b) => b.lane)).toEqual([0, 1, 0]);
    expect(bars[0].left).toBeCloseTo(100 / (3 * 31));
    expect(bars[0].width).toBeCloseTo(100 / (6 * 31));
  });
  it('preserves canceled requests, reports invalid dates and keeps employees absent from the catalog', () => {
    const canceled = { ...request('1'), tinhTrang: 'C' };
    const invalid = request('2', 'invalid');
    const missing = { ...request('3'), maNhanVien: 'NV99' };
    const model = buildLeaveGantt(people, [canceled, invalid, missing], filter);
    expect(model.invalid).toBe(1);
    expect(model.groups[0].employees).toHaveLength(3);
    expect(buildLeaveGantt(people, [canceled], { ...filter, tinhTrang: 'A' }, true).groups).toEqual(
      [],
    );
  });
  it('renders employee details, month/day headers and accessible clickable leave bars', async () => {
    const html = await renderToString(
      createSSRApp(Chart, { employees: people, requests: [request('1')], filter }),
    );
    for (const label of [
      'Nguyễn Văn An',
      'Trần Thị Bình',
      'Điều dưỡng',
      'Bác sĩ',
      'Khoa Nội',
      'Tháng 10/2026',
      'gantt-bar',
      'aria-label',
      'Đã duyệt',
      'Hủy đơn',
    ])
      expect(html).toContain(label);
    expect(html).not.toContain('NaN');
  });
});
