export interface ApplyStatusHistory {
  id: string;
  applyId: string;
  applyStatusId: string | null;
  applyStatusName: string;
  notes: string | null;
}

export interface ApplyStatusHistoryDetail {
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
}

export interface ApplyStatusHistoryPayload {
  applyId: string;
  applyStatusId: string;
  notes: string | null;
}

export interface ApplyStatusHistoryUpdatePayload {
  notes: string | null;
}
