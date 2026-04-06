export type JobLocation = {
  id: string;
  code: string;
  name: string;
  city: string;
  province: string;
  country: string;
  address: string;
  postalCode: string;
  isActive: boolean;
};

export type JobLocationDetail = {
  id: string;
  code: string;
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
  code: string;
  name: string;
  city: string;
  province: string;
  country: string;
  address: string;
  postalCode: string;
  isActive: boolean;
};
