import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { API_ENDPOINTS } from '../../core/config/api.config';
import { Apply, CreateApplyPayload, UpdateApplyStatusPayload } from './apply.model';

interface ApiResponse<T> {
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root',
})
export class ApplyService {
  constructor(private readonly http: HttpClient) {}

  create(payload: CreateApplyPayload): Observable<Apply> {
    return this.http
      .post<ApiResponse<Apply>>(API_ENDPOINTS.apply.root, payload)
      .pipe(map((response) => response.data));
  }

  updateStatus(id: string, payload: UpdateApplyStatusPayload): Observable<Apply> {
    return this.http
      .patch<ApiResponse<Apply>>(`${API_ENDPOINTS.apply.root}/${id}/status`, payload)
      .pipe(map((response) => response.data));
  }
  getMine(): Observable<Apply[]> {
    return this.http
      .get<ApiResponse<Apply[]>>(`${API_ENDPOINTS.apply.root}/me`)
      .pipe(map((response) => response.data));
  }
}
