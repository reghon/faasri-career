import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subject, forkJoin } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { JobService } from '../../../domain/job/services/job.service';
import { JobDetail, JobListItem } from '../../../domain/job/models/job.model';
import { JobCard } from '../../../shared/components/job-card/job-card';

@Component({
  selector: 'app-job',
  standalone: true,
  imports: [RouterLink, JobCard],
  templateUrl: './job-detail.html',
})
export class JobDetailComponent implements OnInit, OnDestroy {
  job: JobDetail | null = null;
  otherJobs: JobListItem[] = [];
  isLoading = true;
  errorMessage = '';

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly jobService: JobService,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      const id = params['id'] as string;
      this.loadJobDetailPage(id);
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  goToApply() {
    if (!this.job?.id) return;
    this.router.navigate(['/job', this.job.id, 'apply']);
  }

  private loadJobDetailPage(id: string) {
    this.isLoading = true;
    this.errorMessage = '';
    this.job = null;
    this.otherJobs = [];
    this.cdr.detectChanges();

    forkJoin({
      job: this.jobService.getJobById(id),
      jobsResult: this.jobService.getJobs({ page: 1, limit: 10 }),
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
