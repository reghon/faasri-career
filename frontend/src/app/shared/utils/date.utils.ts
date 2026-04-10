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
