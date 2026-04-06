import { queryCamel, queryCamelOne } from "../../../../utils/db.util";
import { jobCategoryQueries } from "./job_category.queries";
import { JobCategory, JobCategoryPayload } from "./job_category.types";

export const jobCategoryRepository = {
  async getAll(): Promise<JobCategory[]> {
    return queryCamel<JobCategory>(jobCategoryQueries.getAll);
  },

  async getById(id: string): Promise<JobCategory | null> {
    return queryCamelOne<JobCategory>(jobCategoryQueries.getById, [id]);
  },

  async getByName(name: string): Promise<JobCategory | null> {
    return queryCamelOne<JobCategory>(jobCategoryQueries.getByName, [name]);
  },

  async create(data: JobCategoryPayload, actorId: string): Promise<JobCategory | null> {
    return queryCamelOne<JobCategory>(jobCategoryQueries.create, [data.name, data.description, data.isActive, actorId]);
  },

  async update(id: string, data: JobCategoryPayload, actorId: string): Promise<JobCategory | null> {
    return queryCamelOne<JobCategory>(jobCategoryQueries.update, [data.name, data.description, data.isActive, actorId, id]);
  },

  async softDelete(id: string, actorId: string): Promise<JobCategory | null> {
    return queryCamelOne<JobCategory>(jobCategoryQueries.softDelete, [id, actorId]);
  },
};
