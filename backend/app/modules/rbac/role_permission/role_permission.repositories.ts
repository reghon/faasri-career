import { queryCamel, queryCamelOne } from "../../../utils/db.util";
import { rolePermissionQueries } from "./role_permission.queries";
import { RolePermission, RolePermissionPayload } from "./role_permission.types";

export const rolePermissionRepository = {
  async getAll(): Promise<RolePermission[]> {
    return queryCamel<RolePermission>(rolePermissionQueries.getAll);
  },

  async getById(id: string): Promise<RolePermission | null> {
    return queryCamelOne<RolePermission>(rolePermissionQueries.getById, [id]);
  },

  async getByRoleAndPermission(roleId: string, permissionId: string): Promise<RolePermission | null> {
    return queryCamelOne<RolePermission>(rolePermissionQueries.getByRoleAndPermission, [roleId, permissionId]);
  },

  async create(data: RolePermissionPayload, actorId: string): Promise<RolePermission | null> {
    return queryCamelOne<RolePermission>(rolePermissionQueries.create, [data.roleId, data.permissionId, data.isActive, actorId]);
  },

  async update(id: string, data: RolePermissionPayload, actorId: string): Promise<RolePermission | null> {
    return queryCamelOne<RolePermission>(rolePermissionQueries.update, [data.roleId, data.permissionId, data.isActive, actorId, id]);
  },

  async softDelete(id: string, actorId: string): Promise<{ id: string } | null> {
    return queryCamelOne<{ id: string }>(rolePermissionQueries.softDelete, [id, actorId]);
  },
};
