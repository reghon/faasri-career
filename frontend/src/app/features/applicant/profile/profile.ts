import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  ApplicantMaster,
  ApplicantMasterService,
  ApplicantProfileService,
} from '../../../domain/applicant/index';
import { ProfileModalComponent } from './components/profile/profile-modal.component';
import { EducationModalComponent } from './components/education/education-modal.component';
import { CertificationModalComponent } from './components/certifications/certification-modal.component';
import { TechnicalSkillModalComponent } from './components/technical-skill/technical-skill-modal.component.';
import { WorkExperienceModalComponent } from './components/work-experience/work-experience-modal.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    ProfileModalComponent,
    EducationModalComponent,
    CertificationModalComponent,
    TechnicalSkillModalComponent,
    WorkExperienceModalComponent,
  ],
  templateUrl: './profile.html',
})
export class Profile implements OnInit {
  applicant: ApplicantMaster | null = null;
  isProfileModalOpen = false;
  isEducationModalOpen = false;
  isWorkExperienceModalOpen = false;
  isCertificationModalOpen = false;
  isTechnicalSkillModalOpen = false;
  isLoading = true;

  constructor(
    private readonly applicantMasterService: ApplicantMasterService,
    private readonly applicantProfileService: ApplicantProfileService,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadApplicant();
  }

  loadApplicant(): void {
    this.isLoading = true;

    this.applicantMasterService.getMe().subscribe({
      next: (data) => {
        this.applicant = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.applicant = null;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  getFileUrl(path: string | null | undefined): string {
    return this.applicantProfileService.getFileUrl(path);
  }

  editProfile(): void {
    this.isProfileModalOpen = true;
  }

  closeProfileModal(): void {
    this.isProfileModalOpen = false;
  }

  editEducation(): void {
    this.isEducationModalOpen = true;
  }

  closeEducationModal(): void {
    this.isEducationModalOpen = false;
  }

  editWorkExperience(): void {
    this.isWorkExperienceModalOpen = true;
  }

  closeWorkExperienceModal(): void {
    this.isWorkExperienceModalOpen = false;
  }

  editCertification(): void {
    this.isCertificationModalOpen = true;
  }

  closeCertificationModal(): void {
    this.isCertificationModalOpen = false;
  }

  editTechnicalSkill(): void {
    this.isTechnicalSkillModalOpen = true;
  }

  closeTechnicalSkillModal(): void {
    this.isTechnicalSkillModalOpen = false;
  }
}
