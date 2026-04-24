import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { API_ENDPOINTS } from '../../../core/config/api.config';
import {
  RolePermission,
  RolePermissionDetail,
  RolePermissionPayload,
} from './role-permission.model';

interface ApiResponse<T> {
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root',
})
export class RolePermissionService {
  private readonly url = API_ENDPOINTS.admin.rolePermissions;

  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<RolePermission[]> {
    return this.http.get<ApiResponse<RolePermission[]>>(this.url).pipe(map((res) => res.data));
  }

  getById(id: string): Observable<RolePermission> {
    return this.http
      .get<ApiResponse<RolePermission>>(`${this.url}/${id}`)
      .pipe(map((res) => res.data));
  }

  create(payload: RolePermissionPayload): Observable<RolePermission> {
    return this.http
      .post<ApiResponse<RolePermission>>(this.url, payload)
      .pipe(map((res) => res.data));
  }

  update(id: string, payload: RolePermissionPayload): Observable<RolePermission> {
    return this.http
      .put<ApiResponse<RolePermission>>(`${this.url}/${id}`, payload)
      .pipe(map((res) => res.data));
  }

  delete(id: string): Observable<RolePermissionDetail> {
    return this.http
      .delete<ApiResponse<RolePermissionDetail>>(`${this.url}/${id}`)
      .pipe(map((res) => res.data));
  }
}   
