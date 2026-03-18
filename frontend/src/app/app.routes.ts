import { Routes } from '@angular/router';
import { AuthLayout } from './layouts/auth-layout/auth-layout';
import { PublicLayout } from './layouts/public-layout/public-layout';
import { ApplicantLayout } from './layouts/applicant-layout/applicant-layout';
import { unsavedChangesGuard } from './core/guards/unsaved-changes-guard';

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
    ],
  },
  {
    path: '',
    component: AuthLayout,
    children: [
      {
        path: 'login',
        loadComponent: () => import('./features/auth/login/login').then((m) => m.Login),
      },
      {
        path: 'register',
        loadComponent: () => import('./features/auth/register/register').then((m) => m.Register),
      },
      {
        path: 'otp',
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
    redirectTo: '',
  },
];
