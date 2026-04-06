import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { API_ENDPOINTS } from '../../../core/config/api.config';
import { ApplicantProfile, ApplicantProfilePayload } from './applicant_profile.model';

interface ApiResponse<T> {
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root',
})
export class ApplicantProfileService {
  constructor(private readonly http: HttpClient) {}

  getMe(): Observable<ApplicantProfile> {
    return this.http
      .get<ApiResponse<ApplicantProfile>>(API_ENDPOINTS.applicant.applicantProfile)
      .pipe(map((response) => response.data));
  }

  updateMe(payload: ApplicantProfilePayload): Observable<ApplicantProfile> {
    return this.http
      .put<ApiResponse<ApplicantProfile>>(API_ENDPOINTS.applicant.applicantProfile, payload)
      .pipe(map((response) => response.data));
  }
}
