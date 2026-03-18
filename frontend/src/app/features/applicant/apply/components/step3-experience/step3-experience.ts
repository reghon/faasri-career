import { Component, Input, Output, EventEmitter, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  ExperienceInfo,
  WorkExperience,
  Certification,
  Language,
} from '../../../../../core/mock/application.mock';
import { ConfirmModal } from '../../../../../shared/components/confirm-modal/confirm-modal';

export interface FieldError {
  field: string;
  message: string;
}

@Component({
  selector: 'app-step3-experience',
  standalone: true,
  imports: [FormsModule, ConfirmModal],
  templateUrl: './step3-experience.html',
})
export class Step3Experience {
  @Input() data!: ExperienceInfo;
  @Input() months: string[] = [];
  @Input() days: string[] = [];
  @Input() years: string[] = [];
  @Input() phoneCodes: string[] = [];
  @Input() industries: string[] = [];
  @Input() employmentTypes: string[] = [];
  @Input() jobLevels: string[] = [];
  @Input() leaveReasons: string[] = [];
  @Input() technicalSkillOptions: string[] = [];
  @Input() languageOptions: string[] = [];
  @Input() proficiencyOptions: string[] = [];
  @Output() dataChange = new EventEmitter<ExperienceInfo>();

  errors: Record<string, string> = {};

  constructor(private el: ElementRef) {}
  showDeleteExpModal = false;
  showDeleteCertModal = false;
  deleteExpIndex = -1;
  deleteCertIndex = -1;
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

  newExperience(): WorkExperience {
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

  newCertification(): Certification {
    return {
      name: '',
      issuer: '',
      issuedDay: '',
      issuedMonth: '',
      issuedYear: '',
      expiredDay: '',
      expiredMonth: '',
      expiredYear: '',
    };
  }

  newLanguage(): Language {
    return { language: '', proficiency: '' };
  }

  addExperience() {
    this.data.experiences.push(this.newExperience());
    this.onChange();
  }

  addCertification() {
    this.data.certifications.push(this.newCertification());
    this.onChange();
  }

  addLanguage() {
    this.data.languages.push(this.newLanguage());
    this.onChange();
  }
  removeLanguage(i: number) {
    this.data.languages.splice(i, 1);
    this.onChange();
  }

  onSkillSelect(event: Event) {
    const select = event.target as HTMLSelectElement;
    const value = select.value;
    if (value) {
      this.toggleSkill(value);
      select.value = '';
    }
  }
  confirmRemoveExperience(i: number) {
    this.deleteExpIndex = i;
    this.showDeleteExpModal = true;
  }

  onConfirmDeleteExp() {
    this.data.experiences.splice(this.deleteExpIndex, 1);
    this.showDeleteExpModal = false;
    this.deleteExpIndex = -1;
    this.onChange();
  }

  onCancelDeleteExp() {
    this.showDeleteExpModal = false;
    this.deleteExpIndex = -1;
  }

  confirmRemoveCertification(i: number) {
    this.deleteCertIndex = i;
    this.showDeleteCertModal = true;
  }

  onConfirmDeleteCert() {
    this.data.certifications.splice(this.deleteCertIndex, 1);
    this.showDeleteCertModal = false;
    this.deleteCertIndex = -1;
    this.onChange();
  }

  onCancelDeleteCert() {
    this.showDeleteCertModal = false;
    this.deleteCertIndex = -1;
  }

  toggleSkill(skill: string) {
    const idx = this.data.technicalSkills.indexOf(skill);
    if (idx > -1) this.data.technicalSkills.splice(idx, 1);
    else this.data.technicalSkills.push(skill);
    this.clearError('skills');
    this.onChange();
  }

  validate(): FieldError[] {
    this.errors = {};
    const errs: FieldError[] = [];

    const check = (condition: boolean, field: string, message: string) => {
      if (condition) {
        this.errors[field] = message;
        errs.push({ field, message });
      }
    };

    if (this.data.hasExperience) {
      this.data.experiences.forEach((exp, i) => {
        check(!exp.company, `exp-${i}-company`, `=Nama perusahaan wajib diisi`);
        check(!exp.industry, `exp-${i}-industry`, `=Industri wajib dipilih`);
        check(!exp.position, `exp-${i}-position`, `=Jabatan wajib diisi`);
        check(!exp.employmentType, `exp-${i}-employmentType`, ` Tipe kepegawaian wajib dipilih`);
        check(!exp.jobLevel, `exp-${i}-jobLevel`, ` Tingkat jabatan wajib dipilih`);
        check(!exp.teamSize, `exp-${i}-teamSize`, ` Jumlah anggota tim wajib diisi`);
        check(!exp.startMonth || !exp.startYear, `exp-${i}-start`, ` Tanggal mulai wajib diisi`);
        check(!exp.endMonth || !exp.endYear, `exp-${i}-end`, ` Tanggal selesai wajib diisi`);
        check(!exp.responsibilities, `exp-${i}-responsibilities`, ` Tanggungjawab wajib diisi`);
        check(!exp.leaveReason, `exp-${i}-leaveReason`, ` Alasan keluar wajib dipilih`);
      });
    }

    check(this.data.technicalSkills.length === 0, 'skills', 'Minimal pilih 1 keterampilan teknis');
    check(
      this.data.languages.every((l) => !l.language),
      'languages',
      'Minimal isi 1 bahasa yang dikuasai',
    );
    check(!this.data.currentSalary, 'currentSalary', 'Gaji pokok saat ini wajib diisi');
    check(
      this.data.languages.some((l) => l.language && !l.proficiency),
      'languages',
      'Tingkat kemahiran bahasa wajib diisi',
    );

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
