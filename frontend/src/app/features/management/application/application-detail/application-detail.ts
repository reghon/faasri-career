import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin, map, of, switchMap } from 'rxjs';

import {
  BreadcrumbComponent,
  BreadcrumbItem,
} from '../../../../shared/components/breadcrumb/breadcrumb';
import { ConfirmModalComponent } from '../../job-detail/components/application/components/confirm-modal';
import { RecruitmentTimelineComponent } from './components/recruitment-timeline';
import { buildRecruitmentTimeline } from './components/recruitment-timeline.helper';
import { RecruitmentTimelineItem } from './components/recruitment-timeline.model';

import { ApplyProfileService } from '../../../../domain/apply/master-data/apply-profile/apply-profile.service';
import { ApplyProfile } from '../../../../domain/apply/master-data/apply-profile/apply-profile.model';
import { ApplyStatusHistoryService } from '../../../../domain/apply/master-data/apply-status-history/apply-status-history.service';
import { ApplyStatusHistory } from '../../../../domain/apply/master-data/apply-status-history/apply-status-history.model';
import { JobApplyStatusService } from '../../../../domain/apply/master-data/job-apply-status/job-apply-status.services';
import { JobApplyStatus } from '../../../../domain/apply/master-data/job-apply-status/job-apply-status.model';
import {
  ApplyStatusMovementItem,
  buildMoveStatusActions,
  mapJobApplyStatuses,
} from '../../../../shared/utils/apply-status-movement';

interface ApplyProfileWithApplication extends ApplyProfile {
  jobId: string | null;
  jobTitle: string | null;
  jobName?: string | null;
  jobLocation: string | null;
  location?: string | null;
  appliedAt: string | null;
}

interface ApplyStatusHistoryView extends ApplyStatusHistory {
  createdAt?: string | null;
  createdBy?: string | null;
}

interface ApplicantProfileView {
  fullName: string;
  email: string;
  birthInfo: string;
  gender: string;
  phone: string;
  address: string;
  linkedinUrl: string;
  cvName: string;
  cvUrl: string;
  avatarUrl: string | null;
}

interface JobApplicationView {
  jobId: string | null;
  jobTitle: string;
  location: string;
  appliedAt: string | null;
}

