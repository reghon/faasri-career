import { ChangeDetectorRef, Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { take } from 'rxjs/operators';

import { StepIndicator } from './components/step-indicator/step-indicator';
import {
  Step1Personal,
  mapApplicantProfileToForm,
} from './components/step1-personal/step1-personal';
import {
  Step2Education,
  EducationFormValue,
  createEducationFormValue,
  mapEducationModelsToForm,
} from './components/step2-education/step2-education';
import {
  Step3Experience,
  ExperienceInfoPayload,
} from './components/step3-experience/step3-experience';
import { Step4Review } from './components/step4-review/step4-review';

import { ApplicantMasterService } from '../../../domain/applicant/applicant_master.service';
import {
  ApplicantProfilePayload,
  CertificationPayload,
  EducationPayload,
  LanguagePayload,
  TechnicalSkillPayload,
  WorkExperiencePayload,
} from '../../../domain/applicant';

import {
  createWorkExperienceSectionValue,
  mapWorkExperienceModelsToForm,
} from './components/step3-experience/work-experience/work-experience-section';
import {
  createCertificationSectionValue,
  mapCertificationModelsToForm,
} from './components/step3-experience/certification/certification-section';
import {
  createTechnicalSkillSectionValue,
  mapTechnicalSkillSectionToForm,
} from './components/step3-experience/technical-skill/technical-skill-section';
import { ApplyService } from '../../../domain/apply/apply.service';
import { CreateApplyPayload } from '../../../domain/apply/apply.model';

interface EducationInfoPayload {
  educations: EducationPayload[];
}

export interface ApplyPersonalInfo extends ApplicantProfilePayload {
  cvUrl: string | null;
  cvFileName: string | null;
}

interface ApplicationPayload {
  personalInfo: ApplyPersonalInfo;
  educationInfo: EducationInfoPayload;
  experienceInfo: ExperienceInfoPayload;
}

@Component({
  selector: 'app-apply',
  standalone: true,
  imports: [
    FormsModule,
    StepIndicator,
    Step1Personal,
    Step2Education,
    Step3Experience,
    Step4Review,
  ],
  templateUrl: './apply.html',
})
export class Apply implements OnInit {
  isDirty = false;
  isLoading = false;
  private isInitializing = true;
  isSubmitting = false;

  currentStep = 1;
  totalSteps = 4;
  jobId = '';

  steps = [
    { number: 1, label: 'Informasi Pribadi' },
    { number: 2, label: 'Pendidikan' },
    { number: 3, label: 'Pengalaman' },
    { number: 4, label: 'Tinjauan' },
  ];

  @ViewChild(Step1Personal) step1!: Step1Personal;
  @ViewChild(Step2Education) step2!: Step2Education;
  @ViewChild(Step3Experience) step3!: Step3Experience;

  personalInfo: ApplyPersonalInfo = {
    ...mapApplicantProfileToForm(null),
    cvUrl: null,
    cvFileName: null,
  };

  cvFile: File | null = null;

  educationInfo: EducationFormValue = createEducationFormValue();

  experienceInfo: ExperienceInfoPayload = {
    hasExperience: createWorkExperienceSectionValue().hasExperience,
    experiences: createWorkExperienceSectionValue().experiences,
    currentSalary: null,
    technicalSkills: createTechnicalSkillSectionValue().technicalSkills,
    technicalSkillsDescription: createTechnicalSkillSectionValue().technicalSkillsDescription,
    certifications: createCertificationSectionValue().certifications,
    languages: createTechnicalSkillSectionValue().languages,
  };

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly applicantMasterService: ApplicantMasterService,
    private readonly cdr: ChangeDetectorRef,
    private readonly applyService: ApplyService,
  ) {}

  canDeactivate(): boolean {
    return !this.isDirty;
  }

  @HostListener('window:beforeunload', ['$event'])
  onBeforeUnload(event: BeforeUnloadEvent): void {
    if (this.isDirty) {
      event.preventDefault();
    }
  }

  ngOnInit(): void {
    this.route.params.pipe(take(1)).subscribe((params) => {
      this.jobId = params['id'] ?? '';
      this.loadApplicantMaster();
    });
  }

  private loadApplicantMaster(): void {
    this.isLoading = true;
    this.isInitializing = true;
    this.cdr.detectChanges();

    this.applicantMasterService
      .getMe()
      .pipe(take(1))
      .subscribe({
        next: (master) => {
          const workSection = mapWorkExperienceModelsToForm(master.workExperiences);

          const skillSection = mapTechnicalSkillSectionToForm({
            technicalSkills: master.technicalSkills,
            technicalSkillsDescription: null,
            languages: master.languages,
          });

          const certificationSection = mapCertificationModelsToForm(
            master.certifications as (CertificationPayload & { id?: string })[],
          );

          this.personalInfo = {
            ...mapApplicantProfileToForm(master.applicantProfile),
            cvUrl: master.applicantProfile?.cvUrl || null,
            cvFileName: master.applicantProfile?.cvFileName || null,
          };

          this.cvFile = null;
          this.educationInfo = mapEducationModelsToForm(master.educations);
          this.experienceInfo = {
            hasExperience: workSection.hasExperience,
            experiences: workSection.experiences,
            currentSalary: null,
            technicalSkills: skillSection.technicalSkills,
            technicalSkillsDescription: skillSection.technicalSkillsDescription,
            certifications: certificationSection.certifications,
            languages: skillSection.languages,
          };

          this.isDirty = false;
          this.isLoading = false;
          this.isInitializing = false;
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Failed to load applicant master', error);
          this.isLoading = false;
          this.isInitializing = false;
          this.cdr.detectChanges();
        },
      });
  }

  onPersonalInfoChange(value: ApplicantProfilePayload): void {
    this.personalInfo = {
      ...this.personalInfo,
      ...value,
    };

    if (!this.isInitializing) {
      this.isDirty = true;
    }
  }

  onCvFileChange(file: File | null): void {
    this.cvFile = file;

    if (!this.isInitializing) {
      this.isDirty = true;
    }
  }

  onCvFileNameChange(fileName: string | null): void {
    this.personalInfo = {
      ...this.personalInfo,
      cvFileName: fileName,
      cvUrl: fileName ? this.personalInfo.cvUrl : null,
    };

    if (!this.isInitializing) {
      this.isDirty = true;
    }
  }

  onEducationInfoChange(value: EducationFormValue): void {
    this.educationInfo = value;

    if (!this.isInitializing) {
      this.isDirty = true;
    }
  }

  onExperienceInfoChange(value: ExperienceInfoPayload): void {
    this.experienceInfo = value;

    if (!this.isInitializing) {
      this.isDirty = true;
    }
  }

  nextStep(): void {
    const errors = this.validateCurrentStep();
    if (errors.length > 0) return;

    if (this.currentStep < this.totalSteps) {
      this.currentStep++;

      setTimeout(() => {
        document.documentElement.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
      }, 0);
    }
  }

  prevStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  goToStep(step: number): void {
    if (step < this.currentStep) {
      this.currentStep = step;
    }
  }

  validateCurrentStep(): any[] {
    if (this.currentStep === 1 && this.step1) return this.step1.validate();
    if (this.currentStep === 2 && this.step2) return this.step2.validate();
    if (this.currentStep === 3 && this.step3) return this.step3.validate();
    return [];
  }

  newEducation(): EducationPayload {
    return {
      level: null,
      country: 'Indonesia',
      institution: null,
      major: null,
      isStillStudying: false,
      startDay: null,
      startMonth: null,
      startYear: null,
      endDay: null,
      endMonth: null,
      endYear: null,
      gpa: null,
      gpaScale: null,
    };
  }

  newExperience(): WorkExperiencePayload {
    return {
      company: null,
      industry: null,
      position: null,
      employmentType: null,
      jobLevel: null,
      teamSize: null,
      startDay: null,
      startMonth: null,
      startYear: null,
      endDay: null,
      endMonth: null,
      endYear: null,
      isCurrentJob: false,
      responsibilities: null,
      leaveReason: null,
      referenceName: null,
      referencePosition: null,
      referencePhoneCode: '+62',
      referencePhone: null,
      referenceEmail: null,
    };
  }

  newCertification(): CertificationPayload {
    return {
      name: '',
      issuer: '',
      issuedDay: null,
      issuedMonth: null,
      issuedYear: null,
      expiredDay: null,
      expiredMonth: null,
      expiredYear: null,
    };
  }

  newLanguage(): LanguagePayload {
    return {
      language: null,
      proficiency: null,
    };
  }

  addEducation(): void {
    this.educationInfo.educations.push(this.newEducation());
  }

  removeEducation(index: number): void {
    this.educationInfo.educations.splice(index, 1);
  }

  addExperience(): void {
    this.experienceInfo.experiences.push(this.newExperience());
  }

  removeExperience(index: number): void {
    this.experienceInfo.experiences.splice(index, 1);
  }

  addCertification(): void {
    this.experienceInfo.certifications.push(this.newCertification());
  }

  removeCertification(index: number): void {
    this.experienceInfo.certifications.splice(index, 1);
  }

  addLanguage(): void {
    this.experienceInfo.languages.push(this.newLanguage());
  }

  removeLanguage(index: number): void {
    this.experienceInfo.languages.splice(index, 1);
  }

  toggleSkill(skillName: string): void {
    const index = this.experienceInfo.technicalSkills.findIndex(
      (item) => item.skillName === skillName,
    );

    if (index > -1) {
      this.experienceInfo.technicalSkills.splice(index, 1);
      return;
    }

    this.experienceInfo.technicalSkills.push({ skillName });
  }

  onSkillSelect(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const value = select.value;

    if (value) {
      this.toggleSkill(value);
      select.value = '';
      this.isDirty = true;
    }
  }

  isSkillSelected(skillName: string): boolean {
    return this.experienceInfo.technicalSkills.some((item) => item.skillName === skillName);
  }

  submit(): void {
    const errors = this.validateCurrentStep();
    if (errors.length > 0) return;

    if (!this.jobId || this.isSubmitting) return;

    const payload: CreateApplyPayload = {
      jobId: this.jobId,
      personalInfo: this.normalizePersonalInfo(this.personalInfo),
      educationInfo: this.normalizeEducationInfo(this.educationInfo),
      experienceInfo: this.normalizeExperienceInfo(this.experienceInfo),
    };

    this.isSubmitting = true;
    this.cdr.detectChanges();

    this.applyService
      .create(payload)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.isSubmitting = false;
          this.isDirty = false;
          this.cdr.detectChanges();

          alert('Lamaran berhasil dikirim');
          this.router.navigate(['/apply-history']);
        },
        error: (error) => {
          console.error('Failed to submit apply', error);
          this.isSubmitting = false;
          this.cdr.detectChanges();

          const message = error?.error?.message || error?.message || 'Gagal mengirim lamaran';

          alert(message);
        },
      });
  }

  private normalizePersonalInfo(data: ApplyPersonalInfo): ApplyPersonalInfo {
    return {
      fullName: data.fullName || null,
      email: data.email || null,
      birthPlace: data.birthPlace || null,
      birthDate: data.birthDate || null,
      gender: data.gender || null,
      phoneCode: data.phoneCode || null,
      phone: data.phone || null,
      address: data.address || null,
      kelurahan: data.kelurahan || null,
      kecamatan: data.kecamatan || null,
      city: data.city || null,
      province: data.province || null,
      postalCode: data.postalCode || null,
      linkedinUrl: data.linkedinUrl || null,
      cvUrl: data.cvUrl || null,
      cvFileName: data.cvFileName || null,
    };
  }

  private normalizeEducationInfo(data: EducationInfoPayload): EducationInfoPayload {
    return {
      educations: data.educations.map((item) => ({
        level: item.level || null,
        country: item.country || null,
        institution: item.institution || null,
        major: item.major || null,
        isStillStudying: !!item.isStillStudying,
        startDay: item.startDay || null,
        startMonth: item.startMonth || null,
        startYear: item.startYear || null,
        endDay: item.endDay || null,
        endMonth: item.endMonth || null,
        endYear: item.endYear || null,
        gpa: item.gpa || null,
        gpaScale: item.gpaScale || null,
      })),
    };
  }

  private normalizeExperienceInfo(data: ExperienceInfoPayload): ExperienceInfoPayload {
    return {
      hasExperience: !!data.hasExperience,
      currentSalary: data.currentSalary || null,
      technicalSkillsDescription: data.technicalSkillsDescription || null,
      technicalSkills: data.technicalSkills.map((item) => ({
        skillName: item.skillName || null,
      })),
      certifications: data.certifications.map((item) => ({
        name: item.name || '',
        issuer: item.issuer || '',
        issuedDay: item.issuedDay || null,
        issuedMonth: item.issuedMonth || null,
        issuedYear: item.issuedYear || null,
        expiredDay: item.expiredDay || null,
        expiredMonth: item.expiredMonth || null,
        expiredYear: item.expiredYear || null,
      })),
      languages: data.languages.map((item) => ({
        language: item.language || null,
        proficiency: item.proficiency || null,
      })),
      experiences: data.experiences.map((item) => ({
        company: item.company || null,
        industry: item.industry || null,
        position: item.position || null,
        employmentType: item.employmentType || null,
        jobLevel: item.jobLevel || null,
        teamSize: item.teamSize || null,
        startDay: item.startDay || null,
        startMonth: item.startMonth || null,
        startYear: item.startYear || null,
        endDay: item.endDay || null,
        endMonth: item.endMonth || null,
        endYear: item.endYear || null,
        isCurrentJob: !!item.isCurrentJob,
        responsibilities: item.responsibilities || null,
        leaveReason: item.leaveReason || null,
        referenceName: item.referenceName || null,
        referencePosition: item.referencePosition || null,
        referencePhoneCode: item.referencePhoneCode || null,
        referencePhone: item.referencePhone || null,
        referenceEmail: item.referenceEmail || null,
      })),
    };
  }
}
