import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { API_ENDPOINTS } from '../../config/api.config';
import { WorkExperience } from './applicant.model';

@Injectable({ providedIn: 'root' })
export class WorkExperienceService {
  constructor(private http: HttpClient) {}

  getAll() {
    return this.http
      .get<{ data: WorkExperience[] }>(API_ENDPOINTS.applicant.workExperiences)
      .pipe(map((res) => res.data));
  }

  create(data: Partial<WorkExperience>) {
    return this.http.post<{ data: WorkExperience }>(API_ENDPOINTS.applicant.workExperiences, data);
  }

  update(id: string, data: Partial<WorkExperience>) {
    return this.http.put<{ data: WorkExperience }>(
      `${API_ENDPOINTS.applicant.workExperiences}/${id}`,
      data,
    );
  }

  delete(id: string) {
    return this.http.delete(`${API_ENDPOINTS.applicant.workExperiences}/${id}`);
  }
}
