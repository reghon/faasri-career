import { queryCamel, queryCamelOne } from "../../utils/db.util";
import { jobQueries } from "./job.queries";
import { CountResult, Job, JobDetail, JobListItem, JobPayload } from "./job.types";

export const jobRepository = {
  async countAll(): Promise<CountResult | null> {
    return queryCamelOne<CountResult>(jobQueries.countAll);
  },

  async getAll(limit: number, offset: number): Promise<JobListItem[]> {
    return queryCamel<JobListItem>(jobQueries.getAll, [limit, offset]);
  },

  async countAllOpen(): Promise<CountResult | null> {
    return queryCamelOne<CountResult>(jobQueries.countAllOpen);
  },

  async getAllOpen(limit: number, offset: number): Promise<JobListItem[]> {
    return queryCamel<JobListItem>(jobQueries.getAllOpen, [limit, offset]);
  },

  async getById(id: string): Promise<JobDetail | null> {
    return queryCamelOne<JobDetail>(jobQueries.getById, [id]);
  },

  async getBySlug(slug: string): Promise<JobDetail | null> {
    return queryCamelOne<JobDetail>(jobQueries.getBySlug, [slug]);
  },

  async create(data: JobPayload, actorId: string): Promise<Job | null> {
    return queryCamelOne<Job>(jobQueries.create, [
      data.categoryId,
      data.employmentTypeId,
      data.statusId,
      data.jobLocationId,
      data.educationLevelId,
      data.departmentId,
      data.workModeId,
      data.title,
      data.slug,
      data.description,
      data.requirements,
      data.responsibilities,
      data.benefits,
      data.minSalary,
      data.maxSalary,
      data.currencyCode,
      data.salaryType,
      data.vacancyCount,
      data.experienceMinYears,
      data.publishedAt ?? null,
      data.closeAt,
      data.isActive,
      actorId,
    ]);
  },

  async update(id: string, data: JobPayload, actorId: string): Promise<Job | null> {
    return queryCamelOne<Job>(jobQueries.update, [
      data.categoryId,
      data.employmentTypeId,
      data.statusId,
      data.jobLocationId,
      data.educationLevelId,
      data.departmentId,
      data.workModeId,
      data.title,
      data.slug,
      data.description,
      data.requirements,
      data.responsibilities,
      data.benefits,
      data.minSalary,
      data.maxSalary,
      data.currencyCode,
      data.salaryType,
      data.vacancyCount,
      data.experienceMinYears,
      data.publishedAt ?? null,
      data.closeAt,
      data.isActive,
      actorId,
      id,
    ]);
  },

  async softDelete(id: string, actorId: string): Promise<Job | null> {
    return queryCamelOne<Job>(jobQueries.softDelete, [id, actorId]);
  },
};
