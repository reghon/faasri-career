import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, computed, signal } from '@angular/core';
import { ApplyService } from '../../../../domain/apply/apply.service';
import { ApplyHistoryList, ApplyMeDetail } from '../../../../domain/apply/apply.model';
import { ApplyStatusHistoryService } from '../../../../domain/apply/master-data/apply-status-history/apply-status-history.service';

@Component({
  selector: 'app-apply-history',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './apply-history.html',
})
export class ApplyHistory implements OnInit {
  applies = signal<ApplyHistoryList[]>([]);
  details = signal<Record<string, ApplyMeDetail>>({});
  expandedApplyId = signal<string | null>(null);
  loading = signal(false);
  loadingDetailId = signal<string | null>(null);
  withdrawingId = signal<string | null>(null);

  constructor(
    private readonly applyService: ApplyService,
    private readonly applyStatusHistoryService: ApplyStatusHistoryService,
  ) {}

  ngOnInit(): void {
    this.fetchApplyList();
  }

  toggleDetail(apply: ApplyHistoryList): void {
    const isSameApply = this.expandedApplyId() === apply.id;
    this.expandedApplyId.set(isSameApply ? null : apply.id);

    if (!isSameApply && !this.details()[apply.id]) {
      this.fetchDetail(apply.id);
    }
  }

  withdrawApply(detail: ApplyMeDetail): void {
    const withdrawnStatus = this.getWithdrawnStatus(detail);
    if (!withdrawnStatus || !this.canWithdraw(detail)) return;

    this.withdrawingId.set(detail.id);
    this.applyStatusHistoryService
      .moveApplicationStatus(detail.id, withdrawnStatus.applyStatusId, 'Kandidat mengundurkan diri')
      .subscribe({
        next: () => {
          this.withdrawingId.set(null);
          this.removeDetail(detail.id);
          this.fetchApplyList();
          this.fetchDetail(detail.id);
        },
        error: () => this.withdrawingId.set(null),
      });
  }

  getDetail = (applyId: string) => computed(() => this.details()[applyId]);

  getVisibleStages = (applyId: string) =>
    computed(() => this.details()[applyId]?.stages.filter((stage) => !stage.isFinal) ?? []);

  getApplyProcessLabel = (apply: ApplyHistoryList): string =>
    apply.statusIsFinal ? 'Selesai' : 'Dalam Proses';

  getProcessLabel = (detail: ApplyMeDetail): string =>
    this.isFinalStatus(detail) ? 'Selesai' : 'Dalam Proses';

  getStageDate = (detail: ApplyMeDetail, statusId: string): string | null =>
    detail.histories.find((history) => history.applyStatusId === statusId)?.createdAt ?? null;

  getLastPassedNonFinalStage = (detail: ApplyMeDetail) => {
    const nonFinalStages = detail.stages.filter((stage) => !stage.isFinal);
    const passedStages = nonFinalStages.filter((stage) =>
      detail.histories.some((history) => history.applyStatusId === stage.applyStatusId),
    );
    return passedStages.at(-1) ?? nonFinalStages[0];
  };

  getFinalHistory = (detail: ApplyMeDetail) =>
    this.isFinalStatus(detail)
      ? (detail.histories.find((history) => history.applyStatusId === detail.statusId) ?? null)
      : null;

  getWithdrawnStatus = (detail: ApplyMeDetail) =>
    detail.stages.find((stage) =>
      `${stage.code ?? ''} ${stage.name ?? ''}`.toLowerCase().includes('withdraw'),
    ) ?? null;

  isCurrentStage = (detail: ApplyMeDetail, statusId: string): boolean =>
    detail.statusId === statusId;

  isStagePassed = (detail: ApplyMeDetail, statusId: string): boolean =>
    detail.histories.some((history) => history.applyStatusId === statusId);

  isFinalStatus = (detail: ApplyMeDetail): boolean =>
    !!detail.stages.find((stage) => stage.applyStatusId === detail.statusId)?.isFinal;

  canWithdraw = (detail: ApplyMeDetail): boolean =>
    !this.isFinalStatus(detail) && !!this.getWithdrawnStatus(detail);

  isHiredStatus = (detail: ApplyMeDetail): boolean => {
    const statusText = this.buildStatusText(detail);
    return (
      statusText.includes('hire') || statusText.includes('hired') || statusText.includes('joined')
    );
  };

  isRejectedStatus = (detail: ApplyMeDetail): boolean =>
    this.buildStatusText(detail).includes('reject');

  isWithdrawnStatus = (detail: ApplyMeDetail): boolean =>
    this.buildStatusText(detail).includes('withdraw');

  private fetchApplyList(): void {
    this.loading.set(true);
    this.applyService.getMine().subscribe({
      next: (applyList) => {
        this.applies.set(applyList);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  private fetchDetail(applyId: string): void {
    this.loadingDetailId.set(applyId);
    this.applyService.getApplyDetailById(applyId).subscribe({
      next: (applyDetail) => {
        this.details.update((current) => ({ ...current, [applyId]: applyDetail }));
        this.loadingDetailId.set(null);
      },
      error: () => this.loadingDetailId.set(null),
    });
  }

  private removeDetail(applyId: string): void {
    this.details.update((current) => {
      const updated = { ...current };
      delete updated[applyId];
      return updated;
    });
  }

  private buildStatusText = (detail: ApplyMeDetail): string =>
    `${detail.currentStatus?.code ?? ''} ${detail.currentStatus?.name ?? ''}`.toLowerCase();
}
