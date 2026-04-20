import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { API_ENDPOINTS } from '../../../core/config/api.config';
import {
  CreateUserByAdminPayload,
  User,
  UserCreateResult,
  UserDetail,
  UserMe,
  UserPayload,
  UserUpdatePayload,
} from './user.model';

interface ApiResponse<T> {
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly url = API_ENDPOINTS.admin.users;

  constructor(private readonly http: HttpClient) {}

  getMe(): Observable<UserMe> {
    return this.http
      .get<ApiResponse<UserMe>>(`${this.url}/me`)
      .pipe(map((response) => response.data));
  }

  getAll(): Observable<User[]> {
    return this.http.get<ApiResponse<User[]>>(this.url).pipe(map((response) => response.data));
  }

  getById(id: string): Observable<UserDetail> {
    return this.http
      .get<ApiResponse<UserDetail>>(`${this.url}/${id}`)
      .pipe(map((response) => response.data));
  }

  create(payload: UserPayload): Observable<UserDetail> {
    return this.http
      .post<ApiResponse<UserDetail>>(this.url, payload)
      .pipe(map((response) => response.data));
  }

  update(id: string, payload: UserUpdatePayload): Observable<UserDetail> {
    return this.http
      .put<ApiResponse<UserDetail>>(`${this.url}/${id}`, payload)
      .pipe(map((response) => response.data));
  }

  delete(id: string): Observable<UserDetail> {
    return this.http
      .delete<ApiResponse<UserDetail>>(`${this.url}/${id}`)
      .pipe(map((response) => response.data));
  }

  createBySuperAdmin(payload: CreateUserByAdminPayload): Observable<UserCreateResult> {
    return this.http
      .post<ApiResponse<UserCreateResult>>(`${this.url}/admin-create`, payload)
      .pipe(map((response) => response.data));
  }
}
