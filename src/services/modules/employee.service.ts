import type { DocumentNode } from 'graphql';
import { apolloClient } from '@/services/graphql/apollo';
import {
  EMPLOYEE_LIST,
  EMPLOYEE_DETAIL,
  MASTER_CODES,
  EMPLOYEE_CODE,
  CREATE_EMPLOYEE,
  UPDATE_EMPLOYEE,
} from '@/graphql/employee/employee.documents';
import {
  mapEmployeeFormToInput,
  type EmployeeDto,
  type EmployeeResponse,
  type MasterCode,
} from '@/types/employee.type';
import type { HrRecord } from '@/types/common';
function check<T>(result: EmployeeResponse<T> | undefined): EmployeeResponse<T> {
  if (result?.isResults !== true)
    throw new Error(result?.message || 'Không thể tải hoặc lưu thông tin nhân viên.');
  return result;
}
async function query<T>(document: DocumentNode, field: string, variables = {}): Promise<T> {
  const response = await apolloClient.query<Record<string, EmployeeResponse<T>>>({
    query: document,
    variables,
    fetchPolicy: 'no-cache',
    errorPolicy: 'none',
  });
  const result = check(response.data?.[field]);
  if (result.data == null)
    throw new Error(result.message || 'Máy chủ không trả về dữ liệu hợp lệ.');
  return result.data;
}
async function save(record: HrRecord, edit: boolean) {
  const field = edit ? 'suaNhanVien' : 'themNhanVien';
  const response = await apolloClient.mutate<Record<string, EmployeeResponse<never>>>({
    mutation: edit ? UPDATE_EMPLOYEE : CREATE_EMPLOYEE,
    variables: { input: mapEmployeeFormToInput(record) },
    errorPolicy: 'none',
  });
  return check(response.data?.[field]);
}
export const employeeService = {
  list: (keyword: string | null) =>
    query<EmployeeDto[]>(EMPLOYEE_LIST, 'danhSachNhanVien', { keyword: keyword?.trim() || null }),
  getEmployeeDetail: (maNhanVien: string) =>
    query<EmployeeDto>(EMPLOYEE_DETAIL, 'thongTinNhanVien', { maNhanVien }),
  masterCodes: (phanLoai: string) =>
    query<MasterCode[]>(MASTER_CODES, 'danhSachMasterCode', { phanLoai }),
  generateCode: () => query<string>(EMPLOYEE_CODE, 'phatSinhMaNhanVien'),
  create: (record: HrRecord) => save({ ...record, status: '1', endDate: '' }, false),
  update: (record: HrRecord) => save(record, true),
};
