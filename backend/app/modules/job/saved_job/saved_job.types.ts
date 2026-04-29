export type SavedJob = {
  id: string;
  userId: string;
  jobId: string;
  isActive: boolean;
};

export type SavedJobDetail = {
  id: string;
  userId: string;
  jobId: string;
  isActive: boolean;
  createdAt: string;
  createdBy: string | null;
  updatedAt: string | null;
  updatedBy: string | null;
  deletedAt: string | null;
  deletedBy: string | null;
};

export type SavedJobPayload = {
  userId: string;
  jobId: string;
  isActive: boolean;
};
