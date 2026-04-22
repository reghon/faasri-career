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
import { FormsModule } from '@angular/forms';
import { finalize, forkJoin } from 'rxjs';
import { QuillModule } from 'ngx-quill';

import { GenericModalComponent } from '../../../../../shared/components/general/generic-modal.component';

import { JobService } from '../../../../../domain/job/services/job.service';
import { JobDetail, JobPayload } from '../../../../../domain/job/models/job.model';

import {
  DepartmentService,
  EducationLevelService,
  EmploymentTypeService,
  JobCategoryService,
  JobLocationService,
  JobStatusService,
  WorkModeService,
} from '../../../../../domain/master-data';
import { SelectComponent } from '../../../../../shared/components/select/select';

interface SelectOption {
  id: string;
  name: string;
}

interface JobFormValue {
  categoryId: string;
  employmentTypeId: string;
  statusId: string;
  jobLocationId: string;
  educationLevelId: string;
  departmentId: string;
  workModeId: string;
  title: string;
  slug: string;
  description: string;
  requirements: string;
  responsibilities: string;
  benefits: string;
  minSalary: number | null;
  maxSalary: number | null;
  currencyCode: string;
  salaryType: string;
  vacancyCount: number;
  experienceMinYears: number;
  publishedAt: string;
  closeAt: string;
  isActive: boolean;
}

