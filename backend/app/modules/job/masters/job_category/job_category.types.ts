export type JobCategory = {
  id: string;
  name: string;
  code: string;
  description: string | null;
  isActive: boolean;
};


export type JobCategoryDetail = {
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

export type JobCategoryPayload = {
  name: string;
  code: string
  description: string | null;
  isActive: boolean;
};
