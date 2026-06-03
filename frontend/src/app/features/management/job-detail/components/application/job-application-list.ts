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
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';

import { ApplyByJobItem } from '../../../../../domain/apply/apply.model';
import { ApplyService } from '../../../../../domain/apply/apply.service';

import { JobApplyStatus } from '../../../../../domain/apply/master-data/job-apply-status/job-apply-status.model';
import { JobApplyStatusService } from '../../../../../domain/apply/master-data/job-apply-status/job-apply-status.services';

import { ApplyStatusHistoryService } from '../../../../../domain/apply/master-data/apply-status-history/apply-status-history.service';
import {
  DataTableColumn,
  DataTableComponent,
  DataTablePagination,
} from '../../../../../shared/components/data-table/data-table';
import { TableActionItem } from '../../../../../shared/components/table-action/table-action';
import {
  buildMoveStatusActions,
  mapJobApplyStatusesWithCount,
} from '../../../../../shared/utils/apply-status-movement';
import { MoveStatusConfirmModalComponent } from './components/move-status-confirm-modal';

export type JobApplicationSummary = {
  total: number;
  rejected: number;
  inProgress: number;
  hired: number;
};

type StatusItem = {
  id: string;
  applyStatusId: string;
  name: string;
  code: string;
  sortOrder: number;
  isFinal: boolean;
  count: number;
};

@Component({
  selector: 'app-job-application-list',
  standalone: true,
  imports: [MoveStatusConfirmModalComponent, CommonModule, FormsModule, DataTableComponent],
  templateUrl: './job-application-list.html',
})
export class JobApplicationListComponent {
  private readonly applyService = inject(ApplyService);
  private readonly jobApplyStatusService = inject(JobApplyStatusService);
  private readonly applyStatusHistoryService = inject(ApplyStatusHistoryService);

  readonly jobId = input.required<string>();
  readonly summaryChange = output<JobApplicationSummary>();

  readonly applies = signal<ApplyByJobItem[]>([]);
  readonly jobApplyStatuses = signal<JobApplyStatus[]>([]);
  readonly isLoading = signal(false);
  readonly errorMessage = signal('');

  readonly searchTerm = signal('');
  readonly selectedStatusId = signal('');

  pageSizeOptions = [10, 25, 50, 100];
  readonly pageSize = signal(10);
  readonly currentPage = signal(1);

  readonly sortDirection = signal<'asc' | 'desc'>('desc');
  readonly isMoveStatusModalOpen = signal(false);
  readonly selectedApplication = signal<ApplyByJobItem | null>(null);
  readonly selectedTargetStatus = signal<StatusItem | null>(null);
  readonly isMovingStatus = signal(false);

  columns: DataTableColumn<ApplyByJobItem>[] = [
    {
      key: 'applicantName',
      label: 'Applicant Name',
      minWidth: '180px',
      valueGetter: (row) => row.applicantName || '-',
    },
    {
      key: 'email',
      label: 'Email',
      minWidth: '180px',
      valueGetter: (row) => row.email || '-',
    },
    {
      key: 'phone',
      label: 'Contact',
      valueGetter: (row) => this.getContact(row),
    },
    {
      key: 'cvUrl',
      label: 'CV',
      align: 'center',
      valueGetter: (row) => (row.cvUrl ? 'View CV' : '-'),
    },
    {
      key: 'linkedinUrl',
      label: 'Linkedin Profile',
      valueGetter: (row) => row.linkedinUrl || '-',
    },
    {
      key: 'action',
      label: 'Action',
      type: 'action',
      align: 'right',
    },
  ];

  readonly statuses = computed(
    () => mapJobApplyStatusesWithCount(this.jobApplyStatuses(), this.applies()) as StatusItem[],
  );

