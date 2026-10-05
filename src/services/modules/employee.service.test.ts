import { beforeEach, describe, expect, it, vi } from 'vitest';
const { query, mutate } = vi.hoisted(() => ({ query: vi.fn(), mutate: vi.fn() }));
vi.mock('@/services/graphql/apollo', () => ({ apolloClient: { query, mutate } }));
import { employeeService } from './employee.service';
import { mapEmployeeDetailToForm, mapEmployeeFormToInput } from '@/types/employee.type';
import {
  EMPLOYEE_DETAIL,
  CREATE_EMPLOYEE,
  UPDATE_EMPLOYEE,
} from '@/graphql/employee/employee.documents';
describe('employee API integration', () => {
  beforeEach(() => {
    query.mockReset();
    mutate.mockReset();
  });
  it('sends only keyword and normalizes an empty search to null', async () => {
    query.mockResolvedValue({ data: { danhSachNhanVien: { isResults: true, data: [] } } });
    await employeeService.list('  ');
    expect(query).toHaveBeenCalledWith(
      expect.objectContaining({ variables: { keyword: null }, fetchPolicy: 'no-cache' }),
    );
    await employeeService.list(' NV0001 ');
    expect(query).toHaveBeenLastCalledWith(
      expect.objectContaining({ variables: { keyword: 'NV0001' } }),
    );
  });
  it('loads detail by employee code', async () => {
    query.mockResolvedValue({
      data: { thongTinNhanVien: { isResults: true, data: { maNhanVien: 'NV0001' } } },
    });
    await employeeService.getEmployeeDetail('NV0001');
    expect(query).toHaveBeenCalledWith(
      expect.objectContaining({ query: EMPLOYEE_DETAIL, variables: { maNhanVien: 'NV0001' } }),
    );
  });
  it('maps codes, dates, nulls and zero without leaking display-only fields into input', () => {
    const form = mapEmployeeDetailToForm({
      maNhanVien: 'NV0001',
      gioiTinh: 'F',
      danToc: '01',
      ngaySinh: '1990-01-02T00:00:00',
      soNguoiPhuThuoc: 0,
      ngayNghiViec: null,
    });
    expect(form).toMatchObject({
      gender: 'Nữ',
      ethnicity: '01',
      birthDate: '1990-01-02',
      dependents: 0,
      endDate: '',
    });
    const input = mapEmployeeFormToInput({
      ...form,
      name: 'Display name',
      department: 'Display department',
      email: '  ',
    });
    expect(input).toMatchObject({
      maNhanVien: 'NV0001',
      gioiTinh: 'F',
      danToc: '01',
      ngaySinh: '1990-01-02T00:00:00.000Z',
      soNguoiPhuThuoc: 0,
      ngayNghiViec: null,
      email: null,
    });
    expect(input).not.toHaveProperty('id');
    expect(input).not.toHaveProperty('name');
    expect(input).not.toHaveProperty('department');
  });
  it('uses separate create/edit mutations and returns server messages', async () => {
    const form = mapEmployeeDetailToForm({ maNhanVien: 'NV0001' });
    mutate.mockResolvedValueOnce({
      data: { themNhanVien: { isResults: true, message: 'Created' } },
    });
    expect((await employeeService.create(form)).message).toBe('Created');
    expect(mutate).toHaveBeenLastCalledWith(expect.objectContaining({ mutation: CREATE_EMPLOYEE, variables: { input: expect.objectContaining({ trangThaiNhanVien: '1', ngayNghiViec: null }) } }));
    mutate.mockResolvedValueOnce({
      data: { suaNhanVien: { isResults: true, message: 'Updated' } },
    });
    await employeeService.update(form);
    expect(mutate).toHaveBeenLastCalledWith(expect.objectContaining({ mutation: UPDATE_EMPLOYEE }));
  });
  it.each(['create', 'update'] as const)(
    'serializes all date fields for %s without shifting the selected day',
    async (method) => {
      const form = mapEmployeeDetailToForm({
        maNhanVien: 'NV0001',
        ngaySinh: '1990-01-02T00:00:00+07:00',
        ngayCap: '2020-02-29',
        ngayTuyenDung: '2025-01-01',
        ngayCapMaSo: '2025-06-15',
        ngayNghiViec: '2026-09-21',
      });
      mutate.mockResolvedValue({
        data: { [method === 'create' ? 'themNhanVien' : 'suaNhanVien']: { isResults: true } },
      });
      await employeeService[method](form);
      expect(mutate).toHaveBeenCalledWith(
        expect.objectContaining({
          variables: {
            input: expect.objectContaining({
              ngaySinh: '1990-01-02T00:00:00.000Z',
              ngayCap: '2020-02-29T00:00:00.000Z',
              ngayTuyenDung: '2025-01-01T00:00:00.000Z',
              ngayCapMaSo: '2025-06-15T00:00:00.000Z',
              ngayNghiViec: method === 'create' ? null : '2026-09-21T00:00:00.000Z',
            }),
          },
        }),
      );
    },
  );
  it('sends null for every empty optional date', () => {
    const input = mapEmployeeFormToInput({
      ...mapEmployeeDetailToForm({ maNhanVien: 'NV1' }),
      endDate: '  ',
    });
    for (const key of ['ngaySinh', 'ngayCap', 'ngayTuyenDung', 'ngayCapMaSo', 'ngayNghiViec'])
      expect(input[key]).toBeNull();
  });
  it.each(['2025-02-29', '2026-04-31', '21/09/2026', 'invalid'])(
    'blocks invalid date %s before mutation',
    async (birthDate) => {
      await expect(
        employeeService.create({ ...mapEmployeeDetailToForm({ maNhanVien: 'NV1' }), birthDate }),
      ).rejects.toThrow('Ngày không hợp lệ.');
      expect(mutate).not.toHaveBeenCalled();
    },
  );
  it('rejects business failures and missing detail data', async () => {
    query.mockResolvedValueOnce({
      data: { thongTinNhanVien: { isResults: false, message: 'Không tìm thấy nhân viên.' } },
    });
    await expect(employeeService.getEmployeeDetail('missing')).rejects.toThrow(
      'Không tìm thấy nhân viên.',
    );
    query.mockResolvedValueOnce({ data: { thongTinNhanVien: { isResults: true, data: null } } });
    await expect(employeeService.getEmployeeDetail('missing')).rejects.toThrow();
    mutate.mockResolvedValueOnce({
      data: { themNhanVien: { isResults: false, message: 'CCCD đã tồn tại.' } },
    });
    await expect(
      employeeService.create(mapEmployeeDetailToForm({ maNhanVien: 'NV1' })),
    ).rejects.toThrow('CCCD đã tồn tại.');
  });
});
