import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { API_ENDPOINTS } from '../../config/api.config';

export interface User {
  id: string;
  email: string;
  isActive: boolean;
  role_name: string;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  currentUser = signal<User | null>(null);
  accessToken = signal<string | null>(null);

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {
    const token = localStorage.getItem('accessToken');
    if (token) this.accessToken.set(token);
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
      );
  }

  logout() {
    return this.http.post(API_ENDPOINTS.auth.logout, {}, { withCredentials: true }).pipe(
      tap(() => {
        this.accessToken.set(null);
        this.currentUser.set(null);
        localStorage.removeItem('accessToken');
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
      .get<{ data: User }>(API_ENDPOINTS.auth.me)
      .pipe(tap((res) => this.currentUser.set(res.data)));
  }

  isLoggedIn(): boolean {
    return !!this.accessToken();
  }
}
