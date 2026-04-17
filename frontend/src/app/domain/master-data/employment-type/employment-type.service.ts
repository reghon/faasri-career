import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { API_ENDPOINTS } from '../../../core/config/api.config';
import {
  EmploymentType,
  EmploymentTypeDetail,
  EmploymentTypePayload,
} from './employment-type.model';

interface ApiResponse<T> {
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root',
})
export class EmploymentTypeService {
  private readonly url = API_ENDPOINTS.master.employmentTypes;

  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<EmploymentType[]> {
    return this.http.get<ApiResponse<EmploymentType[]>>(this.url).pipe(map((res) => res.data));
  }

  getById(id: string): Observable<EmploymentType> {
    return this.http
      .get<ApiResponse<EmploymentType>>(`${this.url}/${id}`)
      .pipe(map((res) => res.data));
  }

  create(payload: EmploymentTypePayload): Observable<EmploymentType> {
    return this.http
      .post<ApiResponse<EmploymentType>>(this.url, payload)
      .pipe(map((res) => res.data));
  }

  update(id: string, payload: EmploymentTypePayload): Observable<EmploymentType> {
    return this.http
      .put<ApiResponse<EmploymentType>>(`${this.url}/${id}`, payload)
      .pipe(map((res) => res.data));
  }

  delete(id: string): Observable<EmploymentTypeDetail> {
    return this.http
      .delete<ApiResponse<EmploymentTypeDetail>>(`${this.url}/${id}`)
      .pipe(map((res) => res.data));
  }
}
