export type ApplyStatus = {
  id: string;
  code: string;
  name: string;
  description: string | null;
  isActive: boolean;
};

export type ApplyStatusDetail = {
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

export type ApplyStatusPayload = {
  code: string;
  name: string;
  description: string | null;
  isActive: boolean;
};
