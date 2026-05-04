import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { API_ENDPOINTS } from '../../core/config/api.config';
import { ApplicantMaster } from './applicant_master.model';

interface ApiResponse<T> {
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root',
})
export class ApplicantMasterService {
  constructor(private readonly http: HttpClient) {}

  getMe(): Observable<ApplicantMaster> {
    return this.http
      .get<ApiResponse<ApplicantMaster>>(API_ENDPOINTS.applicant.applicantMaster)
      .pipe(map((response) => response.data));
  }

  getByApplicantProfileId(id: string): Observable<ApplicantMaster> {
    return this.http
      .get<ApiResponse<ApplicantMaster>>(API_ENDPOINTS.applicant.getByid(id))
      .pipe(map((response) => response.data));
  }
}
