// import { Routes } from '@angular/router';
// import { authGuard, adminGuard } from './core/guards/auth.guard-guard';
//
// export const routes: Routes = [
//   {
//     path: 'login',
//     loadComponent: () =>
//       import('./features/auth/login.component/login.component')
//         .then(m => m.LoginComponent)
//   },
//   {
//     path: '',
//     loadComponent: () =>
//       import('./layout/main-layout/main-layout.component')
//         .then(m => m.MainLayoutComponent),
//     canActivate: [authGuard],
//     children: [
//       { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
//       {
//         path: 'dashboard',
//         loadComponent: () =>
//           import('./features/dashboard/dashboard.component')
//             .then(m => m.DashboardComponent)
//       },
//       {
//         path: 'employees',
//         canActivate: [adminGuard],
//         loadComponent: () =>
//           import('./features/employees/employee-list.component/employee-list.component')
//             .then(m => m.EmployeeListComponent)
//       },
//       {
//         path: 'employees/add',
//         canActivate: [adminGuard],
//         loadComponent: () =>
//           import('./features/employees/employee-form.component/employee-form.component')
//             .then(m => m.EmployeeFormComponent)
//       },
//       {
//         path: 'employees/edit/:id',
//         canActivate: [adminGuard],
//         loadComponent: () =>
//           import('./features/employees/employee-form.component/employee-form.component')
//             .then(m => m.EmployeeFormComponent)
//       },
//       {
//         path: 'attendance',
//         loadComponent: () =>
//           import('./features/attendance.component/attendance.component')
//             .then(m => m.AttendanceComponent)
//       },
//       {
//         path: 'leaves',
//         loadComponent: () =>
//           import('./features/leaves/leave-list.component/leave-list.component')
//             .then(m => m.LeaveListComponent)
//       },
//       {
//         path: 'holidays',
//         loadComponent: () =>
//           import('./features/holidays/holiday-list.component/holiday-list.component')
//             .then(m => m.HolidayListComponent)
//       },
//       {
//         path: 'salary',
//         loadComponent: () =>
//           import('./features/salary.component/salary.component')
//             .then(m => m.SalaryComponent)
//       }
//     ]
//   },
//   { path: '**', redirectTo: 'login' }
// ];
import { Routes } from '@angular/router';
import { authGuard, adminGuard } from './core/guards/auth.guard-guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login.component/login.component')
        .then(m => m.LoginComponent)
  },
  {
    path: '',
    loadComponent: () =>
      import('./features/main-layout/main-layout.component/main-layout.component')
        .then(m => m.MainLayoutComponent),
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component/dashboard.component')
            .then(m => m.DashboardComponent)
      },
      {
        path: 'employees',
        canActivate: [adminGuard],
        loadComponent: () =>
          import('./features/employees/employee-list.component/employee-list.component')
            .then(m => m.EmployeeListComponent)
      },
      {
        path: 'employees/add',
        canActivate: [adminGuard],
        loadComponent: () =>
          import('./features/employees/employee-form.component/employee-form.component')
            .then(m => m.EmployeeFormComponent)
      },
      {
        path: 'employees/edit/:id',
        canActivate: [adminGuard],
        loadComponent: () =>
          import('./features/employees/employee-form.component/employee-form.component')
            .then(m => m.EmployeeFormComponent)
      },
      {
        path: 'attendance',
        loadComponent: () =>
          import('./features/attendance.component/attendance.component')
            .then(m => m.AttendanceComponent)
      },
      {
        path: 'leaves',
        loadComponent: () =>
          import('./features/leaves/leave-list.component/leave-list.component')
            .then(m => m.LeaveListComponent)
      },
      {
        path: 'holidays',
        loadComponent: () =>
          import('./features/holidays/holiday-list.component/holiday-list.component')
            .then(m => m.HolidayListComponent)
      },
      {
        path: 'salary',
        loadComponent: () =>
          import('./features/salary.component/salary.component')
            .then(m => m.SalaryComponent)
      }
    ]
  },
  { path: '**', redirectTo: 'login' }
];
