import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApplicantProfileService, ProfileViewModel } from '../../../core/services/applicant/index';
import { AuthService } from '../../../core/services/auth/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './profile.html',
})
export class Profile implements OnInit {
  user: ProfileViewModel | null = null;
  isEditing = false;
  isLoading = true;

  constructor(
    private profileService: ApplicantProfileService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.profileService.getProfile().subscribe({
      next: (data) => {
        const currentUser = this.authService.currentUser();
        this.user = {
          ...data,
          email: currentUser?.email || '',
        };
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  toggleEdit() {
    if (this.isEditing) {
      this.saveProfile();
    } else {
      this.isEditing = true;
    }
  }

  saveProfile() {
    if (!this.user) return;

    this.profileService
      .updateProfile({
        fullName: this.user.name,
        birthPlace: this.user.birthPlace,
        birthDate: this.user.birthDate,
        gender: this.user.gender,
        phoneCode: this.user.phoneCode,
        phone: this.user.phone,
        linkedinUrl: this.user.linkedinUrl,
      })
      .subscribe({
        next: () => {
          this.isEditing = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Gagal menyimpan profil:', err);
        },
      });
  }

  onAvatarChange(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file && this.user) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.user!.avatar = e.target?.result as string;
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(file);
    }
  }

  onCvChange(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file && this.user) {
      this.user.cvFile = file.name;
      this.cdr.detectChanges();
    }
  }
}
