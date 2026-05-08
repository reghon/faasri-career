import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { API_ENDPOINTS } from '../../../core/config/api.config';
import { JobLocation, JobLocationDetail, JobLocationPayload } from './job-location.model';

interface ApiResponse<T> {
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root',
})
export class JobLocationService {
  private readonly jobLocationUrl = API_ENDPOINTS.master.jobLocations;

  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<JobLocation[]> {
    return this.http
      .get<ApiResponse<JobLocation[]>>(this.jobLocationUrl)
      .pipe(map((response) => response.data));
  }

  getAllDeleted(): Observable<JobLocation[]> {
    return this.http
      .get<ApiResponse<JobLocation[]>>(`${this.jobLocationUrl}/deleted`)
      .pipe(map((response) => response.data));
  }

  getById(id: string): Observable<JobLocation> {
    return this.http
      .get<ApiResponse<JobLocation>>(`${this.jobLocationUrl}/${id}`)
      .pipe(map((response) => response.data));
  }

  create(payload: JobLocationPayload): Observable<JobLocation> {
    return this.http
      .post<ApiResponse<JobLocation>>(this.jobLocationUrl, payload)
      .pipe(map((response) => response.data));
  }

  update(id: string, payload: JobLocationPayload): Observable<JobLocation> {
    return this.http
      .put<ApiResponse<JobLocation>>(`${this.jobLocationUrl}/${id}`, payload)
      .pipe(map((response) => response.data));
  }

  delete(id: string): Observable<JobLocationDetail> {
    return this.http
      .delete<ApiResponse<JobLocationDetail>>(`${this.jobLocationUrl}/${id}`)
      .pipe(map((response) => response.data));
  }

  permanentDelete(id: string): Observable<JobLocationDetail> {
    return this.http
      .delete<ApiResponse<JobLocationDetail>>(`${this.jobLocationUrl}/${id}/permanent`)
      .pipe(map((response) => response.data));
  }

  restore(id: string): Observable<JobLocation> {
    return this.http
      .patch<ApiResponse<JobLocation>>(`${this.jobLocationUrl}/${id}/restore`, {})
      .pipe(map((response) => response.data));
  }
}
