import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';

import { JobDetail as JobDetailModel } from '../../../../../domain/job/models/job.model';
import { ApplyService } from '../../../../../domain/apply/apply.service';
import { ApplyByJobItem } from '../../../../../domain/apply/apply.model';
import { RbacService } from '../../../../../domain/authorization/rbac.service';
import { JobStatus } from '../../../../../domain/master-data';

type JobDetailTab = 'detail' | 'candidate';

@Component({
  selector: 'app-job-detail-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './job-detail-header.html',
})
export class JobDetailHeaderComponent {
  readonly rbac = inject(RbacService);
  private readonly applyService = inject(ApplyService);

  readonly job = input.required<JobDetailModel>();
  readonly activeTab = input<JobDetailTab>('detail');
  readonly statuses = input<JobStatus[]>([]);

  readonly tabChange = output<JobDetailTab>();
  readonly editJob = output<void>();
  readonly statusChange = output<string>();

  readonly applications = signal<ApplyByJobItem[]>([]);

  readonly title = computed(() => this.job().title || '-');

  readonly location = computed(() => this.job().location || '-');

  readonly managementProfile = computed(() => this.job().managementProfile || '-');

  readonly currentStatusId = computed(() => this.job().statusId || '');

  readonly currentStatus = computed(() => {
    const job = this.job();
    const status = this.statuses().find((item) => item.id === job.statusId);

    return status ?? null;
  });

  readonly currentStatusName = computed(
    () => this.currentStatus()?.name || this.job().status || 'Open',
  );

  readonly statusOptions = computed(() => {
    const currentStatusId = this.currentStatusId();

    return this.statuses().filter((status) => status.id !== currentStatusId);
  });

  readonly statusBadgeClass = computed(() => this.getStatusBadgeClass(this.currentStatusName()));

  readonly applicantsCount = computed(() => this.applications().length);

  readonly rejectedCount = computed(
    () =>
      this.applications().filter((item) => item.statusCode?.toUpperCase() === 'REJECTED').length,
  );

  readonly hiredCount = computed(
    () => this.applications().filter((item) => item.statusCode?.toUpperCase() === 'HIRED').length,
  );

  readonly inProgressCount = computed(
    () =>
      this.applications().filter((item) => {
        const statusCode = item.statusCode?.toUpperCase();

        return statusCode !== 'REJECTED' && statusCode !== 'HIRED';
      }).length,
  );

  readonly tabs: { label: string; value: JobDetailTab }[] = [
    {
      label: 'Detail',
      value: 'detail',
    },
    {
      label: 'Candidate',
      value: 'candidate',
    },
  ];

  constructor() {
    effect(() => {
      const jobId = this.job().id;

      if (jobId) {
        this.loadApplicationCounter(jobId);
      }
    });
  }

  private loadApplicationCounter(jobId: string): void {
    this.applyService.getByJobId(jobId).subscribe({
      next: (applications) => {
        this.applications.set(applications);
      },
      error: (error) => {
        console.error('Failed to load application counter:', error);

        this.applications.set([]);
      },
    });
  }

  setTab(tab: JobDetailTab): void {
    this.tabChange.emit(tab);
  }

  onEditJob(): void {
    this.editJob.emit();
  }

  onStatusSelect(statusId: string): void {
    if (!statusId || statusId === this.currentStatusId()) {
      return;
    }

    this.statusChange.emit(statusId);
  }

  private getStatusBadgeClass(status: string | null | undefined): string {
    const normalized = (status || '').toLowerCase();

    if (normalized.includes('open') || normalized.includes('active')) {
      return 'badge-success';
    }

    if (normalized.includes('draft')) {
      return 'badge-warning';
    }

    if (normalized.includes('closed') || normalized.includes('inactive')) {
      return 'badge-error';
    }

    return 'badge-ghost';
  }
}
