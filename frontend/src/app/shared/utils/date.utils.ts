export const MONTHS: string[] = [
  '01',
  '02',
  '03',
  '04',
  '05',
  '06',
  '07',
  '08',
  '09',
  '10',
  '11',
  '12',
];

export const MONTHS_LABEL: string[] = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
];

export const DAYS: string[] = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'));

export const YEARS: string[] = Array.from({ length: 50 }, (_, i) =>
  String(new Date().getFullYear() - i),
);

export const PHONE_CODES: string[] = ['+62', '+60', '+65', '+1', '+44', '+81', '+86'];

export function toDateTimeLocal(date: Date): string {
  const pad = (value: number) => String(value).padStart(2, '0');

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(
    date.getHours(),
  )}:${pad(date.getMinutes())}`;
}

export function toDateTimeLocalFromUnknown(value: string | null | undefined): string {
  if (!value) return toDateTimeLocal(new Date());

  const parsed = new Date(value);

  if (!Number.isNaN(parsed.getTime())) {
    return toDateTimeLocal(parsed);
  }

  return toDateTimeLocal(new Date());
}

export function formatDate(
  value: string | null | undefined,
  locale = 'id-ID',
  options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short', year: 'numeric' },
): string {
  if (!value) return '-';

  const date = new Date(value);
  if (isNaN(date.getTime())) return '-';

  return date.toLocaleDateString(locale, options);
}

export function toTimestamp(value: string | null | undefined): number {
  if (!value) return 0;
  const date = new Date(value);
  return isNaN(date.getTime())     ? 0 : date.getTime();
}
