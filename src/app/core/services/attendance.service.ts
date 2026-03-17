// import { Injectable } from '@angular/core';
// import {HttpClient} from '@angular/common/http';
// import {Observable} from 'rxjs';
// import {ApiResponse} from '../models/auth.model';
// import {AttendanceRecord} from '../models/attendance.model';
//
// @Injectable({
//   providedIn: 'root',
// })
// @Injectable({ providedIn: 'root' })
// export class AttendanceService {
//   private readonly API = 'http://localhost:8080/api/attendance';
//
//   constructor(private http: HttpClient) {}
//
//   punchIn(): Observable<ApiResponse<AttendanceRecord>> {
//     return this.http.post<ApiResponse<AttendanceRecord>>(`${this.API}/punch-in`, {});
//   }
//
//   punchOut(): Observable<ApiResponse<AttendanceRecord>> {
//     return this.http.post<ApiResponse<AttendanceRecord>>(`${this.API}/punch-out`, {});
//   }
//
//   getMyToday(): Observable<ApiResponse<AttendanceRecord>> {
//     return this.http.get<ApiResponse<AttendanceRecord>>(`${this.API}/today`);
//   }
//
//   getAllToday(): Observable<ApiResponse<AttendanceRecord[]>> {
//     return this.http.get<ApiResponse<AttendanceRecord[]>>(`${this.API}/all/today`);
//   }
//
//   getMonthly(empId: number, month: string): Observable<ApiResponse<AttendanceRecord[]>> {
//     return this.http.get<ApiResponse<AttendanceRecord[]>>(`${this.API}/${empId}/monthly?month=${month}`);
//   }
// }
//


import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const API = 'http://localhost:8080/api/attendance';

@Injectable({ providedIn: 'root' })
export class AttendanceService {
  private http = inject(HttpClient);

  punchIn(): Observable<any> {
    return this.http.post(`${API}/punch-in`, {});
  }

  punchOut(): Observable<any> {
    return this.http.post(`${API}/punch-out`, {});
  }

  getMyToday(): Observable<any> {
    return this.http.get(`${API}/today`);
  }

  getMyHistory(): Observable<any> {
    return this.http.get(`${API}/my-history`);
  }

  getAllToday(): Observable<any> {
    return this.http.get(`${API}/all/today`);
  }

  getMonthly(employeeId: number, month: string): Observable<any> {
    return this.http.get(`${API}/${employeeId}/monthly?month=${month}`);
  }

  // ── Admin Methods ──────────────────────────────────────────────────────
  adminAddAttendance(payload: any): Observable<any> {
    return this.http.post(`${API}/admin/add`, payload);
  }

  adminEditAttendance(id: number, payload: any): Observable<any> {
    return this.http.put(`${API}/admin/edit/${id}`, payload);
  }
}
