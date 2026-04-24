import { queryCamel, queryCamelOne } from "../../../utils/db.util";
import { permissionQueries } from "./permission.queries";
import { Permission, PermissionPayload } from "./permission.types";

export const permissionRepository = {
  async getAll(): Promise<Permission[]> {
    return queryCamel<Permission>(permissionQueries.getAll);
  },

  async getById(id: string): Promise<Permission | null> {
    return queryCamelOne<Permission>(permissionQueries.getById, [id]);
  },

  async getByCode(code: string): Promise<Permission | null> {
    return queryCamelOne<Permission>(permissionQueries.getByCode, [code]);
  },

  async getByModuleAndAction(moduleId: string, permissionActionId: string): Promise<Permission | null> {
    return queryCamelOne<Permission>(permissionQueries.getByModuleAndAction, [moduleId, permissionActionId]);
  },

  async create(data: PermissionPayload, actorId: string): Promise<Permission | null> {
    return queryCamelOne<Permission>(permissionQueries.create, [data.moduleId, data.permissionActionId, data.code, data.name, data.description, data.isActive, actorId]);
  },

  async update(id: string, data: PermissionPayload, actorId: string): Promise<Permission | null> {
    return queryCamelOne<Permission>(permissionQueries.update, [data.moduleId, data.permissionActionId, data.code, data.name, data.description, data.isActive, actorId, id]);
  },

  async softDelete(id: string, actorId: string): Promise<{ id: string } | null> {
    return queryCamelOne<{ id: string }>(permissionQueries.softDelete, [id, actorId]);
  },
};
