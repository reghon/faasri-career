import { ApplyStatus } from '../../../../../domain/apply/master-data/apply-status/apply-status.model';

export interface SelectOption {
  id: string;
  name: string;
}

export interface JobFormValue {
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
  minSalary: number | null;
  maxSalary: number | null;
  currencyCode: string;
  salaryType: string;
  vacancyCount: number;
  experienceMinYears: number;
  publishedAt: string;
  closeAt: string;
  isActive: boolean;
}

export interface JobFlowStatusItem {
  applyStatusId: string;
  code: string;
  name: string;
  description: string | null;
  sortOrder: number;
  isDefault: boolean;
  isFinal: boolean;
  isActive: boolean;
}

export interface JobFormMasters {
  categories: SelectOption[];
  employmentTypes: SelectOption[];
  statuses: SelectOption[];
  jobLocations: SelectOption[];
  educationLevels: SelectOption[];
  departments: SelectOption[];
  workModes: SelectOption[];
  applyStatuses: ApplyStatus[];
}

export type JobFormErrors = Record<string, string>;
