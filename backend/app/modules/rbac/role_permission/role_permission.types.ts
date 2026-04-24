export type RolePermission = {
  id: string;
  roleId: string;
  permissionId: string;
  isActive: boolean;
  createdAt: string;
  createdBy: string | null;
  updatedAt: string;
  updatedBy: string | null;
  deletedAt: string | null;
  deletedBy: string | null;

  roleCode?: string;
  roleName?: string;
  permissionCode?: string;
  permissionName?: string;
  moduleCode?: string;
  moduleName?: string;
  permissionActionCode?: string;
  permissionActionName?: string;
};

export type RolePermissionPayload = {
  roleId: string;
  permissionId: string;
  isActive: boolean;
};

export type RolePermissionParams = {
  id: string;
};
