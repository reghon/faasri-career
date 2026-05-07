import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { API_ENDPOINTS } from '../../../core/config/api.config';
import { DashboardData } from './dashboard.model';

interface ApiResponse<T> {
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private readonly url = API_ENDPOINTS.admin.dashboard;

  constructor(private readonly http: HttpClient) {}

  getOverview(): Observable<DashboardData> {
    return this.http
      .get<ApiResponse<DashboardData>>(`${this.url}/overview`)
      .pipe(map((res) => res.data));
  }
}
