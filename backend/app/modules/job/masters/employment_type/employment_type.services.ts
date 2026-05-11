import { AppError } from "../../../../errors/app-error";
import { employmentTypeRepository } from "./employment_type.repositories";
import { EmploymentTypePayload } from "./employment_type.types";

export const employmentTypeService = {
  async getAll() {
    return employmentTypeRepository.getAll();
  },

  async getAllDeleted() {
    return employmentTypeRepository.getAllDeleted();
  },

  async getById(id: string) {
    const employmentType = await employmentTypeRepository.getById(id);

    if (!employmentType) {
      throw new AppError(404, "Employment type not found");
    }

    return employmentType;
  },

  async getDetailById(id: string) {
    const employmentType = await employmentTypeRepository.getDetailById(id);

    if (!employmentType) {
      throw new AppError(404, "Employment type not found");
    }

    return employmentType;
  },

  async create(data: EmploymentTypePayload, actorId: string) {
    const existingByName = await employmentTypeRepository.getByName(data.name);
    if (existingByName) {
      throw new AppError(409, "Employment type name already exists");
    }

    const existingByCode = await employmentTypeRepository.getByCode(data.code);
    if (existingByCode) {
      throw new AppError(409, "Employment type code already exists");
    }

    const createdEmploymentType = await employmentTypeRepository.create(data, actorId);

    if (!createdEmploymentType) {
      throw new AppError(500, "Failed to create employment type");
    }

    return createdEmploymentType;
  },

  async update(id: string, data: EmploymentTypePayload, actorId: string) {
    const existingEmploymentType = await employmentTypeRepository.getById(id);

    if (!existingEmploymentType) {
      throw new AppError(404, "Employment type not found");
    }

    const duplicateByName = await employmentTypeRepository.getByName(data.name);
    if (duplicateByName && duplicateByName.id !== id) {
      throw new AppError(409, "Employment type name already exists");
    }

    const duplicateByCode = await employmentTypeRepository.getByCode(data.code);
    if (duplicateByCode && duplicateByCode.id !== id) {
      throw new AppError(409, "Employment type code already exists");
    }

    const updatedEmploymentType = await employmentTypeRepository.update(id, data, actorId);

    if (!updatedEmploymentType) {
      throw new AppError(500, "Failed to update employment type");
    }

    return updatedEmploymentType;
  },

  async softDelete(id: string, actorId: string) {
    const existingEmploymentType = await employmentTypeRepository.getById(id);
    if (!existingEmploymentType) {
      throw new AppError(404, "Employment type not found");
    }

    const openJobsUsageCount = await employmentTypeRepository.countOpenJobsUsage(id);
    if (openJobsUsageCount > 0) {
      throw new AppError(409, "Employment type cannot be deleted because it is used by open jobs");
    }

    const deletedEmploymentType = await employmentTypeRepository.softDelete(id, actorId);
    if (!deletedEmploymentType) {
      throw new AppError(500, "Failed to delete employment type");
    }

    return deletedEmploymentType;
  },

  async hardDelete(id: string) {
    const existingEmploymentType = await employmentTypeRepository.getSoftDeletedById(id);
    if (!existingEmploymentType) {
      throw new AppError(404, "Employment type not found");
    }

    const jobsUsageCount = await employmentTypeRepository.countJobsUsage(id);
    if (jobsUsageCount > 0) {
      throw new AppError(409, "Employment type cannot be permanently deleted because it is used by jobs");
    }

    const deletedEmploymentType = await employmentTypeRepository.hardDelete(id);

    if (!deletedEmploymentType) {
      throw new AppError(500, "Failed to permanently delete employment type");
    }

    return deletedEmploymentType;
  },

  async restore(id: string, actorId: string) {
    const existingEmploymentType = await employmentTypeRepository.getSoftDeletedById(id);

    if (!existingEmploymentType) {
      throw new AppError(404, "Employment type not found");
    }

    const restoredEmploymentType = await employmentTypeRepository.restore(id, actorId);

    if (!restoredEmploymentType) {
      throw new AppError(500, "Failed to restore employment type");
    }

    return restoredEmploymentType;
  },
};
