import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { API_ENDPOINTS } from '../../../core/config/api.config';
import { JobStatus, JobStatusDetail, JobStatusPayload } from './job-status.model';

interface ApiResponse<T> {
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root',
})
export class JobStatusService {
  private readonly url = API_ENDPOINTS.master.jobStatuses;

  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<JobStatus[]> {
    return this.http.get<ApiResponse<JobStatus[]>>(this.url).pipe(map((res) => res.data));
  }
  getAllDeleted(): Observable<JobStatus[]> {
    return this.http
      .get<ApiResponse<JobStatus[]>>(`${this.url}/deleted`)
      .pipe(map((res) => res.data));
  }

  getById(id: string): Observable<JobStatus> {
    return this.http.get<ApiResponse<JobStatus>>(`${this.url}/${id}`).pipe(map((res) => res.data));
  }

  create(payload: JobStatusPayload): Observable<JobStatus> {
    return this.http.post<ApiResponse<JobStatus>>(this.url, payload).pipe(map((res) => res.data));
  }

  update(id: string, payload: JobStatusPayload): Observable<JobStatus> {
    return this.http
      .put<ApiResponse<JobStatus>>(`${this.url}/${id}`, payload)
      .pipe(map((res) => res.data));
  }

  delete(id: string): Observable<JobStatusDetail> {
    return this.http
      .delete<ApiResponse<JobStatusDetail>>(`${this.url}/${id}`)
      .pipe(map((res) => res.data));
  }

  permanentDelete(id: string): Observable<JobStatusDetail> {
    return this.http
      .delete<ApiResponse<JobStatusDetail>>(`${this.url}/${id}/permanent`)
      .pipe(map((res) => res.data));
  }

  restore(id: string): Observable<JobStatus> {
    return this.http
      .patch<ApiResponse<JobStatus>>(`${this.url}/${id}/restore`, {})
      .pipe(map((res) => res.data));
  }
}
