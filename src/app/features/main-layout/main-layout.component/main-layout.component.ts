import {Component, inject} from '@angular/core';
import {AuthService} from '../../../core/services/auth.service';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {Tooltip} from 'primeng/tooltip';

@Component({
  selector: 'app-main-layout.component',
  imports: [
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    Tooltip
  ],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
})
export class MainLayoutComponent {
  auth = inject(AuthService);

  get userInitials(): string {
    const name = this.auth.currentUser()?.name || '';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }

  logout(): void {
    this.auth.logout();
  }
}
