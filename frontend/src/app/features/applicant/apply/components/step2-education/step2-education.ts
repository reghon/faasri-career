import { Component, Input, Output, EventEmitter, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmModal } from '../../../../../shared/components/confirm-modal/confirm-modal';
import { EducationPayload } from '../../../../../domain/applicant/education/education.model';
import {
  FieldError,
  ErrorMap,
  checkError,
  scrollToFirstError,
  MONTHS,
  DAYS,
  YEARS,
} from '../../../../../shared/utils';

export interface EducationFormItem extends EducationPayload {
  id?: string;
}

export interface EducationFormValue {
  educations: EducationFormItem[];
}

export const EDUCATION_LEVELS: string[] = ['SMA/SMK', 'D1', 'D2', 'D3', 'D4', 'S1', 'S2', 'S3'];

export function createEducationFormItem(): EducationFormItem {
  return {
    level: '',
    country: 'Indonesia',
    institution: '',
    major: '',
    isStillStudying: false,
    startDay: '',
    startMonth: '',
    startYear: '',
    endDay: '',
    endMonth: '',
    endYear: '',
    gpa: '',
    gpaScale: '',
  };
}

export function createEducationFormValue(): EducationFormValue {
  return {
    educations: [createEducationFormItem()],
  };
}

export function mapEducationModelsToForm(
  educations: Array<EducationPayload & { id?: string }> | null | undefined,
): EducationFormValue {
  if (!educations || educations.length === 0) {
    return createEducationFormValue();
  }

  return {
    educations: educations.map((edu) => ({
      id: edu.id,
      level: edu.level || '',
      country: edu.country || 'Indonesia',
      institution: edu.institution || '',
      major: edu.major || '',
      isStillStudying: !!edu.isStillStudying,
      startDay: edu.startDay || '',
      startMonth: edu.startMonth || '',
      startYear: edu.startYear || '',
      endDay: edu.endDay || '',
      endMonth: edu.endMonth || '',
      endYear: edu.endYear || '',
      gpa: edu.gpa || '',
      gpaScale: edu.gpaScale || '',
    })),
  };
}

export function normalizeEducationFormItem(edu: EducationFormItem): EducationFormItem {
  return {
    id: edu.id,
    level: edu.level || null,
    country: edu.country || null,
    institution: edu.institution || null,
    major: edu.major || null,
    isStillStudying: !!edu.isStillStudying,
    startDay: edu.startDay || null,
    startMonth: edu.startMonth || null,
    startYear: edu.startYear || null,
    endDay: edu.isStillStudying ? null : edu.endDay || null,
    endMonth: edu.isStillStudying ? null : edu.endMonth || null,
    endYear: edu.isStillStudying ? null : edu.endYear || null,
    gpa: edu.gpa || null,
    gpaScale: edu.gpaScale || null,
  };
}

export function normalizeEducationFormValue(data: EducationFormValue): EducationFormValue {
  return {
    educations: data.educations.map((edu) => normalizeEducationFormItem(edu)),
  };
}

@Component({
  selector: 'app-step2-education',
  standalone: true,
  imports: [FormsModule, ConfirmModal],
  templateUrl: './step2-education.html',
})
export class Step2Education {
  @Input() data!: EducationFormValue;
  @Output() dataChange = new EventEmitter<EducationFormValue>();

  errors: ErrorMap = {};
  showDeleteModal = false;
  deleteIndex = -1;

  readonly months = MONTHS;
  readonly days = DAYS;
  readonly years = YEARS;
  readonly educationLevels = EDUCATION_LEVELS;

  constructor(private readonly el: ElementRef) {}

  onChange(field?: string): void {
    if (field) this.clearError(field);
    this.dataChange.emit(this.data);
  }

  clearError(field: string): void {
    delete this.errors[field];
  }

  hasError(field: string): boolean {
    return !!this.errors[field];
  }

  getError(field: string): string {
    return this.errors[field] || '';
  }

  addEducation(): void {
    this.data.educations.push(createEducationFormItem());
    this.onChange();
  }

  confirmRemoveEducation(index: number): void {
    this.deleteIndex = index;
    this.showDeleteModal = true;
  }

  onConfirmDelete(): void {
    if (this.deleteIndex < 0 || this.deleteIndex >= this.data.educations.length) return;

    this.data.educations.splice(this.deleteIndex, 1);
    this.showDeleteModal = false;
    this.deleteIndex = -1;
    this.onChange();
  }

  onCancelDelete(): void {
    this.showDeleteModal = false;
    this.deleteIndex = -1;
  }

  validate(): FieldError[] {
    this.errors = {};
    const errs: FieldError[] = [];

    const check = (condition: boolean, field: string, message: string) =>
      checkError(this.errors, errs, condition, field, message);

    this.data.educations.forEach((edu, i) => {
      check(!edu.level, `edu-${i}-level`, 'Tingkat pendidikan wajib dipilih');
      check(!edu.country, `edu-${i}-country`, 'Negara tempat studi wajib dipilih');
      check(!edu.institution, `edu-${i}-institution`, 'Nama institusi wajib diisi');
      check(!edu.major, `edu-${i}-major`, 'Jurusan wajib diisi');
      check(
        !edu.startDay || !edu.startMonth || !edu.startYear,
        `edu-${i}-start`,
        'Tanggal mulai wajib diisi lengkap',
      );
      check(
        !edu.isStillStudying && (!edu.endDay || !edu.endMonth || !edu.endYear),
        `edu-${i}-end`,
        'Tanggal selesai wajib diisi lengkap',
      );
      check(!edu.gpa, `edu-${i}-gpa`, 'Nilai akhir wajib diisi');
      check(!edu.gpaScale, `edu-${i}-gpaScale`, 'Skala nilai wajib diisi');

      const gpa = Number(edu.gpa);
      const gpaScale = Number(edu.gpaScale);
      check(!!edu.gpa && Number.isNaN(gpa), `edu-${i}-gpa`, 'Nilai akhir harus berupa angka');
      check(
        !!edu.gpaScale && Number.isNaN(gpaScale),
        `edu-${i}-gpaScale`,
        'Skala nilai harus berupa angka',
      );
      check(
        !!edu.gpa &&
          !!edu.gpaScale &&
          !Number.isNaN(gpa) &&
          !Number.isNaN(gpaScale) &&
          gpa > gpaScale,
        `edu-${i}-gpa`,
        'Nilai akhir tidak boleh lebih besar dari skala',
      );

      const startDate = this.toComparableDate(edu.startDay, edu.startMonth, edu.startYear);
      const endDate = this.toComparableDate(edu.endDay, edu.endMonth, edu.endYear);
      check(
        !edu.isStillStudying && startDate !== null && endDate !== null && endDate < startDate,
        `edu-${i}-end`,
        'Tanggal selesai tidak boleh lebih awal dari tanggal mulai',
      );
    });

    if (errs.length > 0) {
      scrollToFirstError(this.el, errs[0].field);
    }

    return errs;
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
}
