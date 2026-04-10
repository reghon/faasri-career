import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmModal } from '../../../../../../shared/components/confirm-modal/confirm-modal';
import { WorkExperience, WorkExperiencePayload } from '../../../../../../domain/applicant';
import {
  FieldError,
  ErrorMap,
  checkError,
  scrollToFirstError,
  MONTHS,
  DAYS,
  YEARS,
} from '../../../../../../shared/utils';

export interface WorkExperienceFormItem extends WorkExperiencePayload {
  id?: string;
}

export interface WorkExperienceSectionValue {
  hasExperience: boolean;
  experiences: WorkExperienceFormItem[];
}

export const WORK_EXPERIENCE_PHONE_CODES = ['+62', '+60', '+65', '+1', '+44', '+81', '+86'];

export const WORK_EXPERIENCE_INDUSTRIES = [
  'Teknologi Informasi',
  'Pendidikan',
  'Keuangan',
  'Perbankan',
  'Asuransi',
  'Kesehatan',
  'Manufaktur',
  'Ritel',
  'Logistik',
  'Telekomunikasi',
  'Konstruksi',
  'Konsultan',
  'Media',
  'Pemerintahan',
  'Lainnya',
];

export const WORK_EXPERIENCE_EMPLOYMENT_TYPES = [
  'Full-time',
  'Part-time',
  'Contract',
  'Internship',
  'Freelance',
  'Temporary',
];

export const WORK_EXPERIENCE_JOB_LEVELS = [
  'Staff',
  'Senior Staff',
  'Supervisor',
  'Assistant Manager',
  'Manager',
  'Senior Manager',
  'Head',
  'Director',
];

export const WORK_EXPERIENCE_LEAVE_REASONS = [
  'Kontrak selesai',
  'Mengundurkan diri',
  'PHK',
  'Pindah domisili',
  'Melanjutkan pendidikan',
  'Alasan pribadi',
  'Lainnya',
];

export function createWorkExperienceItem(): WorkExperienceFormItem {
  return {
    company: '',
    industry: '',
    position: '',
    employmentType: '',
    jobLevel: '',
    teamSize: '',
    startDay: '',
    startMonth: '',
    startYear: '',
    endDay: '',
    endMonth: '',
    endYear: '',
    isCurrentJob: false,
    responsibilities: '',
    leaveReason: '',
    referenceName: '',
    referencePosition: '',
    referencePhoneCode: '+62',
    referencePhone: '',
    referenceEmail: '',
  };
}

export function createWorkExperienceSectionValue(): WorkExperienceSectionValue {
  return {
    hasExperience: true,
    experiences: [createWorkExperienceItem()],
  };
}

export function normalizeText(value: string | null | undefined): string | null {
  const result = (value ?? '').trim();
  return result ? result : null;
}

export function normalizeDigits(value: string | null | undefined): string | null {
  const result = (value ?? '').replace(/\D/g, '');
  return result ? result : null;
}

export function normalizeEmail(value: string | null | undefined): string | null {
  const result = (value ?? '').trim().toLowerCase();
  return result ? result : null;
}

export function normalizeWorkExperienceItem(exp: WorkExperienceFormItem): WorkExperienceFormItem {
  const isCurrentJob = !!exp.isCurrentJob;

  return {
    id: exp.id,
    company: normalizeText(exp.company),
    industry: normalizeText(exp.industry),
    position: normalizeText(exp.position),
    employmentType: normalizeText(exp.employmentType),
    jobLevel: normalizeText(exp.jobLevel),
    teamSize: normalizeDigits(exp.teamSize),
    startDay: normalizeText(exp.startDay),
    startMonth: normalizeText(exp.startMonth),
    startYear: normalizeText(exp.startYear),
    endDay: isCurrentJob ? null : normalizeText(exp.endDay),
    endMonth: isCurrentJob ? null : normalizeText(exp.endMonth),
    endYear: isCurrentJob ? null : normalizeText(exp.endYear),
    isCurrentJob,
    responsibilities: normalizeText(exp.responsibilities),
    leaveReason: isCurrentJob ? null : normalizeText(exp.leaveReason),
    referenceName: normalizeText(exp.referenceName),
    referencePosition: normalizeText(exp.referencePosition),
    referencePhoneCode: normalizeText(exp.referencePhoneCode) || '+62',
    referencePhone: normalizeDigits(exp.referencePhone),
    referenceEmail: normalizeEmail(exp.referenceEmail),
  };
}

