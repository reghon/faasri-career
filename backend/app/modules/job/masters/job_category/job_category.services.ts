import { AppError } from "../../../../errors/app-error";
import { jobCategoryRepository } from "./job_category.repositories";
import { JobCategoryPayload } from "./job_category.types";

export const jobCategoryService = {
  async getAll() {
    return jobCategoryRepository.getAll();
  },

  async getAllDeleted() {
    return jobCategoryRepository.getAllDeleted();
  },

  async getById(id: string) {
    const jobCategory = await jobCategoryRepository.getById(id);

    if (!jobCategory) {
      throw new AppError(404, "Job category not found");
    }

    return jobCategory;
  },

  async getDetailById(id: string) {
    const jobCategory = await jobCategoryRepository.getDetailById(id);

    if (!jobCategory) {
      throw new AppError(404, "Job category not found");
    }

    return jobCategory;
  },

  async create(data: JobCategoryPayload, actorId: string) {
    const existingByName = await jobCategoryRepository.getByName(data.name);
    if (existingByName) {
      throw new AppError(409, "Job category name already exists");
    }

    const existingByCode = await jobCategoryRepository.getByCode(data.code);
    if (existingByCode) {
      throw new AppError(409, "Job category code already exists");
    }

    const createdJobCategory = await jobCategoryRepository.create(data, actorId);

    if (!createdJobCategory) {
      throw new AppError(500, "Failed to create job category");
    }

    return createdJobCategory;
  },

  async update(id: string, data: JobCategoryPayload, actorId: string) {
    const existingJobCategory = await jobCategoryRepository.getById(id);

    if (!existingJobCategory) {
      throw new AppError(404, "Job category not found");
    }

    const duplicateByName = await jobCategoryRepository.getByName(data.name);
    if (duplicateByName && duplicateByName.id !== id) {
      throw new AppError(409, "Job category name already exists");
    }

    const duplicateByCode = await jobCategoryRepository.getByCode(data.code);
    if (duplicateByCode && duplicateByCode.id !== id) {
      throw new AppError(409, "Job category code already exists");
    }

    const updatedJobCategory = await jobCategoryRepository.update(id, data, actorId);

    if (!updatedJobCategory) {
      throw new AppError(500, "Failed to update job category");
    }

    return updatedJobCategory;
  },

  async softDelete(id: string, actorId: string) {
    const existingJobCategory = await jobCategoryRepository.getById(id);
    if (!existingJobCategory) {
      throw new AppError(404, "Job category not found");
    }

    const openJobsUsageCount = await jobCategoryRepository.countOpenJobsUsage(id);
    if (openJobsUsageCount > 0) {
      throw new AppError(409, "Job category cannot be deleted because it is used by jobs");
    }

    const deletedJobCategory = await jobCategoryRepository.softDelete(id, actorId);
    if (!deletedJobCategory) {
      throw new AppError(500, "Failed to delete job category");
    }

    return deletedJobCategory;
  },

  async hardDelete(id: string) {
    const existingJobCategory = await jobCategoryRepository.getSoftDeletedById(id);
    if (!existingJobCategory) {
      throw new AppError(404, "Job category not found");
    }

    const jobsUsageCount = await jobCategoryRepository.countJobsUsage(id);
    if (jobsUsageCount > 0) {
      throw new AppError(409, "Job category cannot be permanently deleted because it is used by jobs");
    }

    const deletedJobCategory = await jobCategoryRepository.hardDelete(id);
    if (!deletedJobCategory) {
      throw new AppError(500, "Failed to permanently delete job category");
    }

    return deletedJobCategory;
  },

  async restore(id: string, actorId: string) {
    const existingJobCategory = await jobCategoryRepository.getSoftDeletedById(id);

    if (!existingJobCategory) {
      throw new AppError(404, "Job category not found");
    }

    const restoredJobCategory = await jobCategoryRepository.restore(id, actorId);

    if (!restoredJobCategory) {
      throw new AppError(500, "Failed to restore job category");
    }

    return restoredJobCategory;
  },
};
