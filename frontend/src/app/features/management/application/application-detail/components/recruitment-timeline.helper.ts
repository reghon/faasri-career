// shared/components/recruitment-timeline/recruitment-timeline.helper.ts

import { RecruitmentTimelineItem, RecruitmentTimelineHistory } from './recruitment-timeline.model';
import { JobApplyStatus } from '../../../../../domain/apply/master-data/job-apply-status/job-apply-status.model';

type TimelineState = 'done' | 'current' | 'pending';

// ─── Text matchers ─────────────────────────────────────────────

export function isFinalHire(statusText: string): boolean {
  return statusText.includes('hire');
}

export function isFinalReject(statusText: string): boolean {
  return statusText.includes('reject') || statusText.includes('withdraw');
}

// ─── Class resolvers ───────────────────────────────────────────

export function resolveDotClass(
  state: TimelineState,
  isFinal: boolean,
  statusText: string,
): string {
  if (isFinal && state !== 'pending') {
    if (isFinalHire(statusText)) return 'bg-success';
    if (isFinalReject(statusText)) return 'bg-error';
    return 'bg-base-300';
  }
  if (state === 'current') return 'bg-warning';
  if (state === 'done') return 'bg-info';
  return 'bg-base-300';
}

export function resolveCardClass(
  state: TimelineState,
  isFinal: boolean,
  statusText: string,
): string {
  if (isFinal && state !== 'pending') {
    if (isFinalHire(statusText)) return 'border-success/30 bg-success/5';
    if (isFinalReject(statusText)) return 'border-error/30 bg-error/5';
    return 'border-base-300 bg-base-100';
  }
  if (state === 'current') return 'border-warning/30 bg-warning/5';
  if (state === 'done') return 'border-base-300 bg-base-100';
  return 'border-base-300 bg-base-200/40';
}

export function resolveStatusLabel(
  state: TimelineState,
  isFinal: boolean,
  statusText: string,
): string {
  if (isFinal && state !== 'pending') {
    if (isFinalHire(statusText)) return 'Diterima';
    if (isFinalReject(statusText)) return 'Ditolak';
    return 'Final';
  }
  if (state === 'current') return 'Saat Ini';
  if (state === 'done') return 'Selesai';
  return 'Belum Dilalui';
}

export function resolveStatusClass(
  state: TimelineState,
  isFinal: boolean,
  statusText: string,
): string {
  if (isFinal && state !== 'pending') {
    if (isFinalHire(statusText)) return 'bg-success/10 text-success';
    if (isFinalReject(statusText)) return 'bg-error/10 text-error';
    return 'bg-base-300/60 text-base-content/50';
  }
  if (state === 'current') return 'bg-warning/10 text-warning';
  if (state === 'done') return 'bg-info/10 text-info';
  return 'bg-base-300/60 text-base-content/50';
}

// ─── Builder ───────────────────────────────────────────────────

export function buildRecruitmentTimeline(
  histories: RecruitmentTimelineHistory[],
  jobStatuses: JobApplyStatus[],
): RecruitmentTimelineItem[] {
  const orderedHistories = [...histories].sort((a, b) => {
    const getTime = (h: RecruitmentTimelineHistory) =>
      h.createdAt ? new Date(h.createdAt).getTime() : 0;
    return getTime(a) - getTime(b);
  });

  const activeStatuses = [...jobStatuses]
    .filter((s) => s.isActive)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  const currentHistory = orderedHistories.at(-1) ?? null;

  const hasFinalHistory = orderedHistories.some((history) =>
    activeStatuses.some((s) => s.applyStatusId === history.applyStatusId && s.isFinal),
  );

  const currentStatusEntry = currentHistory
    ? (activeStatuses.find((s) => s.applyStatusId === currentHistory.applyStatusId) ?? null)
    : null;

  const currentSortOrder = currentStatusEntry?.sortOrder ?? -1;

  const visibleStatuses = hasFinalHistory
    ? activeStatuses.filter((status) =>
        orderedHistories.some((h) => h.applyStatusId === status.applyStatusId),
      )
    : activeStatuses.filter((status) => !status.isFinal);

  return visibleStatuses.map((status) => {
    const { applyStatusId } = status;
    const history = orderedHistories.find((h) => h.applyStatusId === applyStatusId) ?? null;
    const isCurrent = !!currentHistory && currentHistory.applyStatusId === applyStatusId;
    const isDone = !isCurrent && (!!history || status.sortOrder < currentSortOrder);

    const state: TimelineState = isCurrent ? 'current' : isDone ? 'done' : 'pending';
    const statusText =
      `${status.applyStatusCode ?? ''} ${status.applyStatusName ?? ''}`.toLowerCase();

    return {
      id: status.id,
      applyStatusId,
      name: status.applyStatusName || '-',
      code: status.applyStatusCode || null,
      description: status.applyStatusDescription || null,
      isFinal: status.isFinal,
      history,
      state,
      dotClass: resolveDotClass(state, status.isFinal, statusText),
      cardClass: resolveCardClass(state, status.isFinal, statusText),
      statusLabel: resolveStatusLabel(state, status.isFinal, statusText),
      statusClass: resolveStatusClass(state, status.isFinal, statusText),
    };
  });
}
