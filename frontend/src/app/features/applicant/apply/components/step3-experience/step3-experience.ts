import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import {
  CertificationPayload,
  LanguagePayload,
  TechnicalSkillPayload,
  WorkExperiencePayload,
} from '../../../../../domain/applicant';
import {
  WorkExperienceSectionComponent,
  WorkExperienceSectionValue,
} from './work-experience/work-experience-section';
import {
  TechnicalSkillSectionComponent,
  TechnicalSkillSectionValue,
} from './technical-skill/technical-skill-section';
import {
  CertificationSectionComponent,
  CertificationSectionValue,
} from './certification/certification-section';

export interface ExperienceInfoPayload {
  hasExperience: boolean;
  experiences: WorkExperiencePayload[];
  currentSalary: string | null;
  technicalSkills: TechnicalSkillPayload[];
  technicalSkillsDescription: string | null;
  certifications: CertificationPayload[];
  languages: LanguagePayload[];
}

export interface FieldError {
  field: string;
  message: string;
}

@Component({
  selector: 'app-step3-experience',
  standalone: true,
  imports: [
    CommonModule,
    WorkExperienceSectionComponent,
    TechnicalSkillSectionComponent,
    CertificationSectionComponent,
  ],
  templateUrl: './step3-experience.html',
})
export class Step3Experience {
  @Input() data!: ExperienceInfoPayload;
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
  @Output() dataChange = new EventEmitter<ExperienceInfoPayload>();

  @ViewChild(WorkExperienceSectionComponent)
  workExperienceSection?: WorkExperienceSectionComponent;

  @ViewChild(TechnicalSkillSectionComponent)
  technicalSkillSection?: TechnicalSkillSectionComponent;

  @ViewChild(CertificationSectionComponent)
  certificationSection?: CertificationSectionComponent;

  onWorkSectionChange(sectionData: WorkExperienceSectionValue): void {
    this.data = {
      ...this.data,
      hasExperience: sectionData.hasExperience,
      experiences: sectionData.experiences,
    };
    this.dataChange.emit(this.data);
  }

  onTechnicalSkillSectionChange(sectionData: TechnicalSkillSectionValue): void {
    this.data = {
      ...this.data,
      technicalSkills: sectionData.technicalSkills,
      technicalSkillsDescription: sectionData.technicalSkillsDescription,
      languages: sectionData.languages,
    };
    this.dataChange.emit(this.data);
  }

  onCertificationSectionChange(sectionData: CertificationSectionValue): void {
    this.data = {
      ...this.data,
      certifications: sectionData.certifications,
    };
    this.dataChange.emit(this.data);
  }

  validate(): FieldError[] {
    const workErrors: FieldError[] = this.workExperienceSection?.validate() || [];
    const skillErrors: FieldError[] = this.technicalSkillSection?.validate() || [];
    const certErrors: FieldError[] = this.certificationSection?.validate() || [];

    return [...workErrors, ...skillErrors, ...certErrors];
  }
}
