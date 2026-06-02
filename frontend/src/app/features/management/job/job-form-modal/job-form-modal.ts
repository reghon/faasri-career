import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs';

import { GenericModalComponent } from '../../../../shared/components/general/generic-modal.component';

import { JobPicSectionComponent } from './components/job-pic-section/job-pic-section';
import { JobBasicSectionComponent } from './components/job-basic-section/job-basic-section';
import { JobLocationSectionComponent } from './components/job-location-section/job-location-section';
import { JobCompensationSectionComponent } from './components/job-compensation-section/job-compensation-section';
import { JobPublicationSectionComponent } from './components/job-publication-section/job-publication-section';
import { JobFlowSectionComponent } from './components/job-flow-section/job-flow-section';
import { JobContentSectionComponent } from './components/job-content-section/job-content-section';

import {
  buildJobPayload,
  createDefaultJobFlowStatuses,
  createInitialJobForm,
  mapJobApplyStatusesToFlowItems,
  normalizeJobFlowStatuses,
  patchJobForm,
} from './helpers/job-form.mapper';
import { validateJobForm } from './helpers/job-form.validator';
import {
  JobFlowStatusItem,
  JobFormErrors,
  JobFormValue,
  SelectOption,
} from './models/job-form.model';
import { ApplyStatus } from '../../../../domain/apply/master-data/apply-status/apply-status.model';
import { JobFormService } from './services/job-form.service';
import { AuthService } from '../../../../domain/auth/auth.service';

@Component({
  selector: 'app-job-form-modal',
  standalone: true,
  imports: [
    CommonModule,
    GenericModalComponent,
    JobPicSectionComponent,
    JobBasicSectionComponent,
    JobLocationSectionComponent,
    JobCompensationSectionComponent,
    JobPublicationSectionComponent,
    JobFlowSectionComponent,
    JobContentSectionComponent,
  ],
  templateUrl: './job-form-modal.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JobFormModalComponent implements OnChanges {
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly service = inject(JobFormService);
  private readonly authService = inject(AuthService);

  @Input() open = false;
  @Input() jobId: string | null = null;

  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  isSubmitting = false;
  isLoading = false;
  canEditJobFlow = true;
  jobFlowLockMessage = '';

  errors: JobFormErrors = {};

  creatorName = '';
  managementProfiles: SelectOption[] = [];
  categories: SelectOption[] = [];
  employmentTypes: SelectOption[] = [];
  statuses: SelectOption[] = [];
  jobLocations: SelectOption[] = [];
  educationLevels: SelectOption[] = [];
  departments: SelectOption[] = [];
  workModes: SelectOption[] = [];

  applyStatuses: ApplyStatus[] = [];
  jobFlowStatuses: JobFlowStatusItem[] = [];

  form: JobFormValue = createInitialJobForm();

  modules = {
    toolbar: [['bold', 'italic', 'underline'], [{ align: [] }]],
  };

  get isEditMode(): boolean {
    return !!this.jobId;
  }

  get isJobFlowLocked(): boolean {
    return this.isEditMode && !this.canEditJobFlow;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['open']?.currentValue) {
      this.initializeModal();
    }
  }

  handleClose(): void {
    if (this.isSubmitting) return;

    this.resetForm();
    this.close.emit();
  }

  onSave(): void {
    this.errors = validateJobForm(this.form, this.jobFlowStatuses);

    if (Object.keys(this.errors).length > 0) {
      this.detect();
      return;
    }

    if (this.isEditMode && this.jobId) {
      this.validateJobFlowBeforeSave(this.jobId);
      return;
    }

    this.continueSave();
  }

  detect(): void {
    this.cdr.detectChanges();
  }

  private initializeModal(): void {
    this.errors = {};
    this.creatorName = this.authService.currentUser()?.email ?? '-';
    this.isLoading = true;
    this.detect();

    this.service.loadMasters().subscribe({
      next: (masters) => {
        this.managementProfiles = masters.managementProfiles;
        this.categories = masters.categories;
        this.employmentTypes = masters.employmentTypes;
        this.statuses = masters.statuses;
        this.jobLocations = masters.jobLocations;
        this.educationLevels = masters.educationLevels;
        this.departments = masters.departments;
        this.workModes = masters.workModes;
        this.applyStatuses = masters.applyStatuses;

        if (this.isEditMode && this.jobId) {
          this.loadJobDetail(this.jobId);
          return;
        }

        this.form = createInitialJobForm();
        this.jobFlowStatuses = createDefaultJobFlowStatuses(this.applyStatuses);
        this.isLoading = false;
        this.detect();
      },
      error: () => {
        this.errors['general'] = 'Gagal memuat data master.';
        this.isLoading = false;
        this.detect();
      },
    });
  }

  private loadJobDetail(jobId: string): void {
    this.service.loadJobFormDetail(jobId).subscribe({
      next: ({ job, jobApplyStatuses, editGuard }) => {
        this.creatorName = job.createdBy ?? '-';
        this.form = patchJobForm(job, {
          categories: this.categories,
          employmentTypes: this.employmentTypes,
          statuses: this.statuses,
          jobLocations: this.jobLocations,
          educationLevels: this.educationLevels,
          departments: this.departments,
          workModes: this.workModes,
        });

        const patchedFlow = mapJobApplyStatusesToFlowItems(jobApplyStatuses);

        this.jobFlowStatuses =
          patchedFlow.length > 0
            ? normalizeJobFlowStatuses(patchedFlow)
            : createDefaultJobFlowStatuses(this.applyStatuses);

        this.canEditJobFlow = editGuard.canEditJobFlow;
        this.jobFlowLockMessage = editGuard.canEditJobFlow
          ? ''
          : 'Tahapan lowongan tidak dapat diubah karena kandidat sudah melewati tahap Submitted.';

        this.isLoading = false;
        this.detect();
      },
      error: () => {
        this.errors['general'] = 'Gagal memuat detail lowongan.';
        this.isLoading = false;
        this.detect();
      },
    });
  }

  private validateJobFlowBeforeSave(jobId: string): void {
    this.isSubmitting = true;
    this.detect();

    this.service.validateJobFlowEdit(jobId).subscribe({
      next: (guard) => {
        this.canEditJobFlow = guard.canEditJobFlow;
        this.jobFlowLockMessage = guard.canEditJobFlow
          ? ''
          : 'Tahapan lowongan tidak dapat diubah karena kandidat sudah melewati tahap Submitted.';

        this.continueSave();
      },
      error: () => {
        this.isSubmitting = false;
        this.errors['general'] = 'Gagal memvalidasi tahapan lowongan.';
        this.detect();
      },
    });
  }

  private continueSave(): void {
    const payload = buildJobPayload(this.form);

    this.isSubmitting = true;
    this.detect();

    this.service
      .saveJobWithFlow(this.jobId, payload, this.jobFlowStatuses, !this.isJobFlowLocked)
      .pipe(
        finalize(() => {
          this.isSubmitting = false;
          this.detect();
        }),
      )
      .subscribe({
        next: () => {
          this.saved.emit();
          this.handleClose();
        },
        error: (error) => {
          this.errors['general'] = error?.error?.message || 'Gagal menyimpan lowongan.';
          this.detect();
        },
      });
  }

  private resetForm(): void {
    this.errors = {};
    this.creatorName = '';
    this.form = createInitialJobForm();
    this.jobFlowStatuses = [];
    this.canEditJobFlow = true;
    this.jobFlowLockMessage = '';
    this.isLoading = false;
    this.isSubmitting = false;
    this.detect();
  }
}
