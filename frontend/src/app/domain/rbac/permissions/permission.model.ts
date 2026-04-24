export interface Permission {
  id: string;
  moduleId: string;
  permissionActionId: string;
  code: string;
  name: string;
  description: string | null;
  isActive: boolean;

  moduleCode?: string;
  moduleName?: string;
  permissionActionCode?: string;
  permissionActionName?: string;
}

export interface PermissionDetail {
  id: string;
  moduleId: string;
  permissionActionId: string;
  code: string;
  name: string;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;

  moduleCode?: string;
  moduleName?: string;
  permissionActionCode?: string;
  permissionActionName?: string;
}

export type PermissionPayload = {
  moduleId: string;
  permissionActionId: string;
  code: string;
  name: string;
  description: string | null;
  isActive: boolean;
};
