import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { ApplyService } from '../../domain/apply/apply.service';

export const hasAppliedGuard: CanActivateFn = (route) => {
  const applyService = inject(ApplyService);
  const router = inject(Router);

  const jobId = route.params['id'];

  return applyService.hasApplied(jobId).pipe(
    map((hasApplied) => {
      if (hasApplied) {
        router.navigate(['/job', jobId], {
          queryParams: {
            alreadyApplied: 'true',
          },
        });

        return false;
      }

      return true;
    }),

    catchError(() => {
      router.navigate(['/job', jobId]);

      return of(false);
    }),
  );
};
