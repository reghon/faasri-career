import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { API_ENDPOINTS } from '../../../../core/config/api.config';
import {
  JobApplyStatus,
  JobApplyStatusDetail,
  JobApplyStatusEditGuard,
  JobApplyStatusPayload,
  JobApplyStatusSyncPayload,
  JobApplyStatusUpdatePayload,
} from './job-apply-status.model';

interface ApiResponse<T> {
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root',
})
export class JobApplyStatusService {
  private readonly url = API_ENDPOINTS.master.jobApplyStatuses;

  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<JobApplyStatus[]> {
    return this.http.get<ApiResponse<JobApplyStatus[]>>(this.url).pipe(map((res) => res.data));
  }

  getByJobId(jobId: string): Observable<JobApplyStatus[]> {
    return this.http
      .get<ApiResponse<JobApplyStatus[]>>(`${this.url}/job/${jobId}`)
      .pipe(map((res) => res.data));
  }

  getById(id: string): Observable<JobApplyStatus> {
    return this.http
      .get<ApiResponse<JobApplyStatus>>(`${this.url}/${id}`)
      .pipe(map((res) => res.data));
  }

  create(payload: JobApplyStatusPayload): Observable<JobApplyStatus> {
    return this.http
      .post<ApiResponse<JobApplyStatus>>(this.url, payload)
      .pipe(map((res) => res.data));
  }

  getEditGuard(jobId: string): Observable<JobApplyStatusEditGuard> {
    return this.http
      .get<ApiResponse<JobApplyStatusEditGuard>>(`${this.url}/job/${jobId}/edit-guard`)
      .pipe(map((res) => res.data));
  }

  syncByJobId(jobId: string, payload: JobApplyStatusSyncPayload): Observable<JobApplyStatus[]> {
    return this.http
      .put<ApiResponse<JobApplyStatus[]>>(`${this.url}/job/${jobId}/sync`, payload)
      .pipe(map((res) => res.data));
  }
  update(id: string, payload: JobApplyStatusUpdatePayload): Observable<JobApplyStatus> {
    return this.http
      .put<ApiResponse<JobApplyStatus>>(`${this.url}/${id}`, payload)
      .pipe(map((res) => res.data));
  }

  delete(id: string): Observable<JobApplyStatusDetail> {
    return this.http
      .delete<ApiResponse<JobApplyStatusDetail>>(`${this.url}/${id}`)
      .pipe(map((res) => res.data));
  }
}
