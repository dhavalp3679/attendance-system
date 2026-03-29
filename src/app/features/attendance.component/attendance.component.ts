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
//   selector: 'app-attendance',
//   imports: [
//     Toast,
//     Tag,
//     TableModule,
//     DatePipe,
//     FormsModule,
//     ButtonDirective
//   ],
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
import { ButtonDirective, ButtonModule } from 'primeng/button';
import { Tag, TagModule } from 'primeng/tag';
import { Toast, ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
// import { CalendarModule } from 'primeng/calendar';
// import { DropdownModule } from 'primeng/dropdown';
import { MessageService } from 'primeng/api';
import { AttendanceService } from '../../core/services/attendance.service';
import { AuthService } from '../../core/services/auth.service';
import { AttendanceRecord } from '../../core/models/attendance.model';
import {AutoCompleteModule} from 'primeng/autocomplete';
import {DatePicker, DatePickerModule} from 'primeng/datepicker';
import {SelectModule} from 'primeng/select';

@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [
    CommonModule,
    Toast,
    Tag,
    TableModule,
    DatePipe,
    FormsModule,
    ButtonDirective,
    ButtonModule,
    DialogModule,
    AutoCompleteModule,
    DatePickerModule,
    SelectModule
  ],
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
  loading = false;
  punchLoading = false;

  filterEmpId = '';
  filterMonth = new Date().toISOString().substring(0, 7);

  // ── Add Attendance Dialog ─────────────────────────────────────
  showAddDialog = false;
  addForm = {
    employeeId: null as number | null,
    date: new Date(),
    punchIn: null as Date | null,
    punchOut: null as Date | null,
    status: 'PRESENT'
  };

  statusOptions = [
    { label: 'Present', value: 'PRESENT' },
    { label: 'Late', value: 'LATE' },
    { label: 'Half Day', value: 'HALF_DAY' },
    { label: 'Absent', value: 'ABSENT' }
  ];

  addLoading = false;

  ngOnInit(): void {
    this.timer = setInterval(() => this.currentTime = new Date(), 1000);
    if (this.auth.isAdmin()) {
      this.loadAllToday();
    } else {
      this.loadMyStatus();
    }
  }

  ngOnDestroy(): void {
    clearInterval(this.timer);
  }

  loadMyStatus(): void {
    this.svc.getMyToday().subscribe({
      next: res => { this.myStatus = res.data; },
      error: () => { this.myStatus = null; }
    });
  }

  loadAllToday(): void {
    this.loading = true;
    this.svc.getAllToday().subscribe({
      next: res => { this.allToday = res.data || []; this.loading = false; },
      error: () => { this.loading = false; }
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

  loadMonthly(): void {
    if (!this.filterEmpId || !this.filterMonth) return;
    this.loading = true;
    this.svc.getMonthly(+this.filterEmpId, this.filterMonth).subscribe({
      next: res => { this.monthlyRecords = res.data || []; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  // ── Add Attendance Dialog Methods ─────────────────────────────
  openAddDialog(): void {
    this.addForm = {
      employeeId: null,
      date: new Date(),
      punchIn: null,
      punchOut: null,
      status: 'PRESENT'
    };
    this.showAddDialog = true;
  }

  submitAddAttendance(): void {
    if (!this.addForm.employeeId || !this.addForm.date) {
      this.msgSvc.add({ severity: 'warn', summary: 'Warning', detail: 'Employee ID and Date required!' });
      return;
    }

    this.addLoading = true;

    const payload = {
      employeeId: this.addForm.employeeId,
      date: this.addForm.date.toISOString().substring(0, 10),
      punchInTime: this.addForm.punchIn
        ? this.formatTime(this.addForm.punchIn) : null,
      punchOutTime: this.addForm.punchOut
        ? this.formatTime(this.addForm.punchOut) : null,
      status: this.addForm.status
    };

    this.svc.addAttendance(payload).subscribe({
      next: () => {
        this.addLoading = false;
        this.showAddDialog = false;
        this.msgSvc.add({ severity: 'success', summary: '✅ Added!', detail: 'Attendance record added successfully!' });
        this.loadAllToday();
      },
      error: err => {
        this.addLoading = false;
        this.msgSvc.add({ severity: 'error', summary: 'Error', detail: err?.error?.message || 'Failed to add attendance!' });
      }
    });
  }

  private formatTime(date: Date): string {
    return date.toTimeString().substring(0, 8); // HH:mm:ss
  }

  getSeverity(status?: string): any {
    const m: Record<string, any> = {
      PRESENT: 'success', LATE: 'warn', HALF_DAY: 'secondary', ABSENT: 'danger'
    };
    return m[status || ''] || 'info';
  }

  getOT(mins?: number): string {
    return mins ? (mins / 60).toFixed(1) + ' hrs' : '—';
  }

  get canPunchIn(): boolean {
    return !this.myStatus?.punchInTime;
  }

  get canPunchOut(): boolean {
    return !!this.myStatus?.punchInTime && !this.myStatus?.punchOutTime;
  }
}