export function normalizeWorkExperienceSectionValue(
  data: WorkExperienceSectionValue,
): WorkExperienceSectionValue {
  const hasExperience = !!data?.hasExperience;
  const experiences = (data?.experiences ?? []).map(normalizeWorkExperienceItem);

  return {
    hasExperience,
    experiences: hasExperience
      ? experiences.length > 0
        ? experiences
        : [createWorkExperienceItem()]
      : [createWorkExperienceItem()],
  };
}

export function mapWorkExperienceModelsToForm(
  data: WorkExperience[] | null,
): WorkExperienceSectionValue {
  if (!data || data.length === 0) {
    return createWorkExperienceSectionValue();
  }

  return {
    hasExperience: true,
    experiences: data.map((item) => ({
      id: item.id,
      company: item.company || '',
      industry: item.industry || '',
      position: item.position || '',
      employmentType: item.employmentType || '',
      jobLevel: item.jobLevel || '',
      teamSize: item.teamSize || '',
      startDay: item.startDay || '',
      startMonth: item.startMonth || '',
      startYear: item.startYear || '',
      endDay: item.endDay || '',
      endMonth: item.endMonth || '',
      endYear: item.endYear || '',
      isCurrentJob: !!item.isCurrentJob,
      responsibilities: item.responsibilities || '',
      leaveReason: item.leaveReason || '',
      referenceName: item.referenceName || '',
      referencePosition: item.referencePosition || '',
      referencePhoneCode: item.referencePhoneCode || '+62',
      referencePhone: item.referencePhone || '',
      referenceEmail: item.referenceEmail || '',
    })),
  };
}

export function toWorkExperiencePayload(item: WorkExperienceFormItem): WorkExperiencePayload {
  const normalized = normalizeWorkExperienceItem(item);

  return {
    company: normalized.company,
    industry: normalized.industry,
    position: normalized.position,
    employmentType: normalized.employmentType,
    jobLevel: normalized.jobLevel,
    teamSize: normalized.teamSize,
    startDay: normalized.startDay,
    startMonth: normalized.startMonth,
    startYear: normalized.startYear,
    endDay: normalized.endDay,
    endMonth: normalized.endMonth,
    endYear: normalized.endYear,
    isCurrentJob: !!normalized.isCurrentJob,
    responsibilities: normalized.responsibilities,
    leaveReason: normalized.leaveReason,
    referenceName: normalized.referenceName,
    referencePosition: normalized.referencePosition,
    referencePhoneCode: normalized.referencePhoneCode,
    referencePhone: normalized.referencePhone,
    referenceEmail: normalized.referenceEmail,
  };
}

export function isSameWorkExperiencePayload(
  a: WorkExperiencePayload,
  b: WorkExperiencePayload,
): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

@Component({
  selector: 'app-work-experience-section',
  standalone: true,
  imports: [FormsModule, ConfirmModal],
  templateUrl: './work-experience-section.html',
})
export class WorkExperienceSectionComponent implements OnInit, OnChanges {
  @Input() data!: WorkExperienceSectionValue;
  @Input() phoneCodes: string[] = WORK_EXPERIENCE_PHONE_CODES;
  @Input() industries: string[] = WORK_EXPERIENCE_INDUSTRIES;
  @Input() employmentTypes: string[] = WORK_EXPERIENCE_EMPLOYMENT_TYPES;
  @Input() jobLevels: string[] = WORK_EXPERIENCE_JOB_LEVELS;
  @Input() leaveReasons: string[] = WORK_EXPERIENCE_LEAVE_REASONS;
  @Output() dataChange = new EventEmitter<WorkExperienceSectionValue>();

  errors: ErrorMap = {};
  showDeleteExpModal = false;
  deleteExpIndex = -1;

  readonly months = MONTHS;
  readonly days = DAYS;
  readonly years = YEARS;

  constructor(private readonly el: ElementRef) {}

  ngOnInit(): void {
    this.syncDisplayValuesFromData();
  }

  ngOnChanges(): void {
    this.syncDisplayValuesFromData();
  }

  private syncDisplayValuesFromData(): void {
    this.data = this.mapIncomingDataToForm(this.data);
  }

