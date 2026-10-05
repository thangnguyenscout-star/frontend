import { modules, departments, departmentWorkSchedules, positions } from '@/constants/modules';
import type { HrRecord } from '@/types/common';
const names = [
  'Nguyễn Minh Anh',
  'Trần Hoàng Nam',
  'Lê Thu Hà',
  'Phạm Quốc Bảo',
  'Võ Ngọc Linh',
  'Đặng Đức Huy',
  'Bùi Thanh Mai',
  'Hoàng Gia Hân',
  'Đỗ Tuấn Kiệt',
  'Phan Thảo Vy',
  'Ngô Hải Đăng',
  'Dương Mỹ Duyên',
];
const day = (offset: number) => {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().slice(0, 10);
};
export function seed(): Record<string, HrRecord[]> {
  const records: Record<string, HrRecord[]> = Object.fromEntries(
    modules.map((m) => [
      m.key,
      Array.from(
        { length: m.key === 'departments' ? 6 : m.key.includes('types') ? 3 : 36 },
        (_, i) => ({
          id: String(i + 1),
          code: `${m.key === 'contracts' ? 'HD' : m.key === 'employees' ? 'NV' : m.key.slice(0, 3).toUpperCase()}-${String(i + 1).padStart(4, '0')}`,
          employeeId: `NV-${String(i + 1).padStart(4, '0')}`,
          name:
            m.key === 'departments'
              ? departments[i]
              : m.key === 'positions'
                ? positions[i % 6]
                : m.key === 'contract-types'
                  ? ['fixed', 'permanent', 'probation'][i]
                  : m.key === 'allowance-types'
                    ? ['Meal', 'Transport', 'Housing'][i]
                    : names[i % 12],
          department: departments[i % 6],
          ...(m.key === 'departments'
            ? { workSchedule: departmentWorkSchedules[departments[i]] }
            : {}),
          position: positions[i % 6],
          type: ['fixed', 'permanent', 'probation'][i % 3],
          signingDate: day(-190 - i),
          startDate: day(-180 - i),
          endDate: day(i % 8 === 0 ? -10 : i % 5 === 0 ? 5 : i % 3 === 0 ? 20 : 180 + i),
          salary: 8500000 + i * 350000,
          income: 10000000 + i * 350000,
          status: i % 8 === 0 ? 'expired' : i % 7 === 0 ? 'pending' : 'active',
          phone: `090${String(1234500 + i)}`,
          email: `staff${i + 1}@hotel.example`,
          hod: names[i % 12],
          count: 6,
          date: day(-i % 7),
          hours: 8,
          days: 2,
          shift: ['06:00–14:00', '14:00–22:00', '22:00–06:00'][i % 3],
          period: new Date().toISOString().slice(0, 7),
          amount: 12000000 + i * 250000,
          gender: i % 2 ? 'Nam' : 'Nữ',
          birthDate: String(1990 + (i % 12)) + '-03-15',
          identityNumber: '079' + String(100000000 + i),
          address: 'Quận 1, TP. Hồ Chí Minh',
          emergencyContact: 'Người thân · 0901234567',
          education: 'Đại học · Quản trị khách sạn',
          hotel: 'Grand Hotel Saigon',
          subDepartment: departments[i % 6],
          grade: 'Bậc ' + (1 + (i % 4)),
          manager: 'Nguyễn Văn Hải',
          shiftPattern: 'Ca xoay 3 ca',
          probationSalary: 7225000 + i * 297500,
          serviceChargeRate: 1 + (i % 3) * 0.2,
          healthCheck: 1,
          backgroundCheck: 1,
          identityVerified: 1,
          qualifications: 1,
          bankReady: 0,
          uniformReady: 0,
          healthInsuranceNumber: 'DN479791628' + String(4900 + i),
          healthcareProvider: 'Bệnh viện Đa khoa Sài Gòn',
          bank: 'Vietcombank',
          bankAccount: '007100' + String(1234567 + i),
          taxNumber: '842190' + String(8700 + i),
          insuranceNumber: '791628' + String(4900 + i),
          serviceCharge: 1500000 + i * 50000,
          coefficient: 1 + (i % 4) * 0.5,
          overtimePay: (i % 3) * 250000,
          allowance: 1500000,
          gross: 11500000 + i * 400000 + (i % 3) * 250000,
          insurance: 892500 + i * 36750,
          tax: 250000 + i * 15000,
          deductions: 0,
          checkIn: ['05:52', '13:55', '21:54'][i % 3],
          checkOut: ['14:05', '22:05', '06:04'][i % 3],
          lateMinutes: i % 7 === 0 ? 12 : 0,
          note: '',
        }),
      ),
    ]),
  );
  records.employees.forEach((employee) => {
    const parts = employee.name.split(' ');
    employee.lastName = parts[0];
    employee.middleName = parts.slice(1, -1).join(' ');
    employee.firstName = parts[parts.length - 1];
    employee.birthPlace = 'TP. Hồ Chí Minh';
    employee.ethnicity = 'Kinh';
    employee.religion = 'Không';
    employee.currentAddress = employee.address;
    employee.specialization = 'Quản trị khách sạn';
    employee.identityIssuedDate = '2021-06-15';
    employee.identityIssuedPlace = 'Cục Cảnh sát QLHC về TTXH';
    employee.insuranceIssuedDate = '2022-01-10';
    employee.healthInsuranceIssuedDate = '2026-01-01';
    employee.healthInsuranceNumber = '791628' + String(4900 + Number(employee.id));
  });
  const monday = new Date();
  monday.setHours(12, 0, 0, 0);
  monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
  records.schedules = records.employees.flatMap((employee, index) =>
    Array.from({ length: 7 }, (_, i) => {
      const date = new Date(monday);
      date.setDate(date.getDate() + i);
      const dateKey =
        date.getFullYear() +
        '-' +
        String(date.getMonth() + 1).padStart(2, '0') +
        '-' +
        String(date.getDate()).padStart(2, '0');
      const shift = i >= 5 ? 'OFF' : ['06:00–14:00', '14:00–22:00', '22:00–06:00'][index % 3];
      return {
        id: String(index * 7 + i + 1),
        code: 'CA-' + employee.code + '-' + dateKey,
        employeeId: employee.code,
        name: employee.name,
        department: employee.department,
        position: employee.position,
        date: dateKey,
        shift,
        hours: i >= 5 ? 0 : 8,
        status: 'draft',
      };
    }),
  );
  records.contracts.forEach((row) => {
    if (row.type === 'permanent') row.endDate = '';
  });
  records['service-charge'].forEach((row) => {
    row.amount = Number(row.serviceCharge);
  });
  records.payroll.forEach((row) => {
    row.days = 26;
    row.amount =
      Number(row.gross) - Number(row.insurance) - Number(row.tax) - Number(row.deductions);
  });
  return records;
}
