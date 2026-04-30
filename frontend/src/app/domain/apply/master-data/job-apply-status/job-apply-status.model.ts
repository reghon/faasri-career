export interface JobApplyStatus {
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
}

export interface JobApplyStatusDetail {
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
  createdAt: string;
  createdBy: string | null;
  updatedAt: string;
  updatedBy: string | null;
  deletedAt: string | null;
  deletedBy: string | null;
}

export interface JobApplyStatusPayload {
  jobId: string;
  applyStatusId: string;
  sortOrder: number;
  isDefault: boolean;
  isFinal: boolean;
  isActive: boolean;
}

export interface JobApplyStatusUpdatePayload {
  applyStatusId: string;
  sortOrder: number;
  isDefault: boolean;
  isFinal: boolean;
  isActive: boolean;
}

export interface JobApplyStatusSyncItem {
  applyStatusId: string;
  sortOrder: number;
  isDefault: boolean;
  isFinal: boolean;
  isActive: boolean;
}

export interface JobApplyStatusSyncPayload {
  items: JobApplyStatusSyncItem[];
}

export interface JobApplyStatusEditGuard {
  totalApplies: number;
  lockedApplies: number;
  canEditJobFlow: boolean;
}
