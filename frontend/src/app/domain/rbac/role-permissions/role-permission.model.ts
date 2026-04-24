export interface RolePermission {
  id: string;
  roleId: string;
  permissionId: string;
  isActive: boolean;

  roleCode?: string;
  roleName?: string;
  permissionCode?: string;
  permissionName?: string;
  moduleCode?: string;
  moduleName?: string;
  permissionActionCode?: string;
  permissionActionName?: string;
}

export interface RolePermissionDetail {
  id: string;
  roleId: string;
  permissionId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;

  roleCode?: string;
  roleName?: string;
  permissionCode?: string;
  permissionName?: string;
  moduleCode?: string;
  moduleName?: string;
  permissionActionCode?: string;
  permissionActionName?: string;
}

export type RolePermissionPayload = {
  roleId: string;
  permissionId: string;
  isActive: boolean;
};
