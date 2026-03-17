import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {SalaryCalculateRequest, SalaryReport} from '../models/holiday-salary.model';
import {Observable} from 'rxjs';
import {ApiResponse} from '../models/auth.model';

@Injectable({
  providedIn: 'root',
})
@Injectable({ providedIn: 'root' })
export class SalaryService {
  private readonly API = 'http://localhost:8080/api/salary';

  constructor(private http: HttpClient) {}

  calculate(req: SalaryCalculateRequest): Observable<ApiResponse<SalaryReport>> {
    return this.http.post<ApiResponse<SalaryReport>>(`${this.API}/calculate`, req);
  }

  getReport(empId: number, month: string): Observable<ApiResponse<SalaryReport>> {
    return this.http.get<ApiResponse<SalaryReport>>(`${this.API}/${empId}/${month}`);
  }

  getMyReports(): Observable<ApiResponse<SalaryReport[]>> {
    return this.http.get<ApiResponse<SalaryReport[]>>(`${this.API}/my-reports`);
  }
}
