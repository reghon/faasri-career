import { Routes } from '@angular/router';
import { AuthLayout } from './layouts/auth-layout/auth-layout';
import { PublicLayout } from './layouts/public-layout/public-layout';
import { ApplicantLayout } from './layouts/applicant-layout/applicant-layout';
import { unsavedChangesGuard } from './core/guards/unsaved-changes-guard';
import { guestGuard } from './core/guards/guest.guard';

export const routes: Routes = [
  {
    path: '',
    component: PublicLayout,
    children: [
      {
        path: '',
        loadComponent: () => import('./features/home/home').then((m) => m.Home),
      },
    ],
  },
  {
    path: '',
    component: ApplicantLayout,
    children: [
      {
        path: 'job/:id',
        loadComponent: () => import('./features/job-detail/job-detail').then((m) => m.JobDetail),
      },
      {
        path: 'job/:id/apply',
        loadComponent: () => import('./features/applicant/apply/apply').then((m) => m.Apply),
        canDeactivate: [unsavedChangesGuard],
      },
      {
        path: 'profile',
        loadComponent: () => import('./features/applicant/profile/profile').then((m) => m.Profile),
      },
    ],
  },
  {
    path: '',
    component: AuthLayout,
    children: [
      {
        path: 'login',
        canActivate: [guestGuard],
        loadComponent: () => import('./features/auth/login/login').then((m) => m.Login),
      },
      {
        path: 'register',
        canActivate: [guestGuard],
        loadComponent: () => import('./features/auth/register/register').then((m) => m.Register),
      },
      {
        path: 'otp',
        canActivate: [guestGuard],
        loadComponent: () => import('./features/auth/otp/otp').then((m) => m.Otp),
      },
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '**',
    loadComponent: () => import('./features/not-found/not-found.component').then((m) => m.NotFound),
  },
];
