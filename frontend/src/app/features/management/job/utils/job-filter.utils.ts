import { JobListItem } from '../../../../domain/job/models/job.model';
import { toTimestamp } from '../../../../shared/utils/';

export type SortField = 'publishedAt' | 'title' | 'status';
export type SortDirection = 'asc' | 'desc';

export interface JobFilters {
  keyword: string;
  status: string;
  department: string;
  location: string;
}

const SEARCHABLE_KEYS: (keyof JobListItem)[] = [
  'id',
  'slug',
  'title',
  'category',
  'department',
  'location',
  'workType',
  'jobType',
  'status',
  'educationLevel',
];

export function getDisplayStatus(job: JobListItem): string {
  if (!job.isActive) return 'Inactive';
  return job.status || 'Unknown';
}

export function getStatusDotClass(job: JobListItem): string {
  const status = getDisplayStatus(job).toLowerCase();

  if (status.includes('open') || status.includes('active')) {
    return 'bg-success shadow-[0_0_8px_rgba(34,197,94,0.7)]';
  }
  if (status.includes('close') || status.includes('closed')) {
    return 'bg-error shadow-[0_0_8px_rgba(239,68,68,0.5)]';
  }
  if (status.includes('draft') || status.includes('pending')) {
    return 'bg-warning shadow-[0_0_8px_rgba(245,158,11,0.5)]';
  }

  return 'bg-base-300';
}

export function getStatusTextClass(job: JobListItem): string {
  const status = getDisplayStatus(job).toLowerCase();

  if (status.includes('open') || status.includes('active')) return 'text-success';
  if (status.includes('close') || status.includes('closed')) return 'text-error';
  if (status.includes('draft') || status.includes('pending')) return 'text-warning';

  return 'text-base-content/70';
}

export function filterJobs(items: JobListItem[], filters: JobFilters): JobListItem[] {
  const keyword = filters.keyword.trim().toLowerCase();

  return items.filter((item) => {
    const matchesKeyword =
      !keyword ||
      SEARCHABLE_KEYS.some((key) => (item[key] as string | null)?.toLowerCase().includes(keyword));

    const matchesStatus = !filters.status || item.status === filters.status;
    const matchesDepartment = !filters.department || item.department === filters.department;
    const matchesLocation = !filters.location || item.location === filters.location;

    return matchesKeyword && matchesStatus && matchesDepartment && matchesLocation;
  });
}

export function sortJobs(
  items: JobListItem[],
  field: SortField,
  direction: SortDirection,
): JobListItem[] {
  return [...items].sort((a, b) => {
    let comparison = 0;

    if (field === 'title') {
      comparison = a.title.localeCompare(b.title);
    } else if (field === 'status') {
      comparison = getDisplayStatus(a).localeCompare(getDisplayStatus(b));
    } else if (field === 'publishedAt') {
      comparison = toTimestamp(a.publishedAt) - toTimestamp(b.publishedAt);
    }

    return direction === 'asc' ? comparison : -comparison;
  });
}
