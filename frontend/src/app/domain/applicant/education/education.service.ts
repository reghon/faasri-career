import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { API_ENDPOINTS } from '../../../core/config/api.config';
import { Education, EducationPayload } from './education.model';

interface ApiResponse<T> {
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root',
})
export class EducationService {
  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<Education[]> {
    return this.http
      .get<ApiResponse<Education[]>>(API_ENDPOINTS.applicant.educations)
      .pipe(map((response) => response.data));
  }

  create(payload: EducationPayload): Observable<Education> {
    return this.http
      .post<ApiResponse<Education>>(API_ENDPOINTS.applicant.educations, payload)
      .pipe(map((response) => response.data));
  }

  update(id: string, payload: EducationPayload): Observable<Education> {
    return this.http
      .put<ApiResponse<Education>>(`${API_ENDPOINTS.applicant.educations}/${id}`, payload)
      .pipe(map((response) => response.data));
  }

  delete(id: string): Observable<void> {
    return this.http
      .delete<ApiResponse<null>>(`${API_ENDPOINTS.applicant.educations}/${id}`)
      .pipe(map(() => void 0));
  }
}
