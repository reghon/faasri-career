import { Component, ElementRef, QueryList, ViewChildren, ChangeDetectorRef } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { API_ENDPOINTS } from '../../../../core/config/api.config';
import { AuthService } from '../../../../domain/auth/auth.service';
import { ToastService } from '../../../../core/services/toast/toast.service';

@Component({
  selector: 'app-otp',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './otp.html',
})
export class Otp {
  @ViewChildren('otpInput') otpInputs!: QueryList<ElementRef>;

  email = '';
  otp = ['', '', '', '', '', ''];
  errorMessage = '';
  isLoading = false;

  constructor(
    private router: Router,
    private http: HttpClient,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private toastService: ToastService,
  ) {
    const nav = this.router.getCurrentNavigation();
    this.email = nav?.extras?.state?.['email'] || '';
  }

  onInput(index: number, event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input.value.replace(/\D/g, '');
    this.otp[index] = value;
    input.value = value;
    if (value && index < 5) {
      const inputs = this.otpInputs.toArray();
      inputs[index + 1].nativeElement.focus();
    }
  }

  onKeydown(index: number, event: KeyboardEvent) {
    if (event.key === 'Backspace' && !this.otp[index] && index > 0) {
      const inputs = this.otpInputs.toArray();
      inputs[index - 1].nativeElement.focus();
    }
  }

  onVerify() {
    const otpCode = this.otp.join('');
    if (otpCode.length < 6) {
      this.errorMessage = 'Masukkan 6 digit kode OTP';
      this.cdr.detectChanges();
      return;
    }
    this.isLoading = true;
    this.errorMessage = '';
    this.cdr.detectChanges();

    this.http
      .post<{
        data: { accessToken: string };
      }>(
        API_ENDPOINTS.auth.verifyOtp,
        { email: this.email, otp: otpCode },
        { withCredentials: true },
      )
      .subscribe({
        next: (res) => {
          this.toastService.show('Akun berhasil diverifikasi!');
          this.authService.accessToken.set(res.data.accessToken);
          localStorage.setItem('accessToken', res.data.accessToken);
          this.authService.getMe().subscribe();
          this.router.navigate(['/']);
        },
        error: (err) => {
          this.isLoading = false;
          const msg = err.error?.message;
          this.errorMessage = Array.isArray(msg) ? msg[0] : msg || 'Verifikasi gagal';
          this.cdr.detectChanges();
        },
      });
  }
}
