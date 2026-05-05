import { Routes } from '@angular/router';
import { AuthLayout } from './layouts/auth-layout/auth-layout';
import { PublicLayout } from './layouts/public-layout/public-layout';
import { ApplicantLayout } from './layouts/applicant-layout/applicant-layout';
import { ManagementLayout } from './layouts/management-layout/management-layout';
import { unsavedChangesGuard } from './core/guards/unsaved-changes-guard';
import { guestGuard } from './core/guards/guest.guard';
import { managementGuard } from './core/guards/management.guard';

export const routes: Routes = [
  {
    path: '',
    component: PublicLayout,
    children: [
      {
        path: '',
        loadComponent: () => import('./features/public/home/home').then((m) => m.Home),
      },
    ],
  },
  {
    path: '',
    component: ApplicantLayout,
    children: [
      {
        path: 'job/:id',
        loadComponent: () =>
          import('./features/public/job-detail/job-detail').then((m) => m.JobDetailComponent),
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
      {
        path: 'saved-jobs',
        loadComponent: () =>
          import('./features/applicant/job/saved-job/saved-job').then((m) => m.SavedJob),
      },
    ],
  },
  {
    path: 'management',
    component: ManagementLayout,
    canActivate: [managementGuard],
    canActivateChild: [managementGuard],
    children: [
      {
        path: 'job',
        loadComponent: () => import('./features/management/job/job').then((m) => m.Job),
      },
      {
        path: 'master-data',
        loadComponent: () =>
          import('./features/management/master-data/master-data').then((m) => m.MasterData),
      },
      {
        path: 'job/:slug',
        loadComponent: () =>
          import('./features/management/job-detail/job-detail').then((m) => m.JobDetail),
      },
      {
        path: 'admin',
        loadComponent: () =>
          import('./features/management/admin/admin-master-data').then((m) => m.AdminMasterData),
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/management/dashboard/dashboard').then((m) => m.Dashboard),
      },
      {
        path: 'applicant',
        loadComponent: () =>
          import('./features/management/applicant/applicant').then((m) => m.Applicant),
      },
      {
        path: 'applicant/:id',
        loadComponent: () =>
          import('./features/management/applicant/applicant-detail/applicant-detail').then((m) => m.ApplicantDetail),
      },
      {
        path: 'application',
        loadComponent: () =>
          import('./features/management/application/application').then((m) => m.Application),
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
        loadComponent: () => import('./features/public/auth/login/login').then((m) => m.Login),
      },
      {
        path: 'register',
        canActivate: [guestGuard],
        loadComponent: () =>
          import('./features/public/auth/register/register').then((m) => m.Register),
      },
      {
        path: 'otp',
        canActivate: [guestGuard],
        loadComponent: () => import('./features/public/auth/otp/otp').then((m) => m.Otp),
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
    loadComponent: () =>
      import('./features/common/not-found/not-found.component').then((m) => m.NotFound),
  },
];
