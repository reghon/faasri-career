import { ApplyStatus } from '../../../../../domain/apply/master-data/apply-status/apply-status.model';
import { JobApplyStatus } from '../../../../../domain/apply/master-data/job-apply-status/job-apply-status.model';
import { JobDetail, JobPayload } from '../../../../../domain/job/models/job.model';
import { toDateTimeLocal, toDateTimeLocalFromUnknown } from '../../../../../shared/utils/date.utils';
import { JobFlowStatusItem, JobFormValue, SelectOption } from '../models/job-form.model';

export function createInitialJobForm(): JobFormValue {
  const now = new Date();
  const nextMonth = new Date();

  nextMonth.setMonth(nextMonth.getMonth() + 1);

  return {
    categoryId: '',
    employmentTypeId: '',
    statusId: '',
    jobLocationId: '',
    educationLevelId: '',
    departmentId: '',
    workModeId: '',
    title: '',
    slug: '',
    description: '',
    requirements: '',
    responsibilities: '',
    benefits: '',
    minSalary: null,
    maxSalary: null,
    currencyCode: 'IDR',
    salaryType: '',
    vacancyCount: 1,
    experienceMinYears: 0,
    publishedAt: toDateTimeLocal(now),
    closeAt: toDateTimeLocal(nextMonth),
    isActive: true,
  };
}

export function patchJobForm(
  job: JobDetail,
  masters: {
    categories: SelectOption[];
    employmentTypes: SelectOption[];
    statuses: SelectOption[];
    jobLocations: SelectOption[];
    educationLevels: SelectOption[];
    departments: SelectOption[];
    workModes: SelectOption[];
  },
): JobFormValue {
  return {
    categoryId: findOptionIdByName(masters.categories, job.category),
    employmentTypeId: findOptionIdByName(masters.employmentTypes, job.jobType),
    statusId: findOptionIdByName(masters.statuses, job.status),
    jobLocationId: findOptionIdByName(masters.jobLocations, job.location),
    educationLevelId: findOptionIdByName(masters.educationLevels, job.educationLevel),
    departmentId: findOptionIdByName(masters.departments, job.department),
    workModeId: findOptionIdByName(masters.workModes, job.workType),
    title: job.title ?? '',
    slug: job.slug ?? '',
    description: job.aboutRole ?? '',
    requirements: job.qualifications ?? '',
    responsibilities: job.responsibilities ?? '',
    benefits: job.benefits ?? '',
    minSalary: job.minSalary ?? 0,
    maxSalary: job.maxSalary ?? 0,
    currencyCode: job.currencyCode ?? 'IDR',
    salaryType: job.salaryType ?? 'month',
    vacancyCount: job.vacancyCount ?? 1,
    experienceMinYears: Number(job.experience?.replace(/[^\d.]/g, '') || 0),
    publishedAt: toDateTimeLocalFromUnknown(job.postedAt),
    closeAt: toDateTimeLocalFromUnknown(job.closeAt),
    isActive: job.isActive ?? true,
  };
}

export function buildJobPayload(form: JobFormValue): JobPayload {
  return {
    categoryId: form.categoryId,
    employmentTypeId: form.employmentTypeId,
    statusId: form.statusId,
    jobLocationId: form.jobLocationId,
    educationLevelId: form.educationLevelId,
    departmentId: form.departmentId,
    workModeId: form.workModeId,
    title: form.title.trim(),
    slug: form.slug.trim(),
    description: form.description.trim(),
    requirements: form.requirements.trim(),
    responsibilities: form.responsibilities.trim(),
    benefits: form.benefits.trim(),
    minSalary: Number(form.minSalary ?? 0),
    maxSalary: Number(form.maxSalary ?? 0),
    currencyCode: form.currencyCode.trim().toUpperCase(),
    salaryType: form.salaryType.trim(),
    vacancyCount: Number(form.vacancyCount),
    experienceMinYears: Number(form.experienceMinYears),
    publishedAt: new Date(form.publishedAt).toISOString(),
    closeAt: new Date(form.closeAt).toISOString(),
    isActive: form.isActive,
  };
}

export function mapApplyStatusToFlowItem(status: ApplyStatus, index: number): JobFlowStatusItem {
  const code = status.code.toUpperCase();

  return {
    applyStatusId: status.id,
    code: status.code,
    name: status.name,
    description: status.description,
    sortOrder: index + 1,
    isDefault: code === 'SUBMITTED',
    isFinal: ['REJECTED', 'HIRED', 'WITHDRAWN'].includes(code),
    isActive: true,
  };
}

export function mapJobApplyStatusesToFlowItems(items: JobApplyStatus[]): JobFlowStatusItem[] {
  return items
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((item) => ({
      applyStatusId: item.applyStatusId,
      code: item.applyStatusCode,
      name: item.applyStatusName,
      description: item.applyStatusDescription,
      sortOrder: item.sortOrder,
      isDefault: item.isDefault,
      isFinal: item.isFinal,
      isActive: item.isActive,
    }));
}

export function normalizeJobFlowStatuses(items: JobFlowStatusItem[]): JobFlowStatusItem[] {
  const submitted = items.filter((item) => item.code.toUpperCase() === 'SUBMITTED');

  const finals = items.filter((item) =>
    ['REJECTED', 'HIRED', 'WITHDRAWN'].includes(item.code.toUpperCase()),
  );

  const middle = items.filter((item) => {
    const code = item.code.toUpperCase();
    return !['SUBMITTED', 'REJECTED', 'HIRED', 'WITHDRAWN'].includes(code);
  });

  return [...submitted, ...middle, ...finals].map((item, index) => {
    const code = item.code.toUpperCase();

    return {
      ...item,
      sortOrder: index + 1,
      isDefault: code === 'SUBMITTED',
      isFinal: ['REJECTED', 'HIRED', 'WITHDRAWN'].includes(code),
    };
  });
}

export function createDefaultJobFlowStatuses(applyStatuses: ApplyStatus[]): JobFlowStatusItem[] {
  const submitted = applyStatuses.find((status) => status.code.toUpperCase() === 'SUBMITTED');

  const finals = applyStatuses.filter((status) =>
    ['REJECTED', 'HIRED', 'WITHDRAWN'].includes(status.code.toUpperCase()),
  );

  const ordered = submitted ? [submitted, ...finals] : finals;

  return normalizeJobFlowStatuses(
    ordered.map((status, index) => mapApplyStatusToFlowItem(status, index)),
  );
}

export function isLockedDefaultStatus(item: JobFlowStatusItem): boolean {
  return ['SUBMITTED', 'APPLIED', 'REJECTED', 'HIRED', 'WITHDRAWN'].includes(
    item.code.toUpperCase(),
  );
}

function findOptionIdByName(options: SelectOption[], name: string): string {
  const normalizedTarget = (name || '').trim().toLowerCase();

  return options.find((item) => item.name.trim().toLowerCase() === normalizedTarget)?.id || '';
}
