// import { Component, OnInit, OnDestroy, inject } from '@angular/core';
// import {CommonModule, DatePipe} from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { TableModule } from 'primeng/table';
// import {ButtonDirective, ButtonModule} from 'primeng/button';
// import {Tag, TagModule} from 'primeng/tag';
// import {Toast, ToastModule} from 'primeng/toast';
// import { MessageService } from 'primeng/api';
// import {AttendanceService} from '../../core/services/attendance.service';
// import {AuthService} from '../../core/services/auth.service';
// import {AttendanceRecord} from '../../core/models/attendance.model';
//
// @Component({
//   selector: 'app-attendance.component',
//   imports: [
//     Toast,
//     Tag,
//     TableModule,
//     DatePipe,
//     FormsModule,
//     ButtonDirective
//   ],
//   providers: [MessageService],
//   templateUrl: './attendance.component.html',
//   styleUrl: './attendance.component.scss',
// })
// export class AttendanceComponent implements OnInit, OnDestroy {
//   auth = inject(AuthService);
//   private svc = inject(AttendanceService);
//   private msgSvc = inject(MessageService);
//
//   currentTime = new Date();
//   today = new Date();
//   private timer: any;
//
//   myStatus: AttendanceRecord | null = null;
//   allToday: AttendanceRecord[] = [];
//   monthlyRecords: AttendanceRecord[] = [];
//   loading = false;
//   punchLoading = false;
//
//   filterEmpId = '';
//   filterMonth = new Date().toISOString().substring(0, 7);
//
//   ngOnInit(): void {
//     this.timer = setInterval(() => this.currentTime = new Date(), 1000);
//     if (this.auth.isAdmin()) {
//       this.loadAllToday();
//     } else {
//       this.loadMyStatus();
//     }
//   }
//
//   ngOnDestroy(): void {
//     clearInterval(this.timer);
//   }
//
//   loadMyStatus(): void {
//     this.svc.getMyToday().subscribe({
//       next: res => { this.myStatus = res.data; },
//       error: () => { this.myStatus = null; }
//     });
//   }
//
//   loadAllToday(): void {
//     this.loading = true;
//     this.svc.getAllToday().subscribe({
//       next: res => { this.allToday = res.data || []; this.loading = false; },
//       error: () => { this.loading = false; }
//     });
//   }
//
//   punchIn(): void {
//     this.punchLoading = true;
//     this.svc.punchIn().subscribe({
//       next: res => {
//         this.punchLoading = false;
//         this.msgSvc.add({ severity: 'success', summary: '✅ Punched In!', detail: res.message });
//         this.loadMyStatus();
//       },
//       error: err => {
//         this.punchLoading = false;
//         this.msgSvc.add({ severity: 'error', summary: 'Error', detail: err?.error?.message || 'Punch in failed!' });
//       }
//     });
//   }
//
//   punchOut(): void {
//     this.punchLoading = true;
//     this.svc.punchOut().subscribe({
//       next: res => {
//         this.punchLoading = false;
//         this.msgSvc.add({ severity: 'success', summary: '👋 Punched Out!', detail: res.message });
//         this.loadMyStatus();
//       },
//       error: err => {
//         this.punchLoading = false;
//         this.msgSvc.add({ severity: 'error', summary: 'Error', detail: err?.error?.message || 'Punch out failed!' });
//       }
//     });
//   }
//
//   loadMonthly(): void {
//     if (!this.filterEmpId || !this.filterMonth) return;
//     this.loading = true;
//     this.svc.getMonthly(+this.filterEmpId, this.filterMonth).subscribe({
//       next: res => { this.monthlyRecords = res.data || []; this.loading = false; },
//       error: () => { this.loading = false; }
//     });
//   }
//
//   getSeverity(status?: string): any {
//     const m: Record<string, any> = {
//       PRESENT: 'success', LATE: 'warn', HALF_DAY: 'secondary', ABSENT: 'danger'
//     };
//     return m[status || ''] || 'info';
//   }
//
//   getOT(mins?: number): string {
//     return mins ? (mins / 60).toFixed(1) + ' hrs' : '—';
//   }
//
//   get canPunchIn(): boolean {
//     return !this.myStatus?.punchInTime;
//   }
//
//   get canPunchOut(): boolean {
//     return !!this.myStatus?.punchInTime && !this.myStatus?.punchOutTime;
//   }
// }

