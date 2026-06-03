import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';

import {
  BreadcrumbComponent,
  BreadcrumbItem,
} from '../../../shared/components/breadcrumb/breadcrumb';

import { JobService } from '../../../domain/job/services/job.service';
import { JobDetail as JobDetailModel } from '../../../domain/job/models/job.model';
import { JobDetailHeaderComponent } from './components/job-detail-header/job-detail-header';
import { JobDetailOverviewComponent } from './components/job-detail-overview/job-detail-overview';
import { JobApplicationListComponent } from './components/application/job-application-list';

import { JobFormModalComponent } from '../job/job-form-modal/job-form-modal';
import { JobStatus } from '../../../domain/master-data';
import { JobStatusService } from '../../../domain/master-data/job-status/job-status.service';

type JobDetailTab = 'detail' | 'candidate';

@Component({
  selector: 'app-job-detail',
  standalone: true,
  imports: [
    CommonModule,
    BreadcrumbComponent,
    JobDetailHeaderComponent,
    JobDetailOverviewComponent,
    JobApplicationListComponent,
    JobFormModalComponent,
  ],
  templateUrl: './job-detail.html',
})

export class JobDetail implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly jobService = inject(JobService);
  private readonly jobStatusService = inject(JobStatusService);

  readonly job = signal<JobDetailModel | null>(null);

  readonly isLoading = signal(false);
  readonly errorMessage = signal('');
  readonly statuses = signal<JobStatus[]>([]);
  readonly activeTab = signal<JobDetailTab>('detail');
  readonly isJobFormModalOpen = signal(false);
  readonly selectedJobId = signal<string | null>(null);
  readonly breadcrumbItems = signal<BreadcrumbItem[]>([
    { label: 'Home', route: '/' },
    { label: 'Job', route: '/management/job' },
    { label: 'Detail' },
  ]);

  slug = '';

  readonly hasJob = computed(() => !!this.job());

  readonly currentJobId = computed(() => this.job()?.id ?? null);

  readonly currentStatusId = computed(() => this.job()?.statusId ?? '');

  hiringManager = 'User PIC Manager';

  ngOnInit(): void {
    this.slug = this.route.snapshot.paramMap.get('slug') || '';

    if (!this.slug) {
      this.errorMessage.set('Slug job tidak ditemukan.');
      return;
    }

    this.loadJobDetail();
  }

  loadJobDetail(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    forkJoin({
      job: this.jobService.getJobBySlug(this.slug),
      statuses: this.jobStatusService.getAll(),
    }).subscribe({
      next: ({ job, statuses }) => {
        this.job.set(job);
        this.statuses.set(statuses.filter((status) => status.isActive));

        this.breadcrumbItems.set([
          { label: 'Home', route: '/' },
          { label: 'Job', route: '/management/job' },
          { label: job.title || 'Detail' },
        ]);

        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Failed to load job detail:', error);

        this.job.set(null);
        this.statuses.set([]);
        this.errorMessage.set('Gagal memuat detail lowongan.');

        this.isLoading.set(false);
      },
    });
  }

  setActiveTab(tab: JobDetailTab): void {
    this.activeTab.set(tab);
  }

  openEditJobModal(): void {
    const job = this.job();

    if (!job?.id) return;

    this.selectedJobId.set(job.id);
    this.isJobFormModalOpen.set(true);
  }

  onCloseJobFormModal(): void {
    this.isJobFormModalOpen.set(false);
    this.selectedJobId.set(null);
  }

  onJobSaved(): void {
    this.isJobFormModalOpen.set(false);
    this.selectedJobId.set(null);

    this.loadJobDetail();
  }

  updateStatus(statusId: string): void {
    const job = this.job();

    if (!job || statusId === job.statusId) return;

    this.jobService.updateJobStatus(job.id, { statusId }).subscribe({
      next: (updatedJob) => {
        this.job.set(updatedJob);
      },
      error: (error) => {
        console.error(error);
      },
    });
  }
}
