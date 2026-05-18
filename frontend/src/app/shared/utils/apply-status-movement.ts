import { JobApplyStatus } from '../../domain/apply/master-data/job-apply-status/job-apply-status.model';
import { TableActionItem } from '../components/table-action/table-action';

export type ApplyStatusMovementItem = {
  id: string;
  applyStatusId: string;
  name: string;
  code: string;
  sortOrder: number;
  isFinal: boolean;
  count?: number;
};

export function mapJobApplyStatuses(statuses: JobApplyStatus[]): ApplyStatusMovementItem[] {
  return statuses
    .filter((status) => status.isActive)
    .map((status) => ({
      id: status.applyStatusId,
      applyStatusId: status.applyStatusId,
      name: status.applyStatusName,
      code: status.applyStatusCode,
      sortOrder: status.sortOrder,
      isFinal: status.isFinal,
    }))
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export function mapJobApplyStatusesWithCount<T extends { statusId: string }>(
  statuses: JobApplyStatus[],
  items: T[],
): ApplyStatusMovementItem[] {
  const countMap = new Map<string, number>();

  items.forEach((item) => {
    countMap.set(item.statusId, (countMap.get(item.statusId) || 0) + 1);
  });

  return mapJobApplyStatuses(statuses).map((status) => ({
    ...status,
    count: countMap.get(status.id) || 0,
  }));
}

export function getUniqueJobIds<T extends { jobId?: string | null }>(items: T[]): string[] {
  return Array.from(
    new Set(items.map((item) => item.jobId).filter((jobId): jobId is string => !!jobId)),
  );
}

export function buildMoveStatusActions(
  statuses: ApplyStatusMovementItem[],
  currentStatusId: string,
): TableActionItem[] {
  const currentStatus = statuses.find((status) => status.id === currentStatusId);

  if (!currentStatus) {
    return [
      {
        label: 'Status saat ini tidak ditemukan',
        value: 'current_status_not_found',
        class: 'menu-title pointer-events-none text-xs text-base-content/50',
        disabled: true,
      },
    ];
  }

  if (currentStatus.isFinal) {
    return [
      {
        label: 'Status sudah final',
        value: 'status_final_locked',
        class: 'menu-title pointer-events-none text-xs text-base-content/50',
        disabled: true,
      },
    ];
  }

  const moveStatusActions = statuses
    .filter((status) => status.id !== currentStatusId)
    .map((status) => {
      const disabled = status.sortOrder <= currentStatus.sortOrder;

      return {
        label: status.name,
        value: `move_status:${status.id}`,
        class: disabled ? 'text-base-content/40 pointer-events-none' : 'text-base-content',
        disabled,
      };
    });

  return [
    {
      label: 'Move Status',
      value: 'move_status_header',
      class: 'menu-title pointer-events-none text-xs text-base-content/50',
      disabled: true,
    },
    ...moveStatusActions,
  ];
}
