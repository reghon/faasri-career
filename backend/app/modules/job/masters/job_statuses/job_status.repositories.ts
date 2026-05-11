import { queryCamel, queryCamelOne } from "../../../../utils/db.util";
import { jobStatusQueries } from "./job_status.queries";
import { CountResult, JobStatus, JobStatusDetail, JobStatusPayload } from "./job_status.types";

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

  async countOpenJobsUsage(id: string): Promise<number> {
    const result = await queryCamelOne<CountResult>(jobStatusQueries.countOpenJobsUsage, [id]);
    return result?.count ?? 0;
  },

  async countJobsUsage(id: string): Promise<number> {
    const result = await queryCamelOne<CountResult>(jobStatusQueries.countJobsUsage, [id]);
    return result?.count ?? 0;
  },

  async softDelete(id: string, actorId: string): Promise<JobStatusDetail | null> {
    return queryCamelOne<JobStatusDetail>(jobStatusQueries.softDelete, [id, actorId]);
  },

  async hardDelete(id: string): Promise<JobStatusDetail | null> {
    return queryCamelOne<JobStatusDetail>(jobStatusQueries.hardDelete, [id]);
  },

  async restore(id: string, actorId: string): Promise<JobStatusDetail | null> {
    return queryCamelOne<JobStatusDetail>(jobStatusQueries.restore, [id, actorId]);
  },
};
