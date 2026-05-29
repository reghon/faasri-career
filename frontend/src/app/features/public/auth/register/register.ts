import { Component, ChangeDetectorRef, computed, signal } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../domain/auth/auth.service';
import { ToastService } from '../../../../core/services/toast/toast.service';
import { PasswordField } from '../../../../shared/components/password-field/password-field';
import { ConfirmPasswordField } from '../../../../shared/components/password-field/confirm-password-field';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, FormsModule, PasswordField, ConfirmPasswordField],
  templateUrl: './register.html',
})
export class Register {
  fullName = '';
  email = '';
  password = signal('');
  confirmPassword = signal('');
  errorMessage = '';
  isLoading = false;

  isPasswordValid = computed(() => {
    const password = this.password();

    return (
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[0-9]/.test(password) &&
      /[^a-zA-Z0-9]/.test(password)
    );
  });

  passwordsMatch = computed(
    () => this.password() === this.confirmPassword() && this.confirmPassword().length > 0,
  );

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private toastService: ToastService,
  ) {}

  onRegister() {
    if (!this.fullName || !this.email || !this.password() || !this.confirmPassword()) {
      this.errorMessage = 'Semua field wajib diisi';
      return;
    }
    if (!this.passwordsMatch()) {
      this.errorMessage = 'Kata sandi tidak cocok';
      return;
    }
    if (!this.isPasswordValid()) {
      this.errorMessage = 'Kata sandi belum memenuhi ketentuan';
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.errorMessage = 'Format email tidak valid';
      return;
    }
    this.isLoading = true;
    this.errorMessage = '';
    this.authService.register(this.email, this.password()).subscribe({
      next: () => {
        this.toastService.show('Registrasi berhasil! Cek email kamu.');
        this.router.navigate(['/otp'], { state: { email: this.email } });
      },
      error: (err) => {
        this.isLoading = false;
        const msg = err.error?.message;
        this.errorMessage = Array.isArray(msg) ? msg[0] : msg || 'Registrasi gagal';
        this.cdr.detectChanges();
      },
    });
  }
}
