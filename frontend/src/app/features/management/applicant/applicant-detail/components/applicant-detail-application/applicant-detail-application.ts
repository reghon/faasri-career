import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { RecruitmentTimelineComponent } from '../../../../application/application-detail/components/recruitment-timeline';
import { RecruitmentTimelineItem } from '../../../../application/application-detail/components/recruitment-timeline.model';

import { ApplyService } from '../../../../../../domain/apply/apply.service';
import { ApplyHistoryList, ApplyMeDetail } from '../../../../../../domain/apply/apply.model';
import {
  isFinalHire,
  isFinalReject,
  resolveCardClass,
  resolveDotClass,
  resolveStatusClass,
  resolveStatusLabel,
} from '../../../../application/application-detail/components/recruitment-timeline.helper';

@Component({
  selector: 'app-applicant-detail-application',
  standalone: true,
  imports: [CommonModule, DatePipe, RecruitmentTimelineComponent],
  templateUrl: './applicant-detail-application.html',
})
export class ApplicantDetailApplicationComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly applyService = inject(ApplyService);

  readonly isLoadingList = signal(false);
  readonly applications = signal<ApplyHistoryList[]>([]);
  readonly errorMessage = signal('');

  readonly openApplicationHistories = signal<Record<string, boolean>>({});
  readonly applicationDetails = signal<Record<string, ApplyMeDetail>>({});
  readonly detailLoadingMap = signal<Record<string, boolean>>({});
  readonly detailErrorMap = signal<Record<string, string>>({});

  private applicantProfileId = '';

  ngOnInit(): void {
    const applicantProfileId = this.route.snapshot.paramMap.get('id');

    if (!applicantProfileId) {
      this.router.navigate(['/management/applicant']);
      return;
    }

    this.applicantProfileId = applicantProfileId;
    this.loadApplications(applicantProfileId);
  }

  goToDetail(applyId: string): void {
    this.router.navigate(['/management/application', applyId]);
  }

  toggleApplicationHistory(application: ApplyHistoryList): void {
    const key = String(application.id);
    const willOpen = !this.openApplicationHistories()[key];

    this.openApplicationHistories.update((histories) => ({
      ...histories,
      [key]: willOpen,
    }));

    if (willOpen && !this.applicationDetails()[key]) {
      this.loadApplicationDetail(application);
    }
  }

  isApplicationHistoryOpen(id: string | number): boolean {
    return !!this.openApplicationHistories()[String(id)];
  }

  applicationDetail(id: string | number): ApplyMeDetail | null {
    return this.applicationDetails()[String(id)] ?? null;
  }

  isDetailLoading(id: string | number): boolean {
    return !!this.detailLoadingMap()[String(id)];
  }

  detailError(id: string | number): string {
    return this.detailErrorMap()[String(id)] ?? '';
  }

  timelineItems(id: string | number): RecruitmentTimelineItem[] {
    const detail = this.applicationDetail(id);

    if (!detail?.histories?.length) return [];

    const histories = [...detail.histories].sort((a, b) => {
      const getTime = (h: typeof a) => (h.createdAt ? new Date(h.createdAt).getTime() : 0);
      return getTime(a) - getTime(b);
    });

    const lastHistory = histories.at(-1);

    return histories.map((history) => {
      const isLast = history === lastHistory;
      const statusText = `${history.applyStatusName ?? ''}`.toLowerCase();
      const isFinal = isLast && (isFinalHire(statusText) || isFinalReject(statusText));
      const state = isLast && !isFinal ? ('current' as const) : ('done' as const);

      return {
        id: String(history.id),
        applyStatusId: history.applyStatusId ?? '',
        name: history.applyStatusName || '-',
        code: null,
        description: null,
        isFinal,
        history,
        state,
        dotClass: resolveDotClass(state, isFinal, statusText),
        cardClass: resolveCardClass(state, isFinal, statusText),
        statusLabel: resolveStatusLabel(state, isFinal, statusText),
        statusClass: resolveStatusClass(state, isFinal, statusText),
      };
    });
  }
  accordionClass(isOpen: boolean): string {
    return isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]';
  }

  chevronClass(isOpen: boolean): string {
    return isOpen ? 'rotate-180' : '';
  }

  private loadApplications(applicantProfileId: string): void {
    this.isLoadingList.set(true);
    this.errorMessage.set('');
    this.openApplicationHistories.set({});
    this.applicationDetails.set({});
    this.detailLoadingMap.set({});
    this.detailErrorMap.set({});

    this.applyService.getApplyListByApplicantProfileId(applicantProfileId).subscribe({
      next: (applications) => {
        this.applications.set(applications);
        this.isLoadingList.set(false);

        if (!applications.length) {
          this.errorMessage.set('Application applicant tidak ditemukan.');
        }
      },
      error: (error) => {
        console.error('Failed to load applicant applications:', error);
        this.isLoadingList.set(false);
        this.errorMessage.set('Gagal memuat daftar application.');
      },
    });
  }

  private loadApplicationDetail(application: ApplyHistoryList): void {
    const key = String(application.id);

    this.detailLoadingMap.update((map) => ({ ...map, [key]: true }));
    this.detailErrorMap.update((map) => ({ ...map, [key]: '' }));

    this.applyService.getApplyDetail(this.applicantProfileId, application.id).subscribe({
      next: (data) => {
        this.applicationDetails.update((details) => ({ ...details, [key]: data }));
        this.detailLoadingMap.update((map) => ({ ...map, [key]: false }));
      },
      error: (error) => {
        console.error('Failed to load application detail:', error);
        this.detailLoadingMap.update((map) => ({ ...map, [key]: false }));
        this.detailErrorMap.update((map) => ({
          ...map,
          [key]: 'Gagal memuat detail application.',
        }));
      },
    });
  }
}
