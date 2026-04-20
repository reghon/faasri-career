import { queryCamel, queryCamelOne } from "../../../utils/db.util";
import { applyStatusQueries } from "./apply_status.queries";
import { ApplyStatus, ApplyStatusDetail, ApplyStatusPayload } from "./apply_status.types";

type ApplyStatusLookup = Pick<ApplyStatus, "id" | "name" | "code">;

export const applyStatusRepository = {
  async getAll(): Promise<ApplyStatus[]> {
    return queryCamel<ApplyStatus>(applyStatusQueries.getAll);
  },

  async getById(id: string): Promise<ApplyStatus | null> {
    return queryCamelOne<ApplyStatus>(applyStatusQueries.getById, [id]);
  },

  async getDetailById(id: string): Promise<ApplyStatusDetail | null> {
    return queryCamelOne<ApplyStatusDetail>(applyStatusQueries.getDetailById, [id]);
  },

  async getByName(name: string): Promise<ApplyStatusLookup | null> {
    return queryCamelOne<ApplyStatusLookup>(applyStatusQueries.getByName, [name]);
  },

  async getByCode(code: string): Promise<ApplyStatusLookup | null> {
    return queryCamelOne<ApplyStatusLookup>(applyStatusQueries.getByCode, [code]);
  },

  async create(data: ApplyStatusPayload, actorId: string): Promise<ApplyStatus | null> {
    return queryCamelOne<ApplyStatus>(applyStatusQueries.create, [data.code, data.name, data.description, data.sortOrder, data.isDefault, data.isFinal, data.isActive, actorId]);
  },

  async update(id: string, data: ApplyStatusPayload, actorId: string): Promise<ApplyStatus | null> {
    return queryCamelOne<ApplyStatus>(applyStatusQueries.update, [data.code, data.name, data.description, data.sortOrder, data.isDefault, data.isFinal, data.isActive, actorId, id]);
  },

  async softDelete(id: string, actorId: string): Promise<ApplyStatusDetail | null> {
    return queryCamelOne<ApplyStatusDetail>(applyStatusQueries.softDelete, [id, actorId]);
  },
};
