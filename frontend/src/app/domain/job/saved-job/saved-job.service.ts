import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { API_ENDPOINTS } from '../../../core/config/api.config';
import { JobListItem } from '../models/job.model';
import {
  SavedJob,
  SavedJobDetail,
  SavedJobListItem,
  SavedJobListItemApi,
  SavedJobPayload,
} from './saved-job.model';

interface ApiResponse<T> {
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root',
})
export class SavedJobService {
  private readonly url = API_ENDPOINTS.job.savedJobs;

  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<SavedJobListItem[]> {
    return this.http.get<ApiResponse<SavedJobListItemApi[]>>(this.url).pipe(
      map((res) =>
        res.data.map((item) => ({
          savedJobId: item.id,
          job: this.mapToJobListItem(item),
        })),
      ),
    );
  }

  getById(id: string): Observable<SavedJob> {
    return this.http.get<ApiResponse<SavedJob>>(`${this.url}/${id}`).pipe(map((res) => res.data));
  }

  create(payload: SavedJobPayload): Observable<SavedJob> {
    return this.http.post<ApiResponse<SavedJob>>(this.url, payload).pipe(map((res) => res.data));
  }

  update(id: string, payload: SavedJobPayload): Observable<SavedJob> {
    return this.http
      .put<ApiResponse<SavedJob>>(`${this.url}/${id}`, payload)
      .pipe(map((res) => res.data));
  }

  delete(id: string): Observable<SavedJobDetail> {
    return this.http
      .delete<ApiResponse<SavedJobDetail>>(`${this.url}/${id}`)
      .pipe(map((res) => res.data));
  }

  private mapToJobListItem(item: SavedJobListItemApi): JobListItem {
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
}
