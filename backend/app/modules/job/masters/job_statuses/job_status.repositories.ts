import { queryCamel, queryCamelOne } from "../../../../utils/db.util";
import { jobStatusQueries } from "./job_status.queries";
import { JobStatus, JobStatusDetail, JobStatusPayload } from "./job_status.types";

type JobStatusLookup = Pick<JobStatus, "id" | "code" | "name">;

export const jobStatusRepository = {
  async getAll(): Promise<JobStatus[]> {
    return queryCamel<JobStatus>(jobStatusQueries.getAll);
  },

  async getAllDeleted(): Promise<JobStatus[]> {
    return queryCamel<JobStatus>(jobStatusQueries.getAllDeleted);
  },

  async getById(id: string): Promise<JobStatus | null> {
    return queryCamelOne<JobStatus>(jobStatusQueries.getById, [id]);
  },
  
  async getSoftDeletedById(id: string): Promise<JobStatus | null> {
    return queryCamelOne<JobStatus>(jobStatusQueries.getSoftDeletedById, [id]);
  },

  async getDetailById(id: string): Promise<JobStatusDetail | null> {
    return queryCamelOne<JobStatusDetail>(jobStatusQueries.getDetailById, [id]);
  },

  async getByName(name: string): Promise<JobStatusLookup | null> {
    return queryCamelOne<JobStatusLookup>(jobStatusQueries.getByName, [name]);
  },

  async getByCode(code: string): Promise<JobStatusLookup | null> {
    return queryCamelOne<JobStatusLookup>(jobStatusQueries.getByCode, [code]);
  },

  async create(data: JobStatusPayload, actorId: string): Promise<JobStatus | null> {
    return queryCamelOne<JobStatus>(jobStatusQueries.create, [data.code, data.name, data.description, data.isActive, actorId]);
  },

  async update(id: string, data: JobStatusPayload, actorId: string): Promise<JobStatus | null> {
    return queryCamelOne<JobStatus>(jobStatusQueries.update, [data.code, data.name, data.description, data.isActive, actorId, id]);
  },

  async softDelete(id: string, actorId: string): Promise<JobStatusDetail | null> {
    return queryCamelOne<JobStatusDetail>(jobStatusQueries.softDelete, [id, actorId]);
  },

  async hardDelete(id: string, actorId: string): Promise<JobStatusDetail | null> {
    return queryCamelOne<JobStatusDetail>(jobStatusQueries.hardDelete, [id, actorId]);
  },

  async restore(id: string, actorId: string): Promise<JobStatusDetail | null> {
    return queryCamelOne<JobStatusDetail>(jobStatusQueries.restore, [id, actorId]);
  },
};
