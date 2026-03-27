import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { TagModule } from 'primeng/tag';
import { SelectModule } from 'primeng/select';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { HttpClient } from '@angular/common/http';

const API = 'http://localhost:8080/api';

@Component({
  selector: 'app-shifts',
  standalone: true,
  imports: [
    CommonModule, FormsModule, TableModule, ButtonModule,
    DialogModule, ToastModule, TagModule, SelectModule,
    ConfirmDialogModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './shifts.component.html',
  styleUrl: './shifts.component.scss'
})
export class ShiftsComponent implements OnInit {
  private http = inject(HttpClient);
  private msgSvc = inject(MessageService);
  private confirmSvc = inject(ConfirmationService);

  shifts: any[] = [];
  employees: any[] = [];
  loading = false;

  // Shift Dialog
  showShiftDialog = false;
  shiftDialogMode: 'add' | 'edit' = 'add';
  shiftLoading = false;
  editShiftId: number | null = null;

  shiftForm = {
    name: '',
    startTime: '09:00:00',
    endTime: '18:00:00',
    description: ''
  };

  // Assign Dialog
  showAssignDialog = false;
  assignLoading = false;
  assignForm = {
    employeeId: null as number | null,
    shiftId: null as number | null
  };

  employeeOptions: any[] = [];
  shiftOptions: any[] = [];

  ngOnInit(): void {
    this.loadShifts();
    this.loadEmployees();
  }

  // ── Load Shifts ───────────────────────────────────────────────────────
  loadShifts(): void {
    this.loading = true;
    this.http.get<any>(`${API}/shifts`).subscribe({
      next: res => { this.shifts = res.data || []; this.loading = false;
        this.shiftOptions = this.shifts.map(s => ({
          label: s.name + ' (' + s.startTime + ' - ' + s.endTime + ')',
          value: s.id
        }));
      },
      error: () => { this.loading = false; }
    });
  }

  // ── Load Employees ────────────────────────────────────────────────────
  loadEmployees(): void {
    this.http.get<any>(`${API}/employees`).subscribe({
      next: res => {
        this.employees = res.data || [];
        this.employeeOptions = this.employees.map(e => ({
          label: e.name + ' (' + e.department + ')',
          value: e.id
        }));
      },
      error: () => {}
    });
  }

  // ── Open Add Dialog ───────────────────────────────────────────────────
  openAddDialog(): void {
    this.shiftDialogMode = 'add';
    this.editShiftId = null;
    this.shiftForm = { name: '', startTime: '09:00:00', endTime: '18:00:00', description: '' };
    this.showShiftDialog = true;
  }

  // ── Open Edit Dialog ──────────────────────────────────────────────────
  openEditDialog(shift: any): void {
    this.shiftDialogMode = 'edit';
    this.editShiftId = shift.id;
    this.shiftForm = {
      name: shift.name,
      startTime: shift.startTime,
      endTime: shift.endTime,
      description: shift.description || ''
    };
    this.showShiftDialog = true;
  }

  // ── Save Shift ────────────────────────────────────────────────────────
  saveShift(): void {
    if (!this.shiftForm.name || !this.shiftForm.startTime || !this.shiftForm.endTime) {
      this.msgSvc.add({ severity: 'warn', summary: 'Warning', detail: 'Badha fields bharvo!' });
      return;
    }
    this.shiftLoading = true;
    const call = this.shiftDialogMode === 'add'
      ? this.http.post<any>(`${API}/shifts`, this.shiftForm)
      : this.http.put<any>(`${API}/shifts/${this.editShiftId}`, this.shiftForm);

    call.subscribe({
      next: () => {
        this.shiftLoading = false;
        this.showShiftDialog = false;
        this.msgSvc.add({ severity: 'success', summary: '✅ Success!',
          detail: this.shiftDialogMode === 'add' ? 'Shift add thayu!' : 'Shift update thayu!' });
        this.loadShifts();
      },
      error: err => {
        this.shiftLoading = false;
        this.msgSvc.add({ severity: 'error', summary: 'Error',
          detail: err?.error?.message || 'Failed!' });
      }
    });
  }

  // ── Delete Shift ──────────────────────────────────────────────────────
  deleteShift(shift: any): void {
    this.confirmSvc.confirm({
      message: `"${shift.name}" delete karvu che?`,
      header: 'Confirm Delete',
      icon: 'pi pi-trash',
      accept: () => {
        this.http.delete<any>(`${API}/shifts/${shift.id}`).subscribe({
          next: () => {
            this.msgSvc.add({ severity: 'success', summary: '✅ Deleted!',
              detail: 'Shift delete thayu!' });
            this.loadShifts();
          },
          error: err => {
            this.msgSvc.add({ severity: 'error', summary: 'Error',
              detail: err?.error?.message || 'Delete failed!' });
          }
        });
      }
    });
  }

  // ── Open Assign Dialog ────────────────────────────────────────────────
  openAssignDialog(): void {
    this.assignForm = { employeeId: null, shiftId: null };
    this.showAssignDialog = true;
  }

  // ── Assign Shift ──────────────────────────────────────────────────────
  assignShift(): void {
    if (!this.assignForm.employeeId || !this.assignForm.shiftId) {
      this.msgSvc.add({ severity: 'warn', summary: 'Warning',
        detail: 'Employee ane Shift select karo!' });
      return;
    }
    this.assignLoading = true;
    this.http.post<any>(`${API}/shifts/assign`, this.assignForm).subscribe({
      next: res => {
        this.assignLoading = false;
        this.showAssignDialog = false;
        this.msgSvc.add({ severity: 'success', summary: '✅ Assigned!',
          detail: res.message + ' WhatsApp notification moklayu!' });
        this.loadEmployees();
      },
      error: err => {
        this.assignLoading = false;
        this.msgSvc.add({ severity: 'error', summary: 'Error',
          detail: err?.error?.message || 'Assign failed!' });
      }
    });
  }

  // ── Remove Shift ──────────────────────────────────────────────────────
  removeShift(employeeId: number, employeeName: string): void {
    this.confirmSvc.confirm({
      message: `${employeeName} ni shift remove karvi che?`,
      header: 'Confirm',
      accept: () => {
        this.http.delete<any>(`${API}/shifts/remove/${employeeId}`).subscribe({
          next: () => {
            this.msgSvc.add({ severity: 'success', summary: '✅ Removed!',
              detail: 'Shift remove thayi!' });
            this.loadEmployees();
          },
          error: () => {}
        });
      }
    });
  }

  formatTime(time: string): string {
    if (!time) return '—';
    return time.substring(0, 5);
  }
}
