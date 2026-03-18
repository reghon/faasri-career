import { Component, Input, Output, EventEmitter, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EducationInfo, Education } from '../../../../../core/mock/application.mock';
import { ConfirmModal } from '../../../../../shared/components/confirm-modal/confirm-modal';

export interface FieldError {
  field: string;
  message: string;
}

@Component({
  selector: 'app-step2-education',
  standalone: true,
  imports: [FormsModule, ConfirmModal],
  templateUrl: './step2-education.html',
})
export class Step2Education {
  @Input() data!: EducationInfo;
  @Input() months: string[] = [];
  @Input() days: string[] = [];
  @Input() years: string[] = [];
  @Input() educationLevels: string[] = [];
  @Output() dataChange = new EventEmitter<EducationInfo>();

  errors: Record<string, string> = {};

  constructor(private el: ElementRef) {}
  showDeleteModal = false;
  deleteIndex = -1;

  onConfirmDelete() {
    this.data.educations.splice(this.deleteIndex, 1);
    this.showDeleteModal = false;
    this.deleteIndex = -1;
    this.onChange();
  }

  onCancelDelete() {
    this.showDeleteModal = false;
    this.deleteIndex = -1;
  }
  onChange() {
    this.dataChange.emit(this.data);
  }

  clearError(field: string) {
    delete this.errors[field];
  }

  hasError(field: string): boolean {
    return !!this.errors[field];
  }

  getError(field: string): string {
    return this.errors[field] || '';
  }

  newEducation(): Education {
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

  addEducation() {
    this.data.educations.push(this.newEducation());
    this.onChange();
  }

  confirmRemoveEducation(i: number) {
    this.deleteIndex = i;
    this.showDeleteModal = true;
  }
  validate(): FieldError[] {
    this.errors = {};
    const errs: FieldError[] = [];

    this.data.educations.forEach((edu, i) => {
      const check = (condition: boolean, field: string, message: string) => {
        if (condition) {
          this.errors[field] = message;
          errs.push({ field, message });
        }
      };

      check(!edu.level, `edu-${i}-level`, ` Tingkat pendidikan wajib dipilih`);
      check(!edu.institution, `edu-${i}-institution`, ` Nama institusi wajib diisi`);
      check(!edu.major, `edu-${i}-major`, ` Jurusan wajib diisi`);
      check(!edu.startMonth || !edu.startYear, `edu-${i}-start`, ` Tanggal mulai wajib diisi`);
      check(
        !edu.isStillStudying && (!edu.endMonth || !edu.endYear),
        `edu-${i}-end`,
        ` Tanggal selesai wajib diisi`,
      );
      check(!edu.gpa, `edu-${i}-gpa`, `Nilai akhir wajib diisi`);
      check(!edu.gpaScale, `edu-${i}-gpaScale`, `Skala nilai wajib diisi`);
      check(
        !!edu.gpa && !!edu.gpaScale && parseFloat(edu.gpa) > parseFloat(edu.gpaScale),
        `edu-${i}-gpa`,
        `Nilai akhir tidak boleh lebih besar dari skala`,
      );
    });

    if (errs.length > 0) this.scrollToFirstError(errs[0].field);
    return errs;
  }

  scrollToFirstError(field: string) {
    setTimeout(() => {
      const el = this.el.nativeElement.querySelector(`[data-field="${field}"]`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  }
}
