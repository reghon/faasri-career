import { inject } from '@angular/core';
import {
  CanActivateFn,
  Router,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
} from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../domain/auth/auth.service';

export const managementGuard: CanActivateFn = async (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isLoggedIn()) {
    await router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }

  let user = authService.currentUser();

  if (!user) {
    try {
      const res = await firstValueFrom(authService.getMe());
      user = res.data;
    } catch {
      await router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
      return false;
    }
  }

  if (user.roleName === 'applicant') {
    await router.navigate(['/forbidden']);
    return false;
  }

  return true;
};
