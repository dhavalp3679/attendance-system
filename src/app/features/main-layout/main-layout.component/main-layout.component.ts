// import {Component, inject} from '@angular/core';
// import {AuthService} from '../../../core/services/auth.service';
// import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
// import {Tooltip} from 'primeng/tooltip';
//
// @Component({
//   selector: 'app-main-layout.component',
//   imports: [
//     RouterLink,
//     RouterLinkActive,
//     RouterOutlet,
//     Tooltip
//   ],
//   templateUrl: './main-layout.component.html',
//   styleUrl: './main-layout.component.scss',
// })
// export class MainLayoutComponent {
//   auth = inject(AuthService);
//
//   get userInitials(): string {
//     const name = this.auth.currentUser()?.name || '';
//     return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
//   }
//
//   logout(): void {
//     this.auth.logout();
//   }
// }
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';  // ✅ removed Router
import { Menubar } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { TooltipModule } from 'primeng/tooltip';
import { AuthService } from '../../../core/services/auth.service'; // ✅ correct path (3 levels up)

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, Menubar, TooltipModule],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss'
})
export class MainLayoutComponent implements OnInit {

  menuItems: MenuItem[] = [];

  constructor(public auth: AuthService) {} // ✅ removed private router: Router

  get userInitials(): string {
    const name = this.auth.currentUser()?.name ?? '';
    return name.split(' ').map((n: string) => n[0]).join('').toUpperCase();
  }

  ngOnInit() {
    this.buildMenu();
  }

  buildMenu() {
    const isAdmin = this.auth.isAdmin();

    this.menuItems = [
      {
        label: 'Dashboard',
        icon: 'pi pi-home',
        routerLink: '/dashboard'
      },
      {
        label: 'Attendance',
        icon: 'pi pi-clock',
        items: [
          { label: 'Attendance', icon: 'pi pi-clock', routerLink: '/attendance' },
          { label: 'GPS Attendance', icon: 'pi pi-map-marker', routerLink: '/gps-attendance' }
        ]
      },
      ...(isAdmin ? [{
        label: 'Employees',
        icon: 'pi pi-users',
        items: [
          { label: 'Employee List', icon: 'pi pi-list', routerLink: '/employees' },
          { label: 'Add Employee', icon: 'pi pi-user-plus', routerLink: '/employees/add' }
        ]
      }] : []),
      {
        label: 'Leaves',
        icon: 'pi pi-calendar-minus',
        items: [
          { label: 'Leaves', icon: 'pi pi-calendar-minus', routerLink: '/leaves' },
          ...(isAdmin ? [{ label: 'Holidays', icon: 'pi pi-calendar', routerLink: '/holidays' }] : [])
        ]
      },
      {
        label: 'Salary',
        icon: 'pi pi-wallet',
        items: [
          { label: 'Salary', icon: 'pi pi-wallet', routerLink: '/salary' },
          { label: 'Salary Slip', icon: 'pi pi-file-pdf', routerLink: '/salary-slip' }
        ]
      }
    ];
  }

  logout() {
    this.auth.logout(); // ✅ AuthService already calls router.navigate internally
  }
}
