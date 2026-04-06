import { queryCamel, queryCamelOne } from "../../../../utils/db.util";
import { workModeQueries } from "./work_mode.queries";
import { WorkMode, WorkModeDetail, WorkModePayload } from "./work_mode.types";

type WorkModeLookup = Pick<WorkMode, "id" | "code" | "name">;

export const workModeRepository = {
  async getAll(): Promise<WorkMode[]> {
    return queryCamel<WorkMode>(workModeQueries.getAll);
  },

  async getById(id: string): Promise<WorkMode | null> {
    return queryCamelOne<WorkMode>(workModeQueries.getById, [id]);
  },

  async getDetailById(id: string): Promise<WorkModeDetail | null> {
    return queryCamelOne<WorkModeDetail>(workModeQueries.getDetailById, [id]);
  },

  async getByName(name: string): Promise<WorkModeLookup | null> {
    return queryCamelOne<WorkModeLookup>(workModeQueries.getByName, [name]);
  },

  async getByCode(code: string): Promise<WorkModeLookup | null> {
    return queryCamelOne<WorkModeLookup>(workModeQueries.getByCode, [code]);
  },

  async create(data: WorkModePayload, actorId: string): Promise<WorkMode | null> {
    return queryCamelOne<WorkMode>(workModeQueries.create, [data.code, data.name, data.isActive, actorId]);
  },

  async update(id: string, data: WorkModePayload, actorId: string): Promise<WorkMode | null> {
    return queryCamelOne<WorkMode>(workModeQueries.update, [data.code, data.name, data.isActive, actorId, id]);
  },

  async softDelete(id: string, actorId: string): Promise<WorkModeDetail | null> {
    return queryCamelOne<WorkModeDetail>(workModeQueries.softDelete, [id, actorId]);
  },
};
