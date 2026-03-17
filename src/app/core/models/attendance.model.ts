export interface AttendanceRecord {
  id?: number;
  employeeId?: number;
  employeeName?: string;
  date?: string;
  punchInTime?: string;
  punchOutTime?: string;
  status?: 'PRESENT' | 'LATE' | 'HALF_DAY' | 'ABSENT';
  overtimeMinutes?: number;
}

export type AttendanceStatus = 'PRESENT' | 'LATE' | 'HALF_DAY' | 'ABSENT';
