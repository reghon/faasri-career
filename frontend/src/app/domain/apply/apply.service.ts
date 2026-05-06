import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { API_ENDPOINTS } from '../../core/config/api.config';
import {
  Apply,
  CreateApplyPayload,
  UpdateApplyStatusPayload,
  ApplyByJobItem,
  ApplyListItem,
  ApplyMeDetail,
  ApplyHistoryList,
} from './apply.model';
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

  getAll(): Observable<ApplyListItem[]> {
    return this.http
      .get<ApiResponse<ApplyListItem[]>>(`${API_ENDPOINTS.apply.root}`)
      .pipe(map((response) => response.data));
  }

  getMine(): Observable<ApplyHistoryList[]> {
    return this.http
      .get<ApiResponse<ApplyHistoryList[]>>(`${API_ENDPOINTS.apply.root}/me`)
      .pipe(map((response) => response.data));
  }

  getMineDetail(id: string): Observable<ApplyMeDetail> {
    return this.http
      .get<ApiResponse<ApplyMeDetail>>(`${API_ENDPOINTS.apply.root}/me/${id}/detail`)
      .pipe(map((response) => response.data));
  }

  getByJobId(jobId: string): Observable<ApplyByJobItem[]> {
    return this.http
      .get<ApiResponse<ApplyByJobItem[]>>(`${API_ENDPOINTS.apply.root}/job/${jobId}`)
      .pipe(map((response) => response.data));
  }
}
