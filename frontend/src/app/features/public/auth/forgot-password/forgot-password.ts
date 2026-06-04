import {
  Component,
  ElementRef,
  OnDestroy,
  QueryList,
  ViewChild,
  ViewChildren,
  computed,
  inject,
  signal,
} from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../domain/auth/auth.service';

type ForgotPasswordStep = 1 | 2 | 3;

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './forgot-password.html',
})
export class ForgotPassword implements OnDestroy {
  @ViewChildren('otpInput')
  otpInputs!: QueryList<ElementRef<HTMLInputElement>>;

  @ViewChild('newPasswordInput')
  newPasswordInput?: ElementRef<HTMLInputElement>;

  private readonly fb = inject(NonNullableFormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly emailForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  readonly otpForm = this.fb.group({
    digit0: ['', [Validators.required, Validators.pattern(/^\d$/)]],
    digit1: ['', [Validators.required, Validators.pattern(/^\d$/)]],
    digit2: ['', [Validators.required, Validators.pattern(/^\d$/)]],
    digit3: ['', [Validators.required, Validators.pattern(/^\d$/)]],
    digit4: ['', [Validators.required, Validators.pattern(/^\d$/)]],
    digit5: ['', [Validators.required, Validators.pattern(/^\d$/)]],
  });

  readonly passwordForm = this.fb.group({
    newPassword: ['', Validators.required],
    confirmPassword: ['', Validators.required],
  });

  readonly step = signal<ForgotPasswordStep>(1);
  readonly errorMessage = signal('');
  readonly successMessage = signal('');
  readonly isLoading = signal(false);
  readonly otp = signal(['', '', '', '', '', '']);
  readonly otpVerified = signal(false);
  readonly isVerifyingOtp = signal(false);
  readonly newPassword = signal('');
  readonly confirmPassword = signal('');
  readonly newPasswordTouched = signal(false);
  readonly confirmPasswordTouched = signal(false);
  readonly countdown = signal(0);

  showNewPassword = false;
  showConfirmPassword = false;

  private countdownInterval: ReturnType<typeof setInterval> | null = null;

  readonly email = computed(() => this.emailForm.controls.email.value.trim());
  readonly otpCode = computed(() => this.otp().join(''));
  readonly otpFull = computed(() => this.otpCode().length === 6);
  readonly hasMinLength = computed(() => this.newPassword().length >= 8);
  readonly hasUppercase = computed(() => /[A-Z]/.test(this.newPassword()));
  readonly hasNumber = computed(() => /[0-9]/.test(this.newPassword()));
  readonly hasSymbol = computed(() => /[^a-zA-Z0-9]/.test(this.newPassword()));
  readonly isNewPasswordValid = computed(
    () => this.hasMinLength() && this.hasUppercase() && this.hasNumber() && this.hasSymbol(),
  );
  readonly passwordsMatch = computed(
    () => this.confirmPassword().length > 0 && this.newPassword() === this.confirmPassword(),
  );
  readonly showPasswordHints = computed(
    () => this.newPasswordTouched() && this.newPassword().length > 0,
  );
  readonly showConfirmMismatch = computed(
    () =>
      this.confirmPasswordTouched() && this.confirmPassword().length > 0 && !this.passwordsMatch(),
  );
  readonly showConfirmMatch = computed(
    () => this.confirmPasswordTouched() && this.passwordsMatch(),
  );
  readonly canConfirmOtp = computed(
    () => this.otpFull() && !this.otpVerified() && !this.isVerifyingOtp(),
  );
  readonly canSubmit = computed(
    () =>
      this.otpVerified() && this.isNewPasswordValid() && this.passwordsMatch() && !this.isLoading(),
  );

  onRequestOtp(): void {
    this.errorMessage.set('');
    this.successMessage.set('');
    this.emailForm.markAllAsTouched();

    if (this.emailForm.invalid) {
      this.errorMessage.set('Email wajib diisi dengan format yang valid');
      return;
    }

    this.isLoading.set(true);

    this.authService.requestForgotPassword(this.email()).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.step.set(2);
        this.resetOtpForm();
        this.startCountdown();
        setTimeout(() => this.otpInputs.first?.nativeElement.focus());
      },
      error: (err) => {
        this.isLoading.set(false);
        const msg = err?.error?.message;
        this.errorMessage.set(Array.isArray(msg) ? msg[0] : msg || 'Email tidak terdaftar');
      },
    });
  }

  onConfirmOtp(): void {
    if (!this.canConfirmOtp()) return;

    this.errorMessage.set('');
    this.otpForm.markAllAsTouched();

    if (this.otpForm.invalid) return;

    this.isVerifyingOtp.set(true);

    this.authService.verifyForgotPasswordOtp(this.email(), this.otpCode()).subscribe({
      next: () => {
        this.isVerifyingOtp.set(false);
        this.otpVerified.set(true);
        this.step.set(3);
        setTimeout(() => this.newPasswordInput?.nativeElement.focus());
      },
      error: (err) => {
        this.isVerifyingOtp.set(false);
        this.otpVerified.set(false);
        const msg = err?.error?.message;
        this.errorMessage.set(
          Array.isArray(msg) ? msg[0] : msg || 'Kode OTP tidak valid atau sudah kadaluarsa',
        );
      },
    });
  }

  onConfirm(): void {
    this.newPasswordTouched.set(true);
    this.confirmPasswordTouched.set(true);
    this.passwordForm.markAllAsTouched();

    if (!this.canSubmit()) return;

    this.errorMessage.set('');
    this.isLoading.set(true);

    this.authService
      .confirmForgotPassword(
        this.email(),
        this.otpCode(),
        this.newPassword(),
        this.confirmPassword(),
      )
      .subscribe({
        next: () => {
          this.isLoading.set(false);
          this.router.navigate(['/login'], {
            state: {
              successMessage: 'Password berhasil direset. Silakan login kembali.',
            },
          });
        },
        error: (err) => {
          this.isLoading.set(false);
          const msg = err?.error?.message;
          this.errorMessage.set(Array.isArray(msg) ? msg[0] : msg || 'Gagal mereset password');
        },
      });
  }

  onOtpInput(index: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value.replace(/\D/g, '').slice(-1);
    const updated = [...this.otp()];

    updated[index] = value;
    this.otp.set(updated);
    this.otpControl(index).setValue(value, { emitEvent: false });
    input.value = value;

    if (value && index < 5) {
      this.otpInputs.toArray()[index + 1]?.nativeElement.focus();
    }

    queueMicrotask(() => {
      if (this.canConfirmOtp()) {
        this.onConfirmOtp();
      }
    });
  }

  onOtpKeydown(index: number, event: KeyboardEvent): void {
    if (event.key === 'Backspace' && !this.otp()[index] && index > 0) {
      this.otpInputs.toArray()[index - 1]?.nativeElement.focus();
    }
  }

  onNewPasswordInput(value: string): void {
    this.newPassword.set(value);
    this.newPasswordTouched.set(true);
    this.passwordForm.controls.newPassword.setValue(value, { emitEvent: false });
  }

  onConfirmPasswordInput(value: string): void {
    this.confirmPassword.set(value);
    this.confirmPasswordTouched.set(true);
    this.passwordForm.controls.confirmPassword.setValue(value, { emitEvent: false });
  }

  onResendOtp(): void {
    if (this.countdown() > 0) return;

    this.errorMessage.set('');
    this.otpVerified.set(false);

    this.authService.requestForgotPassword(this.email()).subscribe({
      next: () => {
        this.resetOtpForm();
        this.startCountdown();
        setTimeout(() => this.otpInputs.first?.nativeElement.focus());
      },
    });
  }

  private otpControl(index: number) {
    return this.otpForm.controls[`digit${index}` as keyof typeof this.otpForm.controls];
  }

  private resetOtpForm(): void {
    this.otp.set(['', '', '', '', '', '']);
    this.otpVerified.set(false);
    this.otpForm.reset();
  }

  private startCountdown(): void {
    this.countdown.set(60);

    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }

    this.countdownInterval = setInterval(() => {
      const current = this.countdown();

      if (current <= 1) {
        this.countdown.set(0);
        clearInterval(this.countdownInterval!);
        this.countdownInterval = null;
        return;
      }

      this.countdown.set(current - 1);
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }
}
