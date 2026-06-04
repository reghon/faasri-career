import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, Subscription, forkJoin } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { JobListItem } from '../../../domain/job/models/job.model';
import { JobService } from '../../../domain/job/services/job.service';
import { JobFormModalComponent } from './job-form-modal/job-form-modal';

import { JobStatusService } from '../../../domain/master-data/job-status/job-status.service';
import { DepartmentService } from '../../../domain/master-data/department/department.service';
import { JobLocationService } from '../../../domain/master-data/job-location/job-location.service';

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
} from '../../../shared/components/table-toolbar/table-toolbar';

import { getDisplayStatus, getStatusDotClass, getStatusTextClass } from './utils/job-filter.utils';
import { formatDate } from '../../../shared/utils/';
import { RbacService } from '../../../domain/authorization/rbac.service';

const DEFAULT_PAGE_SIZE = 10;
const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];
const SEARCH_DEBOUNCE_MS = 300;

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
export class Job implements OnInit, OnDestroy {
  private readonly jobService = inject(JobService);
  private readonly router = inject(Router);
  private readonly jobStatusService = inject(JobStatusService);
  private readonly departmentService = inject(DepartmentService);
  private readonly jobLocationService = inject(JobLocationService);

  readonly rbac = inject(RbacService);

  readonly isLoading = signal(false);
  readonly jobs = signal<JobListItem[]>([]);
  readonly totalItems = signal(0);
  readonly totalPages = signal(0);

  readonly searchTerm = signal('');
  readonly selectedStatus = signal('');
  readonly selectedDepartment = signal('');
  readonly selectedLocation = signal('');
  readonly currentPage = signal(1);
  readonly pageSize = signal(DEFAULT_PAGE_SIZE);

  readonly statusOptions = signal<string[]>([]);
  readonly departmentOptions = signal<string[]>([]);
  readonly locationOptions = signal<string[]>([]);

  readonly isJobFormModalOpen = signal(false);
  readonly selectedJobId = signal<string | null>(null);

  private readonly searchSubject = new Subject<string>();
  private searchSub!: Subscription;

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
    const total = this.totalItems();
    const page = this.currentPage();
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
      valueGetter: (job) =>
        formatDate(job.publishedAt, 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
    },
    { key: 'action', label: 'Action', type: 'action', align: 'right' },
  ];

  readonly toolbarActions: ToolbarAction[] = [{ key: 'reset', label: 'Reset Filters' }];

  readonly getStatusDotClass = getStatusDotClass;
  readonly getStatusTextClass = getStatusTextClass;

  ngOnInit(): void {
    this.loadFilterOptions();
    this.loadJobs();

    this.searchSub = this.searchSubject.pipe(debounceTime(SEARCH_DEBOUNCE_MS)).subscribe((value) => {
      this.searchTerm.set(value);
      this.currentPage.set(1);
      this.loadJobs();
    });
  }

  ngOnDestroy(): void {
    this.searchSub?.unsubscribe();
  }

  onToolbarSearchChange(value: string): void {
    this.searchSubject.next(value);
  }

  onToolbarFilterChange(event: { key: string; value: string }): void {
    if (event.key === 'status') this.selectedStatus.set(event.value);
    if (event.key === 'department') this.selectedDepartment.set(event.value);
    if (event.key === 'location') this.selectedLocation.set(event.value);
    this.currentPage.set(1);
    this.loadJobs();
  }

  onToolbarAction(action: string): void {
    if (action === 'reset') this.resetFilters();
  }

  onPageSizeChange(size: number): void {
    this.pageSize.set(size);
    this.currentPage.set(1);
    this.loadJobs();
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages()) return;
    this.currentPage.set(page);
    this.loadJobs();
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

    this.jobService
      .getJobs({
        page: this.currentPage(),
        limit: this.pageSize(),
        search: this.searchTerm(),
        status: this.selectedStatus(),
        department: this.selectedDepartment(),
        location: this.selectedLocation(),
      })
      .subscribe({
        next: (response) => {
          this.jobs.set(response.items);
          this.totalItems.set(response.meta.total);
          this.totalPages.set(response.meta.totalPages);
          this.isLoading.set(false);
        },
        error: () => {
          this.jobs.set([]);
          this.totalItems.set(0);
          this.totalPages.set(0);
          this.isLoading.set(false);
        },
      });
  }

  private loadFilterOptions(): void {
    forkJoin([
      this.jobStatusService.getAll(),
      this.departmentService.getAll(),
      this.jobLocationService.getAll(),
    ]).subscribe({
      next: ([statuses, departments, locations]) => {
        this.statusOptions.set(
          statuses.filter((s) => s.isActive).map((s) => s.name),
        );
        this.departmentOptions.set(
          departments.filter((d) => d.isActive).map((d) => d.name),
        );
        this.locationOptions.set(
          locations.filter((l) => l.isActive).map((l) => l.name),
        );
      },
    });
  }

  private resetFilters(): void {
    this.searchTerm.set('');
    this.selectedStatus.set('');
    this.selectedDepartment.set('');
    this.selectedLocation.set('');
    this.currentPage.set(1);
    this.loadJobs();
  }
}