  private mapIncomingDataToForm(
    data: WorkExperienceSectionValue | null | undefined,
  ): WorkExperienceSectionValue {
    if (!data) {
      return createWorkExperienceSectionValue();
    }

    return {
      hasExperience: !!data.hasExperience,
      experiences:
        data.experiences && data.experiences.length > 0
          ? data.experiences.map((exp) => ({
              id: exp.id,
              company: exp.company || '',
              industry: exp.industry || '',
              position: exp.position || '',
              employmentType: exp.employmentType || '',
              jobLevel: exp.jobLevel || '',
              teamSize: exp.teamSize || '',
              startDay: exp.startDay || '',
              startMonth: exp.startMonth || '',
              startYear: exp.startYear || '',
              endDay: exp.endDay || '',
              endMonth: exp.endMonth || '',
              endYear: exp.endYear || '',
              isCurrentJob: !!exp.isCurrentJob,
              responsibilities: exp.responsibilities || '',
              leaveReason: exp.leaveReason || '',
              referenceName: exp.referenceName || '',
              referencePosition: exp.referencePosition || '',
              referencePhoneCode: exp.referencePhoneCode || '+62',
              referencePhone: exp.referencePhone || '',
              referenceEmail: exp.referenceEmail || '',
            }))
          : [createWorkExperienceItem()],
    };
  }

  onChange(field?: string): void {
    if (field) this.clearError(field);
    this.dataChange.emit(this.data);
  }

  onHasExperienceChange(value: boolean): void {
    this.data.hasExperience = value;

    if (!value) {
      this.data.experiences = [createWorkExperienceItem()];
      this.clearExperienceErrors();
    } else if (!this.data.experiences.length) {
      this.data.experiences = [createWorkExperienceItem()];
    }

    this.onChange();
  }

  onReferencePhoneInput(index: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    const digits = this.onlyDigits(input.value);

    this.data.experiences[index].referencePhone = digits;
    input.value = digits;
    this.onChange(`exp-${index}-referencePhone`);
  }

  onTeamSizeInput(index: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    const digits = this.onlyDigits(input.value);

    this.data.experiences[index].teamSize = digits;
    input.value = digits;
    this.onChange(`exp-${index}-teamSize`);
  }

  onCurrentJobChange(index: number): void {
    const exp = this.data.experiences[index];

    if (exp.isCurrentJob) {
      exp.endDay = '';
      exp.endMonth = '';
      exp.endYear = '';
      exp.leaveReason = '';

      this.clearMultipleErrors([`exp-${index}-end`, `exp-${index}-leaveReason`]);
    }

    this.onChange();
  }

  clearExperienceErrors(): void {
    Object.keys(this.errors).forEach((key) => {
      if (key.startsWith('exp-')) {
        delete this.errors[key];
      }
    });
  }

  clearError(field: string): void {
    delete this.errors[field];
  }

  clearMultipleErrors(fields: string[]): void {
    fields.forEach((field) => delete this.errors[field]);
  }

  hasError(field: string): boolean {
    return !!this.errors[field];
  }

  getError(field: string): string {
    return this.errors[field] || '';
  }

  addExperience(): void {
    this.data.experiences.push(createWorkExperienceItem());
    this.onChange();
  }

  confirmRemoveExperience(index: number): void {
    this.deleteExpIndex = index;
    this.showDeleteExpModal = true;
  }

  onConfirmDeleteExp(): void {
    if (this.deleteExpIndex < 0 || this.deleteExpIndex >= this.data.experiences.length) return;

    this.data.experiences.splice(this.deleteExpIndex, 1);

    if (this.data.experiences.length === 0) {
      this.data.experiences = [createWorkExperienceItem()];
    }

    this.rebuildExperienceErrorsAfterDelete(this.deleteExpIndex);

    this.showDeleteExpModal = false;
    this.deleteExpIndex = -1;
    this.onChange();
  }

  onCancelDeleteExp(): void {
    this.showDeleteExpModal = false;
    this.deleteExpIndex = -1;
  }

  private rebuildExperienceErrorsAfterDelete(deletedIndex: number): void {
    const nextErrors: ErrorMap = {};

    Object.entries(this.errors).forEach(([field, message]) => {
      const match = field.match(/^exp-(\d+)-(.*)$/);

      if (!match) {
        nextErrors[field] = message;
        return;
      }

      const currentIndex = Number(match[1]);
      const suffix = match[2];

      if (currentIndex < deletedIndex) {
        nextErrors[field] = message;
        return;
      }

      if (currentIndex > deletedIndex) {
        nextErrors[`exp-${currentIndex - 1}-${suffix}`] = message;
      }
    });

    this.errors = nextErrors;
  }

