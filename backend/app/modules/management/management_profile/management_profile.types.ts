export type ManagementProfile = {
  id: string;
  userId: string;
  roleId: string;
  fullName: string;
  isActive: boolean;
};

export type ManagementProfilePayload = {
  userId: string;
  roleId: string;
  fullName: string;
  isActive: boolean;
};

export type ManagementProfileDetail = {
  id: string;
  userId: string;
  roleId: string;
  fullName: string;
  isActive: boolean;
  createdAt: string;
  createdBy: string | null;
  updatedAt: string;
  updatedBy: string | null;
  deletedAt: string | null;
  deletedBy: string | null;
};
