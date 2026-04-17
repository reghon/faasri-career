import { queryCamel, queryCamelOne } from "../../../utils/db.util";
import { managementProfileQueries } from "./management_profile.queries";
import { ManagementProfile, ManagementProfilePayload } from "./management_profile.types";

export const managementProfileRepository = {
  async getAll(): Promise<ManagementProfile[]> {
    return queryCamel<ManagementProfile>(managementProfileQueries.getAll);
  },

  async getById(id: string): Promise<ManagementProfile | null> {
    return queryCamelOne<ManagementProfile>(managementProfileQueries.getById, [id]);
  },

  async getByUserId(userId: string): Promise<ManagementProfile | null> {
    return queryCamelOne<ManagementProfile>(managementProfileQueries.getByUserId, [userId]);
  },

  async create(data: ManagementProfilePayload, actorId: string): Promise<ManagementProfile | null> {
    return queryCamelOne<ManagementProfile>(managementProfileQueries.create, [data.userId, data.roleId, data.fullName, data.isActive, actorId]);
  },

  async update(id: string, data: ManagementProfilePayload, actorId: string): Promise<ManagementProfile | null> {
    return queryCamelOne<ManagementProfile>(managementProfileQueries.update, [data.userId, data.roleId, data.fullName, data.isActive, actorId, id]);
  },

  async softDelete(id: string, actorId: string): Promise<ManagementProfile | null> {
    return queryCamelOne<ManagementProfile>(managementProfileQueries.softDelete, [id, actorId]);
  },
};
