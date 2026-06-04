import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, Subscription, forkJoin } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

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
import { TableActionItem } from '../../../shared/components/table-action/table-action';

import { ApplyListItem } from '../../../domain/apply/apply.model';
import { ApplyService } from '../../../domain/apply/apply.service';
import { JobService } from '../../../domain/job/services/job.service';
import { JobApplyStatusService } from '../../../domain/apply/master-data/job-apply-status/job-apply-status.services';
import { ApplyStatusHistoryService } from '../../../domain/apply/master-data/apply-status-history/apply-status-history.service';
import { ApplyStatusService } from '../../../domain/apply/master-data/apply-status/apply-status.service';

import { MoveStatusConfirmModalComponent } from '../job-detail/components/application/components/move-status-confirm-modal';

import { formatDate } from '../../../shared/utils';
import {
  ApplyStatusMovementItem,
  buildMoveStatusActions,
  getUniqueJobIds,
  mapJobApplyStatuses,
} from '../../../shared/utils/apply-status-movement';
import { RbacService } from '../../../domain/authorization/rbac.service';

const DEFAULT_PAGE_SIZE = 10;
const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];
const SEARCH_DEBOUNCE_MS = 300;

type ApplicationListItem = ApplyListItem & {
  jobId: string;
  statusId: string;
  statusCode?: string | null;
};

@Component({
  selector: 'app-application',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    BreadcrumbComponent,
    DataTableComponent,
    TableToolbarComponent,
    MoveStatusConfirmModalComponent,
  ],
  templateUrl: './application.html',
})
export class Application implements OnInit, OnDestroy {
  private readonly applyService = inject(ApplyService);
  private readonly jobService = inject(JobService);
  private readonly applyStatusService = inject(ApplyStatusService);
  private readonly router = inject(Router);
  private readonly jobApplyStatusService = inject(JobApplyStatusService);
  private readonly applyStatusHistoryService = inject(ApplyStatusHistoryService);
  private readonly statusCache = new Map<string, ApplyStatusMovementItem[]>();

  readonly rbac = inject(RbacService);

  readonly isLoading = signal(false);
  readonly isMovingStatus = signal(false);
  readonly errorMessage = signal('');

  readonly applications = signal<ApplicationListItem[]>([]);
  readonly totalItems = signal(0);
  readonly totalPages = signal(0);

  readonly searchTerm = signal('');
  readonly selectedJobName = signal('');
  readonly selectedStatusName = signal('');
  readonly sortBy = signal('');
  readonly sortDirection = signal<'asc' | 'desc'>('desc');
  readonly currentPage = signal(1);
  readonly pageSize = signal(DEFAULT_PAGE_SIZE);

  readonly jobNameOptions = signal<string[]>([]);
  readonly statusNameOptions = signal<string[]>([]);

  readonly isMoveStatusModalOpen = signal(false);
  readonly selectedApplication = signal<ApplicationListItem | null>(null);
  readonly selectedTargetStatus = signal<ApplyStatusMovementItem | null>(null);

  private readonly searchSubject = new Subject<string>();
  private searchSub!: Subscription;

