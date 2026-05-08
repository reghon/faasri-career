import { AppError } from "../../../../errors/app-error";
import { jobStatusRepository } from "./job_status.repositories";
import { JobStatusPayload } from "./job_status.types";

export const jobStatusService = {
  async getAll() {
    return jobStatusRepository.getAll();
  },

  async getAllDeleted() {
    return jobStatusRepository.getAllDeleted();
  },

  async getById(id: string) {
    const jobStatus = await jobStatusRepository.getById(id);

    if (!jobStatus) {
      throw new AppError(404, "Job status not found");
    }

    return jobStatus;
  },

  async getDetailById(id: string) {
    const jobStatus = await jobStatusRepository.getDetailById(id);

    if (!jobStatus) {
      throw new AppError(404, "Job status not found");
    }

    return jobStatus;
  },

  async create(data: JobStatusPayload, actorId: string) {
    const existingByCode = await jobStatusRepository.getByCode(data.code);
    if (existingByCode) {
      throw new AppError(409, "Job status code already exists");
    }

    const existingByName = await jobStatusRepository.getByName(data.name);
    if (existingByName) {
      throw new AppError(409, "Job status name already exists");
    }

    const createdJobStatus = await jobStatusRepository.create(data, actorId);

    if (!createdJobStatus) {
      throw new AppError(500, "Failed to create job status");
    }

    return createdJobStatus;
  },

  async update(id: string, data: JobStatusPayload, actorId: string) {
    const existingJobStatus = await jobStatusRepository.getById(id);

    if (!existingJobStatus) {
      throw new AppError(404, "Job status not found");
    }

    const duplicateByCode = await jobStatusRepository.getByCode(data.code);
    if (duplicateByCode && duplicateByCode.id !== id) {
      throw new AppError(409, "Job status code already exists");
    }

    const duplicateByName = await jobStatusRepository.getByName(data.name);
    if (duplicateByName && duplicateByName.id !== id) {
      throw new AppError(409, "Job status name already exists");
    }

    const updatedJobStatus = await jobStatusRepository.update(id, data, actorId);

    if (!updatedJobStatus) {
      throw new AppError(500, "Failed to update job status");
    }

    return updatedJobStatus;
  },

  async softDelete(id: string, actorId: string) {
    const existingJobStatus = await jobStatusRepository.getById(id);

    if (!existingJobStatus) {
      throw new AppError(404, "Job status not found");
    }

    const deletedJobStatus = await jobStatusRepository.softDelete(id, actorId);

    if (!deletedJobStatus) {
      throw new AppError(500, "Failed to delete job status");
    }

    return deletedJobStatus;
  },

  async hardDelete(id: string, actorId: string) {
    const existingJobStatus = await jobStatusRepository.getById(id);

    if (!existingJobStatus) {
      throw new AppError(404, "Job status not found");
    }

    const deletedJobStatus = await jobStatusRepository.hardDelete(id, actorId);

    if (!deletedJobStatus) {
      throw new AppError(500, "Failed to permanently delete job status");
    }

    return deletedJobStatus;
  },

  async restore(id: string, actorId: string) {
    const existingJobStatus = await jobStatusRepository.getSoftDeletedById(id);

    if (!existingJobStatus) {
      throw new AppError(404, "Job status not found");
    }

    const restoredJobStatus = await jobStatusRepository.restore(id, actorId);

    if (!restoredJobStatus) {
      throw new AppError(500, "Failed to restore job status");
    }

    return restoredJobStatus;
  },
};
