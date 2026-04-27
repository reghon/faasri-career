import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  BreadcrumbComponent,
  BreadcrumbItem,
} from '../../../shared/components/breadcrumb/breadcrumb';
import { JobService } from '../../../domain/job/services/job.service';
import { JobDetail as JobDetailModel } from '../../../domain/job/models/job.model';
import { JobDetailHeaderComponent } from './components/job-detail-header/job-detail-header';
import { JobDetailOverviewComponent } from './components/job-detail-overview/job-detail-overview';

type JobDetailTab = 'detail' | 'candidate' | 'pipeline' | 'activity';

@Component({
  selector: 'app-job-detail',
  standalone: true,
  imports: [
    CommonModule,
    BreadcrumbComponent,
    JobDetailHeaderComponent,
    JobDetailOverviewComponent,
  ],
  templateUrl: './job-detail.html',
})
export class JobDetail implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly jobService = inject(JobService);
  private readonly cdr = inject(ChangeDetectorRef);

  slug = '';
  job: JobDetailModel | null = null;
  isLoading = false;
  errorMessage = '';

  activeTab: JobDetailTab = 'detail';

  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Home', route: '/' },
    { label: 'Job', route: '/management/job' },
    { label: 'Detail' },
  ];

  applicantsCount = 42;
  rejectedCount = 23;
  inProgressCount = 18;
  hiredCount = 1;
  hiringManager = 'User PIC Manager';

  ngOnInit(): void {
    this.slug = this.route.snapshot.paramMap.get('slug') || '';

    if (!this.slug) {
      this.errorMessage = 'Slug job tidak ditemukan.';
      return;
    }

    this.loadJobDetail();
  }

  loadJobDetail(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.cdr.detectChanges();

    this.jobService.getJobBySlug(this.slug).subscribe({
      next: (job) => {
        this.job = job;
        this.breadcrumbItems = [
          { label: 'Home', route: '/' },
          { label: 'Job', route: '/management/job' },
          { label: job.title || 'Detail' },
        ];
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Failed to load job detail:', error);
        this.job = null;
        this.errorMessage = 'Gagal memuat detail lowongan.';
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  setActiveTab(tab: JobDetailTab): void {
    this.activeTab = tab;
  }
}
