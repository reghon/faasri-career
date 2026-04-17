import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { API_ENDPOINTS } from '../../../../core/config/api.config';
import { ApplyStatus, ApplyStatusDetail, ApplyStatusPayload } from './apply-status.model';

interface ApiResponse<T> {
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root',
})
export class ApplyStatusService {
  private readonly url = API_ENDPOINTS.master.applyStatuses;

  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<ApplyStatus[]> {
    return this.http.get<ApiResponse<ApplyStatus[]>>(this.url).pipe(map((res) => res.data));
  }

  getById(id: string): Observable<ApplyStatus> {
    return this.http
      .get<ApiResponse<ApplyStatus>>(`${this.url}/${id}`)
      .pipe(map((res) => res.data));
  }

  create(payload: ApplyStatusPayload): Observable<ApplyStatus> {
    return this.http.post<ApiResponse<ApplyStatus>>(this.url, payload).pipe(map((res) => res.data));
  }

  update(id: string, payload: ApplyStatusPayload): Observable<ApplyStatus> {
    return this.http
      .put<ApiResponse<ApplyStatus>>(`${this.url}/${id}`, payload)
      .pipe(map((res) => res.data));
  }

  delete(id: string): Observable<ApplyStatusDetail> {
    return this.http
      .delete<ApiResponse<ApplyStatusDetail>>(`${this.url}/${id}`)
      .pipe(map((res) => res.data));
  }
}
