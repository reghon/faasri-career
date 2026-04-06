import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  ApplicantMaster,
  ApplicantMasterService,
  ApplicantProfileService,
} from '../../../domain/applicant/index';
import { SectionAddButton } from './components/shared/section-add-button';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule, SectionAddButton, CommonModule],
  templateUrl: './profile.html',
})
export class Profile implements OnInit {
  applicant: ApplicantMaster | null = null;
  isEditing = false;
  isLoading = true;

  constructor(
    private applicantMasterService: ApplicantMasterService,
    private applicantProfileService: ApplicantProfileService,
    private cdr: ChangeDetectorRef,
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
  toggleEdit(): void {
    if (this.isEditing) {
      this.saveProfile();
      return;
    }

    this.isEditing = true;
  }

  saveProfile(): void {
    if (!this.applicant?.applicantProfile) {
      return;
    }

    const profile = this.applicant.applicantProfile;

    this.applicantProfileService
      .updateMe({
        fullName: profile.fullName,
        birthPlace: profile.birthPlace,
        birthDate: profile.birthDate,
        gender: profile.gender,
        phoneCode: profile.phoneCode,
        phone: profile.phone,
        address: profile.address,
        kelurahan: profile.kelurahan,
        kecamatan: profile.kecamatan,
        city: profile.city,
        province: profile.province,
        postalCode: profile.postalCode,
        isSameAddress: profile.isSameAddress,
        linkedinUrl: profile.linkedinUrl,
      })
      .subscribe({
        next: () => {
          this.isEditing = false;
          this.loadApplicant();
        },
        error: (err) => {
          console.error('Gagal menyimpan profil:', err);
        },
      });
  }

  trackById(_index: number, item: { id: string }): string {
    return item.id;
  }

  onAddWorkExperience(): void {}

  onAddEducation(): void {}

  onAddCV(): void {}

  onAddTechnicalSkill(): void {}

  onAddCertification(): void {}
}
