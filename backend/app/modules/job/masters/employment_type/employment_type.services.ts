import { AppError } from "../../../../errors/app-error";
import { employmentTypeRepository } from "./employment_type.repositories";
import { EmploymentTypePayload } from "./employment_type.types";

export const employmentTypeService = {
  async getAll() {
    return employmentTypeRepository.getAll();
  },

  async getById(id: string) {
    const employmentType = await employmentTypeRepository.getById(id);

    if (!employmentType) {
      throw new AppError(404, "Employment type not found");
    }

    return employmentType;
  },

  async create(data: EmploymentTypePayload, actorId: string) {
    const existingEmploymentType = await employmentTypeRepository.getByName(data.name);

    if (existingEmploymentType) {
      throw new AppError(409, "Employment type name already exists");
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

    const duplicateEmploymentType = await employmentTypeRepository.getByName(data.name);

    if (duplicateEmploymentType && duplicateEmploymentType.id !== id) {
      throw new AppError(409, "Employment type name already exists");
    }

    const updatedEmploymentType = await employmentTypeRepository.update(id, data, actorId);

    if (!updatedEmploymentType) {
      throw new AppError(500, "Failed to update employment type");
    }

    return updatedEmploymentType;
  },

  async delete(id: string, actorId: string) {
    const existingEmploymentType = await employmentTypeRepository.getById(id);

    if (!existingEmploymentType) {
      throw new AppError(404, "Employment type not found");
    }

    const deletedEmploymentType = await employmentTypeRepository.softDelete(id, actorId);

    if (!deletedEmploymentType) {
      throw new AppError(500, "Failed to delete employment type");
    }

    return deletedEmploymentType;
  },
};
