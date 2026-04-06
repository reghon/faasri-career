import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { API_ENDPOINTS } from '../../../core/config/api.config';
import { WorkExperience, WorkExperiencePayload } from './work_experience.model';

interface ApiResponse<T> {
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root',
})
export class WorkExperienceService {
  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<WorkExperience[]> {
    return this.http
      .get<ApiResponse<WorkExperience[]>>(API_ENDPOINTS.applicant.workExperiences)
      .pipe(map((response) => response.data));
  }

  create(payload: WorkExperiencePayload): Observable<WorkExperience> {
    return this.http
      .post<ApiResponse<WorkExperience>>(API_ENDPOINTS.applicant.workExperiences, payload)
      .pipe(map((response) => response.data));
  }

  update(id: string, payload: WorkExperiencePayload): Observable<WorkExperience> {
    return this.http
      .put<ApiResponse<WorkExperience>>(`${API_ENDPOINTS.applicant.workExperiences}/${id}`, payload)
      .pipe(map((response) => response.data));
  }

  delete(id: string): Observable<void> {
    return this.http
      .delete<ApiResponse<null>>(`${API_ENDPOINTS.applicant.workExperiences}/${id}`)
      .pipe(map(() => void 0));
  }
}
