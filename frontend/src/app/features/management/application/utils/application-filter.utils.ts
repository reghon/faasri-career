import type { ApplyListItem } from '../../../../domain/apply/apply.model';
import { toTimestamp } from '../../../../shared/utils/date.utils';

export type SortField =
  | 'fullName'
  | 'linkedinUrl'
  | 'jobName'
  | 'statusName'
  | 'appliedAt'
  | 'statusUpdatedAt';

export type SortDirection = 'asc' | 'desc';

export interface ApplicationFilters {
  keyword: string;
  jobName: string;
  statusName: string;
}

const SEARCHABLE_KEYS: (keyof ApplyListItem)[] = [
  'fullName',
  'linkedinUrl',
  'jobName',
  'statusName',
  'appliedAt',
  'statusUpdatedAt',
];

const STRING_SORT_FIELDS = new Set<SortField>(['fullName', 'linkedinUrl', 'jobName', 'statusName']);
const DATE_SORT_FIELDS = new Set<SortField>(['appliedAt', 'statusUpdatedAt']);

export function filterApplications(
  items: ApplyListItem[],
  filters: ApplicationFilters,
): ApplyListItem[] {
  const keyword = filters.keyword.trim().toLowerCase();

  return items.filter((item) => {
    const matchesKeyword =
      !keyword ||
      SEARCHABLE_KEYS.some((key) => (item[key] as string | null)?.toLowerCase().includes(keyword));

    const matchesJob = !filters.jobName || item.jobName === filters.jobName;
    const matchesStatus = !filters.statusName || item.statusName === filters.statusName;

    return matchesKeyword && matchesJob && matchesStatus;
  });
}

export function sortApplications(
  items: ApplyListItem[],
  field: SortField,
  direction: SortDirection,
): ApplyListItem[] {
  return [...items].sort((a, b) => {
    const comparison = resolveComparison(a, b, field);
    return direction === 'asc' ? comparison : -comparison;
  });
}

function resolveComparison(a: ApplyListItem, b: ApplyListItem, field: SortField): number {
  if (STRING_SORT_FIELDS.has(field)) {
    return ((a[field] as string) ?? '').localeCompare((b[field] as string) ?? '');
  }

  if (DATE_SORT_FIELDS.has(field)) {
    return toTimestamp(a[field] as string) - toTimestamp(b[field] as string);
  }

  return 0;
}
