export type JobStatus = {
  id: string;
  code: string;
  name: string;
  description: string | null;
  isActive: boolean;
};

export type JobStatusDetail = {
  id: string;
  code: string;
  name: string;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  createdBy: string | null;
  updatedAt: string;
  updatedBy: string | null;
  deletedAt: string | null;
  deletedBy: string | null;
};

export type JobStatusPayload = {
  code: string;
  name: string;
  description: string | null;
  isActive: boolean;
};
