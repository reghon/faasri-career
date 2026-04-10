import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { of, switchMap } from 'rxjs';
import {
  ApplicantProfile,
  ApplicantProfilePayload,
  ApplicantProfileService,
} from '../../../../../domain/applicant/index';
import {
  Step1Personal,
  createApplicantProfileForm,
  mapApplicantProfileToForm,
  normalizeApplicantProfileForm,
} from '../../../apply/components/step1-personal/step1-personal';
import { FieldError } from '../../../../../shared/utils';
import { GenericModalComponent } from '../general/generic-modal.component';

@Component({
  selector: 'app-profile-modal',
  standalone: true,
  imports: [GenericModalComponent, Step1Personal],
  templateUrl: './profile-modal.component.html',
})
export class ProfileModalComponent implements OnChanges {
  @ViewChild(Step1Personal) personalForm?: Step1Personal;

  @Input() open = false;
  @Input() profile: ApplicantProfile | null = null;

  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<ApplicantProfile>();

  isSubmitting = false;

  formData: ApplicantProfilePayload = createApplicantProfileForm();

  avatarFile: File | null = null;
  avatarPreviewUrl: string | null = null;
  removeAvatarFlag = false;

  cvFile: File | null = null;
  cvFileName: string | null = null;
  removeCvFlag = false;

  constructor(private readonly applicantProfileService: ApplicantProfileService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['profile'] || changes['open']) {
      this.formData = mapApplicantProfileToForm(this.profile);

      this.avatarFile = null;
      this.avatarPreviewUrl = this.profile?.avatarUrl
        ? this.applicantProfileService.getFileUrl(this.profile.avatarUrl)
        : null;
      this.removeAvatarFlag = false;

      this.cvFile = null;
      this.cvFileName = this.profile?.cvFileName || null;
      this.removeCvFlag = false;
    }
  }

  onDataChange(data: ApplicantProfilePayload): void {
    this.formData = { ...data };
  }

  onAvatarFileChange(file: File | null): void {
    this.avatarFile = file;
  }

  onAvatarPreviewUrlChange(url: string | null): void {
    this.avatarPreviewUrl = url;
  }

  onAvatarRemoveChange(shouldRemove: boolean): void {
    this.removeAvatarFlag = shouldRemove;
    if (shouldRemove) {
      this.avatarFile = null;
      this.avatarPreviewUrl = null;
    }
  }

  onCvFileChange(file: File | null): void {
    this.cvFile = file;
  }

  onCvFileNameChange(fileName: string | null): void {
    this.cvFileName = fileName;
  }

  onCvRemoveChange(shouldRemove: boolean): void {
    this.removeCvFlag = shouldRemove;
    if (shouldRemove) {
      this.cvFile = null;
      this.cvFileName = null;
    }
  }

  onClose(): void {
    if (this.isSubmitting) return;
    this.close.emit();
  }

  onSave(): void {
    const errors: FieldError[] = this.personalForm?.validate() ?? [];
    if (errors.length > 0) return;

    this.isSubmitting = true;
    const payload = normalizeApplicantProfileForm(this.formData);

    this.applicantProfileService
      .updateMe(payload)
      .pipe(
        switchMap((updatedProfile) => {
          if (this.removeAvatarFlag && this.profile?.avatarUrl) {
            return this.applicantProfileService.removeAvatar();
          }
          return of(updatedProfile);
        }),
        switchMap((updatedProfile) => {
          if (this.avatarFile) {
            return this.applicantProfileService.updateAvatar(this.avatarFile);
          }
          return of(updatedProfile);
        }),
        switchMap((updatedProfile) => {
          if (this.removeCvFlag && this.profile?.cvUrl) {
            return this.applicantProfileService.removeCv();
          }
          return of(updatedProfile);
        }),
        switchMap((updatedProfile) => {
          if (this.cvFile) {
            return this.applicantProfileService.updateCv(this.cvFile);
          }
          return of(updatedProfile);
        }),
      )
      .subscribe({
        next: (updated) => {
          this.isSubmitting = false;
          this.saved.emit(updated);
          this.close.emit();
        },
        error: (err) => {
          console.error('Gagal update profile:', err);
          this.isSubmitting = false;
        },
      });
  }
}
