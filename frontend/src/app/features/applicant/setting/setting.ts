import {
  Component,
  ElementRef,
  OnDestroy,
  QueryList,
  ViewChildren,
  signal,
  computed,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';

import { AuthService } from '../../../domain/auth/auth.service';
import { PasswordField } from '../../../shared/components/password-field/password-field';
import { ConfirmPasswordField } from '../../../shared/components/password-field/confirm-password-field';

@Component({
  selector: 'app-setting',
  standalone: true,
  imports: [FormsModule, PasswordField, ConfirmPasswordField],
  templateUrl: './setting.html',
})
export class Setting implements OnDestroy {
  @ViewChildren('otpInput') otpInputs!: QueryList<ElementRef>;

  currentEmail = computed(() => this.authService.currentUser()?.email ?? '');

  newEmail = signal('');
  otp = signal<string[]>(['', '', '', '', '', '']);

  isSendingOtp = signal(false);
  isVerifyingOtp = signal(false);
  otpSent = signal(false);
  otpVerified = signal(false);
  otpCountdown = signal(0);

  oldPassword = signal('');
  newPassword = signal('');
  confirmPassword = signal('');
  showOldPassword = signal(false);
  isSubmittingPassword = signal(false);

  errors = signal<Record<string, string>>({});

  isNewEmailValid = computed(() => {
    const email = this.newEmail();
    if (!email) return false;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  });

  newEmailError = computed(() => {
    const email = this.newEmail();
    if (!email) return '';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Format email tidak valid';
    return '';
  });

  isOtpCooldownActive = computed(() => this.otpCountdown() > 0);

  isPasswordValid = computed(() => {
    const p = this.newPassword();
    return p.length >= 8 && /[A-Z]/.test(p) && /[0-9]/.test(p) && /[^a-zA-Z0-9]/.test(p);
  });

  passwordsMatch = computed(
    () => this.confirmPassword().length > 0 && this.newPassword() === this.confirmPassword(),
  );

  canSubmitPassword = computed(
    () =>
      !this.isSubmittingPassword() &&
      this.oldPassword().length > 0 &&
      this.isPasswordValid() &&
      this.passwordsMatch(),
  );

  private otpCountdownTimer: ReturnType<typeof setInterval> | null = null;

  constructor(private authService: AuthService) {}

  ngOnDestroy() {
    this.clearOtpCountdown();
  }

  sendOtp() {
    this.clearError('newEmail');

    if (this.isOtpCooldownActive() || !this.isNewEmailValid()) return;

    this.isSendingOtp.set(true);

    this.authService
      .requestChangeEmail(this.newEmail())
      .pipe(finalize(() => this.isSendingOtp.set(false)))
      .subscribe({
        next: () => {
          this.otpSent.set(true);
          this.otpVerified.set(false);
          this.otp.set(['', '', '', '', '', '']);
          this.startOtpCountdown();
        },
        error: (err) => {
          this.setError('newEmail', err?.error?.message ?? 'Gagal mengirim OTP');
        },
      });
  }

  confirmOtp() {
    this.clearError('otp');

    const otpCode = this.otp().join('');

    if (otpCode.length < 6) {
      this.setError('otp', 'Masukkan 6 digit kode OTP');
      return;
    }

    this.isVerifyingOtp.set(true);

    this.authService
      .confirmChangeEmail(this.newEmail(), otpCode)
      .pipe(finalize(() => this.isVerifyingOtp.set(false)))
      .subscribe({
        next: () => {
          this.otpVerified.set(true);
          window.location.reload();
        },
        error: (err) => {
          this.otpVerified.set(false);
          this.setError(
            'otp',
            err?.error?.message ?? 'Kode OTP tidak sesuai atau sudah kadaluarsa',
          );
        },
      });
  }

  onOtpInput(index: number, event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input.value.replace(/\D/g, '').slice(-1);

    input.value = value;

    this.otp.update((digits) => {
      const updated = [...digits];
      updated[index] = value;
      return updated;
    });

    this.clearError('otp');

    if (value && index < 5) {
      this.otpInputs.toArray()[index + 1]?.nativeElement.focus();
    }
  }

  onOtpKeydown(index: number, event: KeyboardEvent) {
    if (event.key === 'Backspace' && !this.otp()[index] && index > 0) {
      this.otpInputs.toArray()[index - 1]?.nativeElement.focus();
    }
  }

  submitPassword() {
    this.errors.set({});

    if (!this.oldPassword()) this.setError('oldPassword', 'Password saat ini wajib diisi');
    if (!this.isPasswordValid()) this.setError('newPassword', 'Password belum memenuhi ketentuan');
    if (!this.passwordsMatch()) this.setError('confirmPassword', 'Password konfirmasi tidak cocok');

    if (Object.keys(this.errors()).length > 0) return;

    this.isSubmittingPassword.set(true);

    this.authService
      .changePassword(this.oldPassword(), this.newPassword(), this.confirmPassword())
      .pipe(finalize(() => this.isSubmittingPassword.set(false)))
      .subscribe({
        next: () => {
          this.oldPassword.set('');
          this.newPassword.set('');
          this.confirmPassword.set('');
        },
        error: (err) => {
          const msg = err?.error?.message ?? 'Terjadi kesalahan';
          const field = msg.toLowerCase().includes('password lama')
            ? 'oldPassword'
            : 'passwordGeneral';
          this.setError(field, msg);
        },
      });
  }

  toggleShowOldPassword() {
    this.showOldPassword.update((v) => !v);
  }

  hasError(field: string): boolean {
    return !!this.errors()[field];
  }

  getError(field: string): string {
    return this.errors()[field] ?? '';
  }

  private setError(field: string, message: string) {
    this.errors.update((e) => ({ ...e, [field]: message }));
  }

  private clearError(field: string) {
    this.errors.update((e) => {
      const updated = { ...e };
      delete updated[field];
      return updated;
    });
  }

  private startOtpCountdown() {
    this.clearOtpCountdown();
    this.otpCountdown.set(60);

    this.otpCountdownTimer = setInterval(() => {
      const next = this.otpCountdown() - 1;
      this.otpCountdown.set(Math.max(next, 0));
      if (next <= 0) this.clearOtpCountdown();
    }, 1000);
  }

  private clearOtpCountdown() {
    if (this.otpCountdownTimer) {
      clearInterval(this.otpCountdownTimer);
      this.otpCountdownTimer = null;
    }
  }
}
