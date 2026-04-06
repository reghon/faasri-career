import { queryCamel, queryCamelOne } from "../../../../utils/db.util";
import { jobCategoryQueries } from "./job_category.queries";
import { JobCategory, JobCategoryDetail, JobCategoryPayload } from "./job_category.types";

type JobCategoryLookup = Pick<JobCategory, "id" | "name" | "code">;

export const jobCategoryRepository = {
  async getAll(): Promise<JobCategory[]> {
    return queryCamel<JobCategory>(jobCategoryQueries.getAll);
  },

  async getById(id: string): Promise<JobCategory | null> {
    return queryCamelOne<JobCategory>(jobCategoryQueries.getById, [id]);
  },

  async getDetailById(id: string): Promise<JobCategoryDetail | null> {
    return queryCamelOne<JobCategoryDetail>(jobCategoryQueries.getDetailById, [id]);
  },

  async getByName(name: string): Promise<JobCategoryLookup | null> {
    return queryCamelOne<JobCategoryLookup>(jobCategoryQueries.getByName, [name]);
  },

  async getByCode(code: string): Promise<JobCategoryLookup | null> {
    return queryCamelOne<JobCategoryLookup>(jobCategoryQueries.getByCode, [code]);
  },

  async create(data: JobCategoryPayload, actorId: string): Promise<JobCategory | null> {
    return queryCamelOne<JobCategory>(jobCategoryQueries.create, [data.name, data.code, data.description, data.isActive, actorId]);
  },

  async update(id: string, data: JobCategoryPayload, actorId: string): Promise<JobCategory | null> {
    return queryCamelOne<JobCategory>(jobCategoryQueries.update, [data.name, data.code, data.description, data.isActive, actorId, id]);
  },

  async softDelete(id: string, actorId: string): Promise<JobCategoryDetail | null> {
    return queryCamelOne<JobCategoryDetail>(jobCategoryQueries.softDelete, [id, actorId]);
  },
};
