import { queryCamel, queryCamelOne } from "../../../utils/db.util";
import { savedJobQueries } from "./saved_job.queries";
import { SavedJob, SavedJobDetail, SavedJobPayload } from "./saved_job.types";

export const savedJobRepository = {
  async getAll(): Promise<SavedJob[]> {
    return queryCamel<SavedJob>(savedJobQueries.getAll);
  },

  async getById(id: string): Promise<SavedJob | null> {
    return queryCamelOne<SavedJob>(savedJobQueries.getById, [id]);
  },

  async getDetailById(id: string): Promise<SavedJobDetail | null> {
    return queryCamelOne<SavedJobDetail>(savedJobQueries.getDetailById, [id]);
  },

  async getByUserAndJob(userId: string, jobId: string): Promise<SavedJobDetail | null> {
    return queryCamelOne<SavedJobDetail>(savedJobQueries.getByUserAndJob, [userId, jobId]);
  },

  async create(data: SavedJobPayload, actorId: string): Promise<SavedJob | null> {
    return queryCamelOne<SavedJob>(savedJobQueries.create, [data.userId, data.jobId, data.isActive, actorId]);
  },

  async update(id: string, data: SavedJobPayload, actorId: string): Promise<SavedJob | null> {
    return queryCamelOne<SavedJob>(savedJobQueries.update, [data.userId, data.jobId, data.isActive, actorId, id]);
  },

  async restore(data: SavedJobPayload, actorId: string): Promise<SavedJob | null> {
    return queryCamelOne<SavedJob>(savedJobQueries.restore, [data.userId, data.jobId, data.isActive, actorId]);
  },

  async softDelete(id: string, actorId: string): Promise<SavedJobDetail | null> {
    return queryCamelOne<SavedJobDetail>(savedJobQueries.softDelete, [id, actorId]);
  },
};