  private onlyDigits(value: string | null | undefined): string {
    return (value ?? '').replace(/\D/g, '');
  }

  private isAnyReferenceFilled(exp: WorkExperienceFormItem): boolean {
    return !!(
      (exp.referenceName || '').trim() ||
      (exp.referencePosition || '').trim() ||
      (exp.referencePhone || '').trim() ||
      (exp.referenceEmail || '').trim()
    );
  }

  private isValidEmail(email: string | null | undefined): boolean {
    if (!email) return true;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  private toComparableDate(
    day?: string | null,
    month?: string | null,
    year?: string | null,
  ): number | null {
    if (!day || !month || !year) return null;

    const parsedDay = Number(day);
    const parsedMonth = Number(month);
    const parsedYear = Number(year);

    if (Number.isNaN(parsedDay) || Number.isNaN(parsedMonth) || Number.isNaN(parsedYear)) {
      return null;
    }

    const date = new Date(parsedYear, parsedMonth - 1, parsedDay);

    if (
      date.getFullYear() !== parsedYear ||
      date.getMonth() !== parsedMonth - 1 ||
      date.getDate() !== parsedDay
    ) {
      return null;
    }

    return date.getTime();
  }

  validate(): FieldError[] {
    this.errors = {};
    const errs: FieldError[] = [];

    const check = (condition: boolean, field: string, message: string) =>
      checkError(this.errors, errs, condition, field, message);

    if (this.data.hasExperience) {
      this.data.experiences.forEach((exp, i) => {
        check(!exp.company, `exp-${i}-company`, 'Nama perusahaan wajib diisi');
        check(!exp.industry, `exp-${i}-industry`, 'Industri wajib dipilih');
        check(!exp.position, `exp-${i}-position`, 'Jabatan wajib diisi');
        check(!exp.employmentType, `exp-${i}-employmentType`, 'Tipe kepegawaian wajib dipilih');
        check(!exp.teamSize, `exp-${i}-teamSize`, 'Jumlah anggota tim wajib diisi');
        check(
          !!exp.teamSize && !/^\d+$/.test(exp.teamSize),
          `exp-${i}-teamSize`,
          'Jumlah anggota tim harus berupa angka',
        );

        check(
          !exp.startDay || !exp.startMonth || !exp.startYear,
          `exp-${i}-start`,
          'Tanggal mulai wajib diisi lengkap',
        );

        const startDate = this.toComparableDate(exp.startDay, exp.startMonth, exp.startYear);
        check(
          !!exp.startDay && !!exp.startMonth && !!exp.startYear && startDate === null,
          `exp-${i}-start`,
          'Tanggal mulai tidak valid',
        );

        if (!exp.isCurrentJob) {
          check(
            !exp.endDay || !exp.endMonth || !exp.endYear,
            `exp-${i}-end`,
            'Tanggal selesai wajib diisi lengkap',
          );

          const endDate = this.toComparableDate(exp.endDay, exp.endMonth, exp.endYear);
          check(
            !!exp.endDay && !!exp.endMonth && !!exp.endYear && endDate === null,
            `exp-${i}-end`,
            'Tanggal selesai tidak valid',
          );

          check(
            startDate !== null && endDate !== null && endDate < startDate,
            `exp-${i}-end`,
            'Tanggal selesai tidak boleh lebih awal dari tanggal mulai',
          );

          check(!exp.leaveReason, `exp-${i}-leaveReason`, 'Alasan keluar wajib dipilih');
        }

        check(!exp.responsibilities, `exp-${i}-responsibilities`, 'Tanggung jawab wajib diisi');

        const hasReference = this.isAnyReferenceFilled(exp);

        if (hasReference) {
          check(!exp.referenceName, `exp-${i}-referenceName`, 'Nama referensi wajib diisi');
          check(
            !exp.referencePosition,
            `exp-${i}-referencePosition`,
            'Jabatan referensi wajib diisi',
          );
          check(
            !exp.referencePhone,
            `exp-${i}-referencePhone`,
            'Nomor telepon referensi wajib diisi',
          );
          check(
            !!exp.referenceEmail && !this.isValidEmail(exp.referenceEmail),
            `exp-${i}-referenceEmail`,
            'Format email referensi tidak valid',
          );
        }
      });
    }

    if (errs.length > 0) {
      scrollToFirstError(this.el, errs[0].field);
    }

    return errs;
  }
}
