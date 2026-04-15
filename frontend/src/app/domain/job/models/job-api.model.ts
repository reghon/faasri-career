export interface JobListItemApi {
  id: string;
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
  isActive: boolean;
  categoryName: string;
  employmentTypeName: string;
  statusName: string;
  jobLocationName: string;
  educationLevelName: string;
  departmentName: string;
  workModeName: string;
}

export interface JobDetailApi {
  id: string;
  categoryId: string;
  employmentTypeId: string;
  statusId: string;
  jobLocationId: string;
  educationLevelId: string;
  departmentId: string;
  workModeId: string;
  title: string;
  slug: string;
  description: string;
  requirements: string;
  responsibilities: string;
  benefits: string;
  minSalary: string;
  maxSalary: string;
  currencyCode: string;
  salaryType: string;
  vacancyCount: number;
  experienceMinYears: string;
  publishedAt: string;
  closeAt: string;
  isActive: boolean;
  createdAt: string;
  createdBy: string | null;
  updatedAt: string;
  updatedBy: string | null;
  deletedAt: string | null;
  deletedBy: string | null;
  categoryName: string;
  employmentTypeName: string;
  statusName: string;
  jobLocationName: string;
  educationLevelName: string;
  departmentName: string;
  workModeName: string;
}

export interface PaginationMetaApi {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedJobsApi {
  items: JobListItemApi[];
  meta: PaginationMetaApi;
}

export interface ApiResponse<T> {
  message: string;
  data: T;
}
