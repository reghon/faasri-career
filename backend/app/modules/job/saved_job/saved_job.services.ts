import { AppError } from "../../../errors/app-error";
import { savedJobRepository } from "./saved_job.repositories";
import { SavedJobPayload } from "./saved_job.types";

export const savedJobService = {
  async getAll() {
    return savedJobRepository.getAll();
  },

  async getById(id: string) {
    const savedJob = await savedJobRepository.getById(id);

    if (!savedJob) {
      throw new AppError(404, "Saved job not found");
    }

    return savedJob;
  },

  async getDetailById(id: string) {
    const savedJob = await savedJobRepository.getDetailById(id);

    if (!savedJob) {
      throw new AppError(404, "Saved job not found");
    }

    return savedJob;
  },

  async create(data: SavedJobPayload, actorId: string) {
    const existingSavedJob = await savedJobRepository.getByUserAndJob(data.userId, data.jobId);

    if (existingSavedJob && !existingSavedJob.deletedAt) {
      throw new AppError(409, "Job already saved");
    }

    if (existingSavedJob && existingSavedJob.deletedAt) {
      const restoredSavedJob = await savedJobRepository.restore(data, actorId);

      if (!restoredSavedJob) {
        throw new AppError(500, "Failed to restore saved job");
      }

      return restoredSavedJob;
    }

    const createdSavedJob = await savedJobRepository.create(data, actorId);

    if (!createdSavedJob) {
      throw new AppError(500, "Failed to create saved job");
    }

    return createdSavedJob;
  },

  async update(id: string, data: SavedJobPayload, actorId: string) {
    const existingSavedJob = await savedJobRepository.getById(id);

    if (!existingSavedJob) {
      throw new AppError(404, "Saved job not found");
    }

    const duplicateSavedJob = await savedJobRepository.getByUserAndJob(data.userId, data.jobId);

    if (duplicateSavedJob && duplicateSavedJob.id !== id && !duplicateSavedJob.deletedAt) {
      throw new AppError(409, "Job already saved by this user");
    }

    const updatedSavedJob = await savedJobRepository.update(id, data, actorId);

    if (!updatedSavedJob) {
      throw new AppError(500, "Failed to update saved job");
    }

    return updatedSavedJob;
  },

  async softDelete(id: string, actorId: string) {
    const existingSavedJob = await savedJobRepository.getById(id);

    if (!existingSavedJob) {
      throw new AppError(404, "Saved job not found");
    }

    const deletedSavedJob = await savedJobRepository.softDelete(id, actorId);

    if (!deletedSavedJob) {
      throw new AppError(500, "Failed to delete saved job");
    }

    return deletedSavedJob;
  },
};
