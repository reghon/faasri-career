import { AppError } from "../../../../errors/app-error";
import { educationLevelRepository } from "./education_level.repositories";
import { EducationLevelPayload } from "./education_level.types";

export const educationLevelService = {
  async getAll() {
    return educationLevelRepository.getAll();
  },

  async getAllDeleted() {
    return educationLevelRepository.getAllDeleted();
  },

  async getById(id: string) {
    const educationLevel = await educationLevelRepository.getById(id);

    if (!educationLevel) {
      throw new AppError(404, "Education level not found");
    }

    return educationLevel;
  },

  async create(data: EducationLevelPayload, actorId: string) {
    const existingByName = await educationLevelRepository.getByName(data.name);
    if (existingByName) {
      throw new AppError(409, "Education level name already exists");
    }

    const existingByCode = await educationLevelRepository.getByCode(data.code);
    if (existingByCode) {
      throw new AppError(409, "Education level code already exists");
    }

    const createdEducationLevel = await educationLevelRepository.create(data, actorId);

    if (!createdEducationLevel) {
      throw new AppError(500, "Failed to create education level");
    }

    return createdEducationLevel;
  },

  async update(id: string, data: EducationLevelPayload, actorId: string) {
    const existingEducationLevel = await educationLevelRepository.getById(id);

    if (!existingEducationLevel) {
      throw new AppError(404, "Education level not found");
    }

    const duplicateName = await educationLevelRepository.getByName(data.name);
    if (duplicateName && duplicateName.id !== id) {
      throw new AppError(409, "Education level name already exists");
    }

    const duplicateCode = await educationLevelRepository.getByCode(data.code);
    if (duplicateCode && duplicateCode.id !== id) {
      throw new AppError(409, "Education level code already exists");
    }

    const updatedEducationLevel = await educationLevelRepository.update(id, data, actorId);

    if (!updatedEducationLevel) {
      throw new AppError(500, "Failed to update education level");
    }

    return updatedEducationLevel;
  },

  async softDelete(id: string, actorId: string) {
    const existingEducationLevel = await educationLevelRepository.getById(id);

    if (!existingEducationLevel) {
      throw new AppError(404, "Education level not found");
    }

    const openJobsUsageCount = await educationLevelRepository.countOpenJobsUsage(id);
    if (openJobsUsageCount > 0) {
      throw new AppError(409, "Education level cannot be deleted because it is used by open jobs");
    }

    const deletedEducationLevel = await educationLevelRepository.softDelete(id, actorId);

    if (!deletedEducationLevel) {
      throw new AppError(500, "Failed to delete education level");
    }

    return deletedEducationLevel;
  },

  async hardDelete(id: string) {
    const existingEducationLevel = await educationLevelRepository.getSoftDeletedById(id);
    if (!existingEducationLevel) {
      throw new AppError(404, "Education level not found");
    }

    const jobsUsageCount = await educationLevelRepository.countJobsUsage(id);
    if (jobsUsageCount > 0) {
      throw new AppError(409, "Education level cannot be deleted because it is used by jobs");
    }

    const deletedEducationLevel = await educationLevelRepository.hardDelete(id);

    if (!deletedEducationLevel) {
      throw new AppError(500, "Failed to permanently delete education level");
    }

    return deletedEducationLevel;
  },

  async restore(id: string, actorId: string) {
    const existingEducationLevel = await educationLevelRepository.getSoftDeletedById(id);

    if (!existingEducationLevel) {
      throw new AppError(404, "Education level not found");
    }
    const updatedEducationLevel = await educationLevelRepository.restore(id, actorId);

    if (!updatedEducationLevel) {
      throw new AppError(500, "Failed to restore education level");
    }

    return updatedEducationLevel;
  },
};
