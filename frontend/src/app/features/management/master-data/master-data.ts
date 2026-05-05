import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
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

import { ApplyStatusService } from '../../../domain/apply/master-data/apply-status/apply-status.service';

import { MasterDataTable } from '../../../shared/components/master-data/master-data-table/master-data-table';
import { MasterDataFormModal } from '../../../shared/components/master-data/master-data-form-modal/master-data-form-modal';
import { MasterDataDeleteModal } from '../../../shared/components/master-data/master-data-delete-modal/master-data-delete-modal';

import { MASTER_CONFIGS, MasterConfig, MasterKey, MasterRecord } from './config/master-data.config';

import {
  buildFormFromRecord,
  buildInitialForm,
  buildPayload,
  clearFieldError,
  validateForm,
} from './util/master-data-form.utils';

@Component({
  selector: 'app-master-data',
  standalone: true,
  imports: [CommonModule, FormsModule, MasterDataTable, MasterDataFormModal, MasterDataDeleteModal],
  templateUrl: './master-data.html',
})
export class MasterData implements OnInit {
  private readonly jobLocationService = inject(JobLocationService);
  private readonly jobCategoryService = inject(JobCategoryService);
  private readonly workModeService = inject(WorkModeService);
  private readonly jobStatusService = inject(JobStatusService);
  private readonly employmentTypeService = inject(EmploymentTypeService);
  private readonly departmentService = inject(DepartmentService);
  private readonly educationLevelService = inject(EducationLevelService);
  private readonly applyStatusService = inject(ApplyStatusService);

  // ─── Static Config ────────────────────────────────────────────────────────

  readonly configs: MasterConfig[] = MASTER_CONFIGS;

  // ─── State ───────────────────────────────────────────────────────────────

  readonly activeKey = signal<MasterKey>('jobLocations');
  readonly items = signal<MasterRecord[]>([]);
  readonly search = signal('');

  readonly isLoading = signal(false);
  readonly isSubmitting = signal(false);
  readonly isDeleting = signal(false);

  readonly isFormModalOpen = signal(false);
  readonly isDeleteModalOpen = signal(false);
  readonly isEditMode = signal(false);

  readonly selectedItem = signal<MasterRecord | null>(null);
  readonly form = signal<Record<string, any>>({});
  readonly formErrors = signal<Record<string, string>>({});

  readonly feedbackMessage = signal('');
  readonly feedbackType = signal<'success' | 'error' | ''>('');

  // ─── Derived State (computed) ─────────────────────────────────────────────

  readonly activeConfig = computed<MasterConfig>(
    () => this.configs.find((c) => c.key === this.activeKey())!,
  );

  readonly filteredItems = computed<MasterRecord[]>(() => {
    const keyword = this.search().trim().toLowerCase();
    if (!keyword) return [...this.items()];

    return this.items().filter((item) =>
      Object.values(item).some((value) =>
        String(value ?? '')
          .toLowerCase()
          .includes(keyword),
      ),
    );
  });

  readonly modalTitle = computed(
    () => (this.isEditMode() ? 'Edit ' : 'Tambah ') + this.activeConfig().label,
  );

  readonly formFeedbackMessage = computed(() =>
    this.feedbackType() === 'error' ? this.feedbackMessage() : '',
  );

  // ─── Lifecycle ────────────────────────────────────────────────────────────

  ngOnInit(): void {
    this.form.set(buildInitialForm(this.activeConfig().fields));
    this.loadData();
  }

  // ─── Tab ─────────────────────────────────────────────────────────────────

  setActiveTab(key: MasterKey): void {
    if (this.activeKey() === key) return;

    this.activeKey.set(key);
    this.search.set('');
    this.selectedItem.set(null);
    this.clearFeedback();
    this.formErrors.set({});
    this.form.set(buildInitialForm(this.activeConfig().fields));
    this.loadData();
  }

  // ─── Data ─────────────────────────────────────────────────────────────────

