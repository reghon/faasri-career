import { Component, Input } from '@angular/core';
import {
  ApplicantProfilePayload,
  CertificationPayload,
  EducationPayload,
  LanguagePayload,
  TechnicalSkillPayload,
  WorkExperiencePayload,
} from '../../../../../domain/applicant';

interface ApplyPersonalInfo extends ApplicantProfilePayload {
  cvUrl: string | null;
  cvFileName: string | null;
}

interface EducationInfoPayload {
  educations: EducationPayload[];
}

interface ExperienceInfoPayload {
  hasExperience: boolean;
  experiences: WorkExperiencePayload[];
  currentSalary: string | null;
  technicalSkills: TechnicalSkillPayload[];
  technicalSkillsDescription: string | null;
  certifications: CertificationPayload[];
  languages: LanguagePayload[];
}

@Component({
  selector: 'app-step4-review',
  standalone: true,
  imports: [],
  templateUrl: './step4-review.html',
})
export class Step4Review {
  @Input() personalInfo!: ApplyPersonalInfo;
  @Input() educationInfo!: EducationInfoPayload;
  @Input() experienceInfo!: ExperienceInfoPayload;

  formatBirthDate(value: string | null): string {
    if (!value) return '-';

    const parts = value.split('-');
    if (parts.length !== 3) return value;

    const [year, month, day] = parts;
    return `${day}-${month}-${year}`;
  }

  formatPhone(code: string | null, phone: string | null): string {
    return [code, phone].filter(Boolean).join(' ') || '-';
  }

  formatEducationPeriod(edu: EducationPayload): string {
    const start = edu.startYear || '-';
    const end = edu.isStillStudying ? 'Sekarang' : edu.endYear || '-';
    return `${start} - ${end}`;
  }

  formatExperiencePeriod(exp: WorkExperiencePayload): string {
    const start = [exp.startMonth, exp.startYear].filter(Boolean).join(' ') || '-';
    const end = exp.isCurrentJob
      ? 'Sekarang'
      : [exp.endMonth, exp.endYear].filter(Boolean).join(' ') || '-';

    return `${start} - ${end}`;
  }

  hasAnyCertification(): boolean {
    return this.experienceInfo?.certifications?.some((cert) => !!cert.name);
  }

  hasAnyLanguage(): boolean {
    return this.experienceInfo?.languages?.some((lang) => !!lang.language);
  }

  trackBySkill(_: number, skill: TechnicalSkillPayload): string {
    return skill.skillName || '';
  }
}
