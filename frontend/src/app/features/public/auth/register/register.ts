import { Component, ChangeDetectorRef } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../domain/auth/auth.service';
import { ToastService } from '../../../../core/services/toast/toast.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './register.html',
})
export class Register {
  fullName = '';
  email = '';
  password = '';
  confirmPassword = '';
  errorMessage = '';
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private toastService: ToastService,
  ) {}

  onRegister() {
    if (!this.fullName || !this.email || !this.password || !this.confirmPassword) {
      this.errorMessage = 'Semua field wajib diisi';
      return;
    }
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Kata sandi tidak cocok';
      return;
    }
    if (this.password.length < 8) {
      this.errorMessage = 'Kata sandi minimal 8 karakter';
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.errorMessage = 'Format email tidak valid';
      return;
    }
    this.isLoading = true;
    this.errorMessage = '';
    this.authService.register(this.email, this.password).subscribe({
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
