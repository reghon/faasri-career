export type JobApplyStatus = {
  id: string;
  jobId: string;
  applyStatusId: string;
  sortOrder: number;
  isDefault: boolean;
  isFinal: boolean;
  isActive: boolean;
  applyStatusCode: string;
  applyStatusName: string;
  applyStatusDescription: string | null;
};

export type JobApplyStatusDetail = JobApplyStatus & {
  createdAt: string;
  createdBy: string | null;
  updatedAt: string;
  updatedBy: string | null;
  deletedAt: string | null;
  deletedBy: string | null;
};

export type JobApplyStatusPayload = {
  jobId: string;
  applyStatusId: string;
  sortOrder: number;
  isDefault: boolean;
  isFinal: boolean;
  isActive: boolean;
};

export type JobApplyStatusUpdatePayload = {
  applyStatusId: string;
  sortOrder: number;
  isDefault: boolean;
  isFinal: boolean;
  isActive: boolean;
};

export type JobApplyStatusSyncItem = {
  applyStatusId: string;
  sortOrder: number;
  isDefault: boolean;
  isFinal: boolean;
  isActive: boolean;
};

export type JobApplyStatusSyncPayload = {
  items: JobApplyStatusSyncItem[];
};

export type JobFlowEditGuard = {
  totalApplies: number;
  lockedApplies: number;
};
