export type AttendanceStatus = 'present' | 'late' | 'early' | 'absent' | 'leave';
export const demoDepartments = [
  ['Lễ tân', 45],
  ['Buồng phòng', 80],
  ['Nhà hàng', 60],
  ['Bếp', 40],
  ['Bảo trì', 25],
  ['Kế toán', 15],
  ['Nhân sự', 10],
  ['Kinh doanh', 20],
  ['An ninh', 30],
] as const;
const names = [
  'Nguyễn Văn An',
  'Trần Thị Bình',
  'Lê Văn Cường',
  'Phạm Thị Duyên',
  'Huỳnh Văn Em',
  'Đặng Văn Hải',
  'Nguyễn Thị Hoa',
  'Trần Văn Khoa',
];
export const demoEmployees = demoDepartments.flatMap(([department, count], group) =>
  Array.from({ length: count }, (_, i) => ({
    code: 'NV' + String(group * 100 + i + 1).padStart(4, '0'),
    name: names[(group + i) % names.length],
    department,
    shift: ['HC', 'C1', 'C2', 'C3'][(group + i) % 4],
    seed: group * 31 + i,
  })),
);
export function demoAttendance(date: string) {
  const offset = Number(date.slice(-2));
  return demoEmployees.map((employee, i) => {
    const n = (i + offset * 3) % 325;
    const status: AttendanceStatus =
      n < 15 ? 'leave' : n < 22 ? 'absent' : n < 34 ? 'late' : n < 42 ? 'early' : 'present';
    const minutes = status === 'late' || status === 'early' ? 5 + (employee.seed % 5) * 5 : 0;
    return {
      ...employee,
      status,
      minutes,
      checkIn:
        status === 'absent' || status === 'leave'
          ? '—'
          : status === 'late'
            ? '07:' + String(minutes).padStart(2, '0')
            : '07:00',
    };
  });
}
