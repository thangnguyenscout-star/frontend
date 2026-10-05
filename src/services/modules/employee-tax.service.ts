import { mockEmployeeTax } from '@/mock/services/employee-tax.mock';
import type { HrRecord } from '@/types/common';
export const employeeTaxService = {
 // Adapter reserved for the future employee tax GraphQL query.
 async get(employee:HrRecord,payroll?:HrRecord){return mockEmployeeTax(employee,payroll);},
};
