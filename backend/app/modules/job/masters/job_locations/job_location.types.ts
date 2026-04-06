export type JobLocation = {
  id: string;
  name: string;
  city: string;
  province: string;
  country: string;
  address: string;
  postalCode: string;
  isActive: boolean;
  createdAt: string;
  createdBy: string | null;
  updatedAt: string;
  updatedBy: string | null;
  deletedAt: string | null;
  deletedBy: string | null;
};

export type JobLocationPayload = {
  name: string;
  city: string;
  province: string;
  country: string;
  address: string;
  postalCode: string;
  isActive: boolean;
};
