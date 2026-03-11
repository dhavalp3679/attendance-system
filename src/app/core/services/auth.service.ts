import {Injectable, signal} from '@angular/core';
import {ApiResponse, LoginRequest, LoginResponse} from '../models/auth.model';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {Observable, tap} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API = 'http://localhost:8080/api/auth';

  currentUser = signal<LoginResponse | null>(this.loadUser());

  constructor(private http: HttpClient, private router: Router) {}

  login(req: LoginRequest): Observable<ApiResponse<LoginResponse>> {
    return this.http.post<ApiResponse<LoginResponse>>(`${this.API}/login`, req).pipe(
      tap(res => {
        if (res.success && res.data) {
          localStorage.setItem('auth_user', JSON.stringify(res.data));
          localStorage.setItem('auth_token', res.data.token);
          this.currentUser.set(res.data);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('auth_user');
    localStorage.removeItem('auth_token');
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean {
    return this.currentUser()?.role === 'ADMIN';
  }

  private loadUser(): LoginResponse | null {
    const stored = localStorage.getItem('auth_user');
    return stored ? JSON.parse(stored) : null;
  }
}
