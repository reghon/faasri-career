import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { API_ENDPOINTS } from '../../../core/config/api.config';
import { ApplicantProfile, ApplicantProfilePayload } from './applicant_profile.model';

interface ApiResponse<T> {
  message: string;
  data: T;
}

export interface GetApplicantsParams {
  page?: number;
  limit?: number;
  search?: string;
  gender?: string;
  sortBy?: string;
  sortDirection?: string;
}

export interface ApplicantListResult {
  items: ApplicantProfile[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

@Injectable({
  providedIn: 'root',
})
export class ApplicantProfileService {
  private readonly profileUrl = API_ENDPOINTS.applicant.applicantProfile;

  constructor(private readonly http: HttpClient) {}

  getAll(params: GetApplicantsParams = {}): Observable<ApplicantListResult> {
    let httpParams = new HttpParams()
      .set('page', params.page ?? 1)
      .set('limit', params.limit ?? 10);

    if (params.search) httpParams = httpParams.set('search', params.search);
    if (params.gender) httpParams = httpParams.set('gender', params.gender);
    if (params.sortBy) httpParams = httpParams.set('sortBy', params.sortBy);
    if (params.sortDirection) httpParams = httpParams.set('sortDirection', params.sortDirection);

    return this.http
      .get<ApiResponse<ApplicantListResult>>(this.profileUrl.replace('/me', ''), { params: httpParams })
      .pipe(map((response) => response.data));
  }

  getMe(): Observable<ApplicantProfile> {
    return this.http
      .get<ApiResponse<ApplicantProfile>>(this.profileUrl)
      .pipe(map((response) => response.data));
  }

  updateMe(payload: ApplicantProfilePayload): Observable<ApplicantProfile> {
    return this.http
      .put<ApiResponse<ApplicantProfile>>(this.profileUrl, payload)
      .pipe(map((response) => response.data));
  }

  updateAvatar(file: File): Observable<ApplicantProfile> {
    const formData = new FormData();
    formData.append('avatar', file);

    return this.http
      .put<ApiResponse<ApplicantProfile>>(`${this.profileUrl}/avatar`, formData)
      .pipe(map((response) => response.data));
  }

  removeAvatar(): Observable<ApplicantProfile> {
    return this.http
      .delete<ApiResponse<ApplicantProfile>>(`${this.profileUrl}/avatar`)
      .pipe(map((response) => response.data));
  }

  updateCv(file: File): Observable<ApplicantProfile> {
    const formData = new FormData();
    formData.append('cv', file);

    return this.http
      .put<ApiResponse<ApplicantProfile>>(`${this.profileUrl}/cv`, formData)
      .pipe(map((response) => response.data));
  }

  removeCv(): Observable<ApplicantProfile> {
    return this.http
      .delete<ApiResponse<ApplicantProfile>>(`${this.profileUrl}/cv`)
      .pipe(map((response) => response.data));
  }

  getFileUrl(path: string | null | undefined): string {
    if (!path) return '';
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    return `${new URL(this.profileUrl).origin}${path}`;
  }
}
