export interface Leave {
  id?: number;
  employeeId?: number;
  employeeName?: string;
  leaveType: 'CL' | 'LWP';
  fromDate: string;
  toDate: string;
  numberOfDays?: number;
  reason: string;
  status?: 'PENDING' | 'APPROVED' | 'REJECTED';
  adminNote?: string;
  decidedBy?: string;
  clBalance?: number;
}

export interface LeaveDecision {
  status: 'APPROVED' | 'REJECTED';
  leaveType: 'CL' | 'LWP';
  adminNote?: string;
}
