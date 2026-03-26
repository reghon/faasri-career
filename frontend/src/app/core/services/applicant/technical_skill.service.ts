import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { API_ENDPOINTS } from '../../config/api.config';
import { TechnicalSkill } from './applicant.model';

@Injectable({ providedIn: 'root' })
export class TechnicalSkillService {
  constructor(private http: HttpClient) {}

  getAll() {
    return this.http
      .get<{ data: TechnicalSkill[] }>(API_ENDPOINTS.applicant.technicalSkills)
      .pipe(map((res) => res.data));
  }

  create(skillName: string) {
    return this.http.post<{ data: TechnicalSkill }>(API_ENDPOINTS.applicant.technicalSkills, {
      skillName,
    });
  }

  delete(id: string) {
    return this.http.delete(`${API_ENDPOINTS.applicant.technicalSkills}/${id}`);
  }
}
