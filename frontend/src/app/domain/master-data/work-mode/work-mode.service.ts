import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { API_ENDPOINTS } from '../../../core/config/api.config';
import { WorkMode, WorkModeDetail, WorkModePayload } from './work-mode.model';

interface ApiResponse<T> {
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root',
})
export class WorkModeService {
  private readonly url = API_ENDPOINTS.master.workModes;

  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<WorkMode[]> {
    return this.http.get<ApiResponse<WorkMode[]>>(this.url).pipe(map((res) => res.data));
  }

  getAllDeleted(): Observable<WorkMode[]> {
    return this.http
      .get<ApiResponse<WorkMode[]>>(`${this.url}/deleted`)
      .pipe(map((res) => res.data));
  }

  getById(id: string): Observable<WorkMode> {
    return this.http.get<ApiResponse<WorkMode>>(`${this.url}/${id}`).pipe(map((res) => res.data));
  }

  create(payload: WorkModePayload): Observable<WorkMode> {
    return this.http.post<ApiResponse<WorkMode>>(this.url, payload).pipe(map((res) => res.data));
  }

  update(id: string, payload: WorkModePayload): Observable<WorkMode> {
    return this.http
      .put<ApiResponse<WorkMode>>(`${this.url}/${id}`, payload)
      .pipe(map((res) => res.data));
  }

  delete(id: string): Observable<WorkModeDetail> {
    return this.http
      .delete<ApiResponse<WorkModeDetail>>(`${this.url}/${id}`)
      .pipe(map((res) => res.data));
  }

  permanentDelete(id: string): Observable<WorkModeDetail> {
    return this.http
      .delete<ApiResponse<WorkModeDetail>>(`${this.url}/${id}/permanent`)
      .pipe(map((res) => res.data));
  }

  restore(id: string): Observable<WorkMode> {
    return this.http
      .patch<ApiResponse<WorkMode>>(`${this.url}/${id}/restore`, {})
      .pipe(map((res) => res.data));
  }
}