import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { MessageService } from 'primeng/api';
import { AttendanceService } from '../../core/services/attendance.service';
import { AuthService } from '../../core/services/auth.service';
import { AttendanceRecord } from '../../core/models/attendance.model';

@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [
    CommonModule, FormsModule, TableModule, ButtonModule,
    TagModule, ToastModule, DialogModule, SelectModule, DatePipe
  ],
  providers: [MessageService],
  templateUrl: './attendance.component.html',
  styleUrl: './attendance.component.scss',
})
export class AttendanceComponent implements OnInit, OnDestroy {
  auth = inject(AuthService);
  private svc = inject(AttendanceService);
  private msgSvc = inject(MessageService);

  currentTime = new Date();
  today = new Date();
  private timer: any;

  myStatus: AttendanceRecord | null = null;
  allToday: AttendanceRecord[] = [];
  monthlyRecords: AttendanceRecord[] = [];
  calendarDays: any[] = [];

  loading = false;
  punchLoading = false;

  filterEmpId = '';
  filterMonth = new Date().toISOString().substring(0, 7);

  viewMode: 'calendar' | 'table' = 'calendar';

  // Admin Add/Edit Dialog
  showDialog = false;
  dialogMode: 'add' | 'edit' = 'add';
  dialogLoading = false;

  form = {
    id: null as number | null,
    employeeId: null as number | null,
    date: '',
    punchIn: '',
    punchOut: '',
    status: 'PRESENT'
  };

  statusOptions = [
    { label: 'Present',  value: 'PRESENT'  },
    { label: 'Late',     value: 'LATE'     },
    { label: 'Half Day', value: 'HALF_DAY' },
    { label: 'Absent',   value: 'ABSENT'   }
  ];

  ngOnInit(): void {
    this.timer = setInterval(() => this.currentTime = new Date(), 1000);
    if (this.auth.isAdmin()) {
      this.loadAllToday();
    } else {
      this.loadMyStatus();
    }
  }

  ngOnDestroy(): void { clearInterval(this.timer); }

  // ── Employee ──────────────────────────────────────────────────────────────
  loadMyStatus(): void {
    this.svc.getMyToday().subscribe({
      next: res => { this.myStatus = res.data; },
      error: () => { this.myStatus = null; }
    });
  }

  punchIn(): void {
    this.punchLoading = true;
    this.svc.punchIn().subscribe({
      next: res => {
        this.punchLoading = false;
        this.msgSvc.add({ severity: 'success', summary: '✅ Punched In!', detail: res.message });
        this.loadMyStatus();
      },
      error: err => {
        this.punchLoading = false;
        this.msgSvc.add({ severity: 'error', summary: 'Error', detail: err?.error?.message || 'Punch in failed!' });
      }
    });
  }

  punchOut(): void {
    this.punchLoading = true;
    this.svc.punchOut().subscribe({
      next: res => {
        this.punchLoading = false;
        this.msgSvc.add({ severity: 'success', summary: '👋 Punched Out!', detail: res.message });
        this.loadMyStatus();
      },
      error: err => {
        this.punchLoading = false;
        this.msgSvc.add({ severity: 'error', summary: 'Error', detail: err?.error?.message || 'Punch out failed!' });
      }
    });
  }

