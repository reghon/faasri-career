import { Component, OnInit, computed, inject, signal } from '@angular/core';

import { CommonModule } from '@angular/common';

import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { finalize } from 'rxjs';

import {
  ManagementProfile,
  ManagementProfilePayload,
} from '../../../domain/management_profile/management-profile.model';

import { ManagementProfileService } from '../../../domain/management_profile/management-profile.service';

@Component({
  selector: 'management-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './management-profile.html',
})
export class ManagementProfileComponent implements OnInit {
  private readonly fb = inject(FormBuilder);

  private readonly managementProfileService = inject(ManagementProfileService);
  loading = signal(false);

  saving = signal(false);

  profile = signal<ManagementProfile | null>(null);

  form = this.fb.group({
    fullName: ['', Validators.required],
  });

  hasChanges = signal(false);

  canSubmit = computed(() => {
    return this.hasChanges() && !this.saving();
  });

  ngOnInit(): void {
    this.loadProfile();
    this.form.valueChanges.subscribe(() => {
      const profile = this.profile();
      this.hasChanges.set(
        this.form.valid && !!profile && this.form.value.fullName !== profile.fullName,
      );
    });
  }

  loadProfile(): void {
    this.loading.set(true);

    this.managementProfileService
      .getMe()
      .pipe(
        finalize(() => {
          this.loading.set(false);
        }),
      )
      .subscribe({
        next: (response) => {
          this.profile.set(response);

          this.form.patchValue({
            fullName: response.fullName,
          });
        },

        error: (error) => {
          console.error(error);

          alert('Gagal memuat profile');
        },
      });
  }
  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);

    this.managementProfileService
      .updateMe(this.form.value.fullName || '')
      .pipe(
        finalize(() => {
          this.saving.set(false);
        }),
      )
      .subscribe({
        next: (response) => {
          this.profile.set(response);
          this.hasChanges.set(false);

          alert('Profile berhasil diperbarui');
        },

        error: (error) => {
          console.error(error);

          alert('Gagal memperbarui profile');
        },
      });
  }
}