  loadData(): void {
    this.isLoading.set(true);

    this.getServiceCall('getAll')
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (data: MasterRecord[]) => this.items.set(data ?? []),
        error: (error: any) => {
          this.items.set([]);
          this.showError(this.extractErrorMessage(error, 'Failed to load data.'));
        },
      });
  }

  // ─── Modal: Form ──────────────────────────────────────────────────────────

  openCreateModal(): void {
    this.isEditMode.set(false);
    this.selectedItem.set(null);
    this.formErrors.set({});
    this.clearFeedback();
    this.form.set(buildInitialForm(this.activeConfig().fields));
    this.isFormModalOpen.set(true);
  }

  openEditModal(item: MasterRecord): void {
    this.isEditMode.set(true);
    this.selectedItem.set(item);
    this.formErrors.set({});
    this.clearFeedback();
    this.form.set(buildFormFromRecord(this.activeConfig().fields, item));
    this.isFormModalOpen.set(true);
  }

  closeFormModal(): void {
    if (this.isSubmitting()) return;
    this.isFormModalOpen.set(false);
    this.formErrors.set({});
  }

  onFormChange(event: { key: string; value: any; form: Record<string, any> }): void {
    this.form.set({ ...event.form });
    this.formErrors.set(clearFieldError(this.formErrors(), event.key));
    this.clearFeedback();
  }

  submitForm(): void {
    const errors = validateForm(this.activeConfig().fields, this.form());
    this.formErrors.set(errors);
    if (Object.keys(errors).length > 0) return;

    const payload = buildPayload(this.activeConfig().fields, this.form());
    this.isSubmitting.set(true);

    const selected = this.selectedItem();
    const request$ =
      this.isEditMode() && selected?.id
        ? this.getServiceCall('update', selected.id, payload)
        : this.getServiceCall('create', payload);

    request$.pipe(finalize(() => this.isSubmitting.set(false))).subscribe({
      next: () => {
        this.isFormModalOpen.set(false);
        this.showSuccess(
          this.isEditMode() ? 'Data updated successfully.' : 'Data created successfully.',
        );
        this.loadData();
      },
      error: (error: any) =>
        this.showError(this.extractErrorMessage(error, 'Failed to save data.')),
    });
  }

  // ─── Modal: Delete ────────────────────────────────────────────────────────

  openDeleteModal(item: MasterRecord): void {
    this.selectedItem.set(item);
    this.clearFeedback();
    this.isDeleteModalOpen.set(true);
  }

  closeDeleteModal(): void {
    if (this.isDeleting()) return;
    this.isDeleteModalOpen.set(false);
  }

  deleteSelected(): void {
    const selected = this.selectedItem();
    if (!selected?.id) return;

    this.isDeleting.set(true);

    this.getServiceCall('delete', selected.id)
      .pipe(finalize(() => this.isDeleting.set(false)))
      .subscribe({
        next: () => {
          this.isDeleteModalOpen.set(false);
          this.showSuccess('Data deleted successfully.');
          this.loadData();
        },
        error: (error: any) =>
          this.showError(this.extractErrorMessage(error, 'Failed to delete data.')),
      });
  }

  // ─── Registry ─────────────────────────────────────────────────────────────

  private getServiceCall(action: 'getAll'): any;
  private getServiceCall(action: 'create', payload: any): any;
  private getServiceCall(action: 'update', id: string, payload: any): any;
  private getServiceCall(action: 'delete', id: string): any;
  private getServiceCall(
    action: 'getAll' | 'create' | 'update' | 'delete',
    arg1?: any,
    arg2?: any,
  ): any {
    switch (this.activeKey()) {
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

  // ─── Private Helpers ──────────────────────────────────────────────────────

  private clearFeedback(): void {
    this.feedbackMessage.set('');
    this.feedbackType.set('');
  }

  private showSuccess(message: string): void {
    this.feedbackType.set('success');
    this.feedbackMessage.set(message);
  }

  private showError(message: string): void {
    this.feedbackType.set('error');
    this.feedbackMessage.set(message);
  }

  private extractErrorMessage(error: any, fallback: string): string {
    return error?.error?.message || error?.error?.errors?.[0]?.message || fallback;
  }
}