  // ── Admin ─────────────────────────────────────────────────────────────────
  loadAllToday(): void {
    this.loading = true;
    this.svc.getAllToday().subscribe({
      next: res => { this.allToday = res.data || []; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  loadMonthly(): void {
    if (!this.filterEmpId || !this.filterMonth) return;
    this.loading = true;
    this.svc.getMonthly(+this.filterEmpId, this.filterMonth).subscribe({
      next: res => {
        this.monthlyRecords = res.data || [];
        this.loading = false;
        this.buildCalendar();
      },
      error: () => { this.loading = false; }
    });
  }

  // ── Calendar ──────────────────────────────────────────────────────────────
  buildCalendar(): void {
    if (!this.filterMonth) return;
    const [year, month] = this.filterMonth.split('-').map(Number);
    const firstDay = new Date(year, month - 1, 1);
    const lastDay  = new Date(year, month, 0);
    const days: any[] = [];

    for (let i = 0; i < firstDay.getDay(); i++) days.push(null);

    for (let d = 1; d <= lastDay.getDate(); d++) {
      const dateStr = `${year}-${String(month).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
      const record  = this.monthlyRecords.find(r => r.date === dateStr);
      const dow     = new Date(year, month - 1, d).getDay();
      days.push({ day: d, date: dateStr, isSunday: dow === 0, record: record || null });
    }
    this.calendarDays = days;
  }

  getCalendarWeeks(): any[][] {
    const weeks: any[][] = [];
    for (let i = 0; i < this.calendarDays.length; i += 7) {
      weeks.push(this.calendarDays.slice(i, i + 7));
    }
    return weeks;
  }

  getCalMonthLabel(): string {
    if (!this.filterMonth) return '';
    const [year, month] = this.filterMonth.split('-').map(Number);
    return new Date(year, month - 1, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }

  getCellClass(day: any): string {
    if (!day) return 'empty';
    if (day.isSunday) return 'sunday-cell';
    if (!day.record) return 'absent-cell';
    const map: Record<string, string> = {
      PRESENT: 'present-cell', LATE: 'late-cell',
      HALF_DAY: 'half-cell',   ABSENT: 'absent-cell'
    };
    return map[day.record.status] || '';
  }

  // ── Admin Dialog ──────────────────────────────────────────────────────────
  openAddDialog(): void {
    this.dialogMode = 'add';
    this.form = {
      id: null,
      employeeId: this.filterEmpId ? +this.filterEmpId : null,
      date: '',
      punchIn: '09:00',
      punchOut: '18:00',
      status: 'PRESENT'
    };
    this.showDialog = true;
  }

  openEditDialog(record: AttendanceRecord): void {
    this.dialogMode = 'edit';
    this.form = {
      id: record.id || null,
      employeeId: record.employeeId || null,
      date: record.date || '',
      punchIn: record.punchInTime ? record.punchInTime.substring(0, 5) : '',
      punchOut: record.punchOutTime ? record.punchOutTime.substring(0, 5) : '',
      status: record.status || 'PRESENT'
    };
    this.showDialog = true;
  }

  saveAttendance(): void {
    if (!this.form.employeeId || !this.form.date || !this.form.status) {
      this.msgSvc.add({ severity: 'warn', summary: 'Warning', detail: 'Badha fields bharvo!' });
      return;
    }
    this.dialogLoading = true;
    const payload = {
      employeeId: this.form.employeeId,
      date:       this.form.date,
      punchIn:    this.form.punchIn  ? this.form.punchIn  + ':00' : null,
      punchOut:   this.form.punchOut ? this.form.punchOut + ':00' : null,
      status:     this.form.status
    };

    const call = this.dialogMode === 'add'
      ? this.svc.adminAddAttendance(payload)
      : this.svc.adminEditAttendance(this.form.id!, payload);

    call.subscribe({
      next: () => {
        this.dialogLoading = false;
        this.showDialog = false;
        this.msgSvc.add({
          severity: 'success',
          summary: this.dialogMode === 'add' ? '✅ Added!' : '✅ Updated!',
          detail: 'Attendance save thayu!'
        });
        this.loadMonthly();
      },
      error: err => {
        this.dialogLoading = false;
        this.msgSvc.add({ severity: 'error', summary: 'Error', detail: err?.error?.message || 'Failed!' });
      }
    });
  }

  // ── Helpers ───────────────────────────────────────────────────────────────
  getSeverity(status?: string): any {
    const m: Record<string, any> = {
      PRESENT: 'success', LATE: 'warn', HALF_DAY: 'secondary', ABSENT: 'danger'
    };
    return m[status || ''] || 'info';
  }

  getOT(mins?: number): string {
    return mins ? (mins / 60).toFixed(1) + ' hrs' : '—';
  }

  get canPunchIn():  boolean { return !this.myStatus?.punchInTime; }
  get canPunchOut(): boolean { return !!this.myStatus?.punchInTime && !this.myStatus?.punchOutTime; }
}
