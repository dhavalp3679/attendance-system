import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ApiResponse} from '../models/auth.model';
import {AttendanceRecord} from '../models/attendance.model';

@Injectable({
  providedIn: 'root',
})
@Injectable({ providedIn: 'root' })
export class AttendanceService {
  private readonly API = 'http://localhost:8080/api/attendance';

  constructor(private http: HttpClient) {}

  punchIn(): Observable<ApiResponse<AttendanceRecord>> {
    return this.http.post<ApiResponse<AttendanceRecord>>(`${this.API}/punch-in`, {});
  }

  punchOut(): Observable<ApiResponse<AttendanceRecord>> {
    return this.http.post<ApiResponse<AttendanceRecord>>(`${this.API}/punch-out`, {});
  }

  getMyToday(): Observable<ApiResponse<AttendanceRecord>> {
    return this.http.get<ApiResponse<AttendanceRecord>>(`${this.API}/today`);
  }

  getAllToday(): Observable<ApiResponse<AttendanceRecord[]>> {
    return this.http.get<ApiResponse<AttendanceRecord[]>>(`${this.API}/all/today`);
  }

  getMonthly(empId: number, month: string): Observable<ApiResponse<AttendanceRecord[]>> {
    return this.http.get<ApiResponse<AttendanceRecord[]>>(`${this.API}/${empId}/monthly?month=${month}`);
  }
}

