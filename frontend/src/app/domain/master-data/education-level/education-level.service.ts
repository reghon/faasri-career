import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { API_ENDPOINTS } from '../../../core/config/api.config';
import {
  EducationLevel,
  EducationLevelDetail,
  EducationLevelPayload,
} from './education-level.model';

interface ApiResponse<T> {
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root',
})
export class EducationLevelService {
  private readonly url = API_ENDPOINTS.master.educationLevels;

  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<EducationLevel[]> {
    return this.http.get<ApiResponse<EducationLevel[]>>(this.url).pipe(map((res) => res.data));
  }

  getById(id: string): Observable<EducationLevel> {
    return this.http
      .get<ApiResponse<EducationLevel>>(`${this.url}/${id}`)
      .pipe(map((res) => res.data));
  }

  create(payload: EducationLevelPayload): Observable<EducationLevel> {
    return this.http
      .post<ApiResponse<EducationLevel>>(this.url, payload)
      .pipe(map((res) => res.data));
  }

  update(id: string, payload: EducationLevelPayload): Observable<EducationLevel> {
    return this.http
      .put<ApiResponse<EducationLevel>>(`${this.url}/${id}`, payload)
      .pipe(map((res) => res.data));
  }

  delete(id: string): Observable<EducationLevelDetail> {
    return this.http
      .delete<ApiResponse<EducationLevelDetail>>(`${this.url}/${id}`)
      .pipe(map((res) => res.data));
  }
}
