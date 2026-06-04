import { queryCamel, queryCamelOne } from "../../utils/db.util";
import { jobQueries } from "./job.queries";
import { CountResult, Job, JobDetail, JobFilterParams, JobListItem, JobPayload } from "./job.types";

function buildFilterClauses(filters: JobFilterParams): { conditions: string; params: unknown[] } {
  const conditions: string[] = [];
  const params: unknown[] = [];

  if (filters.search) {
    params.push(`%${filters.search}%`);
    conditions.push(`j.title ILIKE $${params.length}`);
  }

  if (filters.status) {
    params.push(filters.status);
    conditions.push(`js.name = $${params.length}`);
  }

  if (filters.department) {
    params.push(filters.department);
    conditions.push(`d.name = $${params.length}`);
  }

  if (filters.location) {
    params.push(filters.location);
    conditions.push(`jl.name = $${params.length}`);
  }

  return {
    conditions: conditions.length > 0 ? "AND " + conditions.join(" AND ") : "",
    params,
  };
}

export const jobRepository = {
  async countAll(filters: JobFilterParams): Promise<CountResult | null> {
    const { conditions, params } = buildFilterClauses(filters);
    return queryCamelOne<CountResult>(jobQueries.countAllFiltered(conditions), params);
  },

  async getAll(limit: number, offset: number, filters: JobFilterParams): Promise<JobListItem[]> {
    const { conditions, params } = buildFilterClauses(filters);
    const limitParam = `$${params.length + 1}`;
    const offsetParam = `$${params.length + 2}`;
    return queryCamel<JobListItem>(
      jobQueries.getAllFiltered(conditions, limitParam, offsetParam),
      [...params, limit, offset],
    );
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
      data.managementProfileId,
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
      data.managementProfileId,
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

  async updateStatus(id: string, statusId: string, actorId: string): Promise<Job | null> {
    return queryCamelOne<Job>(jobQueries.updateStatus, [statusId, actorId, id]);
  },
};
