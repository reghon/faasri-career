import { inject } from '@angular/core';
import {
  CanActivateFn,
  Router,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
} from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { toObservable } from '@angular/core/rxjs-interop';

import { AuthService } from '../../domain/auth/auth.service';

export const managementGuard: CanActivateFn = async (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  await firstValueFrom(
    toObservable(authService.isReady).pipe(
      filter((ready) => ready),
      take(1),
    ),
  );

  let user = authService.currentUser();

  if (!user) {
    try {
      const res = await firstValueFrom(authService.getMe());
      user = res.data;
    } catch {
      return router.createUrlTree(['/login'], {
        queryParams: { returnUrl: state.url },
      });
    }
  }

  if (user.roleName === 'applicant') {
    return router.createUrlTree(['/']);
  }

  return true;
};
