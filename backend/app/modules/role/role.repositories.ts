import { queryCamel, queryCamelOne } from "../../utils/db.util";
import { roleQueries } from "./role.queries";
import { Role, RoleDetail, RolePayload } from "./role.types";

export const roleRepository = {
  async getAll(): Promise<Role[]> {
    return queryCamel<Role>(roleQueries.getAll);
  },

  async getById(id: string): Promise<RoleDetail | null> {
    return queryCamelOne<RoleDetail>(roleQueries.getById, [id]);
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

  async softDelete(id: string, actorId: string): Promise<RoleDetail | null> {
    return queryCamelOne<RoleDetail>(roleQueries.softDelete, [id, actorId]);
  },
};
