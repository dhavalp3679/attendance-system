import {Component, inject, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {EmployeeService} from '../../../core/services/employee.service';
import {ConfirmationService, MessageService} from 'primeng/api';
import {DEPARTMENTS, Employee} from '../../../core/models/employee.model';
import {TableModule} from 'primeng/table';
import {Select} from 'primeng/select';
import {FormsModule} from '@angular/forms';
import {ConfirmDialog} from 'primeng/confirmdialog';
import {Toast} from 'primeng/toast';
import {Tag} from 'primeng/tag';
import {DecimalPipe} from '@angular/common';
import { TooltipModule } from 'primeng/tooltip';
import {ButtonModule} from 'primeng/button';

@Component({
  selector: 'app-employee-list.component',
  imports: [
    TableModule,
    Select,
    FormsModule,
    ConfirmDialog,
    Toast,
    Tag,
    DecimalPipe,
    TooltipModule,
    ButtonModule

  ],
  providers: [MessageService,ConfirmationService],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.scss',
})
export class EmployeeListComponent implements OnInit {
  private router = inject(Router);
  private employeeSvc = inject(EmployeeService);
  private confirmSvc = inject(ConfirmationService);
  private msgSvc = inject(MessageService);

  employees: Employee[] = [];
  loading = false;
  searchText = '';
  selectedDept = '';
  departments = ['All', ...DEPARTMENTS];

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.employeeSvc.getAll().subscribe({
      next: res => { this.employees = res.data || []; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  goToAdd(): void {
    this.router.navigate(['/employees/add']);
  }

  goToEdit(id: number): void {
    this.router.navigate(['/employees/edit', id]);
  }

  // confirmDelete(emp: Employee): void {
  //   this.confirmSvc.confirm({
  //     message: `"${emp.name}" ne delete karvu che?`,
  //     header: 'Confirm Delete',
  //     icon: 'pi pi-trash',
  //     acceptSeverity: 'danger',
  //     acceptLabel: 'Delete',
  //     rejectLabel: 'Cancel',
  //     accept: () => {
  //       this.employeeSvc.delete(emp.id!).subscribe({
  //         next: () => {
  //           this.msgSvc.add({ severity: 'success', summary: 'Deleted!', detail: `${emp.name} deleted successfully.` });
  //           this.load();
  //         },
  //         error: err => {
  //           this.msgSvc.add({ severity: 'error', summary: 'Error', detail: err?.error?.message || 'Delete failed!' });
  //         }
  //       });
  //     }
  //   });
  // }
  confirmDelete(emp: Employee): void {
    this.confirmSvc.confirm({
      message: `"${emp.name}" ne delete karvu che?`,
      header: 'Confirm Delete',
      icon: 'pi pi-trash',
      acceptLabel: 'Delete',
      rejectLabel: 'Cancel',
      accept: () => {
        this.employeeSvc.delete(emp.id!).subscribe({
          next: () => {
            this.msgSvc.add({ severity: 'success', summary: 'Deleted!', detail: `${emp.name} deleted successfully.` });
            this.load();
          },
          error: (err: any) => {
            this.msgSvc.add({ severity: 'error', summary: 'Error', detail: err?.error?.message || 'Delete failed!' });
          }
        });
      }
    });
  }
  getRoleSeverity(role: string): 'warn' | 'success' {
    return role === 'ADMIN' ? 'warn' : 'success';
  }

  get filteredEmployees(): Employee[] {
    return this.employees.filter(e => {
      const matchSearch = !this.searchText ||
        e.name.toLowerCase().includes(this.searchText.toLowerCase()) ||
        e.email.toLowerCase().includes(this.searchText.toLowerCase()) ||
        e.designation?.toLowerCase().includes(this.searchText.toLowerCase());
      const matchDept = !this.selectedDept || this.selectedDept === 'All' || e.department === this.selectedDept;
      return matchSearch && matchDept;
    });
  }
}
