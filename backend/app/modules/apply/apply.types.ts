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

export type ApplyByJobItem = Apply & {
  applicantName: string | null;
  email: string | null;
  phoneCode: string | null;
  phone: string | null;
  cvUrl: string | null;
  cvFileName: string | null;
  linkedinUrl: string | null;
  statusCode: string | null;
  statusName: string | null;
  statusSortOrder: number | null;
};

export type ApplyListItem = {
  id: string;
  applicantProfileId: string;
  jobId: string;
  statusId: string;

  fullName: string | null;
  linkedinUrl: string | null;
  jobName: string | null;
  statusName: string | null;

  appliedAt: string;
  statusUpdatedAt: string | null;
};
