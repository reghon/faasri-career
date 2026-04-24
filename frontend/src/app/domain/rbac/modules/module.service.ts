import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { API_ENDPOINTS } from '../../../core/config/api.config';
import { Module, ModuleDetail, ModulePayload } from './module.model';

interface ApiResponse<T> {
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root',
})
export class ModuleService {
  private readonly url = API_ENDPOINTS.admin.modules;

  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<Module[]> {
    return this.http.get<ApiResponse<Module[]>>(this.url).pipe(map((res) => res.data));
  }

  getById(id: string): Observable<Module> {
    return this.http.get<ApiResponse<Module>>(`${this.url}/${id}`).pipe(map((res) => res.data));
  }

  create(payload: ModulePayload): Observable<Module> {
    return this.http.post<ApiResponse<Module>>(this.url, payload).pipe(map((res) => res.data));
  }

  update(id: string, payload: ModulePayload): Observable<Module> {
    return this.http
      .put<ApiResponse<Module>>(`${this.url}/${id}`, payload)
      .pipe(map((res) => res.data));
  }

  delete(id: string): Observable<ModuleDetail> {
    return this.http
      .delete<ApiResponse<ModuleDetail>>(`${this.url}/${id}`)
      .pipe(map((res) => res.data));
  }
}
