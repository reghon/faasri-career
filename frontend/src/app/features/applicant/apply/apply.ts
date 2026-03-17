import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApplicationService } from '../../../core/services/application';
import { StepIndicator } from './components/step-indicator/step-indicator';
import { Step1Personal } from './components/step1-personal/step1-personal';
import { Step2Education } from './components/step2-education/step2-education';
import { Step3Experience } from './components/step3-experience/step3-experience';
import { Step4Review } from './components/step4-review/step4-review';
import { HostListener } from '@angular/core';

import {
  ApplicationForm,
  PersonalInfo,
  EducationInfo,
  ExperienceInfo,
  Education,
  WorkExperience,
  Certification,
  Language,
} from '../../../core/mock/application.mock';

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

  canDeactivate(): boolean {
    return !this.isDirty;
  }

  @HostListener('window:beforeunload', ['$event'])
  onBeforeUnload(event: BeforeUnloadEvent) {
    if (this.isDirty) {
      event.preventDefault();
    }
  }
  currentStep = 1;
  totalSteps = 4;
  jobId = '';
  @ViewChild(Step1Personal) step1!: Step1Personal;
  @ViewChild(Step2Education) step2!: Step2Education;
  @ViewChild(Step3Experience) step3!: Step3Experience;
  // Dropdown options
  months = [
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember',
  ];
  days = Array.from({ length: 31 }, (_, i) => (i + 1).toString());
  years = Array.from({ length: 50 }, (_, i) => (new Date().getFullYear() - i).toString());
  phoneCodes = ['+62', '+1', '+44', '+65', '+60'];
  jobSources = ['LinkedIn', 'Instagram', 'Website Faasri', 'Referral', 'Job Fair', 'Lainnya'];
  educationLevels = ['SMA/SMK', 'D1', 'D2', 'D3', 'D4', 'S1', 'S2', 'S3'];
  industries = [
    'Teknologi',
    'Keuangan',
    'Pemasaran',
    'Operasional',
    'SDM',
    'Pendidikan',
    'Kesehatan',
    'Lainnya',
  ];
  employmentTypes = ['Full Time', 'Part Time', 'Contract', 'Freelance', 'Internship'];
  jobLevels = ['Staff', 'Supervisor', 'Manager', 'Senior Manager', 'Director', 'C-Level'];
  leaveReasons = [
    'Gaji',
    'Jenjang Karir',
    'Lingkungan Kerja',
    'Pindah Domisili',
    'Kontrak Berakhir',
    'Lainnya',
  ];
  technicalSkillOptions = [
    'Microsoft Office',
    'Excel',
    'Google Sheets',
    'Figma',
    'Photoshop',
    'SQL',
    'Python',
    'JavaScript',
    'React',
    'Angular',
  ];
  languageOptions = ['Indonesia', 'Inggris', 'Mandarin', 'Jepang', 'Korea', 'Jerman', 'Prancis'];
  proficiencyOptions = ['Pemula', 'Menengah', 'Mahir', 'Native'];

  personalInfo: PersonalInfo = {
    cvFile: null,
    fullName: '',
    birthPlace: '',
    birthDay: '',
    birthMonth: '',
    birthYear: '',
    email: '',
    phoneCode: '+62',
    phone: '',
    gender: '',
    address: '',
    kelurahan: '',
    kecamatan: '',
    city: '',
    province: '',
    postalCode: '',
    isSameAddress: false,
    linkedinUrl: '',
    jobSource: '',
  };
  steps = [
    { number: 1, label: 'Informasi Pribadi' },
    { number: 2, label: 'Pendidikan' },
    { number: 3, label: 'Pengalaman' },
    { number: 4, label: 'Tinjauan' },
  ];

  nextStep() {
    const errors = this.validateCurrentStep();
    if (errors.length > 0) return;
    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  validateCurrentStep(): any[] {
    if (this.currentStep === 1 && this.step1) return this.step1.validate();
    if (this.currentStep === 2 && this.step2) return this.step2.validate();
    if (this.currentStep === 3 && this.step3) return this.step3.validate();
    return [];
  }

  educationInfo: EducationInfo = {
    educations: [this.newEducation()],
  };

  experienceInfo: ExperienceInfo = {
    hasExperience: true,
    experiences: [this.newExperience()],
    currentSalary: '',
    technicalSkills: [],
    technicalSkillsDescription: '',
    certifications: [this.newCertification()],
    languages: [this.newLanguage()],
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private applicationService: ApplicationService,
  ) {}

  ngOnInit() {
    this.route.params.subscribe((p) => (this.jobId = p['id']));
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

  addEducation() {
    this.educationInfo.educations.push(this.newEducation());
  }
  removeEducation(i: number) {
    this.educationInfo.educations.splice(i, 1);
  }

  addExperience() {
    this.experienceInfo.experiences.push(this.newExperience());
  }
  removeExperience(i: number) {
    this.experienceInfo.experiences.splice(i, 1);
  }

  addCertification() {
    this.experienceInfo.certifications.push(this.newCertification());
  }
  removeCertification(i: number) {
    this.experienceInfo.certifications.splice(i, 1);
  }

  addLanguage() {
    this.experienceInfo.languages.push(this.newLanguage());
  }
  removeLanguage(i: number) {
    this.experienceInfo.languages.splice(i, 1);
  }

  toggleSkill(skill: string) {
    const idx = this.experienceInfo.technicalSkills.indexOf(skill);
    if (idx > -1) this.experienceInfo.technicalSkills.splice(idx, 1);
    else this.experienceInfo.technicalSkills.push(skill);
  }
  onSkillSelect(event: Event) {
    const select = event.target as HTMLSelectElement;
    const value = select.value;
    if (value) {
      this.toggleSkill(value);
      select.value = '';
    }
  }

  isSkillSelected(skill: string): boolean {
    return this.experienceInfo.technicalSkills.includes(skill);
  }

  onCvChange(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) this.personalInfo.cvFile = file;
  }

  prevStep() {
    if (this.currentStep > 1) this.currentStep--;
  }

  goToStep(step: number) {
    if (step < this.currentStep) this.currentStep = step;
  }

  submit() {
    const form: ApplicationForm = {
      personalInfo: this.personalInfo,
      educationInfo: this.educationInfo,
      experienceInfo: this.experienceInfo,
    };
    this.applicationService.submitApplication(this.jobId, form).subscribe((res) => {
      if (res.success) {
        this.isDirty = false;
        this.router.navigate(['/job', this.jobId]);
      }
    });
  }
}
