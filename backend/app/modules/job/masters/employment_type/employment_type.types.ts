export type EmploymentType = {
  id: string;
  name: string;
  code: string;
  description: string | null;
  isActive: boolean;
};

export type EmploymentTypePayload = {
  name: string;
  code: string;
  description: string | null;
  isActive: boolean;
};

export type EmploymentTypeDetail = {
  id: string;
  name: string;
  code: string;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  createdBy: string | null;
  updatedAt: string;
  updatedBy: string | null;
  deletedAt: string | null;
  deletedBy: string | null;
};

export type CountResult = {
  count: number;
};
