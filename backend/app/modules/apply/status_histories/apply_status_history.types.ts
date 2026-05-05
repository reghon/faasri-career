export type ApplyStatusHistory = {
  id: string;
  applyId: string;
  applyStatusId: string | null;
  applyStatusName: string;
  notes: string | null;
};

export type ApplyStatusHistoryDetail = {
  id: string;
  applyId: string;
  applyStatusId: string | null;
  applyStatusName: string;
  notes: string | null;
  createdAt: string;
  createdBy: string | null;
  updatedAt: string;
  updatedBy: string | null;
  deletedAt: string | null;
  deletedBy: string | null;
};

export type ApplyStatusHistoryPayload = {
  applyId: string;
  applyStatusId: string;
  notes: string | null;
};

export type ApplyStatusHistoryUpdatePayload = {
  notes: string | null;
};

export type ApplyLookup = {
  id: string;
  jobId: string;
  statusId: string;
  statusSortOrder: number;
  statusIsFinal: boolean;
};

export type ApplyStatusWithSortOrder = {
  id: string;
  code: string;
  name: string;
  sortOrder: number;
  isFinal: boolean;
};

export type CreateApplyStatusHistoryItem = {
  applyId: string;
  applyStatusId: string;
  applyStatusName: string;
  notes: string | null;
};
export type LatestApplyStatusHistory = {
  id: string;
  applyId: string;
  applyStatusId: string | null;
  applyStatusName: string;
  notes: string | null;
  sortOrder: number | null;
};
