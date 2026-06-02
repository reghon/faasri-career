export interface JobListItem {
  id: string;
  slug: string;
  title: string;
  category: string;
  location: string;
  workType: string;
  jobType: string;
  salary: string;
  experience: string;
  skills: string[];

  publishedAt: string;
  closeAt: string;
  isActive: boolean;

  department: string;
  educationLevel: string;
  status: string;
  vacancyCount: number;
  minSalary: number;
  maxSalary: number;
  currencyCode: string;
  salaryType: string;
}

export interface JobDetail {
  id: string;
  slug: string;
  title: string;

  managementProfileId: string | null;
  managementProfileName: string | null;
  createdBy: string | null;
  createdByName: string | null;

  category: string;
  location: string;
  workType: string;
  jobType: string;
  salary: string;
  experience: string;
  skills: string[];

  postedAt: string;
  updatedAt: string;
  closeAt: string;
  isActive: boolean;

  aboutRole: string;
  responsibilities: string;
  qualifications: string;
  benefits: string;

  department: string;
  educationLevel: string;
  managementProfile: string;
  status: string;
  vacancyCount: number;
  minSalary: number;
  maxSalary: number;
  currencyCode: string;
  salaryType: string;
}

export interface JobPayload {
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
  benefits: string;
  minSalary: number;
  maxSalary: number;
  currencyCode: string;
  salaryType: string;
  vacancyCount: number;
  experienceMinYears: number;
  publishedAt: string;
  closeAt: string;
  isActive: boolean;
}
