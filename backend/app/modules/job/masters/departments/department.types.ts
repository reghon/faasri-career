export type Department = {
  id: string;
  code: string;
  name: string;
  description: string | null;
  isActive: boolean;
};

export type DepartmentPayload = {
  code: string;
  name: string;
  description: string | null;
  isActive: boolean;
};

export type DepartmentDetail = {
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

