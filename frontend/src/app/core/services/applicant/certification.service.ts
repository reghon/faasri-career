import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { API_ENDPOINTS } from '../../config/api.config';
import { Certification } from './applicant.model';

@Injectable({ providedIn: 'root' })
export class CertificationService {
  constructor(private http: HttpClient) {}

  getAll() {
    return this.http
      .get<{ data: Certification[] }>(API_ENDPOINTS.applicant.certifications)
      .pipe(map((res) => res.data));
  }

  create(data: Partial<Certification>) {
    return this.http.post<{ data: Certification }>(API_ENDPOINTS.applicant.certifications, data);
  }

  update(id: string, data: Partial<Certification>) {
    return this.http.put<{ data: Certification }>(
      `${API_ENDPOINTS.applicant.certifications}/${id}`,
      data,
    );
  }

  delete(id: string) {
    return this.http.delete(`${API_ENDPOINTS.applicant.certifications}/${id}`);
  }
}
