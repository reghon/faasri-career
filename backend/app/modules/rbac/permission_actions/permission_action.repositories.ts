import { queryCamel, queryCamelOne } from "../../../utils/db.util";
import { permissionActionQueries } from "./permission_action.queries";
import { PermissionAction, PermissionActionPayload } from "./permission_action.types";

export const permissionActionRepository = {
  async getAll(): Promise<PermissionAction[]> {
    return queryCamel<PermissionAction>(permissionActionQueries.getAll);
  },

  async getById(id: string): Promise<PermissionAction | null> {
    return queryCamelOne<PermissionAction>(permissionActionQueries.getById, [id]);
  },

  async getByCode(code: string): Promise<PermissionAction | null> {
    return queryCamelOne<PermissionAction>(permissionActionQueries.getByCode, [code]);
  },

  async getByName(name: string): Promise<PermissionAction | null> {
    return queryCamelOne<PermissionAction>(permissionActionQueries.getByName, [name]);
  },

  async create(data: PermissionActionPayload, actorId: string): Promise<PermissionAction | null> {
    return queryCamelOne<PermissionAction>(permissionActionQueries.create, [data.code, data.name, data.description, data.isActive, actorId]);
  },

  async update(id: string, data: PermissionActionPayload, actorId: string): Promise<PermissionAction | null> {
    return queryCamelOne<PermissionAction>(permissionActionQueries.update, [data.code, data.name, data.description, data.isActive, actorId, id]);
  },

  async softDelete(id: string, actorId: string): Promise<{ id: string } | null> {
    return queryCamelOne<{ id: string }>(permissionActionQueries.softDelete, [id, actorId]);
  },
};
