import { Component, ChangeDetectorRef } from '@angular/core';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../domain/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './login.html',
})
export class Login {
  email = '';
  password = '';
  errorMessage = '';
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
  ) {}

  onLogin() {
    if (!this.email || !this.password) {
      this.errorMessage = 'Email dan password wajib diisi';
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.errorMessage = 'Format email tidak valid';
      return;
    }

    this.isLoading = true;

    this.errorMessage = '';

    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        this.authService.getMe().subscribe({
          next: (res) => {
            this.isLoading = false;

            const roleName = res.data.roleName;
            const returnUrl = this.route.snapshot.queryParams['returnUrl'];

            let redirectUrl = '/';

            if (returnUrl) {
              redirectUrl = returnUrl;
            } else {
              redirectUrl = roleName === 'applicant' ? '/' : '/management/dashboard';
            }

            this.router.navigateByUrl(redirectUrl);
          },
          error: () => {
            this.isLoading = false;
            this.router.navigate(['/']);
          },
        });
      },
      error: (err) => {
        this.isLoading = false;
        const msg = err.error?.message;
        this.errorMessage = Array.isArray(msg) ? msg[0] : msg || 'Email atau password salah';
        this.cdr.detectChanges();
      },
    });
  }
}
