import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject} from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { API_ENDPOINTS } from '../config/api.config';

let isRefreshing = false;

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const http = inject(HttpClient);

  const token = localStorage.getItem('accessToken');

  const authReq = token
    ? req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      })
    : req;

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      const isExcludedRoute =
        req.url.includes('/auth/login') ||
        req.url.includes('/auth/register') ||
        req.url.includes('/auth/refresh');

      if (error.status === 401 && !isExcludedRoute) {
        if (isRefreshing) {
          return throwError(() => error);
        }

        isRefreshing = true;

        return http
          .post<{
            data: {
              accessToken: string;
            };
          }>(
            API_ENDPOINTS.auth.refresh,
            {},
            {
              withCredentials: true,
            },
          )
          .pipe(
            switchMap((res) => {
              isRefreshing = false;

              localStorage.setItem('accessToken', res.data.accessToken);

              const retryReq = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${res.data.accessToken}`,
                },
              });

              return next(retryReq);
            }),

            catchError((refreshError) => {
              isRefreshing = false;

              localStorage.removeItem('accessToken');

              window.location.href = '/login';

              return throwError(() => refreshError);
            }),
          );
      }

      return throwError(() => error);
    }),
  );
};
