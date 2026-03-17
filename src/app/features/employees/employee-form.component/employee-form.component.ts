import {Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {EmployeeService} from '../../../core/services/employee.service';
import {MessageService} from 'primeng/api';
import {DEPARTMENTS, Employee, ROLES} from '../../../core/models/employee.model';
import {ButtonDirective} from 'primeng/button';
import {FormsModule} from '@angular/forms';
import {Divider} from 'primeng/divider';
import {Select} from 'primeng/select';
import {Toast} from 'primeng/toast';

@Component({
  selector: 'app-employee-form.component',
  imports: [
    ButtonDirective,
    FormsModule,
    Divider,
    Select,
    Toast
  ],
  providers: [MessageService],
  templateUrl: './employee-form.component.html',
  styleUrl: './employee-form.component.scss',
})
export class EmployeeFormComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private employeeSvc = inject(EmployeeService);
  private msgSvc = inject(MessageService);

  isEdit = false;
  empId: number | null = null;
  loading = false;

  departments = DEPARTMENTS;
  roles = ROLES;

  form: Employee = {
    name: '', email: '', password: '',
    phoneNumber: '', department: '', designation: '',
    salary: 0, role: 'EMPLOYEE', joinDate: '',
    bankAccountNumber: '', bankIfscCode: '', bankName: '',
    address: '', emergencyContactName: '', emergencyContactPhone: ''
  };

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEdit = true;
      this.empId = +id;
      this.employeeSvc.getById(this.empId).subscribe({
        next: res => {
          Object.assign(this.form, res.data);
          // Edit mode ma password clear karo — user navu nakhse to j update thase
          this.form.password = '';
        }
      });
    }
  }

  save(): void {
    // Required fields check
    if (!this.form.name || !this.form.email || !this.form.department ||
      !this.form.designation || !this.form.salary) {
      this.msgSvc.add({
        severity: 'warn',
        summary: 'Required Fields',
        detail: 'Badha starred fields jaruri che!'
      });
      return;
    }

    // Add mode ma password jaruri che
    if (!this.isEdit && (!this.form.password || this.form.password.length < 6)) {
      this.msgSvc.add({
        severity: 'warn',
        summary: 'Password Required',
        detail: 'Password minimum 6 characters joie!'
      });
      return;
    }

    this.loading = true;

    // Edit mode ma password empty hoy to send nahi karvo
    const payload = { ...this.form };
    if (this.isEdit && !payload.password) {
      delete (payload as any).password;
    }

    const call = this.isEdit
      ? this.employeeSvc.update(this.empId!, payload)
      : this.employeeSvc.add(payload);

    call.subscribe({
      next: () => {
        this.loading = false;
        this.msgSvc.add({
          severity: 'success',
          summary: 'Success!',
          detail: this.isEdit ? 'Employee updated!' : 'Employee added!'
        });
        setTimeout(() => void this.router.navigate(['/employees']), 800);
      },
      error: err => {
        this.loading = false;
        this.msgSvc.add({
          severity: 'error',
          summary: 'Error',
          detail: err?.error?.message || 'Failed!'
        });
      }
    });
  }

  cancel(): void {
    void this.router.navigate(['/employees']);
  }
}
