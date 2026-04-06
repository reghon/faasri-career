export type JobCategory = {
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

export type JobCategoryPayload = {
  name: string;
  description: string | null;
  isActive: boolean;
};
