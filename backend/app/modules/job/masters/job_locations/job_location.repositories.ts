import { queryCamel, queryCamelOne } from "../../../../utils/db.util";
import { jobLocationQueries } from "./job_location.queries";
import { JobLocation, JobLocationDetail, JobLocationPayload } from "./job_location.types";

type JobLocationLookup = Pick<JobLocation, "id" | "name" | "code">;

export const jobLocationRepository = {
  async getAll(): Promise<JobLocation[]> {
    return queryCamel<JobLocation>(jobLocationQueries.getAll);
  },

  async getAllDeleted(): Promise<JobLocation[]> {
    return queryCamel<JobLocation>(jobLocationQueries.getAllDeleted);
  },

  async getById(id: string): Promise<JobLocation | null> {
    return queryCamelOne<JobLocation>(jobLocationQueries.getById, [id]);
  },

  async getSoftDeletedById(id: string): Promise<JobLocation | null> {
    return queryCamelOne<JobLocation>(jobLocationQueries.getSoftDeletedById, [id]);
  },

  async getDetailById(id: string): Promise<JobLocationDetail | null> {
    return queryCamelOne<JobLocationDetail>(jobLocationQueries.getDetailById, [id]);
  },

  async getByName(name: string): Promise<JobLocationLookup | null> {
    return queryCamelOne<JobLocationLookup>(jobLocationQueries.getByName, [name]);
  },

  async getByCode(code: string): Promise<JobLocationLookup | null> {
    return queryCamelOne<JobLocationLookup>(jobLocationQueries.getByCode, [code]);
  },

  async create(data: JobLocationPayload, actorId: string): Promise<JobLocation | null> {
    return queryCamelOne<JobLocation>(jobLocationQueries.create, [data.code, data.name, data.city, data.province, data.country, data.address, data.postalCode, data.isActive, actorId]);
  },

  async update(id: string, data: JobLocationPayload, actorId: string): Promise<JobLocation | null> {
    return queryCamelOne<JobLocation>(jobLocationQueries.update, [data.code, data.name, data.city, data.province, data.country, data.address, data.postalCode, data.isActive, actorId, id]);
  },

  async softDelete(id: string, actorId: string): Promise<JobLocationDetail | null> {
    return queryCamelOne<JobLocationDetail>(jobLocationQueries.softDelete, [id, actorId]);
  },

  async hardDelete(id: string, actorId: string): Promise<JobLocationDetail | null> {
    return queryCamelOne<JobLocationDetail>(jobLocationQueries.hardDelete, [id, actorId]);
  },

  async restore(id: string, actorId: string): Promise<JobLocationDetail | null> {
    return queryCamelOne<JobLocationDetail>(jobLocationQueries.restore, [id, actorId]);
  },
};
