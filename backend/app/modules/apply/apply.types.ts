export type Apply = {
  id: string;
  applicantProfileId: string;
  jobId: string;
  statusId: string;
  applicationCode: string | null;
  notes: string | null;
  appliedAt: string;
  isActive: boolean;
  createdAt: string;
  createdBy: string | null;
  updatedAt: string;
  updatedBy: string | null;
  deletedAt: string | null;
  deletedBy: string | null;
};

export type CreateApplyPayload = {
  applicantProfileId: string;
  jobId: string;
  statusId: string;
  applicationCode: string | null;
  notes: string | null;
};

export type UpdateApplyStatusPayload = {
  statusId: string;
  notes: string | null;
};

export type ApplyParams = {
  id: string;
};
