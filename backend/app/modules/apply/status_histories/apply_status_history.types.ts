export type ApplyStatusHistory = {
  id: string;
  applyId: string;
  fromStatusId: string | null;
  toStatusId: string;
  notes: string | null;
  changedAt: string;
  changedBy: string | null;
  createdAt: string;
  createdBy: string | null;
  updatedAt: string;
  updatedBy: string | null;
  deletedAt: string | null;
  deletedBy: string | null;
};

export type CreateApplyStatusHistoryPayload = {
  applyId: string;
  fromStatusId: string | null;
  toStatusId: string;
  notes?: string | null;
  actorId: string;
};
