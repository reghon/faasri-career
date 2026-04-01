import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { API_ENDPOINTS } from '../../../core/config/api.config';
import { Education } from './education.model';

@Injectable({ providedIn: 'root' })
export class EducationService {
  constructor(private http: HttpClient) {}

  getAll() {
    return this.http
      .get<{ data: Education[] }>(API_ENDPOINTS.applicant.educations)
      .pipe(map((res) => res.data));
  }

  create(data: Partial<Education>) {
    return this.http.post<{ data: Education }>(API_ENDPOINTS.applicant.educations, data);
  }

  update(id: string, data: Partial<Education>) {
    return this.http.put<{ data: Education }>(`${API_ENDPOINTS.applicant.educations}/${id}`, data);
  }

  delete(id: string) {
    return this.http.delete(`${API_ENDPOINTS.applicant.educations}/${id}`);
  }
}
