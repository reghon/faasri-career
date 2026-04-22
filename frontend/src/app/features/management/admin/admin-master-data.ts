import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize, Observable, of } from 'rxjs';

import { MasterDataTable } from '../../../shared/components/master-data/master-data-table/master-data-table';
import {
  MasterDataFieldConfig,
  MasterDataFormModal,
} from '../../../shared/components/master-data/master-data-form-modal/master-data-form-modal';
import { MasterDataDeleteModal } from '../../../shared/components/master-data/master-data-delete-modal/master-data-delete-modal';

import { RoleService } from '../../../domain/admin/role/role.service';
import { UserService } from '../../../domain/admin/user/user.service';

type AdminKey = 'roles' | 'users';

interface ColumnConfig {
  key: string;
  label: string;
}

interface AdminConfig {
  key: AdminKey;
  label: string;
  description: string;
  fields: MasterDataFieldConfig[];
  columns: ColumnConfig[];
}

type AdminRecord = Record<string, any> & {
  id: string;
  code?: string;
  name?: string;
  email?: string;
  isActive?: boolean;
};

@Component({
  selector: 'app-admin-master-data',
  standalone: true,
  imports: [CommonModule, FormsModule, MasterDataTable, MasterDataFormModal, MasterDataDeleteModal],
  templateUrl: './admin-master-data.html',
})
export class AdminMasterData implements OnInit {
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly roleService = inject(RoleService);
  private readonly userService = inject(UserService);

  pageFeedbackMessage = '';
  pageFeedbackType: 'success' | 'error' | '' = '';

  formFeedbackMessage = '';
  formFeedbackType: 'success' | 'error' | '' = '';

  readonly configs: AdminConfig[] = [
    {
      key: 'roles',
      label: 'Roles',
      description: 'Kelola role untuk kebutuhan akses sistem admin.',
      fields: [
        {
          key: 'code',
          label: 'Code',
          type: 'text',
          required: true,
          placeholder: 'HR_ADMIN',
          minLength: 3,
          maxLength: 100,
          pattern: /^[A-Z0-9_]+$/,
          patternMessage: 'Code hanya boleh huruf besar, angka, dan underscore',
        },
        {
          key: 'name',
          label: 'Name',
          type: 'text',
          required: true,
          placeholder: 'HR Admin',
          minLength: 3,
          maxLength: 255,
        },
        {
          key: 'description',
          label: 'Description',
          type: 'textarea',
          rows: 3,
          placeholder: 'Optional description',
          maxLength: 255,
        },
        { key: 'isSuperadmin', label: 'Is Superadmin', type: 'switch' },
        { key: 'isActive', label: 'Active', type: 'switch' },
      ],
      columns: [
        { key: 'code', label: 'Code' },
        { key: 'name', label: 'Name' },
        { key: 'description', label: 'Description' },
        { key: 'isSuperadmin', label: 'Superadmin' },
      ],
    },
    {
      key: 'users',
      label: 'Users',
      description: 'Buat akun user baru dari halaman admin.',
      fields: [
        {
          key: 'email',
          label: 'Email',
          type: 'text',
          required: true,
          placeholder: 'user@faasri.com',
          pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
          patternMessage: 'Format email tidak valid',
        },
        {
          key: 'password',
          label: 'Password',
          type: 'text',
          required: true,
          placeholder: 'Minimal 8 karakter',
          minLength: 8,
        },
        {
          key: 'roleName',
          label: 'Role Name',
          type: 'text',
          required: true,
          placeholder: 'applicant / hr_admin / superadmin',
        },
        { key: 'isActive', label: 'Active', type: 'switch' },
      ],
      columns: [
        { key: 'email', label: 'Email' },
        { key: 'roleName', label: 'Role' },
        { key: 'createdAt', label: 'Created At' },
      ],
    },
  ];

  activeKey: AdminKey = 'roles';

  items: AdminRecord[] = [];
  filteredItems: AdminRecord[] = [];
  search = '';

  isLoading = false;
  isSubmitting = false;
  isDeleting = false;

  isFormModalOpen = false;
  isDeleteModalOpen = false;
  isEditMode = false;

  selectedItem: AdminRecord | null = null;
  form: Record<string, any> = {};
  formErrors: Record<string, string> = {};

  feedbackMessage = '';
  feedbackType: 'success' | 'error' | '' = '';

  ngOnInit(): void {
    this.resetForm();
    this.loadData();
  }

  get activeConfig(): AdminConfig {
    return this.configs.find((config) => config.key === this.activeKey)!;
  }

