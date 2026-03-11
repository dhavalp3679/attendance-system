import { Component, inject, OnInit } from '@angular/core';
import { HolidayService } from '../../../core/services/holiday.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Holiday } from '../../../core/models/holiday-salary.model';
import { Dialog } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { Toast } from 'primeng/toast';
import { ButtonDirective } from 'primeng/button';

@Component({
  selector: 'app-holiday-list',
  imports: [
    Dialog,
    FormsModule,
    DatePipe,
    TableModule,
    ConfirmDialog,
    Toast,
    ButtonDirective
  ],
  templateUrl: './holiday-list.component.html',
  styleUrl: './holiday-list.component.scss',
  providers: [ConfirmationService, MessageService]
})
export class HolidayListComponent implements OnInit {
  private svc = inject(HolidayService);
  private msgSvc = inject(MessageService);
  private confirmSvc = inject(ConfirmationService);

  holidays: Holiday[] = [];
  loading = false;
  showDialog = false;
  addLoading = false;

  form: Holiday = { name: '', date: '', description: '' };

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.svc.getAll().subscribe({
      next: res => {
        this.holidays = res.data || [];
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  add(): void {
    if (!this.form.name || !this.form.date) {
      this.msgSvc.add({ severity: 'warn', summary: 'Required', detail: 'Name ane Date jaruri che!' });
      return;
    }
    this.addLoading = true;
    this.svc.add(this.form).subscribe({
      next: res => {
        this.addLoading = false;
        this.showDialog = false;
        this.msgSvc.add({ severity: 'success', summary: 'Added!', detail: res.message });
        this.form = { name: '', date: '', description: '' };
        this.load();
      },
      error: (err: any) => {
        this.addLoading = false;
        this.msgSvc.add({ severity: 'error', summary: 'Error', detail: err?.error?.message || 'Failed!' });
      }
    });
  }

  confirmDelete(h: Holiday): void {
    this.confirmSvc.confirm({
      message: `"${h.name}" holiday delete karvu che?`,
      header: 'Confirm Delete',
      icon: 'pi pi-trash',
      acceptLabel: 'Delete',
      rejectLabel: 'Cancel',
      accept: () => {
        this.svc.delete(h.id!).subscribe({
          next: () => {
            this.msgSvc.add({ severity: 'success', summary: 'Deleted!' });
            this.load();
          },
          error: (err: any) => {
            this.msgSvc.add({ severity: 'error', summary: 'Error', detail: err?.error?.message || 'Failed!' });
          }
        });
      }
    });
  }
}
