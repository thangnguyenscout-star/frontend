import { employeeProfileFields, type EmployeeProfileField } from '@/mock/employeeProfile';
import { employeeFieldMap } from '@/types/employee.type';
export const employeeApiFields: EmployeeProfileField[] = [
  ...employeeProfileFields
    .filter((field) => field.key in employeeFieldMap)
    .map((field): EmployeeProfileField => ({
      ...field,
      ...(field.key === 'bank' ? { kind: 'select' as const, max: undefined } : {}),
      options: undefined,
    })),
  { key: 'taxCode', label: 'Mã số thuế cá nhân', tab: 3 },
  { key: 'taxIssuedDate', label: 'Ngày cấp mã số thuế', tab: 3, kind: 'date' },
  { key: 'dependents', label: 'Số người phụ thuộc', tab: 3, numeric: true },
  { key: 'status', label: 'Trạng thái nhân viên', tab: 0, required: true },
  { key: 'endDate', label: 'Ngày nghỉ việc', tab: 0, kind: 'date' },
];
export const employeeMasterCategories: Record<string, string> = {
  ethnicity: '01',
  religion: '02',
  birthPlace: '03',
  identityIssuedPlace: '03',
  education: '04',
  specialization: '05',
  bank: '06',
};

export const employeeStatusLabels: Record<string, string> = {
  '1': 'Đang làm việc',
  '2': 'Tạm hoãn hợp đồng',
  '3': 'Nghỉ chế độ',
  '4': 'Nghỉ việc',
};