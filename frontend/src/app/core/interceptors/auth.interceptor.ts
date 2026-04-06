import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject, Injector} from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../../domain/auth/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const injector = inject(Injector);
  const authService = injector.get(AuthService);

  const token = authService.accessToken();

  const authReq = token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !req.url.includes('/auth/')) {
        return authService.refreshToken().pipe(
          switchMap(() => {
            const newToken = authService.accessToken();
            const retryReq = req.clone({
              setHeaders: { Authorization: `Bearer ${newToken}` },
            });
            return next(retryReq);
          }),
          catchError((refreshError) => {
            authService.logout().subscribe();
            return throwError(() => refreshError);
          }),
        );
      }
      return throwError(() => error);
    }),
  );
};
