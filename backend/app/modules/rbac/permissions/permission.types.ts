export type Permission = {
  id: string;
  moduleId: string;
  permissionActionId: string;
  code: string;
  name: string;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  createdBy: string | null;
  updatedAt: string;
  updatedBy: string | null;
  deletedAt: string | null;
  deletedBy: string | null;

  moduleCode?: string;
  moduleName?: string;
  permissionActionCode?: string;
  permissionActionName?: string;
};

export type PermissionPayload = {
  moduleId: string;
  permissionActionId: string;
  code: string;
  name: string;
  description: string | null;
  isActive: boolean;
};

export type PermissionParams = {
  id: string;
};
