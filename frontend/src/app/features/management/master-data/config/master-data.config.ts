export type MasterKey =
  | 'jobLocations'
  | 'jobCategories'
  | 'workModes'
  | 'jobStatuses'
  | 'employmentTypes'
  | 'departments'
  | 'educationLevels'
  | 'applyStatuses';

export type FieldType = 'text' | 'textarea' | 'switch' | 'number';

export interface FieldConfig {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  rows?: number;
}

export interface ColumnConfig {
  key: string;
  label: string;
}

export interface MasterConfig {
  key: MasterKey;
  label: string;
  description: string;
  fields: FieldConfig[];
  columns: ColumnConfig[];
}

export type MasterRecord = Record<string, any> & {
  id: string;
  code?: string;
  name?: string;
  isActive?: boolean;
};

export const MASTER_CONFIGS: MasterConfig[] = [
  {
    key: 'jobLocations',
    label: 'Job Locations',
    description: 'Kelola lokasi kerja lengkap beserta alamat dan wilayah.',
    fields: [
      { key: 'code', label: 'Code', type: 'text', required: true, placeholder: 'JKT-HQ' },
      {
        key: 'name',
        label: 'Name',
        type: 'text',
        required: true,
        placeholder: 'Jakarta Headquarters',
      },
      { key: 'city', label: 'City', type: 'text', required: true, placeholder: 'Jakarta Selatan' },
      {
        key: 'province',
        label: 'Province',
        type: 'text',
        required: true,
        placeholder: 'DKI Jakarta',
      },
      { key: 'country', label: 'Country', type: 'text', required: true, placeholder: 'Indonesia' },
      {
        key: 'address',
        label: 'Address',
        type: 'textarea',
        required: true,
        rows: 3,
        placeholder: 'Full address',
      },
      {
        key: 'postalCode',
        label: 'Postal Code',
        type: 'text',
        required: true,
        placeholder: '12190',
      },
      { key: 'isActive', label: 'Active', type: 'switch' },
    ],
    columns: [
      { key: 'code', label: 'Code' },
      { key: 'name', label: 'Name' },
      { key: 'city', label: 'City' },
      { key: 'province', label: 'Province' },
      { key: 'country', label: 'Country' },
    ],
  },
  {
    key: 'jobCategories',
    label: 'Job Categories',
    description: 'Kelola kategori pekerjaan yang tampil di lowongan.',
    fields: [
      { key: 'code', label: 'Code', type: 'text', required: true, placeholder: 'ENG' },
      { key: 'name', label: 'Name', type: 'text', required: true, placeholder: 'Engineering' },
      {
        key: 'description',
        label: 'Description',
        type: 'textarea',
        rows: 3,
        placeholder: 'Optional description',
      },
      { key: 'isActive', label: 'Active', type: 'switch' },
    ],
    columns: [
      { key: 'code', label: 'Code' },
      { key: 'name', label: 'Name' },
      { key: 'description', label: 'Description' },
    ],
  },
  {
    key: 'workModes',
    label: 'Work Modes',
    description: 'Kelola mode kerja seperti onsite, hybrid, dan remote.',
    fields: [
      { key: 'code', label: 'Code', type: 'text', required: true, placeholder: 'REMOTE' },
      { key: 'name', label: 'Name', type: 'text', required: true, placeholder: 'Remote' },
      { key: 'isActive', label: 'Active', type: 'switch' },
    ],
    columns: [
      { key: 'code', label: 'Code' },
      { key: 'name', label: 'Name' },
    ],
  },
  {
    key: 'jobStatuses',
    label: 'Job Statuses',
    description: 'Kelola status lowongan seperti draft, published, atau closed.',
    fields: [
      { key: 'code', label: 'Code', type: 'text', required: true, placeholder: 'PUBLISHED' },
      { key: 'name', label: 'Name', type: 'text', required: true, placeholder: 'Published' },
      {
        key: 'description',
        label: 'Description',
        type: 'textarea',
        rows: 3,
        placeholder: 'Optional description',
      },
      { key: 'isActive', label: 'Active', type: 'switch' },
    ],
    columns: [
      { key: 'code', label: 'Code' },
      { key: 'name', label: 'Name' },
      { key: 'description', label: 'Description' },
    ],
  },
  {
    key: 'employmentTypes',
    label: 'Employment Types',
    description: 'Kelola tipe kerja seperti full time, part time, contract, dan lainnya.',
    fields: [
      { key: 'code', label: 'Code', type: 'text', required: true, placeholder: 'FULLTIME' },
      { key: 'name', label: 'Name', type: 'text', required: true, placeholder: 'Full Time' },
      {
        key: 'description',
        label: 'Description',
        type: 'textarea',
        rows: 3,
        placeholder: 'Optional description',
      },
      { key: 'isActive', label: 'Active', type: 'switch' },
    ],
    columns: [
      { key: 'code', label: 'Code' },
      { key: 'name', label: 'Name' },
      { key: 'description', label: 'Description' },
    ],
  },
  {
    key: 'departments',
    label: 'Departments',
    description: 'Kelola departemen internal perusahaan.',
    fields: [
      { key: 'code', label: 'Code', type: 'text', required: true, placeholder: 'HR' },
      { key: 'name', label: 'Name', type: 'text', required: true, placeholder: 'Human Resources' },
      {
        key: 'description',
        label: 'Description',
        type: 'textarea',
        rows: 3,
        placeholder: 'Optional description',
      },
      { key: 'isActive', label: 'Active', type: 'switch' },
    ],
    columns: [
      { key: 'code', label: 'Code' },
      { key: 'name', label: 'Name' },
      { key: 'description', label: 'Description' },
    ],
  },
  {
    key: 'educationLevels',
    label: 'Education Levels',
    description: 'Kelola jenjang pendidikan untuk filter dan persyaratan lowongan.',
    fields: [
      { key: 'code', label: 'Code', type: 'text', required: true, placeholder: 'S1' },
      { key: 'name', label: 'Name', type: 'text', required: true, placeholder: 'Bachelor Degree' },
      {
        key: 'description',
        label: 'Description',
        type: 'textarea',
        rows: 3,
        placeholder: 'Optional description',
      },
      { key: 'isActive', label: 'Active', type: 'switch' },
    ],
    columns: [
      { key: 'code', label: 'Code' },
      { key: 'name', label: 'Name' },
      { key: 'description', label: 'Description' },
    ],
  },
  {
    key: 'applyStatuses',
    label: 'Apply Statuses',
    description: 'Kelola status lamaran yang digunakan pada flow rekrutmen per job.',
    fields: [
      { key: 'code', label: 'Code', type: 'text', required: true, placeholder: 'APPLIED' },
      { key: 'name', label: 'Name', type: 'text', required: true, placeholder: 'Applied' },
      {
        key: 'description',
        label: 'Description',
        type: 'textarea',
        rows: 3,
        placeholder: 'Optional description',
      },
      { key: 'isActive', label: 'Active', type: 'switch' },
    ],
    columns: [
      { key: 'code', label: 'Code' },
      { key: 'name', label: 'Name' },
      { key: 'description', label: 'Description' },
    ],
  },
];
