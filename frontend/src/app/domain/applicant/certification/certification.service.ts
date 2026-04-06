import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { API_ENDPOINTS } from '../../../core/config/api.config';
import { Certification, CertificationPayload } from './certification.model';

interface ApiResponse<T> {
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root',
})
export class CertificationService {
  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<Certification[]> {
    return this.http
      .get<ApiResponse<Certification[]>>(API_ENDPOINTS.applicant.certifications)
      .pipe(map((response) => response.data));
  }

  create(payload: CertificationPayload): Observable<Certification> {
    return this.http
      .post<ApiResponse<Certification>>(API_ENDPOINTS.applicant.certifications, payload)
      .pipe(map((response) => response.data));
  }

  update(id: string, payload: CertificationPayload): Observable<Certification> {
    return this.http
      .put<ApiResponse<Certification>>(`${API_ENDPOINTS.applicant.certifications}/${id}`, payload)
      .pipe(map((response) => response.data));
  }

  delete(id: string): Observable<void> {
    return this.http
      .delete<ApiResponse<null>>(`${API_ENDPOINTS.applicant.certifications}/${id}`)
      .pipe(map(() => void 0));
  }
}