  readonly toolbarFilters = computed<ToolbarFilter[]>(() => [
    {
      key: 'jobName',
      label: 'All Job',
      value: this.selectedJobName(),
      options: this.jobNameOptions(),
    },
    {
      key: 'statusName',
      label: 'All Status',
      value: this.selectedStatusName(),
      options: this.statusNameOptions(),
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

  readonly moveStatusModalMessage = computed(() => {
    const applicantName = this.selectedApplication()?.fullName || 'kandidat';
    const statusName = this.selectedTargetStatus()?.name || 'status tujuan';
    return `Pindahkan ${applicantName} ke status ${statusName}?`;
  });

  readonly shouldShowMoveNotes = computed(() => {
    const targetStatus = this.selectedTargetStatus();
    if (!targetStatus) return false;
    const statusText = `${targetStatus.code} ${targetStatus.name}`.toLowerCase();
    return statusText.includes('reject') || statusText.includes('hire');
  });

  readonly breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Management', route: '/management' },
    { label: 'Application' },
  ];

  readonly applicationColumns: DataTableColumn<ApplicationListItem>[] = [
    {
      key: 'fullName',
      label: 'Full Name',
      minWidth: '220px',
      valueGetter: (item) => item.fullName || '-',
    },
    {
      key: 'linkedinUrl',
      label: 'LinkedIn',
      minWidth: '160px',
      valueGetter: (item) => this.formatLinkedinUsername(item.linkedinUrl),
    },
    { key: 'jobName', label: 'Job', minWidth: '220px', valueGetter: (item) => item.jobName || '-' },
    {
      key: 'statusName',
      label: 'Status',
      align: 'center',
      valueGetter: (item) => item.statusName || '-',
    },
    { key: 'appliedAt', label: 'Applied At', valueGetter: (item) => formatDate(item.appliedAt) },
    {
      key: 'statusUpdatedAt',
      label: 'Status Updated At',
      valueGetter: (item) => formatDate(item.statusUpdatedAt),
    },
    { key: 'action', label: 'Action', type: 'action', align: 'right', minWidth: '120px' },
  ];

  readonly toolbarSortOptions: ToolbarSortOption[] = [
    { key: 'full_name', label: 'Full Name' },
    { key: 'job_name', label: 'Job' },
    { key: 'status_name', label: 'Status' },
    { key: 'applied_at', label: 'Applied At' },
  ];

  readonly toolbarActions: ToolbarAction[] = [{ key: 'reset', label: 'Reset Filters' }];

  ngOnInit(): void {
    this.loadFilterOptions();
    this.loadApplications();

    this.searchSub = this.searchSubject.pipe(debounceTime(SEARCH_DEBOUNCE_MS)).subscribe((value) => {
      this.searchTerm.set(value);
      this.currentPage.set(1);
      this.loadApplications();
    });
  }

  ngOnDestroy(): void {
    this.searchSub?.unsubscribe();
  }

  getApplicationActions(row: ApplicationListItem): TableActionItem[] {
    if (!row.jobId) {
      return [{ label: 'Job ID tidak tersedia', value: 'missing_job_id', disabled: true }];
    }
    const statuses = this.statusCache.get(row.jobId);
    if (!statuses) {
      return [{ label: 'Status tidak tersedia', value: 'statuses_not_available', disabled: true }];
    }
    return buildMoveStatusActions(statuses, row.statusId);
  }

  handleApplicationAction(event: { action: string; row: ApplicationListItem }): void {
    if (!event.action.startsWith('move_status:')) return;
    const statusId = event.action.split(':')[1];
    this.openMoveStatusModal(event.row, statusId);
  }

  openMoveStatusModal(row: ApplicationListItem, statusId: string): void {
    const targetStatus = (this.statusCache.get(row.jobId) ?? []).find((s) => s.id === statusId);
    if (!targetStatus) {
      this.errorMessage.set('Status tujuan tidak ditemukan.');
      return;
    }
    this.selectedApplication.set(row);
    this.selectedTargetStatus.set(targetStatus);
    this.isMoveStatusModalOpen.set(true);
    this.errorMessage.set('');
  }

  closeMoveStatusModal(): void {
    if (this.isMovingStatus()) return;
    this.isMoveStatusModalOpen.set(false);
    this.selectedApplication.set(null);
    this.selectedTargetStatus.set(null);
  }

  confirmMoveStatus(event: { notes: string | null }): void {
    const application = this.selectedApplication();
    const targetStatus = this.selectedTargetStatus();
    if (!application || !targetStatus) return;
    this.moveApplicationStatus(application, targetStatus, event.notes);
  }

  formatLinkedinUsername(url: string | null | undefined): string {
    if (!url) return '-';
    const match = url.trim().match(/linkedin\.com\/in\/([^/?#]+)/i);
    if (match?.[1]) return `@${match[1]}`;
    return url.trim().replace(/^https?:\/\/(www\.)?/i, '').replace(/\/$/, '');
  }

  onToolbarSearchChange(value: string): void {
    this.searchSubject.next(value);
  }

  onToolbarFilterChange(event: { key: string; value: string }): void {
    if (event.key === 'jobName') this.selectedJobName.set(event.value);
    if (event.key === 'statusName') this.selectedStatusName.set(event.value);
    this.currentPage.set(1);
    this.loadApplications();
  }

  onToolbarSortByChange(field: string): void {
    if (this.sortBy() === field) {
      this.sortDirection.update((dir) => (dir === 'asc' ? 'desc' : 'asc'));
    } else {
      this.sortBy.set(field);
      this.sortDirection.set(field === 'full_name' ? 'asc' : 'desc');
    }
    this.currentPage.set(1);
    this.loadApplications();
  }

  onToolbarSortDirectionChange(direction: 'asc' | 'desc'): void {
    this.sortDirection.set(direction);
    this.currentPage.set(1);
    this.loadApplications();
  }

  onToolbarAction(action: string): void {
    if (action === 'reset') this.resetFilters();
  }

  onPageSizeChange(size: number): void {
    this.pageSize.set(size);
    this.currentPage.set(1);
    this.loadApplications();
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages()) return;
    this.currentPage.set(page);
    this.loadApplications();
  }

  viewApplication(application: ApplicationListItem): void {
    this.router.navigate(['/management/application', application.id]);
  }

  private moveApplicationStatus(
    application: ApplicationListItem,
    targetStatus: ApplyStatusMovementItem,
    notes: string | null = null,
  ): void {
    this.isMovingStatus.set(true);
    this.errorMessage.set('');

    this.applyStatusHistoryService
      .create({ applyId: application.id, applyStatusId: targetStatus.id, notes })
      .subscribe({
        next: () => {
          this.isMovingStatus.set(false);
          this.isMoveStatusModalOpen.set(false);
          this.selectedApplication.set(null);
          this.selectedTargetStatus.set(null);
          this.loadApplications();
        },
        error: (error) => {
          this.errorMessage.set(error?.error?.message || 'Gagal memindahkan status application.');
          this.isMovingStatus.set(false);
        },
      });
  }

  private loadApplications(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.applyService
      .getAll({
        page: this.currentPage(),
        limit: this.pageSize(),
        search: this.searchTerm(),
        jobName: this.selectedJobName(),
        statusName: this.selectedStatusName(),
        sortBy: this.sortBy(),
        sortDirection: this.sortDirection(),
      })
      .subscribe({
        next: (response) => {
          const items = response.items as ApplicationListItem[];
          this.applications.set(items);
          this.totalItems.set(response.meta.total);
          this.totalPages.set(response.meta.totalPages);
          this.loadStatusCacheForItems(items);
          this.isLoading.set(false);
        },
        error: () => {
          this.applications.set([]);
          this.totalItems.set(0);
          this.totalPages.set(0);
          this.errorMessage.set('Gagal memuat data application.');
          this.isLoading.set(false);
        },
      });
  }

  private loadStatusCacheForItems(items: ApplicationListItem[]): void {
    const jobIds = getUniqueJobIds(items);
    const uncachedJobIds = jobIds.filter((id) => !this.statusCache.has(id));

    if (uncachedJobIds.length === 0) return;

    forkJoin(uncachedJobIds.map((jobId) => this.jobApplyStatusService.getByJobId(jobId))).subscribe({
      next: (statusGroups) => {
        statusGroups.forEach((statuses, index) => {
          this.statusCache.set(uncachedJobIds[index], mapJobApplyStatuses(statuses));
        });
      },
    });
  }

  private loadFilterOptions(): void {
    forkJoin([
      this.jobService.getJobs({ page: 1, limit: 100, status: 'Open' }),
      this.applyStatusService.getAll(),
    ]).subscribe({
      next: ([jobsResult, statuses]) => {
        this.jobNameOptions.set(jobsResult.items.map((j) => j.title));
        this.statusNameOptions.set(
          statuses.filter((s) => s.isActive).map((s) => s.name),
        );
      },
    });
  }

  private resetFilters(): void {
    this.searchTerm.set('');
    this.selectedJobName.set('');
    this.selectedStatusName.set('');
    this.sortBy.set('');
    this.sortDirection.set('desc');
    this.currentPage.set(1);
    this.loadApplications();
  }
}
