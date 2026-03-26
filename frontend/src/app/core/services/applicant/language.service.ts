import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { API_ENDPOINTS } from '../../config/api.config';
import { Language } from './applicant.model';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  constructor(private http: HttpClient) {}

  getAll() {
    return this.http
      .get<{ data: Language[] }>(API_ENDPOINTS.applicant.languages)
      .pipe(map((res) => res.data));
  }

  create(data: Partial<Language>) {
    return this.http.post<{ data: Language }>(API_ENDPOINTS.applicant.languages, data);
  }

  update(id: string, data: Partial<Language>) {
    return this.http.put<{ data: Language }>(`${API_ENDPOINTS.applicant.languages}/${id}`, data);
  }

  delete(id: string) {
    return this.http.delete(`${API_ENDPOINTS.applicant.languages}/${id}`);
  }
}
