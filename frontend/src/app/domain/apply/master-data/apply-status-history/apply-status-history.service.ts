import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { API_ENDPOINTS } from '../../../../core/config/api.config';
import {
  ApplyStatusHistory,
  ApplyStatusHistoryDetail,
  ApplyStatusHistoryPayload,
  ApplyStatusHistoryUpdatePayload,
} from './apply-status-history.model';

interface ApiResponse<T> {
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root',
})
export class ApplyStatusHistoryService {
  private readonly url = API_ENDPOINTS.apply.applyStatusHistories;

  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<ApplyStatusHistory[]> {
    return this.http.get<ApiResponse<ApplyStatusHistory[]>>(this.url).pipe(map((res) => res.data));
  }

  getById(id: string): Observable<ApplyStatusHistory> {
    return this.http
      .get<ApiResponse<ApplyStatusHistory>>(`${this.url}/${id}`)
      .pipe(map((res) => res.data));
  }

  getByApplyId(applyId: string): Observable<ApplyStatusHistory[]> {
    return this.http
      .get<ApiResponse<ApplyStatusHistory[]>>(`${this.url}/apply/${applyId}`)
      .pipe(map((res) => res.data));
  }

  create(payload: ApplyStatusHistoryPayload): Observable<ApplyStatusHistory[]> {
    return this.http
      .post<ApiResponse<ApplyStatusHistory[]>>(this.url, payload)
      .pipe(map((res) => res.data));
  }

  update(id: string, payload: ApplyStatusHistoryUpdatePayload): Observable<ApplyStatusHistory> {
    return this.http
      .put<ApiResponse<ApplyStatusHistory>>(`${this.url}/${id}`, payload)
      .pipe(map((res) => res.data));
  }

  delete(id: string): Observable<ApplyStatusHistoryDetail> {
    return this.http
      .delete<ApiResponse<ApplyStatusHistoryDetail>>(`${this.url}/${id}`)
      .pipe(map((res) => res.data));
  }
}
