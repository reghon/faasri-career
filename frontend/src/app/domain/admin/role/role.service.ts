import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { API_ENDPOINTS } from '../../../core/config/api.config';
import { Role, RoleDetail, RolePayload } from './role.model';

interface ApiResponse<T> {
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  private readonly url = API_ENDPOINTS.admin.roles;

  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<Role[]> {
    return this.http.get<ApiResponse<Role[]>>(this.url).pipe(map((res) => res.data));
  }

  getById(id: string): Observable<Role> {
    return this.http.get<ApiResponse<Role>>(`${this.url}/${id}`).pipe(map((res) => res.data));
  }

  create(payload: RolePayload): Observable<Role> {
    return this.http.post<ApiResponse<Role>>(this.url, payload).pipe(map((res) => res.data));
  }

  update(id: string, payload: RolePayload): Observable<Role> {
    return this.http
      .put<ApiResponse<Role>>(`${this.url}/${id}`, payload)
      .pipe(map((res) => res.data));
  }

  delete(id: string): Observable<RoleDetail> {
    return this.http
      .delete<ApiResponse<RoleDetail>>(`${this.url}/${id}`)
      .pipe(map((res) => res.data));
  }
}
