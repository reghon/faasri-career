import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';

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
import { JobApplyStatusService } from '../../../domain/apply/master-data/job-apply-status/job-apply-status.services';
import { ApplyStatusHistoryService } from '../../../domain/apply/master-data/apply-status-history/apply-status-history.service';

import { ConfirmModalComponent } from '../job-detail/components/application/components/confirm-modal';

import {
  ApplicationFilters,
  SortDirection,
  SortField,
  filterApplications,
  sortApplications,
} from './utils/application-filter.utils';
import { formatDate } from '../../../shared/utils';
import { getUniqueOptions, paginate } from '../../../shared/utils/';
import {
  ApplyStatusMovementItem,
  buildMoveStatusActions,
  getUniqueJobIds,
  mapJobApplyStatuses,
} from '../../../shared/utils/apply-status-movement';

const DEFAULT_SORT_FIELD: SortField = 'appliedAt';
const DEFAULT_SORT_DIRECTION: SortDirection = 'desc';
const DEFAULT_PAGE_SIZE = 10;
const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

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
    ConfirmModalComponent,
  ],
  templateUrl: './application.html',
})
export class Application implements OnInit {
  private readonly applyService = inject(ApplyService);
  private readonly router = inject(Router);
  private readonly jobApplyStatusService = inject(JobApplyStatusService);
  private readonly applyStatusHistoryService = inject(ApplyStatusHistoryService);
  private readonly statusCache = new Map<string, ApplyStatusMovementItem[]>();

  readonly isLoading = signal(false);
  readonly isMovingStatus = signal(false);
  readonly errorMessage = signal('');

  readonly applications = signal<ApplicationListItem[]>([]);

  readonly searchTerm = signal('');
  readonly selectedJobName = signal('');
  readonly selectedStatusName = signal('');
  readonly sortField = signal<SortField>(DEFAULT_SORT_FIELD);
  readonly sortDirection = signal<SortDirection>(DEFAULT_SORT_DIRECTION);
  readonly currentPage = signal(1);
  readonly pageSize = signal(DEFAULT_PAGE_SIZE);

  readonly isMoveStatusModalOpen = signal(false);
  readonly selectedApplication = signal<ApplicationListItem | null>(null);
  readonly selectedTargetStatus = signal<ApplyStatusMovementItem | null>(null);

  readonly filteredApplications = computed(() => {
    const filters: ApplicationFilters = {
      keyword: this.searchTerm(),
      jobName: this.selectedJobName(),
      statusName: this.selectedStatusName(),
    };
    const filtered = filterApplications(this.applications(), filters);
    return sortApplications(filtered, this.sortField(), this.sortDirection());
  });

  readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(this.filteredApplications().length / this.pageSize())),
  );

  readonly safePage = computed(() => Math.min(this.currentPage(), this.totalPages()));

  readonly pagedApplications = computed(() =>
    paginate(this.filteredApplications(), this.safePage(), this.pageSize()),
  );

  readonly jobNameOptions = computed(() =>
    getUniqueOptions(this.applications().map((item) => item.jobName)),
  );

  readonly statusNameOptions = computed(() =>
    getUniqueOptions(this.applications().map((item) => item.statusName)),
  );

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
    const total = this.filteredApplications().length;
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
    { key: 'fullName', label: 'Sort by Full Name' },
    { key: 'linkedinUrl', label: 'Sort by LinkedIn' },
    { key: 'jobName', label: 'Sort by Job' },
    { key: 'statusName', label: 'Sort by Status' },
    { key: 'appliedAt', label: 'Sort by Applied At' },
    { key: 'statusUpdatedAt', label: 'Sort by Status Updated At' },
  ];

  readonly toolbarActions: ToolbarAction[] = [{ key: 'reset', label: 'Reset Filters' }];

  ngOnInit(): void {
    this.loadApplications();
  }

  getApplicationActions(row: ApplicationListItem): TableActionItem[] {
    if (!row.jobId) {
      return [
        {
          label: 'Job ID tidak tersedia',
          value: 'missing_job_id',
          class: 'menu-title pointer-events-none text-xs text-base-content/50',
          disabled: true,
        },
      ];
    }

    const statuses = this.statusCache.get(row.jobId);

    if (!statuses) {
      return [
        {
          label: 'Status tidak tersedia',
          value: 'statuses_not_available',
          class: 'menu-title pointer-events-none text-xs text-base-content/50',
          disabled: true,
        },
      ];
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

    const cleanUrl = url.trim();
    const match = cleanUrl.match(/linkedin\.com\/in\/([^/?#]+)/i);

    if (match?.[1]) return `@${match[1]}`;

    return cleanUrl
      .replace(/^https?:\/\/(www\.)?/i, '')
      .replace(/^linkedin\.com\/in\//i, '@')
      .replace(/\/$/, '');
  }

  onToolbarSearchChange(value: string): void {
    this.searchTerm.set(value);
    this.currentPage.set(1);
  }

  onToolbarFilterChange(event: { key: string; value: string }): void {
    if (event.key === 'jobName') this.selectedJobName.set(event.value);
    if (event.key === 'statusName') this.selectedStatusName.set(event.value);
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
    this.sortDirection.set(
      incoming === 'appliedAt' || incoming === 'statusUpdatedAt' ? 'desc' : 'asc',
    );
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
          this.applications.update((items) =>
            items.map((item) =>
              item.id === application.id
                ? {
                    ...item,
                    statusId: targetStatus.id,
                    statusName: targetStatus.name,
                    statusCode: targetStatus.code,
                    statusUpdatedAt: new Date().toISOString(),
                  }
                : item,
            ),
          );

          this.isMovingStatus.set(false);
          this.isMoveStatusModalOpen.set(false);
          this.selectedApplication.set(null);
          this.selectedTargetStatus.set(null);
          this.currentPage.set(1);
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
    this.statusCache.clear();

    this.applyService.getAll().subscribe({
      next: (data) => this.loadStatusesByJobs(data as ApplicationListItem[]),
      error: () => {
        this.applications.set([]);
        this.errorMessage.set('Gagal memuat data application.');
        this.isLoading.set(false);
      },
    });
  }

  private loadStatusesByJobs(applications: ApplicationListItem[]): void {
    const jobIds = getUniqueJobIds(applications);

    if (jobIds.length === 0) {
      this.applications.set(applications);
      this.isLoading.set(false);
      return;
    }

    forkJoin(jobIds.map((jobId) => this.jobApplyStatusService.getByJobId(jobId))).subscribe({
      next: (statusGroups) => {
        statusGroups.forEach((statuses, index) => {
          this.statusCache.set(jobIds[index], mapJobApplyStatuses(statuses));
        });

        this.applications.set(applications);
        this.isLoading.set(false);
      },
      error: () => {
        this.applications.set(applications);
        this.errorMessage.set('Data application berhasil dimuat, tapi status gagal dimuat.');
        this.isLoading.set(false);
      },
    });
  }

  private resetFilters(): void {
    this.searchTerm.set('');
    this.selectedJobName.set('');
    this.selectedStatusName.set('');
    this.sortField.set(DEFAULT_SORT_FIELD);
    this.sortDirection.set(DEFAULT_SORT_DIRECTION);
    this.currentPage.set(1);
  }
}
