import { queryCamel, queryCamelOne } from "../../utils/db.util";
import { roleQueries } from "./role.queries";
import { CountResult, Role, RoleDetail, RolePayload } from "./role.types";

export const roleRepository = {
  async getAll(): Promise<Role[]> {
    return queryCamel<Role>(roleQueries.getAll);
  },

  async getAllDeleted(): Promise<Role[]> {
    return queryCamel<Role>(roleQueries.getAllDeleted);
  },

  async getById(id: string): Promise<RoleDetail | null> {
    return queryCamelOne<RoleDetail>(roleQueries.getById, [id]);
  },

  async getSoftDeletedById(id: string): Promise<RoleDetail | null> {
    return queryCamelOne<RoleDetail>(roleQueries.getSoftDeletedById, [id]);
  },

  async getByName(name: string): Promise<Role | null> {
    return queryCamelOne<Role>(roleQueries.getByName, [name]);
  },

  async getByCode(code: string): Promise<Role | null> {
    return queryCamelOne<Role>(roleQueries.getByCode, [code]);
  },

  async create(data: RolePayload, actorId: string): Promise<Role | null> {
    return queryCamelOne<Role>(roleQueries.create, [data.code, data.name, data.description, data.isSuperadmin, data.isActive, actorId]);
  },

  async update(id: string, data: RolePayload, actorId: string): Promise<Role | null> {
    return queryCamelOne<Role>(roleQueries.update, [data.code, data.name, data.description, data.isSuperadmin, data.isActive, actorId, id]);
  },

  async restore(id: string, actorId: string): Promise<Role | null> {
    return queryCamelOne<Role>(roleQueries.restore, [id, actorId]);
  },

  async countRoleUsage(id: string): Promise<number> {
    const result = await queryCamelOne<CountResult>(roleQueries.countRoleUsage, [id]);
    return result?.count ?? 0;
  },

  async softDelete(id: string, actorId: string): Promise<RoleDetail | null> {
    return queryCamelOne<RoleDetail>(roleQueries.softDelete, [id, actorId]);
  },

  async hardDelete(id: string): Promise<RoleDetail | null> {
    return queryCamelOne<RoleDetail>(roleQueries.hardDelete, [id]);
  },
};
