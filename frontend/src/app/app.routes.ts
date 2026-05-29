import { Routes } from '@angular/router';
import { AuthLayout } from './layouts/auth-layout/auth-layout';
import { PublicLayout } from './layouts/public-layout/public-layout';
import { ApplicantLayout } from './layouts/applicant-layout/applicant-layout';
import { ManagementLayout } from './layouts/management-layout/management-layout';
import { unsavedChangesGuard } from './core/guards/unsaved-changes-guard';
import { guestGuard } from './core/guards/guest.guard';
import { managementGuard } from './core/guards/management.guard';
import { hasAppliedGuard } from './core/guards/has-applied.guard';
import { permissionGuard } from './core/guards/permission-guard';

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
        canActivate: [hasAppliedGuard],
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
      {
        path: 'apply-history',
        loadComponent: () =>
          import('./features/applicant/apply/apply-history/apply-history').then(
            (m) => m.ApplyHistory,
          ),
      },
      {
        path: 'setting',
        loadComponent: () => import('./features/applicant/setting/setting').then((m) => m.Setting),
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
        path: 'dashboard',
        loadComponent: () =>
          import('./features/management/dashboard/dashboard').then((m) => m.Dashboard),
      },

      {
        path: 'job',
        canActivate: [permissionGuard],
        data: { permission: 'JOB_LIST' },
        loadComponent: () => import('./features/management/job/job').then((m) => m.Job),
      },
      {
        path: 'job/:slug',
        canActivate: [permissionGuard],
        data: { permission: 'JOB_READ' },
        loadComponent: () =>
          import('./features/management/job-detail/job-detail').then((m) => m.JobDetail),
      },

      {
        path: 'applicant',
        canActivate: [permissionGuard],
        data: { permission: 'APPLICANT_LIST' },
        loadComponent: () =>
          import('./features/management/applicant/applicant').then((m) => m.Applicant),
      },
      {
        path: 'applicant/:id',
        canActivate: [permissionGuard],
        data: { permission: 'APPLICANT_READ' },
        loadComponent: () =>
          import('./features/management/applicant/applicant-detail/applicant-detail').then(
            (m) => m.ApplicantDetail,
          ),
      },

      {
        path: 'application',
        canActivate: [permissionGuard],
        data: { permission: 'APPLICATION_LIST' },
        loadComponent: () =>
          import('./features/management/application/application').then((m) => m.Application),
      },
      {
        path: 'application/:id',
        canActivate: [permissionGuard],
        data: { permission: 'APPLICATION_READ' },
        loadComponent: () =>
          import('./features/management/application/application-detail/application-detail').then(
            (m) => m.ApplicationDetail,
          ),
      },

      {
        path: 'master-data',
        canActivate: [permissionGuard],
        data: { permission: 'MASTER_DATA_LIST' },
        loadComponent: () =>
          import('./features/management/master-data/master-data').then((m) => m.MasterData),
      },

      {
        path: 'admin',
         canActivate: [permissionGuard],
        data: { permission: 'ADMIN_LIST' },
        loadComponent: () =>
          import('./features/management/admin/admin-master-data').then((m) => m.AdminMasterData),
      },

      {
        path: 'profile',
        loadComponent: () =>
          import('./features/management/profile/management-profile').then(
            (m) => m.ManagementProfileComponent,
          ),
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
        path: 'forgot-password',
        canActivate: [guestGuard],
        loadComponent: () =>
          import('./features/public/auth/forgot-password/forgot-password').then(
            (m) => m.ForgotPassword,
          ),
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
