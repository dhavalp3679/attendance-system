export interface Employee {
  id?: number;
  name: string;
  email: string;
  password?: string;
  phoneNumber?: string;
  department: string;
  designation: string;
  salary: number;
  role: 'ADMIN' | 'EMPLOYEE';
  joinDate?: string;
  bankAccountNumber?: string;
  bankIfscCode?: string;
  bankName?: string;
  address?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  clBalance?: number;
}

export const DEPARTMENTS = [
  'HR', 'IT', 'Sales', 'Finance',
  'Marketing', 'Operations', 'Engineering'
];

export const ROLES = ['EMPLOYEE', 'ADMIN'];