@Component({
  selector: 'app-job-form-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, GenericModalComponent, QuillModule, SelectComponent],
  templateUrl: './job-form-modal.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JobFormModalComponent implements OnChanges {
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly jobService = inject(JobService);

  private readonly departmentService = inject(DepartmentService);
  private readonly educationLevelService = inject(EducationLevelService);
  private readonly employmentTypeService = inject(EmploymentTypeService);
  private readonly jobCategoryService = inject(JobCategoryService);
  private readonly jobLocationService = inject(JobLocationService);
  private readonly jobStatusService = inject(JobStatusService);
  private readonly workModeService = inject(WorkModeService);

  @Input() open = false;
  @Input() jobId: string | null = null;

  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  isSubmitting = false;
  isLoading = false;
  errors: Record<string, string> = {};

  categories: SelectOption[] = [];
  employmentTypes: SelectOption[] = [];
  statuses: SelectOption[] = [];
  jobLocations: SelectOption[] = [];
  educationLevels: SelectOption[] = [];
  departments: SelectOption[] = [];
  workModes: SelectOption[] = [];

  form: JobFormValue = this.createInitialForm();
  modules = {
    toolbar: [['bold', 'italic', 'underline'], [{ align: [] }]],
  };
  get isEditMode(): boolean {
    return !!this.jobId;
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
    this.errors = {};

    if (!this.validateForm()) {
      this.detect();
      return;
    }

    const payload = this.buildPayload();

    this.isSubmitting = true;
    this.detect();

    const request$ =
      this.isEditMode && this.jobId
        ? this.jobService.updateJob(this.jobId, payload)
        : this.jobService.createJob(payload);

    request$
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

  private initializeModal(): void {
    this.errors = {};
    this.isLoading = true;
    this.detect();

    forkJoin({
      categories: this.jobCategoryService.getAll(),
      employmentTypes: this.employmentTypeService.getAll(),
      statuses: this.jobStatusService.getAll(),
      jobLocations: this.jobLocationService.getAll(),
      educationLevels: this.educationLevelService.getAll(),
      departments: this.departmentService.getAll(),
      workModes: this.workModeService.getAll(),
    }).subscribe({
      next: (masters) => {
        this.categories = masters.categories.map((item) => ({
          id: item.id,
          name: item.name,
        }));
        this.employmentTypes = masters.employmentTypes.map((item) => ({
          id: item.id,
          name: item.name,
        }));
        this.statuses = masters.statuses.map((item) => ({
          id: item.id,
          name: item.name,
        }));
        this.jobLocations = masters.jobLocations.map((item) => ({
          id: item.id,
          name: item.name,
        }));
        this.educationLevels = masters.educationLevels.map((item) => ({
          id: item.id,
          name: item.name,
        }));
        this.departments = masters.departments.map((item) => ({
          id: item.id,
          name: item.name,
        }));
        this.workModes = masters.workModes.map((item) => ({
          id: item.id,
          name: item.name,
        }));

        if (this.isEditMode && this.jobId) {
          this.loadJobDetail(this.jobId);
          return;
        }

        this.form = this.createInitialForm();
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

  private loadJobDetail(id: string): void {
    this.jobService.getJobById(id).subscribe({
      next: (job) => {
        this.patchForm(job);
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

  private patchForm(job: JobDetail): void {
    this.form = {
      categoryId: this.findOptionIdByName(this.categories, job.category),
      employmentTypeId: this.findOptionIdByName(this.employmentTypes, job.jobType),
      statusId: this.findOptionIdByName(this.statuses, job.status),
      jobLocationId: this.findOptionIdByName(this.jobLocations, job.location),
      educationLevelId: this.findOptionIdByName(this.educationLevels, job.educationLevel),
      departmentId: this.findOptionIdByName(this.departments, job.department),
      workModeId: this.findOptionIdByName(this.workModes, job.workType),
      title: job.title ?? '',
      slug: job.slug ?? '',
      description: job.aboutRole ?? '',
      requirements: job.qualifications ?? '',
      responsibilities: job.responsibilities ?? '',
      benefits: job.benefits ?? '',
      minSalary: job.minSalary ?? 0,
      maxSalary: job.maxSalary ?? 0,
      currencyCode: job.currencyCode ?? 'IDR',
      salaryType: job.salaryType ?? 'month',
      vacancyCount: job.vacancyCount ?? 1,
      experienceMinYears: Number(job.experience?.replace(/[^\d.]/g, '') || 0),
      publishedAt: this.toDateTimeLocalFromUnknown(job.postedAt),
      closeAt: this.toDateTimeLocalFromUnknown(job.closeAt),
      isActive: job.isActive ?? true,
    };
  }

  private validateForm(): boolean {
    this.errors = {};

    if (!this.form.title.trim()) this.errors['title'] = 'Judul wajib diisi.';
    if (!this.form.slug.trim()) this.errors['slug'] = 'Slug wajib diisi.';
    if (!this.form.categoryId) this.errors['categoryId'] = 'Kategori wajib dipilih.';
    if (!this.form.employmentTypeId) {
      this.errors['employmentTypeId'] = 'Tipe pekerjaan wajib dipilih.';
    }
    if (!this.form.statusId) this.errors['statusId'] = 'Status wajib dipilih.';
    if (!this.form.jobLocationId) this.errors['jobLocationId'] = 'Lokasi kerja wajib dipilih.';
    if (!this.form.educationLevelId) {
      this.errors['educationLevelId'] = 'Pendidikan wajib dipilih.';
    }
    if (!this.form.departmentId) this.errors['departmentId'] = 'Departemen wajib dipilih.';
    if (!this.form.workModeId) this.errors['workModeId'] = 'Mode kerja wajib dipilih.';
    if (!this.form.description.trim()) this.errors['description'] = 'Deskripsi wajib diisi.';
    if (!this.form.requirements.trim()) {
      this.errors['requirements'] = 'Requirements wajib diisi.';
    }
    if (!this.form.responsibilities.trim()) {
      this.errors['responsibilities'] = 'Responsibilities wajib diisi.';
    }
    if (!this.form.currencyCode.trim()) this.errors['currencyCode'] = 'Currency wajib diisi.';
    if (!this.form.salaryType.trim()) this.errors['salaryType'] = 'Salary type wajib diisi.';
    if (!this.form.publishedAt) this.errors['publishedAt'] = 'Tanggal publish wajib diisi.';
    if (!this.form.closeAt) this.errors['closeAt'] = 'Tanggal tutup wajib diisi.';

    if (this.form.minSalary === null || this.form.minSalary < 0) {
      this.errors['minSalary'] = 'Minimum salary tidak valid.';
    }

    if (this.form.maxSalary === null || this.form.maxSalary < 0) {
      this.errors['maxSalary'] = 'Maksimum salary tidak valid.';
    }

    if (
      this.form.minSalary !== null &&
      this.form.maxSalary !== null &&
      this.form.maxSalary < this.form.minSalary
    ) {
      this.errors['maxSalary'] = 'Maksimum salary tidak boleh lebih kecil dari minimum salary.';
    }

    if (this.form.vacancyCount < 1) {
      this.errors['vacancyCount'] = 'Vacancy count minimal 1.';
    }

    if (this.form.experienceMinYears < 0) {
      this.errors['experienceMinYears'] = 'Experience minimum tidak boleh negatif.';
    }

    if (this.form.publishedAt && this.form.closeAt) {
      const publishedAt = new Date(this.form.publishedAt).getTime();
      const closeAt = new Date(this.form.closeAt).getTime();

      if (closeAt <= publishedAt) {
        this.errors['closeAt'] = 'Tanggal tutup harus setelah tanggal publish.';
      }
    }

    return Object.keys(this.errors).length === 0;
  }

  private buildPayload(): JobPayload {
    return {
      categoryId: this.form.categoryId,
      employmentTypeId: this.form.employmentTypeId,
      statusId: this.form.statusId,
      jobLocationId: this.form.jobLocationId,
      educationLevelId: this.form.educationLevelId,
      departmentId: this.form.departmentId,
      workModeId: this.form.workModeId,
      title: this.form.title.trim(),
      slug: this.form.slug.trim(),
      description: this.form.description.trim(),
      requirements: this.form.requirements.trim(),
      responsibilities: this.form.responsibilities.trim(),
      benefits: this.form.benefits.trim(),
      minSalary: Number(this.form.minSalary ?? 0),
      maxSalary: Number(this.form.maxSalary ?? 0),
      currencyCode: this.form.currencyCode.trim().toUpperCase(),
      salaryType: this.form.salaryType.trim(),
      vacancyCount: Number(this.form.vacancyCount),
      experienceMinYears: Number(this.form.experienceMinYears),
      publishedAt: new Date(this.form.publishedAt).toISOString(),
      closeAt: new Date(this.form.closeAt).toISOString(),
      isActive: this.form.isActive,
    };
  }

  private findOptionIdByName(options: SelectOption[], name: string): string {
    const normalizedTarget = (name || '').trim().toLowerCase();
    return options.find((item) => item.name.trim().toLowerCase() === normalizedTarget)?.id || '';
  }

  private createInitialForm(): JobFormValue {
    const now = new Date();
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    return {
      categoryId: '',
      employmentTypeId: '',
      statusId: '',
      jobLocationId: '',
      educationLevelId: '',
      departmentId: '',
      workModeId: '',
      title: '',
      slug: '',
      description: '',
      requirements: '',
      responsibilities: '',
      benefits: '',
      minSalary: null,
      maxSalary: null,
      currencyCode: 'IDR',
      salaryType: '',
      vacancyCount: 1,
      experienceMinYears: 0,
      publishedAt: this.toDateTimeLocal(now),
      closeAt: this.toDateTimeLocal(nextMonth),
      isActive: true,
    };
  }

  private resetForm(): void {
    this.errors = {};
    this.form = this.createInitialForm();
    this.isLoading = false;
    this.isSubmitting = false;
    this.detect();
  }

  private toDateTimeLocal(date: Date): string {
    const pad = (value: number) => String(value).padStart(2, '0');

    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }

  private toDateTimeLocalFromUnknown(value: string | null | undefined): string {
    if (!value) return this.toDateTimeLocal(new Date());

    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
      return this.toDateTimeLocal(parsed);
    }

    return this.toDateTimeLocal(new Date());
  }

  private detect(): void {
    this.cdr.detectChanges();
  }
  formatRupiah(value: number | null): string {
    if (value === null || value === undefined) return '';

    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  }

  onSalaryChange(value: string, field: 'minSalary' | 'maxSalary') {
    const numeric = value.replace(/[^\d]/g, '');

    this.form[field] = numeric ? Number(numeric) : null;

    delete this.errors[field];

    this.validateSalaryRelation();
    this.detect();
  }
  private validateSalaryRelation(): void {
    const min = this.form.minSalary;
    const max = this.form.maxSalary;

    if (
      this.errors['maxSalary'] === 'Maksimum gaji harus lebih besar atau sama dengan minimum gaji.'
    ) {
      delete this.errors['maxSalary'];
    }

    if (min !== null && max !== null && max < min) {
      this.errors['maxSalary'] = 'Maksimum gaji harus lebih besar atau sama dengan minimum gaji.';
    }
  }

  onlyNumber(event: KeyboardEvent, field: 'minSalary' | 'maxSalary') {
    const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Home', 'End'];

    if (allowedKeys.includes(event.key)) return;

    if (!/^\d$/.test(event.key)) {
      this.errors[field] = 'Field ini hanya menerima angka 0-9.';
      this.detect();
      event.preventDefault();
      return;
    }

    if (this.errors[field] === 'Field ini hanya menerima angka 0-9.') {
      delete this.errors[field];
      this.detect();
    }
  }

  onPaste(event: ClipboardEvent, field: 'minSalary' | 'maxSalary') {
    const pastedInput = event.clipboardData?.getData('text') || '';

    if (!/^\d+$/.test(pastedInput)) {
      this.errors[field] = 'Paste gagal. Field ini hanya menerima angka tanpa huruf atau simbol.';
      this.detect();
      event.preventDefault();
      return;
    }

    if (
      this.errors[field] === 'Paste gagal. Field ini hanya menerima angka tanpa huruf atau simbol.'
    ) {
      delete this.errors[field];
      this.detect();
    }
  }

  private validateSalaryFields(): void {
    const min = this.form.minSalary;
    const max = this.form.maxSalary;

    delete this.errors['minSalary'];
    delete this.errors['maxSalary'];

    if (min !== null && min < 0) {
      this.errors['minSalary'] = 'Minimum gaji tidak boleh negatif.';
    }

    if (max !== null && max < 0) {
      this.errors['maxSalary'] = 'Maksimum gaji tidak boleh negatif.';
    }

    if (min !== null && max !== null && max < min) {
      this.errors['maxSalary'] = 'Maksimum gaji harus lebih besar atau sama dengan minimum gaji.';
    }
  }
}
