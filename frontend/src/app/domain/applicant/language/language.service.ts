import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { API_ENDPOINTS } from '../../../core/config/api.config';
import { Language, LanguagePayload } from './language.model';

interface ApiResponse<T> {
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<Language[]> {
    return this.http
      .get<ApiResponse<Language[]>>(API_ENDPOINTS.applicant.languages)
      .pipe(map((response) => response.data));
  }

  create(payload: LanguagePayload): Observable<Language> {
    return this.http
      .post<ApiResponse<Language>>(API_ENDPOINTS.applicant.languages, payload)
      .pipe(map((response) => response.data));
  }

  update(id: string, payload: LanguagePayload): Observable<Language> {
    return this.http
      .put<ApiResponse<Language>>(`${API_ENDPOINTS.applicant.languages}/${id}`, payload)
      .pipe(map((response) => response.data));
  }

  delete(id: string): Observable<void> {
    return this.http
      .delete<ApiResponse<null>>(`${API_ENDPOINTS.applicant.languages}/${id}`)
      .pipe(map(() => void 0));
  }
}
