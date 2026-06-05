import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { API_ENDPOINTS } from '../../core/config/api.config';
import {
  Apply,
  CreateApplyPayload,
  UpdateApplyStatusPayload,
  ApplyByJobItem,
  ApplyListItem,
  ApplyMeDetail,
  ApplyHistoryList,
} from './apply.model';
interface ApiResponse<T> {
  message: string;
  data: T;
}

export interface GetAppliesParams {
  page?: number;
  limit?: number;
  search?: string;
  jobName?: string;
  statusName?: string;
  sortBy?: string;
  sortDirection?: string;
}

export interface ApplyListResult {
  items: ApplyListItem[];
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
export class ApplyService {
  constructor(private readonly http: HttpClient) {}

  create(payload: CreateApplyPayload, cvFile?: File | null): Observable<Apply> {
    const formData = new FormData();
    formData.append('data', JSON.stringify(payload));
    if (cvFile) {
      formData.append('cv', cvFile);
    }
    return this.http
      .post<ApiResponse<Apply>>(API_ENDPOINTS.apply.root, formData)
      .pipe(map((response) => response.data));
  }

  updateStatus(id: string, payload: UpdateApplyStatusPayload): Observable<Apply> {
    return this.http
      .patch<ApiResponse<Apply>>(`${API_ENDPOINTS.apply.root}/${id}/status`, payload)
      .pipe(map((response) => response.data));
  }

  getAll(params: GetAppliesParams = {}): Observable<ApplyListResult> {
    let httpParams = new HttpParams()
      .set('page', params.page ?? 1)
      .set('limit', params.limit ?? 10);

    if (params.search) httpParams = httpParams.set('search', params.search);
    if (params.jobName) httpParams = httpParams.set('jobName', params.jobName);
    if (params.statusName) httpParams = httpParams.set('statusName', params.statusName);
    if (params.sortBy) httpParams = httpParams.set('sortBy', params.sortBy);
    if (params.sortDirection) httpParams = httpParams.set('sortDirection', params.sortDirection);

    return this.http
      .get<ApiResponse<ApplyListResult>>(`${API_ENDPOINTS.apply.root}`, { params: httpParams })
      .pipe(map((response) => response.data));
  }

  getMine(): Observable<ApplyHistoryList[]> {
    return this.http
      .get<ApiResponse<ApplyHistoryList[]>>(`${API_ENDPOINTS.apply.root}/me`)
      .pipe(map((response) => response.data));
  }

  getApplyListByApplicantProfileId(applicantProfileId: string): Observable<ApplyHistoryList[]> {
    return this.http
      .get<
        ApiResponse<ApplyHistoryList[]>
      >(`${API_ENDPOINTS.apply.root}/applicant/${applicantProfileId}`)
      .pipe(map((response) => response.data));
  }

  getApplyDetailById(id: string): Observable<ApplyMeDetail> {
    return this.http
      .get<ApiResponse<ApplyMeDetail>>(`${API_ENDPOINTS.apply.root}/me/detail/${id}`)
      .pipe(map((response) => response.data));
  }

  getApplyDetail(applicantProfileId: string, applyId: string): Observable<ApplyMeDetail> {
    return this.http
      .get<
        ApiResponse<ApplyMeDetail>
      >(`${API_ENDPOINTS.apply.root}/applicant/detail/${applicantProfileId}/${applyId}`)
      .pipe(map((response) => response.data));
  }

  getByJobId(jobId: string): Observable<ApplyByJobItem[]> {
    return this.http
      .get<ApiResponse<ApplyByJobItem[]>>(`${API_ENDPOINTS.apply.root}/job/${jobId}`)
      .pipe(map((response) => response.data));
  }

  hasApplied(jobId: string): Observable<boolean> {
    return this.http
      .get<ApiResponse<boolean>>(`${API_ENDPOINTS.apply.root}/check/${jobId}`)
      .pipe(map((response) => response.data));
  }
}
