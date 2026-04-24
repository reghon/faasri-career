import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { API_ENDPOINTS } from '../../../core/config/api.config';
import {
  PermissionAction,
  PermissionActionDetail,
  PermissionActionPayload,
} from './permission-action.model';

interface ApiResponse<T> {
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root',
})
export class PermissionActionService {
  private readonly url = API_ENDPOINTS.admin.permissionActions;

  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<PermissionAction[]> {
    return this.http.get<ApiResponse<PermissionAction[]>>(this.url).pipe(map((res) => res.data));
  }

  getById(id: string): Observable<PermissionAction> {
    return this.http
      .get<ApiResponse<PermissionAction>>(`${this.url}/${id}`)
      .pipe(map((res) => res.data));
  }

  create(payload: PermissionActionPayload): Observable<PermissionAction> {
    return this.http
      .post<ApiResponse<PermissionAction>>(this.url, payload)
      .pipe(map((res) => res.data));
  }

  update(id: string, payload: PermissionActionPayload): Observable<PermissionAction> {
    return this.http
      .put<ApiResponse<PermissionAction>>(`${this.url}/${id}`, payload)
      .pipe(map((res) => res.data));
  }

  delete(id: string): Observable<PermissionActionDetail> {
    return this.http
      .delete<ApiResponse<PermissionActionDetail>>(`${this.url}/${id}`)
      .pipe(map((res) => res.data));
  }
} 
