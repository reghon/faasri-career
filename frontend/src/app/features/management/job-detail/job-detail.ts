import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  BreadcrumbComponent,
  BreadcrumbItem,
} from '../../../shared/components/breadcrumb/breadcrumb';
import { JobService } from '../../../domain/job/services/job.service';
import { JobDetail as JobDetailModel } from '../../../domain/job/models/job.model';

@Component({
  selector: 'app-job-detail',
  standalone: true,
  imports: [CommonModule, BreadcrumbComponent],
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

  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Management', route: '/management' },
    { label: 'Job', route: '/management/job' },
    { label: 'Detail' },
  ];

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
          { label: 'Management', route: '/management' },
          { label: 'Job', route: '/management/job' },
          { label: job.title || this.slug },
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

  formatDate(value: string | null | undefined): string {
    if (!value) return '-';

    return new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }).format(new Date(value));
  }
}
