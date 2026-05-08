import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { API_ENDPOINTS } from '../../../core/config/api.config';
import { JobCategory, JobCategoryDetail, JobCategoryPayload } from './job-category.model';

interface ApiResponse<T> {
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root',
})
export class JobCategoryService {
  private readonly url = API_ENDPOINTS.master.jobCategories;

  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<JobCategory[]> {
    return this.http.get<ApiResponse<JobCategory[]>>(this.url).pipe(map((res) => res.data));
  }

  getAllDeleted(): Observable<JobCategory[]> {
    return this.http
      .get<ApiResponse<JobCategory[]>>(`${this.url}/deleted`)
      .pipe(map((res) => res.data));
  }

  getById(id: string): Observable<JobCategory> {
    return this.http
      .get<ApiResponse<JobCategory>>(`${this.url}/${id}`)
      .pipe(map((res) => res.data));
  }

  create(payload: JobCategoryPayload): Observable<JobCategory> {
    return this.http.post<ApiResponse<JobCategory>>(this.url, payload).pipe(map((res) => res.data));
  }

  update(id: string, payload: JobCategoryPayload): Observable<JobCategory> {
    return this.http
      .put<ApiResponse<JobCategory>>(`${this.url}/${id}`, payload)
      .pipe(map((res) => res.data));
  }

  delete(id: string): Observable<JobCategoryDetail> {
    return this.http
      .delete<ApiResponse<JobCategoryDetail>>(`${this.url}/${id}`)
      .pipe(map((res) => res.data));
  }

  permanentDelete(id: string): Observable<JobCategoryDetail> {
    return this.http
      .delete<ApiResponse<JobCategoryDetail>>(`${this.url}/${id}/permanent`)
      .pipe(map((res) => res.data));
  }

  restore(id: string): Observable<JobCategory> {
    return this.http
      .patch<ApiResponse<JobCategory>>(`${this.url}/${id}/restore`, {})
      .pipe(map((res) => res.data));
  }
}
