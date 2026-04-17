import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { API_ENDPOINTS } from '../../../core/config/api.config';
import {
  ApiResponse,
  JobDetailApi,
  JobListItemApi,
  PaginatedJobsApi,
} from '../models/job-api.model';
import { JobDetail, JobListItem, JobPayload } from '../models/job.model';

export interface GetJobsParams {
  page?: number;
  limit?: number;
}

export interface JobListResult {
  items: JobListItem[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

@Injectable({
  providedIn: 'root',
})
export class JobService {
  private readonly http = inject(HttpClient);

  getJobs(params: GetJobsParams = {}): Observable<JobListResult> {
    const page = params.page ?? 1;
    const limit = params.limit ?? 100;

    const httpParams = new HttpParams().set('page', page).set('limit', limit);

    return this.http
      .get<ApiResponse<PaginatedJobsApi>>(API_ENDPOINTS.job.list, {
        params: httpParams,
      })
      .pipe(
        map((response) => ({
          items: response.data.items.map((item) => this.mapToListItem(item)),
          meta: response.data.meta,
        })),
      );
  }

  getJobById(id: string): Observable<JobDetail> {
    return this.http
      .get<ApiResponse<JobDetailApi>>(API_ENDPOINTS.job.detail(id))
      .pipe(map((response) => this.mapToDetailItem(response.data)));
  }

   getJobBySlug(slug: string): Observable<JobDetail> {
    return this.http
      .get<ApiResponse<JobDetailApi>>(API_ENDPOINTS.job.slug(slug))
      .pipe(map((response) => this.mapToDetailItem(response.data)));
  }

  createJob(payload: JobPayload): Observable<JobDetail> {
    return this.http
      .post<ApiResponse<JobDetailApi>>(API_ENDPOINTS.job.jobs, payload)
      .pipe(map((response) => this.mapToDetailItem(response.data)));
  }
  updateJob(id: string, payload: JobPayload): Observable<JobDetail> {
    return this.http
      .put<ApiResponse<JobDetailApi>>(API_ENDPOINTS.job.detail(id), payload)
      .pipe(map((response) => this.mapToDetailItem(response.data)));
  }

  private mapToListItem(item: JobListItemApi): JobListItem {
    const minSalary = Number(item.minSalary || 0);
    const maxSalary = Number(item.maxSalary || 0);

    return {
      id: item.id,
      slug: item.slug,
      title: item.title,
      category: item.categoryName,
      location: item.jobLocationName,
      workType: item.workModeName,
      jobType: item.employmentTypeName,
      salary: this.formatSalary(minSalary, maxSalary, item.currencyCode, item.salaryType),
      experience: this.formatExperience(item.experienceMinYears),
      skills: [item.departmentName, item.educationLevelName, item.statusName].filter(Boolean),

      publishedAt: item.publishedAt,
      closeAt: item.closeAt,
      isActive: item.isActive,

      department: item.departmentName,
      educationLevel: item.educationLevelName,
      status: item.statusName,
      vacancyCount: item.vacancyCount,
      minSalary,
      maxSalary,
      currencyCode: item.currencyCode,
      salaryType: item.salaryType,
    };
  }

  private mapToDetailItem(item: JobDetailApi): JobDetail {
    const minSalary = Number(item.minSalary || 0);
    const maxSalary = Number(item.maxSalary || 0);

    return {
      id: item.id,
      slug: item.slug,
      title: item.title,
      category: item.categoryName,
      location: item.jobLocationName,
      workType: item.workModeName,
      jobType: item.employmentTypeName,
      salary: this.formatSalary(minSalary, maxSalary, item.currencyCode, item.salaryType),
      experience: this.formatExperience(item.experienceMinYears),
      skills: [item.departmentName, item.educationLevelName, item.statusName].filter(Boolean),

      postedAt: this.formatDate(item.publishedAt),
      updatedAt: this.formatDate(item.updatedAt),
      closeAt: item.closeAt,
      isActive: item.isActive,

      aboutRole: item.description,
      responsibilities: item.responsibilities,
      qualifications: item.requirements,
      benefits: item.benefits,

      department: item.departmentName,
      educationLevel: item.educationLevelName,
      status: item.statusName,
      vacancyCount: item.vacancyCount,
      minSalary,
      maxSalary,
      currencyCode: item.currencyCode,
      salaryType: item.salaryType,
    };
  }

  private formatExperience(experienceMinYears: string): string {
    const years = Number(experienceMinYears || 0);

    if (years <= 0) return 'No minimum experience';
    if (years === 1) return '1 year';
    return `${years} years`;
  }

  private formatSalary(
    minSalary: number,
    maxSalary: number,
    currencyCode: string,
    salaryType: string,
  ): string {
    const formatter = new Intl.NumberFormat('id-ID');
    return `${currencyCode} ${formatter.format(minSalary)} - ${formatter.format(maxSalary)} / ${salaryType}`;
  }

  private formatDate(value: string): string {
    if (!value) return '-';

    return new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(new Date(value));
  }
}