  readonly filteredApplies = computed(() => {
    const keyword = this.searchTerm().trim().toLowerCase();
    const selectedStatusId = this.selectedStatusId();

    let result = [...this.applies()];

    if (selectedStatusId) {
      result = result.filter((item) => item.statusId === selectedStatusId);
    }

    if (keyword) {
      result = result.filter((item) => {
        const searchableValues = [
          item.applicationCode,
          item.applicantName,
          item.email,
          item.phoneCode,
          item.phone,
          item.linkedinUrl,
          item.cvFileName,
          item.statusName,
          item.statusCode,
        ];

        return searchableValues.some((value) => value?.toLowerCase().includes(keyword));
      });
    }

    result.sort((a, b) => {
      const first = new Date(a.appliedAt).getTime();
      const second = new Date(b.appliedAt).getTime();
      const comparison = first - second;

      return this.sortDirection() === 'asc' ? comparison : -comparison;
    });

    return result;
  });

  readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(this.filteredApplies().length / this.pageSize())),
  );

  readonly safePage = computed(() => Math.min(this.currentPage(), this.totalPages()));

  readonly pagedApplies = computed(() => {
    const start = (this.safePage() - 1) * this.pageSize();
    const end = start + this.pageSize();

    return this.filteredApplies().slice(start, end);
  });

  readonly selectedStatusName = computed(
    () =>
      this.statuses().find((status) => status.id === this.selectedStatusId())?.name ||
      'Applications',
  );

  readonly tablePagination = computed<DataTablePagination>(() => {
    const total = this.filteredApplies().length;
    const page = this.safePage();
    const size = this.pageSize();

    return {
      currentPage: page,
      totalPages: this.totalPages(),
      startEntry: total === 0 ? 0 : (page - 1) * size + 1,
      endEntry: Math.min(page * size, total),
      totalItems: total,
      pageSize: size,
      pageSizeOptions: this.pageSizeOptions,
    };
  });

  readonly moveStatusModalMessage = computed(() => {
    const applicantName = this.selectedApplication()?.applicantName || 'kandidat';
    const statusName = this.selectedTargetStatus()?.name || 'status tujuan';

    return `Pindahkan ${applicantName} ke status ${statusName}?`;
  });

  readonly shouldShowMoveNotes = computed(() => {
    const selectedTargetStatus = this.selectedTargetStatus();

    if (!selectedTargetStatus) return false;

    const statusText = `${selectedTargetStatus.code} ${selectedTargetStatus.name}`.toLowerCase();

    return statusText.includes('reject') || statusText.includes('hire');
  });

  constructor() {
    effect(() => {
      const jobId = this.jobId();

      if (jobId) {
        this.loadData(jobId);
      }
    });
  }

  loadData(jobId = this.jobId()): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    forkJoin({
      statuses: this.jobApplyStatusService.getByJobId(jobId),
      applies: this.applyService.getByJobId(jobId),
    }).subscribe({
      next: ({ statuses, applies }) => {
        this.jobApplyStatuses.set(statuses);
        this.applies.set(applies);

        this.emitSummary();
        this.ensureSelectedStatus();

        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Failed to load application data:', error);

        this.applies.set([]);
        this.jobApplyStatuses.set([]);
        this.selectedStatusId.set('');

        this.emitSummary();
        this.errorMessage.set('Gagal memuat data kandidat.');
        this.isLoading.set(false);
      },
    });
  }

  selectStatus(statusId: string): void {
    this.selectedStatusId.set(statusId);
    this.currentPage.set(1);
  }

  onSearchChange(value: string): void {
    this.searchTerm.set(value);
    this.currentPage.set(1);
  }

  toggleSortDirection(): void {
    this.sortDirection.update((direction) => (direction === 'asc' ? 'desc' : 'asc'));
  }

  resetFilters(): void {
    this.searchTerm.set('');
    this.selectedStatusId.set(this.statuses()[0]?.id || '');
    this.sortDirection.set('desc');
    this.currentPage.set(1);
  }

  onPageSizeChange(size: number): void {
    this.pageSize.set(size);
    this.currentPage.set(1);
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages()) return;

    this.currentPage.set(page);
  }

  viewApplication(row: ApplyByJobItem): void {
    console.log('View application:', row);
  }

  editApplication(row: ApplyByJobItem): void {
    console.log('Edit application:', row);
  }

  getContact(row: ApplyByJobItem): string {
    const phoneCode = row.phoneCode || '';
    const phone = row.phone || '';

    if (!phoneCode && !phone) return '-';
    return `${phoneCode}${phone}`;
  }

  private ensureSelectedStatus(): void {
    const statuses = this.statuses();
    const selectedStatusId = this.selectedStatusId();

    if (!selectedStatusId && statuses.length > 0) {
      this.selectedStatusId.set(statuses[0].id);
      return;
    }

    if (selectedStatusId && !statuses.some((status) => status.id === selectedStatusId)) {
      this.selectedStatusId.set(statuses[0]?.id || '');
    }
  }

  private emitSummary(): void {
    const applies = this.applies();
    const total = applies.length;

    const rejected = applies.filter((item) => this.isRejectedStatus(item)).length;
    const hired = applies.filter((item) => this.isHiredStatus(item)).length;

    const inProgress = applies.filter(
      (item) => !this.isRejectedStatus(item) && !this.isHiredStatus(item),
    ).length;

    this.summaryChange.emit({
      total,
      rejected,
      inProgress,
      hired,
    });
  }

  private getStatusText(item: ApplyByJobItem): string {
    return `${item.statusCode || ''} ${item.statusName || ''} ${item.statusId || ''}`.toLowerCase();
  }

  private isRejectedStatus(item: ApplyByJobItem): boolean {
    const status = this.getStatusText(item);
    return status.includes('reject') || status.includes('rejected');
  }

  private isHiredStatus(item: ApplyByJobItem): boolean {
    const status = this.getStatusText(item);
    return status.includes('hire') || status.includes('hired') || status.includes('joined');
  }

  getApplicationActions(row: ApplyByJobItem): TableActionItem[] {
    return buildMoveStatusActions(this.statuses(), row.statusId);
  }

  handleApplicationAction(event: { action: string; row: ApplyByJobItem }): void {
    const { action, row } = event;

    if (action.startsWith('move_status:')) {
      const statusId = action.split(':')[1];
      this.openMoveStatusModal(row, statusId);
    }
  }
  moveApplicationStatus(row: ApplyByJobItem, statusId: string, notes: string | null = null): void {
    const targetStatus = this.statuses().find((status) => status.id === statusId);

    if (!targetStatus) {
      this.errorMessage.set('Status tujuan tidak ditemukan.');
      return;
    }

    this.isMovingStatus.set(true);
    this.errorMessage.set('');

    this.applyStatusHistoryService
      .create({
        applyId: row.id,
        applyStatusId: statusId,
        notes,
      })
      .subscribe({
        next: () => {
          this.applies.update((items) =>
            items.map((item) =>
              item.id === row.id
                ? {
                    ...item,
                    statusId: targetStatus.id,
                    statusName: targetStatus.name,
                    statusCode: targetStatus.code,
                  }
                : item,
            ),
          );

          this.emitSummary();
          this.ensureSelectedStatus();

          this.isMovingStatus.set(false);
          this.isMoveStatusModalOpen.set(false);
          this.selectedApplication.set(null);
          this.selectedTargetStatus.set(null);
        },
        error: (error) => {
          console.error('Failed to move application status:', error);

          this.errorMessage.set(error?.error?.message || 'Gagal memindahkan status kandidat.');

          this.isMovingStatus.set(false);
        },
      });
  }

  openMoveStatusModal(row: ApplyByJobItem, statusId: string): void {
    const targetStatus = this.statuses().find((status) => status.id === statusId);

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
    const selectedApplication = this.selectedApplication();
    const selectedTargetStatus = this.selectedTargetStatus();

    if (!selectedApplication || !selectedTargetStatus) return;

    this.moveApplicationStatus(selectedApplication, selectedTargetStatus.id, event.notes);
  }
}
