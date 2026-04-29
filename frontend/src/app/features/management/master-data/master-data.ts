import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import {
  JobLocationService,
  JobCategoryService,
  WorkModeService,
  JobStatusService,
  EmploymentTypeService,
  DepartmentService,
  EducationLevelService,
} from '../../../domain/master-data';

import { MasterDataTable } from '../../../shared/components/master-data/master-data-table/master-data-table';
import { MasterDataFormModal } from '../../../shared/components/master-data/master-data-form-modal/master-data-form-modal';
import { MasterDataDeleteModal } from '../../../shared/components/master-data/master-data-delete-modal/master-data-delete-modal';
import { ApplyStatusService } from '../../../domain/apply/master-data/apply-status/apply-status.service';

type MasterKey =
  | 'jobLocations'
  | 'jobCategories'
  | 'workModes'
  | 'jobStatuses'
  | 'employmentTypes'
  | 'departments'
  | 'educationLevels'
  | 'applyStatuses';

type FieldType = 'text' | 'textarea' | 'switch' | 'number';

interface FieldConfig {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  rows?: number;
}

interface ColumnConfig {
  key: string;
  label: string;
}

interface MasterConfig {
  key: MasterKey;
  label: string;
  description: string;
  fields: FieldConfig[];
  columns: ColumnConfig[];
}

type MasterRecord = Record<string, any> & {
  id: string;
  code?: string;
  name?: string;
  isActive?: boolean;
};

@Component({
  selector: 'app-master-data',
  standalone: true,
  imports: [CommonModule, FormsModule, MasterDataTable, MasterDataFormModal, MasterDataDeleteModal],
  templateUrl: './master-data.html',
})
export class MasterData implements OnInit {
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly jobLocationService = inject(JobLocationService);
  private readonly jobCategoryService = inject(JobCategoryService);
  private readonly workModeService = inject(WorkModeService);
  private readonly jobStatusService = inject(JobStatusService);
  private readonly employmentTypeService = inject(EmploymentTypeService);
  private readonly departmentService = inject(DepartmentService);
  private readonly educationLevelService = inject(EducationLevelService);
  private readonly applyStatusService = inject(ApplyStatusService);

