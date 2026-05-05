import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  inject,
} from '@angular/core';

import { JobDetail as JobDetailModel } from '../../../../../domain/job/models/job.model';
import { ApplyService } from '../../../../../domain/apply/apply.service';
import { ApplyByJobItem } from '../../../../../domain/apply/apply.model';

type JobDetailTab = 'detail' | 'candidate' | 'pipeline' | 'activity';

@Component({
  selector: 'app-job-detail-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './job-detail-header.html',
})
export class JobDetailHeaderComponent implements OnChanges {
  private readonly applyService = inject(ApplyService);
  private readonly cdr = inject(ChangeDetectorRef);

  @Input({ required: true }) job!: JobDetailModel;
  @Input() activeTab: JobDetailTab = 'detail';

  @Output() tabChange = new EventEmitter<JobDetailTab>();

  applicantsCount = 0;
  rejectedCount = 0;
  inProgressCount = 0;
  hiredCount = 0;

  tabs: { label: string; value: JobDetailTab }[] = [
    { label: 'Detail', value: 'detail' },
    { label: 'Candidate', value: 'candidate' },
    { label: 'Pipeline', value: 'pipeline' },
    { label: 'Activity', value: 'activity' },
  ];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['job'] && this.job?.id) {
      this.loadApplicationCounter(this.job.id);
    }
  }

  loadApplicationCounter(jobId: string): void {
    this.applyService.getByJobId(jobId).subscribe({
      next: (applications) => {
        this.setApplicationCounter(applications);
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Failed to load application counter:', error);
        this.resetApplicationCounter();
        this.cdr.detectChanges();
      },
    });
  }

  private setApplicationCounter(applications: ApplyByJobItem[]): void {
    this.applicantsCount = applications.length;

    this.rejectedCount = applications.filter((item) => {
      return item.statusCode?.toUpperCase() === 'REJECTED';
    }).length;

    this.hiredCount = applications.filter((item) => {
      return item.statusCode?.toUpperCase() === 'HIRED';
    }).length;

    this.inProgressCount = applications.filter((item) => {
      const statusCode = item.statusCode?.toUpperCase();

      return statusCode !== 'REJECTED' && statusCode !== 'HIRED';
    }).length;
  }

  private resetApplicationCounter(): void {
    this.applicantsCount = 0;
    this.rejectedCount = 0;
    this.inProgressCount = 0;
    this.hiredCount = 0;
  }

  setTab(tab: JobDetailTab): void {
    this.tabChange.emit(tab);
  }

  getStatusBadgeClass(status: string | null | undefined): string {
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

  getDisplayStatus(status: string | null | undefined): string {
    return status || 'Open';
  }
}
