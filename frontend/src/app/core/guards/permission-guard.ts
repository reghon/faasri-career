import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../domain/auth/auth.service';

export const permissionGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const requiredPermission = route.data['permission'];

  if (!requiredPermission) {
    return true;
  }

  const permissions = authService.currentUser()?.permissions ?? [];

  if (permissions.includes(requiredPermission)) {
    return true;
  }

  return router.createUrlTree(['/management/dashboard']);
};
