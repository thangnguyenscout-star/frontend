import type { HrRecord } from '@/types/common';
// Snapshot rates from Stitch 8603a88726a148f8bd91b721ed94a900; demonstration data, not a tax engine.
export function mockEmployeeTax(employee:HrRecord,payroll?:HrRecord){
 const base=Number(employee.salary||0);
 return {base,contributions:[{label:'H?u tr? & T? tu?t (BHXH)',employeeRate:8,employerRate:17.5},{label:'B?o hi?m th?t nghi?p (BHTN)',employeeRate:1,employerRate:1},{label:'B?o hi?m y t? (BHYT)',employeeRate:1.5,employerRate:3}].map(r=>({...r,employeeAmount:base*r.employeeRate/100,employerAmount:base*r.employerRate/100})),gross:Number(payroll?.gross||0),tax:Number(payroll?.tax||0),hasPayroll:!!payroll};
}
