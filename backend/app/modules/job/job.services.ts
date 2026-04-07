import { AppError } from "../../errors/app-error";
import { jobRepository } from "./job.repositories";
import { JobPayload, PaginatedJobs } from "./job.types";

export const jobService = {
  async getAll(page: number, limit: number): Promise<PaginatedJobs> {
    const offset = (page - 1) * limit;

    const [countResult, items] = await Promise.all([jobRepository.countAll(), jobRepository.getAll(limit, offset)]);

    const total = countResult?.total ?? 0;

    return {
      items,
      meta: {
        page,
        limit,
        total,
        totalPages: total === 0 ? 0 : Math.ceil(total / limit),
      },
    };
  },

  async getById(id: string) {
    const job = await jobRepository.getById(id);

    if (!job) {
      throw new AppError(404, "Job not found");
    }

    return job;
  },

  async create(data: JobPayload, actorId: string) {
    const existingJob = await jobRepository.getBySlug(data.slug);

    if (existingJob) {
      throw new AppError(409, "Job slug already exists");
    }

    const createdJob = await jobRepository.create(data, actorId);

    if (!createdJob) {
      throw new AppError(500, "Failed to create job");
    }

    return createdJob;
  },

  async update(id: string, data: JobPayload, actorId: string) {
    const existingJob = await jobRepository.getById(id);

    if (!existingJob) {
      throw new AppError(404, "Job not found");
    }

    const duplicateJob = await jobRepository.getBySlug(data.slug);

    if (duplicateJob && duplicateJob.id !== id) {
      throw new AppError(409, "Job slug already exists");
    }

    const updatedJob = await jobRepository.update(id, data, actorId);

    if (!updatedJob) {
      throw new AppError(500, "Failed to update job");
    }

    return updatedJob;
  },

  async delete(id: string, actorId: string) {
    const existingJob = await jobRepository.getById(id);

    if (!existingJob) {
      throw new AppError(404, "Job not found");
    }

    const deletedJob = await jobRepository.softDelete(id, actorId);

    if (!deletedJob) {
      throw new AppError(500, "Failed to delete job");
    }

    return deletedJob;
  },
};
