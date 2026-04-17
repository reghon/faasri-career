export type Role = {
  id: string;
  code: string;
  name: string;
  description: string | null;
  isSuperadmin: boolean;
  isActive: boolean;
};

export type RolePayload = {
  code: string;
  name: string;
  description: string | null;
  isSuperadmin: boolean;
  isActive: boolean;
};

export type RoleDetail = {
  id: string;
  code: string;
  name: string;
  description: string | null;
  isSuperadmin: boolean;
  isActive: boolean;
  createdAt: string;
  createdBy: string | null;
  updatedAt: string;
  updatedBy: string | null;
  deletedAt: string | null;
  deletedBy: string | null;
};