  setActiveTab(key: AdminKey): void {
    if (this.activeKey === key) return;

    this.activeKey = key;
    this.search = '';
    this.selectedItem = null;

    this.pageFeedbackMessage = '';
    this.pageFeedbackType = '';
    this.formFeedbackMessage = '';
    this.formFeedbackType = '';

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
        next: (data: AdminRecord[]) => {
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
    this.formFeedbackMessage = '';
    this.formFeedbackType = '';
    this.resetForm();
    this.isFormModalOpen = true;
    this.cdr.detectChanges();
  }

  openEditModal(item: AdminRecord): void {
    this.isEditMode = true;
    this.selectedItem = item;
    this.formErrors = {};
    this.formFeedbackMessage = '';
    this.formFeedbackType = '';

    const nextForm: Record<string, any> = {};

    for (const field of this.activeConfig.fields) {
      if (field.type === 'switch') {
        nextForm[field.key] = Boolean(item[field.key]);
      } else {
        nextForm[field.key] = item[field.key] ?? '';
      }
    }

    if (this.activeKey === 'users') {
      nextForm['password'] = '';
    }

    this.form = nextForm;
    this.isFormModalOpen = true;
    this.cdr.detectChanges();
  }

  closeFormModal(): void {
    if (this.isSubmitting) return;
    this.isFormModalOpen = false;
    this.formErrors = {};
    this.formFeedbackMessage = '';
    this.formFeedbackType = '';
    this.cdr.detectChanges();
  }

  openDeleteModal(item: AdminRecord): void {
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

    this.validateSingleField(event.key);

    this.formFeedbackMessage = '';
    this.formFeedbackType = '';

    this.cdr.detectChanges();
  }

  private validateSingleField(fieldKey: string): boolean {
    const field = this.activeConfig.fields.find((item) => item.key === fieldKey);

    if (!field) return true;

    delete this.formErrors[fieldKey];

    if (field.type === 'switch') {
      return true;
    }

    const value = String(this.form[fieldKey] ?? '').trim();

    if (field.required && !value) {
      this.formErrors[fieldKey] = `${field.label} wajib diisi`;
      return false;
    }

    if (!value) {
      return true;
    }

    if (field.minLength && value.length < field.minLength) {
      this.formErrors[fieldKey] = `${field.label} minimal ${field.minLength} karakter`;
      return false;
    }

    if (field.maxLength && value.length > field.maxLength) {
      this.formErrors[fieldKey] = `${field.label} maksimal ${field.maxLength} karakter`;
      return false;
    }

    if (field.pattern && !field.pattern.test(value)) {
      this.formErrors[fieldKey] = field.patternMessage || `${field.label} tidak valid`;
      return false;
    }

    return true;
  }

  private showPageSuccess(message: string): void {
    this.pageFeedbackType = 'success';
    this.pageFeedbackMessage = message;
  }

  private showPageError(message: string): void {
    this.pageFeedbackType = 'error';
    this.pageFeedbackMessage = message;
  }

  private showFormError(message: string): void {
    this.formFeedbackType = 'error';
    this.formFeedbackMessage = message;
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
          this.applyBackendErrors(error);
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

  private getServiceCall(action: 'getAll'): Observable<any[]>;
  private getServiceCall(action: 'create', payload: any): Observable<any>;
  private getServiceCall(action: 'update', id: string, payload: any): Observable<any>;
  private getServiceCall(action: 'delete', id: string): Observable<any>;
  private getServiceCall(
    action: 'getAll' | 'create' | 'update' | 'delete',
    arg1?: any,
    arg2?: any,
  ): Observable<any> {
    switch (this.activeKey) {
      case 'roles':
        if (action === 'getAll') return this.roleService.getAll();
        if (action === 'create') return this.roleService.create(arg1);
        if (action === 'update') return this.roleService.update(arg1, arg2);
        return this.roleService.delete(arg1);

      case 'users':
        if (action === 'getAll') return this.userService.getAll();
        if (action === 'create') return this.userService.create(arg1);
        if (action === 'update') return this.userService.update(arg1, arg2);
        return this.userService.delete(arg1);

      default:
        return of([]);
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
    this.formErrors = {};
    let valid = true;

    for (const field of this.activeConfig.fields) {
      if (this.activeKey === 'users' && this.isEditMode && field.key === 'password') {
        continue;
      }

      const fieldValid = this.validateSingleField(field.key);
      if (!fieldValid) {
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

      const rawValue = String(this.form[field.key] ?? '').trim();

      if (this.activeKey === 'users' && this.isEditMode && field.key === 'password' && !rawValue) {
        continue;
      }

      payload[field.key] = rawValue === '' ? null : rawValue;
    }

    return payload;
  }
  private extractErrorMessage(error: any, fallback: string): string {
    return error?.error?.message || error?.error?.errors?.[0]?.message || fallback;
  }

  private applyBackendErrors(error: any): void {
    const errors = error?.error?.errors;

    if (!Array.isArray(errors)) return;

    for (const item of errors) {
      const fieldKey = item?.field || item?.path || item?.param;
      const message = item?.message;

      if (fieldKey && message) {
        this.formErrors[fieldKey] = message;
      }
    }
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
