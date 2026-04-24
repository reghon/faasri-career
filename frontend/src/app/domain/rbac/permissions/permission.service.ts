import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { API_ENDPOINTS } from '../../../core/config/api.config';
import { Permission, PermissionDetail, PermissionPayload } from './permission.model';

interface ApiResponse<T> {
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root',
})
export class PermissionService {
  private readonly url = API_ENDPOINTS.admin.permissions;

  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<Permission[]> {
    return this.http.get<ApiResponse<Permission[]>>(this.url).pipe(map((res) => res.data));
  }

  getById(id: string): Observable<Permission> {
    return this.http.get<ApiResponse<Permission>>(`${this.url}/${id}`).pipe(map((res) => res.data));
  }

  create(payload: PermissionPayload): Observable<Permission> {
    return this.http.post<ApiResponse<Permission>>(this.url, payload).pipe(map((res) => res.data));
  }

  update(id: string, payload: PermissionPayload): Observable<Permission> {
    return this.http
      .put<ApiResponse<Permission>>(`${this.url}/${id}`, payload)
      .pipe(map((res) => res.data));
  }

  delete(id: string): Observable<PermissionDetail> {
    return this.http
      .delete<ApiResponse<PermissionDetail>>(`${this.url}/${id}`)
      .pipe(map((res) => res.data));
  }
}
