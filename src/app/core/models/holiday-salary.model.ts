export interface Holiday {
  id?: number;
  name: string;
  date: string;
  description?: string;
}

export interface SalaryReport {
  id?: number;
  employeeId?: number;
  employeeName?: string;
  month?: string;
  grossSalary?: number;
  basicSalary?: number;
  pfDeduction?: number;
  esicDeduction?: number;
  professionalTax?: number;
  absentDeduction?: number;
  lateDeduction?: number;
  overtimePay?: number;
  netSalary?: number;
  workingDays?: number;
  presentDays?: number;
  absentDays?: number;
  lateCount?: number;
  overtimeHours?: number;
}

export interface SalaryCalculateRequest {
  employeeId: number;
  month: string;
}
