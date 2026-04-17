import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { JobListItem } from '../../../domain/job/models/job.model';
import { JobService } from '../../../domain/job/services/job.service';
import { JobFormModalComponent } from './components/job-form-modal/job-form-modal';
import { PaginationComponent } from '../../../shared/components/pagination/pagination';
import { TableActionComponent } from '../../../shared/components/table-action/table-action';
import {
  BreadcrumbComponent,
  BreadcrumbItem,
} from '../../../shared/components/breadcrumb/breadcrumb';
import { Router } from '@angular/router';

type SortField = 'publishedAt' | 'title' | 'status';
type SortDirection = 'asc' | 'desc';

@Component({
  selector: 'app-job',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    JobFormModalComponent,
    PaginationComponent,
    TableActionComponent,
    BreadcrumbComponent,
  ],
  templateUrl: './job.html',
})
export class Job implements OnInit {
  private readonly jobService = inject(JobService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly router = inject(Router);

  jobs: JobListItem[] = [];
  filteredJobs: JobListItem[] = [];
  pagedJobs: JobListItem[] = [];
  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Management', route: '/management' },
    { label: 'Job' },
  ];
  isLoading = false;

  searchTerm = '';
  selectedStatus = '';
  selectedDepartment = '';
  selectedLocation = '';

  statusOptions: string[] = [];
  departmentOptions: string[] = [];
  locationOptions: string[] = [];

  pageSizeOptions = [10, 25, 50, 100];
  pageSize = 10;
  currentPage = 1;

  sortField: SortField = 'publishedAt';
  sortDirection: SortDirection = 'desc';

  ngOnInit(): void {
    this.loadJobs();
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredJobs.length / this.pageSize));
  }

  get startEntry(): number {
    if (this.filteredJobs.length === 0) return 0;
    return (this.currentPage - 1) * this.pageSize + 1;
  }

  get endEntry(): number {
    return Math.min(this.currentPage * this.pageSize, this.filteredJobs.length);
  }

  loadJobs(): void {
    this.isLoading = true;
    this.cdr.detectChanges();

    this.jobService.getJobs({ page: 1, limit: 100 }).subscribe({
      next: (response) => {
        this.jobs = response.items;
        this.buildFilterOptions();
        this.applyFilters();
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Failed to load jobs:', error);
        this.jobs = [];
        this.filteredJobs = [];
        this.pagedJobs = [];
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  onFilterChange(): void {
    this.currentPage = 1;
    this.applyFilters();
    this.cdr.detectChanges();
  }

  onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.currentPage = 1;
    this.paginate();
    this.cdr.detectChanges();
  }
  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.paginate();
    this.cdr.detectChanges();
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.selectedStatus = '';
    this.selectedDepartment = '';
    this.selectedLocation = '';
    this.sortField = 'publishedAt';
    this.sortDirection = 'desc';
    this.currentPage = 1;
    this.applyFilters();
    this.cdr.detectChanges();
  }

  sortBy(field: SortField): void {
    if (this.sortField === field) {
      this.toggleSortDirection();
      return;
    }

    this.sortField = field;
    this.sortDirection = field === 'publishedAt' ? 'desc' : 'asc';
    this.applyFilters();
    this.cdr.detectChanges();
  }

  toggleSortDirection(): void {
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.applyFilters();
    this.cdr.detectChanges();
  }

  createJob(): void {
    console.log('Create job clicked');
  }

  viewJob(job: JobListItem): void {
    this.router.navigate(['/management/job', job.slug]);
  }

  editJob(job: any): void {
    this.selectedJobId = job.id;
    this.isJobFormModalOpen = true;
  }

  getDisplayStatus(job: JobListItem): string {
    if (!job.isActive) return 'Inactive';
    return job.status || 'Unknown';
  }

  getStatusDotClass(job: JobListItem): string {
    const status = this.getDisplayStatus(job).toLowerCase();

    if (status.includes('open') || status.includes('active')) {
      return 'bg-success shadow-[0_0_8px_rgba(34,197,94,0.7)]';
    }

    if (status.includes('close') || status.includes('closed')) {
      return 'bg-error shadow-[0_0_8px_rgba(239,68,68,0.5)]';
    }

    if (status.includes('draft') || status.includes('pending')) {
      return 'bg-warning shadow-[0_0_8px_rgba(245,158,11,0.5)]';
    }

    return 'bg-base-300';
  }

  getStatusTextClass(job: JobListItem): string {
    const status = this.getDisplayStatus(job).toLowerCase();

    if (status.includes('open') || status.includes('active')) {
      return 'text-success';
    }

    if (status.includes('close') || status.includes('closed')) {
      return 'text-error';
    }

    if (status.includes('draft') || status.includes('pending')) {
      return 'text-warning';
    }

    return 'text-base-content/70';
  }

  formatDate(value: string): string {
    if (!value) return '-';

    return new Intl.DateTimeFormat('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date(value));
  }

  private buildFilterOptions(): void {
    this.statusOptions = this.getUniqueOptions(this.jobs.map((item) => item.status));
    this.departmentOptions = this.getUniqueOptions(this.jobs.map((item) => item.department));
    this.locationOptions = this.getUniqueOptions(this.jobs.map((item) => item.location));
  }

  private getUniqueOptions(values: string[]): string[] {
    return [...new Set(values.filter(Boolean))].sort((a, b) => a.localeCompare(b));
  }

  private applyFilters(): void {
    const keyword = this.searchTerm.trim().toLowerCase();

    let result = [...this.jobs];

    if (keyword) {
      result = result.filter((job) => {
        const searchableValues = [
          job.id,
          job.slug,
          job.title,
          job.category,
          job.department,
          job.location,
          job.workType,
          job.jobType,
          job.status,
          job.educationLevel,
        ];

        return searchableValues.some((value) => value?.toLowerCase().includes(keyword));
      });
    }

    if (this.selectedStatus) {
      result = result.filter((job) => job.status === this.selectedStatus);
    }

    if (this.selectedDepartment) {
      result = result.filter((job) => job.department === this.selectedDepartment);
    }

    if (this.selectedLocation) {
      result = result.filter((job) => job.location === this.selectedLocation);
    }

    result.sort((a, b) => this.compareJobs(a, b));

    this.filteredJobs = result;

    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages;
    }

    this.paginate();
  }

  private paginate(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.pagedJobs = this.filteredJobs.slice(start, end);
  }

  private compareJobs(a: JobListItem, b: JobListItem): number {
    let comparison = 0;

    if (this.sortField === 'title') {
      comparison = a.title.localeCompare(b.title);
    }

    if (this.sortField === 'status') {
      comparison = this.getDisplayStatus(a).localeCompare(this.getDisplayStatus(b));
    }

    if (this.sortField === 'publishedAt') {
      comparison = new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime();
    }

    return this.sortDirection === 'asc' ? comparison : -comparison;
  }
  isJobFormModalOpen = false;
  selectedJobId: string | null = null;

  openCreateModal(): void {
    this.selectedJobId = null;
    this.isJobFormModalOpen = true;
  }

  openEditModal(jobId: string): void {
    this.selectedJobId = jobId;
    this.isJobFormModalOpen = true;
  }

  onCloseJobFormModal(): void {
    this.isJobFormModalOpen = false;
    this.selectedJobId = null;
    this.cdr.detectChanges();
  }

  onJobSaved(): void {
    this.isJobFormModalOpen = false;
    this.selectedJobId = null;
    this.loadJobs();
    this.cdr.detectChanges();
  }
}