  readonly configs: MasterConfig[] = [
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
        {
          key: 'city',
          label: 'City',
          type: 'text',
          required: true,
          placeholder: 'Jakarta Selatan',
        },
        {
          key: 'province',
          label: 'Province',
          type: 'text',
          required: true,
          placeholder: 'DKI Jakarta',
        },
        {
          key: 'country',
          label: 'Country',
          type: 'text',
          required: true,
          placeholder: 'Indonesia',
        },
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
        {
          key: 'name',
          label: 'Name',
          type: 'text',
          required: true,
          placeholder: 'Human Resources',
        },
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
        {
          key: 'name',
          label: 'Name',
          type: 'text',
          required: true,
          placeholder: 'Bachelor Degree',
        },
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
        {
          key: 'code',
          label: 'Code',
          type: 'text',
          required: true,
          placeholder: 'APPLIED',
        },
        {
          key: 'name',
          label: 'Name',
          type: 'text',
          required: true,
          placeholder: 'Applied',
        },
        {
          key: 'description',
          label: 'Description',
          type: 'textarea',
          rows: 3,
          placeholder: 'Optional description',
        },
        {
          key: 'isActive',
          label: 'Active',
          type: 'switch',
        },
      ],
      columns: [
        { key: 'code', label: 'Code' },
        { key: 'name', label: 'Name' },
        { key: 'description', label: 'Description' },
      ],
    },
  ];

  activeKey: MasterKey = 'jobLocations';

  items: MasterRecord[] = [];
  filteredItems: MasterRecord[] = [];

  search = '';

  isLoading = false;
  isSubmitting = false;
  isDeleting = false;

  isFormModalOpen = false;
  isDeleteModalOpen = false;
  isEditMode = false;

  selectedItem: MasterRecord | null = null;
  form: Record<string, any> = {};
  formErrors: Record<string, string> = {};

  feedbackMessage = '';
  feedbackType: 'success' | 'error' | '' = '';

  ngOnInit(): void {
    this.resetForm();
    this.loadData();
  }

  get activeConfig(): MasterConfig {
    return this.configs.find((config) => config.key === this.activeKey)!;
  }

  get activeCount(): number {
    return this.filteredItems.length;
  }

  setActiveTab(key: MasterKey): void {
    if (this.activeKey === key) return;

    this.activeKey = key;
    this.search = '';
    this.selectedItem = null;
    this.feedbackMessage = '';
    this.feedbackType = '';
    this.formErrors = {};
    this.resetForm();
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    this.cdr.detectChanges();

    this.getServiceCall('getAll')
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.cdr.detectChanges();
        }),
      )
      .subscribe({
        next: (data: MasterRecord[]) => {
          this.items = data ?? [];
          this.applyFilter();
          this.cdr.detectChanges();
        },
        error: (error: any) => {
          this.items = [];
          this.filteredItems = [];
          this.showError(this.extractErrorMessage(error, 'Failed to load data.'));
          this.cdr.detectChanges();
        },
      });
  }

  applyFilter(): void {
    const keyword = this.search.trim().toLowerCase();

    if (!keyword) {
      this.filteredItems = [...this.items];
      this.cdr.detectChanges();
      return;
    }

    this.filteredItems = this.items.filter((item) =>
      Object.values(item).some((value) =>
        String(value ?? '')
          .toLowerCase()
          .includes(keyword),
      ),
    );

    this.cdr.detectChanges();
  }

  openCreateModal(): void {
    this.isEditMode = false;
    this.selectedItem = null;
    this.formErrors = {};
    this.feedbackMessage = '';
    this.feedbackType = '';
    this.resetForm();
    this.isFormModalOpen = true;
    this.cdr.detectChanges();
  }

  openEditModal(item: MasterRecord): void {
    this.isEditMode = true;
    this.selectedItem = item;
    this.formErrors = {};
    this.feedbackMessage = '';
    this.feedbackType = '';

    const nextForm: Record<string, any> = {};

    for (const field of this.activeConfig.fields) {
      if (field.type === 'switch') {
        nextForm[field.key] = Boolean(item[field.key]);
      } else {
        nextForm[field.key] = item[field.key] ?? '';
      }
    }

    this.form = nextForm;
    this.isFormModalOpen = true;
    this.cdr.detectChanges();
  }

  closeFormModal(): void {
    if (this.isSubmitting) return;

    this.isFormModalOpen = false;
    this.formErrors = {};
    this.cdr.detectChanges();
  }

  openDeleteModal(item: MasterRecord): void {
    this.selectedItem = item;
    this.feedbackMessage = '';
    this.feedbackType = '';
    this.isDeleteModalOpen = true;
    this.cdr.detectChanges();
  }

  closeDeleteModal(): void {
    if (this.isDeleting) return;

    this.isDeleteModalOpen = false;
    this.cdr.detectChanges();
  }

  onFormChange(event: { key: string; value: any; form: Record<string, any> }): void {
    this.form = { ...event.form };

    if (this.formErrors[event.key]) {
      const nextErrors = { ...this.formErrors };
      delete nextErrors[event.key];
      this.formErrors = nextErrors;
    }

    this.feedbackMessage = '';
    this.feedbackType = '';
    this.cdr.detectChanges();
  }

  submitForm(): void {
    this.formErrors = {};

    if (!this.validateForm()) {
      this.cdr.detectChanges();
      return;
    }

    const payload = this.buildPayload();
    this.isSubmitting = true;
    this.cdr.detectChanges();

    const request$ =
      this.isEditMode && this.selectedItem?.id
        ? this.getServiceCall('update', this.selectedItem.id, payload)
        : this.getServiceCall('create', payload);

    request$
      .pipe(
        finalize(() => {
          this.isSubmitting = false;
          this.cdr.detectChanges();
        }),
      )
      .subscribe({
        next: () => {
          this.isFormModalOpen = false;
          this.showSuccess(
            this.isEditMode ? 'Data updated successfully.' : 'Data created successfully.',
          );
          this.loadData();
          this.cdr.detectChanges();
        },
        error: (error: any) => {
          this.showError(this.extractErrorMessage(error, 'Failed to save data.'));
          this.cdr.detectChanges();
        },
      });
  }

  deleteSelected(): void {
    if (!this.selectedItem?.id) return;

    this.isDeleting = true;
    this.cdr.detectChanges();

    this.getServiceCall('delete', this.selectedItem.id)
      .pipe(
        finalize(() => {
          this.isDeleting = false;
          this.cdr.detectChanges();
        }),
      )
      .subscribe({
        next: () => {
          this.isDeleteModalOpen = false;
          this.showSuccess('Data deleted successfully.');
          this.loadData();
          this.cdr.detectChanges();
        },
        error: (error: any) => {
          this.showError(this.extractErrorMessage(error, 'Failed to delete data.'));
          this.cdr.detectChanges();
        },
      });
  }

  private getServiceCall(action: 'getAll'): any;
  private getServiceCall(action: 'create', payload: any): any;
  private getServiceCall(action: 'update', id: string, payload: any): any;
  private getServiceCall(action: 'delete', id: string): any;
  private getServiceCall(
    action: 'getAll' | 'create' | 'update' | 'delete',
    arg1?: any,
    arg2?: any,
  ): any {
    switch (this.activeKey) {
      case 'jobLocations':
        if (action === 'getAll') return this.jobLocationService.getAll();
        if (action === 'create') return this.jobLocationService.create(arg1);
        if (action === 'update') return this.jobLocationService.update(arg1, arg2);
        return this.jobLocationService.delete(arg1);

      case 'jobCategories':
        if (action === 'getAll') return this.jobCategoryService.getAll();
        if (action === 'create') return this.jobCategoryService.create(arg1);
        if (action === 'update') return this.jobCategoryService.update(arg1, arg2);
        return this.jobCategoryService.delete(arg1);

      case 'workModes':
        if (action === 'getAll') return this.workModeService.getAll();
        if (action === 'create') return this.workModeService.create(arg1);
        if (action === 'update') return this.workModeService.update(arg1, arg2);
        return this.workModeService.delete(arg1);

      case 'jobStatuses':
        if (action === 'getAll') return this.jobStatusService.getAll();
        if (action === 'create') return this.jobStatusService.create(arg1);
        if (action === 'update') return this.jobStatusService.update(arg1, arg2);
        return this.jobStatusService.delete(arg1);

      case 'employmentTypes':
        if (action === 'getAll') return this.employmentTypeService.getAll();
        if (action === 'create') return this.employmentTypeService.create(arg1);
        if (action === 'update') return this.employmentTypeService.update(arg1, arg2);
        return this.employmentTypeService.delete(arg1);

      case 'departments':
        if (action === 'getAll') return this.departmentService.getAll();
        if (action === 'create') return this.departmentService.create(arg1);
        if (action === 'update') return this.departmentService.update(arg1, arg2);
        return this.departmentService.delete(arg1);

      case 'educationLevels':
        if (action === 'getAll') return this.educationLevelService.getAll();
        if (action === 'create') return this.educationLevelService.create(arg1);
        if (action === 'update') return this.educationLevelService.update(arg1, arg2);
        return this.educationLevelService.delete(arg1);

      case 'applyStatuses':
        if (action === 'getAll') return this.applyStatusService.getAll();
        if (action === 'create') return this.applyStatusService.create(arg1);
        if (action === 'update') return this.applyStatusService.update(arg1, arg2);
        return this.applyStatusService.delete(arg1);
    }
  }

  private resetForm(): void {
    const nextForm: Record<string, any> = {};

    for (const field of this.activeConfig.fields) {
      if (field.type === 'switch') {
        nextForm[field.key] = field.key === 'isActive';
        continue;
      }

      if (field.type === 'number') {
        nextForm[field.key] = 0;
        continue;
      }

      nextForm[field.key] = '';
    }

    this.form = nextForm;
  }
  private validateForm(): boolean {
    let valid = true;

    for (const field of this.activeConfig.fields) {
      if (field.type === 'switch') continue;

      const value = String(this.form[field.key] ?? '').trim();

      if (field.required && !value) {
        this.formErrors[field.key] = `${field.label} is required`;
        valid = false;
      }
    }

    return valid;
  }

  private buildPayload(): Record<string, any> {
    const payload: Record<string, any> = {};

    for (const field of this.activeConfig.fields) {
      if (field.type === 'switch') {
        payload[field.key] = Boolean(this.form[field.key]);
        continue;
      }

      if (field.type === 'number') {
        payload[field.key] = Number(this.form[field.key] ?? 0);
        continue;
      }

      const rawValue = String(this.form[field.key] ?? '').trim();
      payload[field.key] = rawValue === '' ? null : rawValue;
    }

    return payload;
  }

  private extractErrorMessage(error: any, fallback: string): string {
    return error?.error?.message || error?.error?.errors?.[0]?.message || fallback;
  }

  private showSuccess(message: string): void {
    this.feedbackType = 'success';
    this.feedbackMessage = message;
  }

  private showError(message: string): void {
    this.feedbackType = 'error';
    this.feedbackMessage = message;
  }
}
