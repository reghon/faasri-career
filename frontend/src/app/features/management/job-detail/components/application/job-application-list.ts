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
import { ConfirmModalComponent } from './components/confirm-modal';

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
  imports: [ConfirmModalComponent, CommonModule, FormsModule, DataTableComponent],
  templateUrl: './job-application-list.html',
})
export class JobApplicationListComponent implements OnChanges {
  private readonly applyService = inject(ApplyService);
  private readonly jobApplyStatusService = inject(JobApplyStatusService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly applyStatusHistoryService = inject(ApplyStatusHistoryService);

  @Input() jobId!: string;
  @Output() summaryChange = new EventEmitter<JobApplicationSummary>();

  applies: ApplyByJobItem[] = [];
  jobApplyStatuses: JobApplyStatus[] = [];
  filteredApplies: ApplyByJobItem[] = [];
  pagedApplies: ApplyByJobItem[] = [];

  statuses: StatusItem[] = [];

  isLoading = false;
  errorMessage = '';

  searchTerm = '';
  selectedStatusId = '';

  pageSizeOptions = [10, 25, 50, 100];
  pageSize = 10;
  currentPage = 1;

  sortDirection: 'asc' | 'desc' = 'desc';

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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['jobId'] && this.jobId) {
      this.loadData();
    }
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredApplies.length / this.pageSize));
  }

  get startEntry(): number {
    if (this.filteredApplies.length === 0) return 0;
    return (this.currentPage - 1) * this.pageSize + 1;
  }

  get endEntry(): number {
    return Math.min(this.currentPage * this.pageSize, this.filteredApplies.length);
  }

  get tablePagination(): DataTablePagination {
    return {
      currentPage: this.currentPage,
      totalPages: this.totalPages,
      startEntry: this.startEntry,
      endEntry: this.endEntry,
      totalItems: this.filteredApplies.length,
      pageSize: this.pageSize,
      pageSizeOptions: this.pageSizeOptions,
    };
  }

  loadData(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.cdr.detectChanges();

    forkJoin({
      statuses: this.jobApplyStatusService.getByJobId(this.jobId),
      applies: this.applyService.getByJobId(this.jobId),
    }).subscribe({
      next: ({ statuses, applies }) => {
        this.jobApplyStatuses = statuses;
        this.applies = applies;

        this.buildStatuses(statuses);
        this.emitSummary();
        this.applyFilters();

        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Failed to load application data:', error);

        this.applies = [];
        this.filteredApplies = [];
        this.pagedApplies = [];
        this.statuses = [];

        this.emitSummary();
        this.errorMessage = 'Gagal memuat data kandidat.';
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  get selectedStatusName(): string {
    return (
      this.statuses.find((status) => status.id === this.selectedStatusId)?.name || 'Applications'
    );
  }
  selectStatus(statusId: string): void {
    this.selectedStatusId = statusId;
    this.currentPage = 1;
    this.applyFilters();
    this.cdr.detectChanges();
  }

  onSearchChange(): void {
    this.currentPage = 1;
    this.applyFilters();
    this.cdr.detectChanges();
  }

  toggleSortDirection(): void {
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.applyFilters();
    this.cdr.detectChanges();
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.selectedStatusId = this.statuses[0]?.id || '';
    this.sortDirection = 'desc';
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

  private buildStatuses(statuses: JobApplyStatus[]): void {
    this.statuses = mapJobApplyStatusesWithCount(statuses, this.applies) as StatusItem[];

    if (!this.selectedStatusId && this.statuses.length > 0) {
      this.selectedStatusId = this.statuses[0].id;
    }

    if (
      this.selectedStatusId &&
      !this.statuses.some((status) => status.id === this.selectedStatusId)
    ) {
      this.selectedStatusId = this.statuses[0]?.id || '';
    }
  }

  private emitSummary(): void {
    const total = this.applies.length;

    const rejected = this.applies.filter((item) => this.isRejectedStatus(item)).length;
    const hired = this.applies.filter((item) => this.isHiredStatus(item)).length;

    const inProgress = this.applies.filter(
      (item) => !this.isRejectedStatus(item) && !this.isHiredStatus(item),
    ).length;

    this.summaryChange.emit({
      total,
      rejected,
      inProgress,
      hired,
    });
  }

  private applyFilters(): void {
    const keyword = this.searchTerm.trim().toLowerCase();

    let result = [...this.applies];

    if (this.selectedStatusId) {
      result = result.filter((item) => item.statusId === this.selectedStatusId);
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

      return this.sortDirection === 'asc' ? comparison : -comparison;
    });

    this.filteredApplies = result;

    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages;
    }

    this.paginate();
  }

  private paginate(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;

    this.pagedApplies = this.filteredApplies.slice(start, end);
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
    return buildMoveStatusActions(this.statuses, row.statusId);
  }

  handleApplicationAction(event: { action: string; row: ApplyByJobItem }): void {
    const { action, row } = event;

    if (action.startsWith('move_status:')) {
      const statusId = action.split(':')[1];
      this.openMoveStatusModal(row, statusId);
    }
  }
  moveApplicationStatus(row: ApplyByJobItem, statusId: string, notes: string | null = null): void {
    const targetStatus = this.statuses.find((status) => status.id === statusId);

    if (!targetStatus) {
      this.errorMessage = 'Status tujuan tidak ditemukan.';
      return;
    }

    this.isMovingStatus = true;
    this.errorMessage = '';
    this.cdr.detectChanges();

    this.applyStatusHistoryService
      .create({
        applyId: row.id,
        applyStatusId: statusId,
        notes,
      })
      .subscribe({
        next: () => {
          row.statusId = targetStatus.id;
          row.statusName = targetStatus.name;
          row.statusCode = targetStatus.code;

          this.buildStatuses(this.jobApplyStatuses);
          this.emitSummary();
          this.applyFilters();

          this.isMovingStatus = false;
          this.isMoveStatusModalOpen = false;
          this.selectedApplication = null;
          this.selectedTargetStatus = null;

          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Failed to move application status:', error);

          this.errorMessage = error?.error?.message || 'Gagal memindahkan status kandidat.';

          this.isMovingStatus = false;
          this.cdr.detectChanges();
        },
      });
  }
  isMoveStatusModalOpen = false;
  selectedApplication: ApplyByJobItem | null = null;
  selectedTargetStatus: StatusItem | null = null;
  isMovingStatus = false;

  get moveStatusModalMessage(): string {
    const applicantName = this.selectedApplication?.applicantName || 'kandidat';
    const statusName = this.selectedTargetStatus?.name || 'status tujuan';

    return `Pindahkan ${applicantName} ke status ${statusName}?`;
  }

  get shouldShowMoveNotes(): boolean {
    if (!this.selectedTargetStatus) return false;

    const statusText =
      `${this.selectedTargetStatus.code} ${this.selectedTargetStatus.name}`.toLowerCase();

    return statusText.includes('reject') || statusText.includes('hire');
  }

  openMoveStatusModal(row: ApplyByJobItem, statusId: string): void {
    const targetStatus = this.statuses.find((status) => status.id === statusId);

    if (!targetStatus) {
      this.errorMessage = 'Status tujuan tidak ditemukan.';
      return;
    }

    this.selectedApplication = row;
    this.selectedTargetStatus = targetStatus;
    this.isMoveStatusModalOpen = true;
    this.errorMessage = '';
    this.cdr.detectChanges();
  }

  closeMoveStatusModal(): void {
    if (this.isMovingStatus) return;

    this.isMoveStatusModalOpen = false;
    this.selectedApplication = null;
    this.selectedTargetStatus = null;
    this.cdr.detectChanges();
  }

  confirmMoveStatus(event: { notes: string | null }): void {
    if (!this.selectedApplication || !this.selectedTargetStatus) return;

    this.moveApplicationStatus(this.selectedApplication, this.selectedTargetStatus.id, event.notes);
  }
}
