import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { JobListItem } from '../../../domain/job/models/job.model';
import { JobService } from '../../../domain/job/services/job.service';
import { JobFormModalComponent } from './job-form-modal/job-form-modal';

import {
  BreadcrumbComponent,
  BreadcrumbItem,
} from '../../../shared/components/breadcrumb/breadcrumb';

import {
  DataTableColumn,
  DataTableComponent,
  DataTablePagination,
} from '../../../shared/components/data-table/data-table';

import {
  TableToolbarComponent,
  ToolbarAction,
  ToolbarFilter,
  ToolbarSortOption,
} from '../../../shared/components/table-toolbar/table-toolbar';

import {
  JobFilters,
  SortDirection,
  SortField,
  filterJobs,
  getDisplayStatus,
  getStatusDotClass,
  getStatusTextClass,
  sortJobs,
} from './utils/job-filter.utils';

import { getUniqueOptions, paginate, formatDate } from '../../../shared/utils/';
import { RbacService } from '../../../domain/authorization/rbac.service';

const DEFAULT_SORT_FIELD: SortField = 'publishedAt';
const DEFAULT_SORT_DIRECTION: SortDirection = 'desc';
const DEFAULT_PAGE_SIZE = 10;
const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

@Component({
  selector: 'app-job',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    JobFormModalComponent,
    BreadcrumbComponent,
    DataTableComponent,
    TableToolbarComponent,
  ],
  templateUrl: './job.html',
})
export class Job implements OnInit {
  private readonly jobService = inject(JobService);
  private readonly router = inject(Router);

  readonly rbac = inject(RbacService);

  readonly isLoading = signal(false);
  readonly jobs = signal<JobListItem[]>([]);

  readonly searchTerm = signal('');
  readonly selectedStatus = signal('');
  readonly selectedDepartment = signal('');
  readonly selectedLocation = signal('');
  readonly sortField = signal<SortField>(DEFAULT_SORT_FIELD);
  readonly sortDirection = signal<SortDirection>(DEFAULT_SORT_DIRECTION);
  readonly currentPage = signal(1);
  readonly pageSize = signal(DEFAULT_PAGE_SIZE);

  readonly isJobFormModalOpen = signal(false);
  readonly selectedJobId = signal<string | null>(null);

  readonly filteredJobs = computed(() => {
    const filters: JobFilters = {
      keyword: this.searchTerm(),
      status: this.selectedStatus(),
      department: this.selectedDepartment(),
      location: this.selectedLocation(),
    };

    const filtered = filterJobs(this.jobs(), filters);
    return sortJobs(filtered, this.sortField(), this.sortDirection());
  });

  readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(this.filteredJobs().length / this.pageSize())),
  );

  readonly safePage = computed(() => Math.min(this.currentPage(), this.totalPages()));

  readonly pagedJobs = computed(() =>
    paginate(this.filteredJobs(), this.safePage(), this.pageSize()),
  );

  readonly statusOptions = computed(() =>
    getUniqueOptions(this.jobs().map((item) => item.status)),
  );

  readonly departmentOptions = computed(() =>
    getUniqueOptions(this.jobs().map((item) => item.department)),
  );

  readonly locationOptions = computed(() =>
    getUniqueOptions(this.jobs().map((item) => item.location)),
  );

  readonly toolbarFilters = computed<ToolbarFilter[]>(() => [
    {
      key: 'status',
      label: 'All Status',
      value: this.selectedStatus(),
      options: this.statusOptions(),
    },
    {
      key: 'department',
      label: 'All Departments',
      value: this.selectedDepartment(),
      options: this.departmentOptions(),
    },
    {
      key: 'location',
      label: 'All Locations',
      value: this.selectedLocation(),
      options: this.locationOptions(),
    },
  ]);

  readonly tablePagination = computed<DataTablePagination>(() => {
    const total = this.filteredJobs().length;
    const page = this.safePage();
    const size = this.pageSize();

    return {
      currentPage: page,
      totalPages: this.totalPages(),
      startEntry: total === 0 ? 0 : (page - 1) * size + 1,
      endEntry: Math.min(page * size, total),
      totalItems: total,
      pageSize: size,
      pageSizeOptions: PAGE_SIZE_OPTIONS,
    };
  });

  readonly breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Management', route: '/management' },
    { label: 'Job' },
  ];

  readonly jobColumns: DataTableColumn<JobListItem>[] = [
    { key: 'title', label: 'Job Title', minWidth: '220px' },
    { key: 'department', label: 'Department' },
    { key: 'location', label: 'Location' },
    { key: 'workType', label: 'Work Type' },
    { key: 'jobType', label: 'Job Type' },
    { key: 'vacancyCount', label: 'Vacancy', type: 'number', align: 'center' },
    {
      key: 'status',
      label: 'Status',
      type: 'badge',
      align: 'center',
      valueGetter: (job) => getDisplayStatus(job),
    },
    {
      key: 'publishedAt',
      label: 'Posted Date',
      type: 'date',
      valueGetter: (job) => formatDate(job.publishedAt, 'en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
    },
    { key: 'action', label: 'Action', type: 'action', align: 'right' },
  ];

  readonly toolbarSortOptions: ToolbarSortOption[] = [
    { key: 'publishedAt', label: 'Sort by Posted Date' },
    { key: 'title', label: 'Sort by Job Title' },
    { key: 'status', label: 'Sort by Status' },
  ];

  readonly toolbarActions: ToolbarAction[] = [{ key: 'reset', label: 'Reset Filters' }];

  readonly getStatusDotClass = getStatusDotClass;
  readonly getStatusTextClass = getStatusTextClass;

  ngOnInit(): void {
    this.loadJobs();
  }

  onToolbarSearchChange(value: string): void {
    this.searchTerm.set(value);
    this.currentPage.set(1);
  }

  onToolbarFilterChange(event: { key: string; value: string }): void {
    if (event.key === 'status') this.selectedStatus.set(event.value);
    if (event.key === 'department') this.selectedDepartment.set(event.value);
    if (event.key === 'location') this.selectedLocation.set(event.value);
    this.currentPage.set(1);
  }

  onToolbarSortDirectionChange(direction: SortDirection): void {
    this.sortDirection.set(direction);
  }

  onToolbarSortByChange(field: string): void {
    const incoming = field as SortField;

    if (this.sortField() === incoming) {
      this.sortDirection.update((dir) => (dir === 'asc' ? 'desc' : 'asc'));
      return;
    }

    this.sortField.set(incoming);
    this.sortDirection.set(incoming === 'publishedAt' ? 'desc' : 'asc');
  }

  onToolbarAction(action: string): void {
    if (action === 'reset') this.resetFilters();
  }

  onPageSizeChange(size: number): void {
    this.pageSize.set(size);
    this.currentPage.set(1);
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages()) return;
    this.currentPage.set(page);
  }

  viewJob(job: JobListItem): void {
    this.router.navigate(['/management/job', job.slug]);
  }

  editJob(job: JobListItem): void {
    this.selectedJobId.set(job.id);
    this.isJobFormModalOpen.set(true);
  }

  openCreateModal(): void {
    this.selectedJobId.set(null);
    this.isJobFormModalOpen.set(true);
  }

  openEditModal(jobId: string): void {
    this.selectedJobId.set(jobId);
    this.isJobFormModalOpen.set(true);
  }

  onCloseJobFormModal(): void {
    this.isJobFormModalOpen.set(false);
    this.selectedJobId.set(null);
  }

  onJobSaved(): void {
    this.isJobFormModalOpen.set(false);
    this.selectedJobId.set(null);
    this.loadJobs();
  }

  private loadJobs(): void {
    this.isLoading.set(true);

    this.jobService.getJobs({ page: 1, limit: 100 }).subscribe({
      next: (response) => {
        this.jobs.set(response.items);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Failed to load jobs:', error);
        this.jobs.set([]);
        this.isLoading.set(false);
      },
    });
  }

  private resetFilters(): void {
    this.searchTerm.set('');
    this.selectedStatus.set('');
    this.selectedDepartment.set('');
    this.selectedLocation.set('');
    this.sortField.set(DEFAULT_SORT_FIELD);
    this.sortDirection.set(DEFAULT_SORT_DIRECTION);
    this.currentPage.set(1);
  }
}
