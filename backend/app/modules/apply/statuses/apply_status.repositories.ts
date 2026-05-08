import { queryCamel, queryCamelOne } from "../../../utils/db.util";
import { applyStatusQueries } from "./apply_status.queries";
import { ApplyStatus, ApplyStatusDetail, ApplyStatusPayload } from "./apply_status.types";
import { PoolClient } from "pg";

type ApplyStatusLookup = Pick<ApplyStatus, "id" | "name" | "code">;

export const applyStatusRepository = {
  async getAll(): Promise<ApplyStatus[]> {
    return queryCamel<ApplyStatus>(applyStatusQueries.getAll);
  },

  async getAllDeleted(): Promise<ApplyStatus[]> {
    return queryCamel<ApplyStatus>(applyStatusQueries.getAllDeleted);
  },

  async getById(id: string): Promise<ApplyStatus | null> {
    return queryCamelOne<ApplyStatus>(applyStatusQueries.getById, [id]);
  },

  async getDefaultByJobId(client: PoolClient, jobId: string): Promise<ApplyStatusLookup | null> {
    return queryCamelOne<ApplyStatusLookup>(client, applyStatusQueries.getDefaultByJobId, [jobId]);
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
    return queryCamelOne<ApplyStatus>(applyStatusQueries.create, [data.code, data.name, data.description, data.isActive, actorId]);
  },

  async update(id: string, data: ApplyStatusPayload, actorId: string): Promise<ApplyStatus | null> {
    return queryCamelOne<ApplyStatus>(applyStatusQueries.update, [data.code, data.name, data.description, data.isActive, actorId, id]);
  },

  async softDelete(id: string, actorId: string): Promise<ApplyStatusDetail | null> {
    return queryCamelOne<ApplyStatusDetail>(applyStatusQueries.softDelete, [id, actorId]);
  },

  async permanentDelete(id: string, actorId: string): Promise<ApplyStatusDetail | null> {
    return queryCamelOne<ApplyStatusDetail>(applyStatusQueries.permanentDelete, [id, actorId]);
  },

  async restore(id: string, actorId: string): Promise<ApplyStatusDetail | null> {
    return queryCamelOne<ApplyStatusDetail>(applyStatusQueries.restore, [id, actorId]);
  },
};
