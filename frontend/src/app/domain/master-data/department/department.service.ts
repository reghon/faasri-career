import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { API_ENDPOINTS } from '../../../core/config/api.config';
import { Department, DepartmentDetail, DepartmentPayload } from './department.model';

interface ApiResponse<T> {
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root',
})
export class DepartmentService {
  private readonly url = API_ENDPOINTS.master.departments;

  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<Department[]> {
    return this.http.get<ApiResponse<Department[]>>(this.url).pipe(map((res) => res.data));
  }

  getAllDeleted(): Observable<Department[]> {
    return this.http
      .get<ApiResponse<Department[]>>(`${this.url}/deleted`)
      .pipe(map((res) => res.data));
  }

  getById(id: string): Observable<Department> {
    return this.http.get<ApiResponse<Department>>(`${this.url}/${id}`).pipe(map((res) => res.data));
  }

  create(payload: DepartmentPayload): Observable<Department> {
    return this.http.post<ApiResponse<Department>>(this.url, payload).pipe(map((res) => res.data));
  }

  update(id: string, payload: DepartmentPayload): Observable<Department> {
    return this.http
      .put<ApiResponse<Department>>(`${this.url}/${id}`, payload)
      .pipe(map((res) => res.data));
  }

  delete(id: string): Observable<DepartmentDetail> {
    return this.http
      .delete<ApiResponse<DepartmentDetail>>(`${this.url}/${id}`)
      .pipe(map((res) => res.data));
  }

  permanentDelete(id: string): Observable<DepartmentDetail> {
    return this.http
      .delete<ApiResponse<DepartmentDetail>>(`${this.url}/${id}/permanent`)
      .pipe(map((res) => res.data));
  }

  restore(id: string): Observable<Department> {
    return this.http
      .patch<ApiResponse<Department>>(`${this.url}/${id}/restore`, {})
      .pipe(map((res) => res.data));
  }
}
