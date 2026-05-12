// management_profile.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { API_ENDPOINTS } from '../../core/config/api.config';
import { ManagementProfile, ManagementProfilePayload } from './management-profile.model';

interface ApiResponse<T> {
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root',
})
export class ManagementProfileService {
  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<ManagementProfile[]> {
    return this.http
      .get<ApiResponse<ManagementProfile[]>>(API_ENDPOINTS.admin.managementProfile)
      .pipe(map((response) => response.data));
  }

  getById(id: string): Observable<ManagementProfile> {
    return this.http
      .get<ApiResponse<ManagementProfile>>(`${API_ENDPOINTS.admin.managementProfile}/${id}`)
      .pipe(map((response) => response.data));
  }

  create(payload: ManagementProfilePayload): Observable<ManagementProfile> {
    return this.http
      .post<ApiResponse<ManagementProfile>>(API_ENDPOINTS.admin.managementProfile, payload)
      .pipe(map((response) => response.data));
  }

  update(id: string, payload: ManagementProfilePayload): Observable<ManagementProfile> {
    return this.http
      .put<ApiResponse<ManagementProfile>>(`${API_ENDPOINTS.admin.managementProfile}/${id}`, payload)
      .pipe(map((response) => response.data));
  }

  delete(id: string): Observable<void> {
    return this.http
      .delete<ApiResponse<null>>(`${API_ENDPOINTS.admin.managementProfile}/${id}`)
      .pipe(map(() => void 0));
  }
}
