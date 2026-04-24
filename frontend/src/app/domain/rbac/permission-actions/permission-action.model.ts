export interface PermissionAction {
  id: string;
  code: string;
  name: string;
  description: string | null;
  isActive: boolean;
}

export interface PermissionActionDetail {
  id: string;
  code: string;
  name: string;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export type PermissionActionPayload = {
  code: string;
  name: string;
  description: string | null;
  isActive: boolean;
};
