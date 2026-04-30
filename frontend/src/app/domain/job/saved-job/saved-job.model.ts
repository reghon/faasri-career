import { JobListItem } from '../models/job.model';

export interface SavedJob {
  id: string;
  userId: string;
  jobId: string;
  isActive: boolean;
}

export interface SavedJobDetail {
  id: string;
  userId: string;
  jobId: string;
  isActive: boolean;
  createdAt: string;
  createdBy: string | null;
  updatedAt: string | null;
  updatedBy: string | null;
  deletedAt: string | null;
  deletedBy: string | null;
}

export interface SavedJobPayload {
  userId: string;
  jobId: string;
  isActive: boolean;
}

export interface SavedJobListItemApi {
  id: string;
  userId: string;
  jobId: string;
  isActive: boolean;

  title: string;
  slug: string;
  minSalary: string;
  maxSalary: string;
  currencyCode: string;
  salaryType: string;
  vacancyCount: number;
  experienceMinYears: string;
  publishedAt: string;
  closeAt: string;

  categoryName: string;
  employmentTypeName: string;
  statusName: string;
  jobLocationName: string;
  educationLevelName: string;
  departmentName: string;
  workModeName: string;
}

export interface SavedJobListItem {
  savedJobId: string;
  job: JobListItem;
}
