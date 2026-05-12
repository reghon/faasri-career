import { ApplicantProfile } from '../../../../domain/applicant/applicant_profile/applicant_profile.model';

export type SortField = 'fullName' | 'email' | 'gender' | 'phone' | 'linkedinUrl';
export type SortDirection = 'asc' | 'desc';

export interface ApplicantFilters {
  keyword: string;
  gender: string;
  phoneCode: string;
}

const STRING_SORT_FIELDS = new Set<SortField>(['fullName', 'email', 'gender', 'linkedinUrl']);

export function formatPhone(applicant: ApplicantProfile): string {
  const phoneCode = applicant.phoneCode || '';
  const phone = applicant.phone || '';

  if (!phoneCode && !phone) return '-';

  return `${phoneCode} ${phone}`.trim();
}

export function filterApplicants(
  items: ApplicantProfile[],
  filters: ApplicantFilters,
): ApplicantProfile[] {
  const keyword = filters.keyword.trim().toLowerCase();

  return items.filter((item) => {
    const matchesKeyword =
      !keyword ||
      [
        item.fullName,
        item.email,
        item.gender,
        item.phoneCode,
        item.phone,
        formatPhone(item),
        item.linkedinUrl,
      ].some((value) => value?.toLowerCase().includes(keyword));

    const matchesGender = !filters.gender || item.gender === filters.gender;
    const matchesPhoneCode = !filters.phoneCode || item.phoneCode === filters.phoneCode;

    return matchesKeyword && matchesGender && matchesPhoneCode;
  });
}

export function sortApplicants(
  items: ApplicantProfile[],
  field: SortField,
  direction: SortDirection,
): ApplicantProfile[] {
  return [...items].sort((a, b) => {
    let comparison = 0;

    if (STRING_SORT_FIELDS.has(field)) {
      comparison = (a[field] ?? '').localeCompare(b[field] ?? '');
    } else if (field === 'phone') {
      comparison = formatPhone(a).localeCompare(formatPhone(b));
    }

    return direction === 'asc' ? comparison : -comparison;
  });
}
