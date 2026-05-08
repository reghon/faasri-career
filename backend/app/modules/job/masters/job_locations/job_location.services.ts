import { AppError } from "../../../../errors/app-error";
import { jobLocationRepository } from "./job_location.repositories";
import { JobLocationPayload } from "./job_location.types";

export const jobLocationService = {
  async getAll() {
    return jobLocationRepository.getAll();
  },

  async getAllDeleted() {
    return jobLocationRepository.getAllDeleted();
  },

  async getById(id: string) {
    const data = await jobLocationRepository.getById(id);

    if (!data) {
      throw new AppError(404, "Job location not found");
    }

    return data;
  },

  async create(data: JobLocationPayload, actorId: string) {
    const existingByCode = await jobLocationRepository.getByCode(data.code);
    if (existingByCode) {
      throw new AppError(409, "Job location code already exists");
    }

    const existingByName = await jobLocationRepository.getByName(data.name);
    if (existingByName) {
      throw new AppError(409, "Job location name already exists");
    }

    const created = await jobLocationRepository.create(data, actorId);

    if (!created) {
      throw new AppError(500, "Failed to create job location");
    }

    return created;
  },

  async update(id: string, data: JobLocationPayload, actorId: string) {
    const existing = await jobLocationRepository.getById(id);

    if (!existing) {
      throw new AppError(404, "Job location not found");
    }

    const duplicateCode = await jobLocationRepository.getByCode(data.code);
    if (duplicateCode && duplicateCode.id !== id) {
      throw new AppError(409, "Job location code already exists");
    }

    const duplicateName = await jobLocationRepository.getByName(data.name);
    if (duplicateName && duplicateName.id !== id) {
      throw new AppError(409, "Job location name already exists");
    }

    const updated = await jobLocationRepository.update(id, data, actorId);

    if (!updated) {
      throw new AppError(500, "Failed to update job location");
    }

    return updated;
  },

  async softDelete(id: string, actorId: string) {
    const existing = await jobLocationRepository.getById(id);

    if (!existing) {
      throw new AppError(404, "Job location not found");
    }

    const deleted = await jobLocationRepository.softDelete(id, actorId);

    if (!deleted) {
      throw new AppError(500, "Failed to delete job location");
    }

    return deleted;
  },

  async hardDelete(id: string, actorId: string) {
    const existing = await jobLocationRepository.getById(id);

    if (!existing) {
      throw new AppError(404, "Job location not found");
    }

    const deleted = await jobLocationRepository.hardDelete(id, actorId);

    if (!deleted) {
      throw new AppError(500, "Failed to permanently delete job location");
    }

    return deleted;
  },

  async restore(id: string, actorId: string) {
    const existing = await jobLocationRepository.getSoftDeletedById(id);

    if (!existing) {
      throw new AppError(404, "Job location not found");
    }

    const updated = await jobLocationRepository.restore(id, actorId);

    if (!updated) {
      throw new AppError(500, "Failed to restore job location");
    }

    return updated;
  },
};
