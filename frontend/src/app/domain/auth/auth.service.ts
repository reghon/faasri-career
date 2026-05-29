import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { tap, finalize, switchMap, catchError } from 'rxjs/operators';
import { API_ENDPOINTS } from '../../core/config/api.config';
import { ToastService } from '../../core/services/toast/toast.service';

export interface User {
  id: string;
  email: string;
  isActive: boolean;
  roleName: string;
  permissions: string[];
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  currentUser = signal<User | null>(null);
  accessToken = signal<string | null>(null);
  readonly isReady = signal(false);
  readonly isLoggedIn = computed(() => !!this.currentUser());
  readonly isApplicant = computed(
    () => this.currentUser()?.roleName?.toLowerCase() === 'applicant',
  );
  constructor(
    private http: HttpClient,
    private router: Router,
    private toastService: ToastService,
  ) {
    console.log('AUTH SERVICE CREATED');
    const token = localStorage.getItem('accessToken');

    if (token) {
      this.accessToken.set(token);

      this.getMe()
        .pipe(
          catchError((error) => {
            console.error('getMe error', error);
            return of(null);
          }),

          finalize(() => {
            console.log('Auth initialization finished');

            this.isReady.set(true);
          }),
        )
        .subscribe((res) => {
          console.log('getMe success', res);
        });
    } else {
      this.isReady.set(true);
    }
  }

  register(email: string, password: string) {
    return this.http.post(API_ENDPOINTS.auth.register, { email, password });
  }

  login(email: string, password: string) {
    return this.http
      .post<{
        message: string;
        data: { accessToken: string };
      }>(API_ENDPOINTS.auth.login, { email, password }, { withCredentials: true })
      .pipe(
        tap((res) => {
          this.accessToken.set(res.data.accessToken);
          localStorage.setItem('accessToken', res.data.accessToken);
        }),

        switchMap(() => this.getMe()),

        tap(() => {
          this.toastService.show('Login berhasil!');
        }),
      );
  }

  logout() {
    return this.http.post(API_ENDPOINTS.auth.logout, {}, { withCredentials: true }).pipe(
      tap(() => {
        this.accessToken.set(null);
        this.currentUser.set(null);
        localStorage.removeItem('accessToken');
        this.toastService.show('Logout Berhasil');
        this.router.navigate(['/login']);
      }),
    );
  }

  refreshToken() {
    return this.http
      .post<{
        data: { accessToken: string };
      }>(API_ENDPOINTS.auth.refresh, {}, { withCredentials: true })
      .pipe(
        tap((res) => {
          this.accessToken.set(res.data.accessToken);
          localStorage.setItem('accessToken', res.data.accessToken);
        }),
      );
  }

  getMe() {
    return this.http
      .get<{ data: User }>(API_ENDPOINTS.auth.me, {
        withCredentials: true,
      })
      .pipe(
        tap((res) => {
          this.currentUser.set(res.data);
        }),
      );
  }
  requestChangeEmail(newEmail: string) {
    return this.http.post<{ message: string }>(
      API_ENDPOINTS.auth.changeEmailRequest,
      { newEmail },
      { withCredentials: true },
    );
  }

  confirmChangeEmail(newEmail: string, otp: string) {
    return this.http
      .post<{
        message: string;
        data: { accessToken: string };
      }>(API_ENDPOINTS.auth.changeEmailConfirm, { newEmail, otp }, { withCredentials: true })
      .pipe(
        tap((res) => {
          this.accessToken.set(res.data.accessToken);
          localStorage.setItem('accessToken', res.data.accessToken);

          const user = this.currentUser();
          if (user) {
            this.currentUser.set({ ...user, email: newEmail });
          }
          this.toastService.show('Email berhasil diubah');
        }),
      );
  }

  changePassword(oldPassword: string, newPassword: string, confirmPassword: string) {
    return this.http
      .post<{
        message: string;
        data: { accessToken: string };
      }>(
        API_ENDPOINTS.auth.changePassword,
        { oldPassword, newPassword, confirmPassword },
        { withCredentials: true },
      )
      .pipe(
        tap((res) => {
          this.accessToken.set(res.data.accessToken);
          localStorage.setItem('accessToken', res.data.accessToken);
          this.toastService.show('Password berhasil diubah');
        }),
      );
  }

  verifyForgotPasswordOtp(email: string, otp: string) {
    return this.http.post<{ message: string }>(API_ENDPOINTS.auth.verifyForgotPasswordOtp, {
      email,
      otp,
    });
  }
  
  requestForgotPassword(email: string) {
    return this.http.post<{ message: string }>(API_ENDPOINTS.auth.forgotPasswordRequest, {
      email,
    });
  }

  confirmForgotPassword(email: string, otp: string, newPassword: string, confirmPassword: string) {
    return this.http
      .post<{
        message: string;
      }>(API_ENDPOINTS.auth.forgotPasswordConfirm, { email, otp, newPassword, confirmPassword })
      .pipe(
        tap(() => {
          this.toastService.show('Password berhasil direset, silakan login');
          this.router.navigate(['/login']);
        }),
      );
  }
}
