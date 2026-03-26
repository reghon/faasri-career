import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { Location } from '@angular/common';

export const guestGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const location = inject(Location);

  if (authService.isLoggedIn()) {
    if (history.length > 1) {
      location.back();
    } else {
      router.navigate(['/']);
    }
    return false;
  }

  return true;
};
