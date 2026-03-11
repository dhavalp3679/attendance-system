import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { DividerModule } from 'primeng/divider';
import { MessageService } from 'primeng/api';
import { SalaryService } from '../../core/services/salary.service';
import { AuthService } from '../../core/services/auth.service';
import { SalaryReport, SalaryCalculateRequest } from '../../core/models/holiday-salary.model';

@Component({
  selector: 'app-salary',
  standalone: true,
  templateUrl: './salary.component.html',
  styleUrl: './salary.component.scss',
  imports: [
    CommonModule,
    DecimalPipe,
    FormsModule,
    TableModule,
    ButtonModule,
    ToastModule,
    DividerModule
  ],
  providers: [MessageService]
})
export class SalaryComponent implements OnInit {
  auth = inject(AuthService);
  private svc = inject(SalaryService);
  private msgSvc = inject(MessageService);

  loading = false;
  calcLoading = false;

  salaryResult: SalaryReport | null = null;
  myReports: SalaryReport[] = [];

  calcReq: SalaryCalculateRequest = {
    employeeId: 0,
    month: new Date().toISOString().substring(0, 7)
  };

  viewEmpId = 0;
  viewMonth = new Date().toISOString().substring(0, 7);

  ngOnInit(): void {
    if (!this.auth.isAdmin()) {
      this.loadMyReports();
    }
  }

  calculate(): void {
    if (!this.calcReq.employeeId || !this.calcReq.month) {
      this.msgSvc.add({ severity: 'warn', summary: 'Required', detail: 'Employee ID ane Month bharvo!' });
      return;
    }
    this.calcLoading = true;
    this.svc.calculate(this.calcReq).subscribe({
      next: res => {
        this.calcLoading = false;
        this.salaryResult = res.data;
        this.msgSvc.add({ severity: 'success', summary: '✅ Calculated!', detail: `Net Salary: ₹${res.data.netSalary}` });
      },
      error: err => {
        this.calcLoading = false;
        this.msgSvc.add({ severity: 'error', summary: 'Error', detail: err?.error?.message || 'Failed!' });
      }
    });
  }

  viewReport(): void {
    if (!this.viewEmpId || !this.viewMonth) return;
    this.svc.getReport(this.viewEmpId, this.viewMonth).subscribe({
      next: res => { this.salaryResult = res.data; }
    });
  }

  loadMyReports(): void {
    this.loading = true;
    this.svc.getMyReports().subscribe({
      next: res => { this.myReports = res.data || []; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  get totalDeductions(): number {
    if (!this.salaryResult) return 0;
    return (this.salaryResult.pfDeduction || 0) +
      (this.salaryResult.esicDeduction || 0) +
      (this.salaryResult.professionalTax || 0) +
      (this.salaryResult.absentDeduction || 0) +
      (this.salaryResult.lateDeduction || 0);
  }
}
