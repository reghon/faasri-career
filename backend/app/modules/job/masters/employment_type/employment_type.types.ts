export type EmploymentType = {
  id: string;
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

export type EmploymentTypePayload = {
  name: string;
  description: string | null;
  isActive: boolean;
};
