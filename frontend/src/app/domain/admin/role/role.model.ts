export interface Role {
  id: string;
  code: string;
  name: string;
  description: string | null;
  isSuperadmin: boolean;
  isActive: boolean;
}

export interface RoleDetail {
  id: string;
  code: string;
  name: string;
  description: string | null;
  isSuperadmin: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export type RolePayload = {
  code: string;
  name: string;
  description: string | null;
  isSuperadmin: boolean;
  isActive: boolean;
};
