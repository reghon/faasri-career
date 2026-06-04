export type Job = {
  id: string;
  managementProfileId: string;
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
  benefits: string | null;
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
};

export type JobListItem = {
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
};

export type JobDetail = Job & {
  managementProfileId: string;
  managementProfileName: string;
  createdByName: string;
  categoryName: string;
  employmentTypeName: string;
  statusName: string;
  jobLocationName: string;
  educationLevelName: string;
  departmentName: string;
  workModeName: string;
};

export type JobPayload = {
  managementProfileId: string;

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
  benefits: string | null;
  minSalary: number;
  maxSalary: number;
  currencyCode: string;
  salaryType: string;
  vacancyCount: number;
  experienceMinYears: number;
  publishedAt?: Date;
  closeAt: Date;
  isActive: boolean;
};

export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
};

export type JobFilterParams = {
  search: string;
  status: string;
  department: string;
  location: string;
};

export type PaginatedJobs = {
  items: JobListItem[];
  meta: PaginationMeta;
};

export type CountResult = {
  total: number;
};
