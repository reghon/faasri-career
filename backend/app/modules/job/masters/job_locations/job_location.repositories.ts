import { queryCamel, queryCamelOne } from "../../../../utils/db.util";
import { jobLocationQueries } from "./job_location.queries";
import { JobLocation, JobLocationPayload } from "./job_location.types";

export const jobLocationRepository = {
  async getAll(): Promise<JobLocation[]> {
    return queryCamel<JobLocation>(jobLocationQueries.getAll);
  },

  async getById(id: string): Promise<JobLocation | null> {
    return queryCamelOne<JobLocation>(jobLocationQueries.getById, [id]);
  },

  async getByName(name: string): Promise<JobLocation | null> {
    return queryCamelOne<JobLocation>(jobLocationQueries.getByName, [name]);
  },

  async create(data: JobLocationPayload, actorId: string): Promise<JobLocation | null> {
    return queryCamelOne<JobLocation>(jobLocationQueries.create, [data.name, data.city, data.province, data.country, data.address, data.postalCode, data.isActive, actorId]);
  },

  async update(id: string, data: JobLocationPayload, actorId: string): Promise<JobLocation | null> {
    return queryCamelOne<JobLocation>(jobLocationQueries.update, [data.name, data.city, data.province, data.country, data.address, data.postalCode, data.isActive, actorId, id]);
  },

  async softDelete(id: string, actorId: string): Promise<JobLocation | null> {
    return queryCamelOne<JobLocation>(jobLocationQueries.softDelete, [id, actorId]);
  },
};
