import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { API_ENDPOINTS } from '../../../core/config/api.config';
import { TechnicalSkill, TechnicalSkillPayload } from './technical_skill.model';

interface ApiResponse<T> {
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root',
})
export class TechnicalSkillService {
  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<TechnicalSkill[]> {
    return this.http
      .get<ApiResponse<TechnicalSkill[]>>(API_ENDPOINTS.applicant.technicalSkills)
      .pipe(map((response) => response.data));
  }

  create(payload: TechnicalSkillPayload): Observable<TechnicalSkill> {
    return this.http
      .post<ApiResponse<TechnicalSkill>>(API_ENDPOINTS.applicant.technicalSkills, payload)
      .pipe(map((response) => response.data));
  }

  delete(id: string): Observable<void> {
    return this.http
      .delete<ApiResponse<null>>(`${API_ENDPOINTS.applicant.technicalSkills}/${id}`)
      .pipe(map(() => void 0));
  }

  update(id: string, payload: TechnicalSkillPayload): Observable<TechnicalSkill> {
    return this.http
      .put<ApiResponse<TechnicalSkill>>(`${API_ENDPOINTS.applicant.technicalSkills}/${id}`, payload)
      .pipe(map((response) => response.data));
  }
}
