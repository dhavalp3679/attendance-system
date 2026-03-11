// import {Component, inject} from '@angular/core';
// import {Toast} from 'primeng/toast';
// import {FormsModule} from '@angular/forms';
// import {Password} from 'primeng/password';
// import {Button} from 'primeng/button';
// import {LoginRequest} from '../../../core/models/auth.model';
// import {AuthService} from '../../../core/services/auth.service';
// import {Router} from '@angular/router';
// import {MessageService} from 'primeng/api';
// import {NgIf} from '@angular/common';
//
// @Component({
//   selector: 'app-login.component',
//   imports: [
//     Toast,
//     FormsModule,
//     Password,
//     Button,
//     NgIf
//   ],
//   templateUrl: './login.component.html',
//   styleUrl: './login.component.scss',
// })
// export class LoginComponent {
//   loginData: LoginRequest = { email: '', password: '' };
//   loading = false;
//   errorMessage = '';
//
//   private auth = inject(AuthService);
//   private router = inject(Router);
//   private msgService = inject(MessageService);
//
//   login(): void {
//     if (!this.loginData.email || !this.loginData.password) {
//       this.errorMessage = 'Email ane Password jaruri che!';
//       return;
//     }
//     this.loading = true;
//     this.errorMessage = '';
//
//     this.auth.login(this.loginData).subscribe({
//       next: () => {
//         this.loading = false;
//         this.msgService.add({ severity: 'success', summary: 'Welcome!', detail: 'Login successful!' });
//         setTimeout(() => this.router.navigate(['/dashboard']), 500);
//       },
//       error: (err) => {
//         this.loading = false;
//         this.errorMessage = err?.error?.message || 'Login failed! Check email/password.';
//       }
//     });
//   }
// }

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../../core/services/auth.service';
import { LoginRequest } from '../../../core/models/auth.model';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    ToastModule
  ],
  providers: [MessageService]   // ← yahi missing hatu!
})
export class LoginComponent {
  loginData: LoginRequest = { email: '', password: '' };
  loading = false;
  errorMessage = '';

  private auth = inject(AuthService);
  private router = inject(Router);
  private msgService = inject(MessageService);

  login(): void {
    if (!this.loginData.email || !this.loginData.password) {
      this.errorMessage = 'Email ane Password jaruri che!';
      return;
    }
    this.loading = true;
    this.errorMessage = '';

    this.auth.login(this.loginData).subscribe({
      next: () => {
        this.loading = false;
        setTimeout(() => this.router.navigate(['/dashboard']), 500);
      },
      error: (err: any) => {
        this.loading = false;
        this.errorMessage = err?.error?.message || 'Login failed! Check email/password.';
      }
    });
  }
}