@Component({
  selector: 'app-application-detail',
  standalone: true,
  imports: [
    CommonModule,
    BreadcrumbComponent,
    ConfirmModalComponent,
    RecruitmentTimelineComponent,
  ],
  templateUrl: './application-detail.html',
})
export class ApplicationDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly applyProfileService = inject(ApplyProfileService);
  private readonly applyStatusHistoryService = inject(ApplyStatusHistoryService);
  private readonly jobApplyStatusService = inject(JobApplyStatusService);

  readonly isLoading = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly applyId = signal<string>('');
  readonly applicantProfile = signal<ApplicantProfileView | null>(null);
  readonly histories = signal<ApplyStatusHistoryView[]>([]);
  readonly jobStatuses = signal<JobApplyStatus[]>([]);
  readonly availableStatuses = signal<ApplyStatusMovementItem[]>([]);

  readonly isMoveStatusModalOpen = signal(false);
  readonly isMovingStatus = signal(false);
  readonly selectedTargetStatus = signal<ApplyStatusMovementItem | null>(null);

  readonly jobApplication = signal<JobApplicationView>({
    jobId: null,
    jobTitle: '-',
    location: '-',
    appliedAt: null,
  });

  readonly breadcrumbItems = computed<BreadcrumbItem[]>(() => [
    { label: 'Application', route: '/management/application' },
    { label: 'Application Detail', route: '/management/application' },
    { label: this.applyId() || '-' },
  ]);

  readonly fullName = computed(() => this.applicantProfile()?.fullName || '-');
  readonly email = computed(() => this.applicantProfile()?.email || '-');
  readonly birthInfo = computed(() => this.applicantProfile()?.birthInfo || '-');
  readonly gender = computed(() => this.applicantProfile()?.gender || '-');
  readonly phone = computed(() => this.applicantProfile()?.phone || '-');
  readonly address = computed(() => this.applicantProfile()?.address || '-');
  readonly linkedinUrl = computed(() => this.applicantProfile()?.linkedinUrl || '-');
  readonly cvName = computed(() => this.applicantProfile()?.cvName || '-');
  readonly cvUrl = computed(() => this.applicantProfile()?.cvUrl || '-');
  readonly avatarUrl = computed(() => this.applicantProfile()?.avatarUrl || null);
  readonly isCvAvailable = computed(() => !!this.cvUrl() && this.cvUrl() !== '-');

  readonly jobTitle = computed(() => this.jobApplication().jobTitle || '-');
  readonly jobLocation = computed(() => this.jobApplication().location || '-');
  readonly appliedAt = computed(() => this.jobApplication().appliedAt);

  readonly orderedHistories = computed(() =>
    [...this.histories()].sort(
      (a, b) => this.getHistoryCreatedAtTime(a) - this.getHistoryCreatedAtTime(b),
    ),
  );

  readonly orderedJobStatuses = computed(() =>
    [...this.jobStatuses()]
      .filter((status) => status.isActive)
      .sort((a, b) => a.sortOrder - b.sortOrder),
  );

  readonly currentHistory = computed(() => {
    const histories = this.orderedHistories();
    return histories.length ? histories[histories.length - 1] : null;
  });

  readonly currentStatus = computed(() => this.currentHistory()?.applyStatusName || '-');

  readonly currentStatusId = computed(() => this.currentHistory()?.applyStatusId || '');

  readonly recruitmentTimeline = computed<RecruitmentTimelineItem[]>(() =>
    buildRecruitmentTimeline(this.orderedHistories(), this.orderedJobStatuses()),
  );

  readonly moveStatusActions = computed(() =>
    buildMoveStatusActions(this.availableStatuses(), this.currentStatusId()),
  );

  readonly moveStatusModalMessage = computed(
    () => `Pindahkan ${this.fullName()} ke status ${this.selectedTargetStatus()?.name || '-'} ?`,
  );

  readonly shouldShowMoveNotes = computed(() => {
    const target = this.selectedTargetStatus();

    if (!target) return false;

    const text = `${target.code} ${target.name}`.toLowerCase();

    return text.includes('reject') || text.includes('hire');
  });

  ngOnInit(): void {
    this.loadApplicationDetail();
  }

  loadApplicationDetail(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.route.paramMap
      .pipe(
        switchMap((params) => {
          const id = params.get('id');

          if (!id) {
            throw new Error('Application ID tidak ditemukan.');
          }

          this.applyId.set(id);

          return forkJoin({
            profile: this.applyProfileService.getByApplyId(id),
            histories: this.applyStatusHistoryService.getByApplyId(id),
          });
        }),
        switchMap(({ profile, histories }) => {
          const jobApplication = this.mapJobApplicationToView(profile, histories);
          const { jobId } = jobApplication;

          if (!jobId) {
            return of({ profile, histories, jobApplication, jobStatuses: [] as JobApplyStatus[] });
          }

          return this.jobApplyStatusService
            .getByJobId(jobId)
            .pipe(map((jobStatuses) => ({ profile, histories, jobApplication, jobStatuses })));
        }),
      )
      .subscribe({
        next: ({ profile, histories, jobApplication, jobStatuses }) => {
          this.applicantProfile.set(this.mapApplyProfileToView(profile));
          this.jobApplication.set(jobApplication);
          this.histories.set(histories as ApplyStatusHistoryView[]);
          this.jobStatuses.set(jobStatuses);
          this.availableStatuses.set(mapJobApplyStatuses(jobStatuses));
          this.isLoading.set(false);
        },
        error: (error) => {
          console.error('Failed to load application detail:', error);

          this.applicantProfile.set(null);
          this.jobApplication.set({ jobId: null, jobTitle: '-', location: '-', appliedAt: null });
          this.histories.set([]);
          this.availableStatuses.set([]);
          this.errorMessage.set('Gagal mengambil detail application.');
          this.isLoading.set(false);
        },
      });
  }

  viewCv(): void {
    if (!this.isCvAvailable()) return;

    window.open(this.cvUrl(), '_blank');
  }

  downloadCv(): void {
    if (!this.isCvAvailable()) return;

    const link = document.createElement('a');
    link.href = this.cvUrl();
    link.download = this.cvName();
    link.click();
  }

  openMoveStatusModal(statusId: string): void {
    const targetStatus = this.availableStatuses().find((s) => s.id === statusId);

    if (!targetStatus) {
      this.errorMessage.set('Status tujuan tidak ditemukan.');
      return;
    }

    this.selectedTargetStatus.set(targetStatus);
    this.isMoveStatusModalOpen.set(true);
    this.errorMessage.set('');
  }

  closeMoveStatusModal(): void {
    if (this.isMovingStatus()) return;

    this.isMoveStatusModalOpen.set(false);
    this.selectedTargetStatus.set(null);
  }

  confirmMoveStatus(event: { notes: string | null }): void {
    const target = this.selectedTargetStatus();

    if (!target) return;

    this.moveApplicationStatus(target, event.notes);
  }

  private moveApplicationStatus(targetStatus: ApplyStatusMovementItem, notes: string | null): void {
    this.isMovingStatus.set(true);
    this.errorMessage.set('');

    this.applyStatusHistoryService
      .create({ applyId: this.applyId(), applyStatusId: targetStatus.id, notes })
      .subscribe({
        next: () => {
          this.histories.update((histories) => [
            ...histories,
            {
              applyId: this.applyId(),
              applyStatusId: targetStatus.id,
              applyStatusName: targetStatus.name,
              createdAt: new Date().toISOString(),
              notes,
            } as ApplyStatusHistoryView,
          ]);

          this.isMovingStatus.set(false);
          this.isMoveStatusModalOpen.set(false);
          this.selectedTargetStatus.set(null);
        },
        error: (error) => {
          this.errorMessage.set(error?.error?.message || 'Gagal memindahkan status.');
          this.isMovingStatus.set(false);
        },
      });
  }

  private mapApplyProfileToView(profile: ApplyProfile): ApplicantProfileView {
    return {
      fullName: profile.fullName || '-',
      email: profile.email || '-',
      birthInfo: this.formatBirthInfo(profile.birthPlace, profile.birthDate),
      gender: profile.gender || '-',
      phone: this.formatPhone(profile.phoneCode, profile.phone),
      address: this.formatAddress(profile),
      linkedinUrl: profile.linkedinUrl || '-',
      cvName: profile.cvFileName || '-',
      cvUrl: profile.cvUrl || '-',
      avatarUrl: null,
    };
  }

  private mapJobApplicationToView(
    profile: ApplyProfile,
    histories: ApplyStatusHistory[],
  ): JobApplicationView {
    const source = profile as ApplyProfileWithApplication;

    const firstHistory = histories[0] as
      | (ApplyStatusHistory & {
          jobId?: string | null;
          jobTitle?: string | null;
          jobName?: string | null;
          location?: string | null;
          jobLocation?: string | null;
          appliedAt?: string | null;
        })
      | undefined;

    return {
      jobId: source.jobId || firstHistory?.jobId || null,
      jobTitle:
        source.jobTitle || source.jobName || firstHistory?.jobTitle || firstHistory?.jobName || '-',
      location:
        source.jobLocation ||
        source.location ||
        firstHistory?.jobLocation ||
        firstHistory?.location ||
        '-',
      appliedAt: source.appliedAt || firstHistory?.appliedAt || null,
    };
  }

  private formatBirthInfo(birthPlace: string | null, birthDate: string | null): string {
    const place = birthPlace || '-';
    const date = birthDate || '-';

    if (place === '-' && date === '-') return '-';

    return `${place}, ${date}`;
  }

  private formatPhone(phoneCode: string | null, phone: string | null): string {
    return `${phoneCode || ''} ${phone || ''}`.trim() || '-';
  }

  private formatAddress(profile: ApplyProfile): string {
    const parts = [
      profile.address,
      profile.kelurahan,
      profile.kecamatan,
      profile.city,
      profile.province,
      profile.postalCode,
    ].filter((item): item is string => !!item);

    return parts.length ? parts.join(', ') : '-';
  }

  private getHistoryCreatedAtTime(history: ApplyStatusHistoryView): number {
    return history.createdAt ? new Date(history.createdAt).getTime() : 0;
  }
}
