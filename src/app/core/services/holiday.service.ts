import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ApiResponse} from '../models/auth.model';
import {Holiday} from '../models/holiday-salary.model';

@Injectable({
  providedIn: 'root',
})
@Injectable({ providedIn: 'root' })
export class HolidayService {
  private readonly API = 'http://localhost:8080/api/holidays';

  constructor(private http: HttpClient) {}

  getAll(): Observable<ApiResponse<Holiday[]>> {
    return this.http.get<ApiResponse<Holiday[]>>(this.API);
  }

  getByMonth(month: string): Observable<ApiResponse<Holiday[]>> {
    return this.http.get<ApiResponse<Holiday[]>>(`${this.API}/month/${month}`);
  }

  add(holiday: Holiday): Observable<ApiResponse<Holiday>> {
    return this.http.post<ApiResponse<Holiday>>(this.API, holiday);
  }

  delete(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.API}/${id}`);
  }
}
