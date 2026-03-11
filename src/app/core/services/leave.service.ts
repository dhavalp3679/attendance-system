import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Leave, LeaveDecision} from '../models/leave.model';
import {Observable} from 'rxjs';
import {ApiResponse} from '../models/auth.model';

@Injectable({
  providedIn: 'root',
})
@Injectable({ providedIn: 'root' })
export class LeaveService {
  private readonly API = 'http://localhost:8080/api/leaves';

  constructor(private http: HttpClient) {}

  apply(leave: Leave): Observable<ApiResponse<Leave>> {
    return this.http.post<ApiResponse<Leave>>(`${this.API}/apply`, leave);
  }

  getMyLeaves(): Observable<ApiResponse<Leave[]>> {
    return this.http.get<ApiResponse<Leave[]>>(`${this.API}/my`);
  }

  getPending(): Observable<ApiResponse<Leave[]>> {
    return this.http.get<ApiResponse<Leave[]>>(`${this.API}/pending`);
  }

  getAll(): Observable<ApiResponse<Leave[]>> {
    return this.http.get<ApiResponse<Leave[]>>(`${this.API}/all`);
  }

  decide(leaveId: number, decision: LeaveDecision): Observable<ApiResponse<Leave>> {
    return this.http.put<ApiResponse<Leave>>(`${this.API}/${leaveId}/decide`, decision);
  }
}
