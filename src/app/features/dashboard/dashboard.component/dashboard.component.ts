import {Component, inject, OnInit} from '@angular/core';
import {AuthService} from '../../../core/services/auth.service';
import {AttendanceService} from '../../../core/services/attendance.service';
import {EmployeeService} from '../../../core/services/employee.service';
import {AttendanceRecord} from '../../../core/models/attendance.model';
import {Tag} from 'primeng/tag';
import {TableModule} from 'primeng/table';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-dashboard.component',
  imports: [
    Tag,
    TableModule,
    DatePipe
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  auth = inject(AuthService);
  private attendanceSvc = inject(AttendanceService);
  private employeeSvc = inject(EmployeeService);

  today = new Date();
  loading = false;

  totalEmployees = 0;
  presentCount = 0;
  lateCount = 0;
  absentCount = 0;

  todayRecords: AttendanceRecord[] = [];
  myTodayStatus: AttendanceRecord | null = null;

  ngOnInit(): void {
    if (this.auth.isAdmin()) {
      this.loadAdminDashboard();
    } else {
      this.loadMyStatus();
    }
  }

  loadAdminDashboard(): void {
    this.loading = true;
    this.employeeSvc.getAll().subscribe({
      next: res => { this.totalEmployees = res.data?.length || 0; }
    });
    this.attendanceSvc.getAllToday().subscribe({
      next: res => {
        this.todayRecords = res.data || [];
        this.presentCount = this.todayRecords.filter(r => r.status === 'PRESENT').length;
        this.lateCount = this.todayRecords.filter(r => r.status === 'LATE').length;
        this.absentCount = this.totalEmployees - this.presentCount - this.lateCount;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  loadMyStatus(): void {
    this.attendanceSvc.getMyToday().subscribe({
      next: res => { this.myTodayStatus = res.data; },
      error: () => { this.myTodayStatus = null; }
    });
  }

  getSeverity(status: string): 'success' | 'warn' | 'danger' | 'secondary' | 'info' {
    const map: Record<string, any> = {
      PRESENT: 'success', LATE: 'warn',
      HALF_DAY: 'secondary', ABSENT: 'danger'
    };
    return map[status] || 'info';
  }

  getOvertimeHours(mins: number): string {
    return mins ? (mins / 60).toFixed(1) + ' hrs' : '—';
  }
}
