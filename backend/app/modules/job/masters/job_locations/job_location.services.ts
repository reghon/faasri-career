import { AppError } from "../../../../errors/app-error";
import { jobLocationRepository } from "./job_location.repositories";
import { JobLocationPayload } from "./job_location.types";

export const jobLocationService = {
  async getAll() {
    return jobLocationRepository.getAll();
  },

  async getById(id: string) {
    const jobLocation = await jobLocationRepository.getById(id);

    if (!jobLocation) {
      throw new AppError(404, "Job location not found");
    }

    return jobLocation;
  },

  async create(data: JobLocationPayload, actorId: string) {
    const existingJobLocation = await jobLocationRepository.getByName(data.name);

    if (existingJobLocation) {
      throw new AppError(409, "Job location name already exists");
    }

    const createdJobLocation = await jobLocationRepository.create(data, actorId);

    if (!createdJobLocation) {
      throw new AppError(500, "Failed to create job location");
    }

    return createdJobLocation;
  },

  async update(id: string, data: JobLocationPayload, actorId: string) {
    const existingJobLocation = await jobLocationRepository.getById(id);

    if (!existingJobLocation) {
      throw new AppError(404, "Job location not found");
    }

    const duplicateJobLocation = await jobLocationRepository.getByName(data.name);

    if (duplicateJobLocation && duplicateJobLocation.id !== id) {
      throw new AppError(409, "Job location name already exists");
    }

    const updatedJobLocation = await jobLocationRepository.update(id, data, actorId);

    if (!updatedJobLocation) {
      throw new AppError(500, "Failed to update job location");
    }

    return updatedJobLocation;
  },

  async delete(id: string, actorId: string) {
    const existingJobLocation = await jobLocationRepository.getById(id);

    if (!existingJobLocation) {
      throw new AppError(404, "Job location not found");
    }

    const deletedJobLocation = await jobLocationRepository.softDelete(id, actorId);

    if (!deletedJobLocation) {
      throw new AppError(500, "Failed to delete job location");
    }

    return deletedJobLocation;
  },
};
