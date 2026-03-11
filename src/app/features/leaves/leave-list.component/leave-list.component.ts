import {Component, inject, OnInit} from '@angular/core';
import {Leave, LeaveDecision} from '../../../core/models/leave.model';
import {AuthService} from '../../../core/services/auth.service';
import {LeaveService} from '../../../core/services/leave.service';
import {MessageService} from 'primeng/api';
import {Select} from 'primeng/select';
import {FormsModule} from '@angular/forms';
import {Dialog} from 'primeng/dialog';
import {DatePipe, SlicePipe} from '@angular/common';
import {ButtonDirective} from 'primeng/button';
import {Tag} from 'primeng/tag';
import {TableModule} from 'primeng/table';
import {Toast} from 'primeng/toast';

@Component({
  selector: 'app-leave-list.component',
  imports: [
    Select,
    FormsModule,
    Dialog,
    DatePipe,
    ButtonDirective,
    Tag,
    TableModule,
    Toast,
    SlicePipe
  ],
  templateUrl: './leave-list.component.html',
  styleUrl: './leave-list.component.scss',
})
export class LeaveListComponent implements OnInit {
  auth = inject(AuthService);
  private svc = inject(LeaveService);
  private msgSvc = inject(MessageService);

  loading = false;
  activeTab: 'pending' | 'all' = 'pending';

  myLeaves: Leave[] = [];
  pendingLeaves: Leave[] = [];
  allLeaves: Leave[] = [];

  clBalance = 12;
  clUsed = 0;
  lwpCount = 0;

  // Apply dialog
  showApply = false;
  applyLoading = false;
  applyForm: Leave = { leaveType: 'CL', fromDate: '', toDate: '', reason: '' };
  leaveTypes = ['CL', 'LWP'];

  // Decide dialog
  showDecide = false;
  decideLoading = false;
  selectedLeave: Leave | null = null;
  decideForm: LeaveDecision = { status: 'APPROVED', leaveType: 'CL', adminNote: '' };
  decideOptions = ['APPROVED', 'REJECTED'];

  ngOnInit(): void {
    if (this.auth.isAdmin()) {
      this.loadPending();
    } else {
      this.loadMyLeaves();
    }
  }

  loadMyLeaves(): void {
    this.loading = true;
    this.svc.getMyLeaves().subscribe({
      next: res => {
        this.myLeaves = res.data || [];
        this.clUsed = this.myLeaves.filter(l => l.leaveType === 'CL' && l.status === 'APPROVED').length;
        this.lwpCount = this.myLeaves.filter(l => l.leaveType === 'LWP' && l.status === 'APPROVED').length;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  loadPending(): void {
    this.loading = true;
    this.svc.getPending().subscribe({
      next: res => { this.pendingLeaves = res.data || []; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  loadAll(): void {
    this.loading = true;
    this.svc.getAll().subscribe({
      next: res => { this.allLeaves = res.data || []; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  applyLeave(): void {
    if (!this.applyForm.fromDate || !this.applyForm.toDate || !this.applyForm.reason) {
      this.msgSvc.add({ severity: 'warn', summary: 'Required', detail: 'Badha fields bharvo!' });
      return;
    }
    this.applyLoading = true;
    this.svc.apply(this.applyForm).subscribe({
      next: res => {
        this.applyLoading = false;
        this.showApply = false;
        this.msgSvc.add({ severity: 'success', summary: 'Applied!', detail: res.message });
        this.applyForm = { leaveType: 'CL', fromDate: '', toDate: '', reason: '' };
        this.loadMyLeaves();
      },
      error: err => {
        this.applyLoading = false;
        this.msgSvc.add({ severity: 'error', summary: 'Error', detail: err?.error?.message || 'Failed!' });
      }
    });
  }

  openDecide(leave: Leave, status: 'APPROVED' | 'REJECTED'): void {
    this.selectedLeave = leave;
    this.decideForm = { status, leaveType: leave.leaveType || 'CL', adminNote: '' };
    this.showDecide = true;
  }

  submitDecision(): void {
    this.decideLoading = true;
    this.svc.decide(this.selectedLeave!.id!, this.decideForm).subscribe({
      next: res => {
        this.decideLoading = false;
        this.showDecide = false;
        this.msgSvc.add({ severity: 'success', summary: 'Done!', detail: res.message });
        this.loadPending();
      },
      error: err => {
        this.decideLoading = false;
        this.msgSvc.add({ severity: 'error', summary: 'Error', detail: err?.error?.message || 'Failed!' });
      }
    });
  }

  get tableData(): Leave[] {
    if (!this.auth.isAdmin()) return this.myLeaves;
    return this.activeTab === 'pending' ? this.pendingLeaves : this.allLeaves;
  }

  getStatusSeverity(s?: string): any {
    const m: Record<string, any> = { PENDING: 'warn', APPROVED: 'success', REJECTED: 'danger' };
    return m[s || ''] || 'info';
  }
}
