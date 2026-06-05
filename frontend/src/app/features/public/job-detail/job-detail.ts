import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  computed,
  inject,
} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subject, forkJoin } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { AuthService } from '../../../domain/auth/auth.service';
import { JobDetail, JobListItem } from '../../../domain/job/models/job.model';
import { JobService } from '../../../domain/job/services/job.service';
import { ApplyService } from '../../../domain/apply/apply.service';
import { HtmlContentComponent } from '../../../shared/components/html-content/html-content.component';
import { JobCard } from '../../../shared/components/job-card/job-card';

@Component({
  selector: 'app-job',
  standalone: true,
  imports: [RouterLink, JobCard, HtmlContentComponent],
  templateUrl: './job-detail.html',
})
export class JobDetailComponent implements OnInit, OnDestroy {
  @ViewChild('loginRequiredModal')
  loginRequiredModal?: ElementRef<HTMLDialogElement>;

  @ViewChild('applyRoleModal')
  applyRoleModal?: ElementRef<HTMLDialogElement>;

  @ViewChild('alreadyAppliedModal')
  alreadyAppliedModal?: ElementRef<HTMLDialogElement>;

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly jobService = inject(JobService);
  private readonly authService = inject(AuthService);
  private readonly applyService = inject(ApplyService);
  private readonly cdr = inject(ChangeDetectorRef);

  readonly currentUser = this.authService.currentUser;
  readonly isReady = this.authService.isReady;
  readonly isLoggedIn = this.authService.isLoggedIn;
  readonly isApplicant = computed(
    () => this.currentUser()?.roleName?.toLowerCase() === 'applicant',
  );

  job: JobDetail | null = null;
  otherJobs: JobListItem[] = [];
  isLoading = true;
  errorMessage = '';

  private readonly destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      const id = params['id'] as string;
      this.loadJobDetailPage(id);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  handleApplyClick(): void {
    const user = this.currentUser();

    if (!user) {
      this.loginRequiredModal?.nativeElement.showModal();

      return;
    }

    if (user.roleName?.toLowerCase() !== 'applicant') {
      this.applyRoleModal?.nativeElement.showModal();

      return;
    }

    if (!this.job?.id) {
      return;
    }

    this.applyService
      .hasApplied(this.job.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (hasApplied) => {
          if (hasApplied) {
            this.alreadyAppliedModal?.nativeElement.showModal();

            return;
          }

          this.goToApply();
        },

        error: (error) => {
          console.error(error);

          alert('Gagal mengecek status apply');
        },
      });
  }

  goToRegister(): void {
    this.router.navigate(['/register'], {
      queryParams: {
        redirect: this.router.url,
      },
    });
  }

  goToLogin(): void {
    this.router.navigate(['/login'], {
      queryParams: {
        redirect: this.router.url,
      },
    });
  }

  goToApply(): void {
    if (!this.job?.id) {
      return;
    }

    this.router.navigate(['/job', this.job.id, 'apply']);
  }

  private loadJobDetailPage(id: string): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.job = null;
    this.otherJobs = [];
    this.cdr.detectChanges();

    forkJoin({
      job: this.jobService.getJobBySlug(id),
      jobsResult: this.jobService.getJobsOpen({ page: 1, limit: 10 }),
    })
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.isLoading = false;
          this.cdr.detectChanges();
        }),
      )
      .subscribe({
        next: ({ job, jobsResult }) => {
          this.job = job;
          this.otherJobs = jobsResult.items.filter((item) => item.id !== id).slice(0, 3);
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Failed to load job detail page', error);
          this.job = null;
          this.otherJobs = [];
          this.errorMessage = 'Job gagal dimuat. Silakan coba lagi.';
          this.cdr.detectChanges();
        },
      });
  }
}
