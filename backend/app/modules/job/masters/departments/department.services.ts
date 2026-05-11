import { AppError } from "../../../../errors/app-error";
import { departmentRepository } from "./department.repositories";
import { DepartmentPayload } from "./department.types";

export const departmentService = {
  async getAll() {
    return departmentRepository.getAll();
  },

  async getAllDeleted() {
    return departmentRepository.getAllDeleted();
  },

  async getById(id: string) {
    const department = await departmentRepository.getById(id);

    if (!department) {
      throw new AppError(404, "Department not found");
    }

    return department;
  },

  async create(data: DepartmentPayload, actorId: string) {
    const existingByName = await departmentRepository.getByName(data.name);
    if (existingByName) {
      throw new AppError(409, "Department name already exists");
    }

    const existingByCode = await departmentRepository.getByCode(data.code);
    if (existingByCode) {
      throw new AppError(409, "Department code already exists");
    }

    const created = await departmentRepository.create(data, actorId);

    if (!created) {
      throw new AppError(500, "Failed to create department");
    }

    return created;
  },

  async update(id: string, data: DepartmentPayload, actorId: string) {
    const existing = await departmentRepository.getById(id);
    if (!existing) {
      throw new AppError(404, "Department not found");
    }

    const duplicateName = await departmentRepository.getByName(data.name);
    if (duplicateName && duplicateName.id !== id) {
      throw new AppError(409, "Department name already exists");
    }

    const duplicateCode = await departmentRepository.getByCode(data.code);
    if (duplicateCode && duplicateCode.id !== id) {
      throw new AppError(409, "Department code already exists");
    }

    const updated = await departmentRepository.update(id, data, actorId);

    if (!updated) {
      throw new AppError(500, "Failed to update department");
    }

    return updated;
  },

  async softDelete(id: string, actorId: string) {
    const existing = await departmentRepository.getById(id);
    if (!existing) {
      throw new AppError(404, "Department not found");
    }

    const openJobsUsageCount = await departmentRepository.countOpenJobsUsage(id);
    if (openJobsUsageCount > 0) {
      throw new AppError(409, "Department cannot be deleted because it is used by open jobs");
    }

    const deleted = await departmentRepository.softDelete(id, actorId);

    if (!deleted) {
      throw new AppError(500, "Failed to delete department");
    }

    return deleted;
  },

  async hardDelete(id: string) {
    const existing = await departmentRepository.getSoftDeletedById(id);
    if (!existing) {
      throw new AppError(404, "Department not found");
    }

    const jobsUsageCount = await departmentRepository.countJobsUsage(id);
    if (jobsUsageCount > 0) {
      throw new AppError(409, "Department cannot be deleted because it is used by jobs");
    }

    const deleted = await departmentRepository.hardDelete(id);

    if (!deleted) {
      throw new AppError(500, "Failed to permanently delete department");
    }

    return deleted;
  },

  async restore(id: string, actorId: string) {
    const existing = await departmentRepository.getSoftDeletedById(id);

    if (!existing) {
      throw new AppError(404, "Department not found");
    }

    const restored = await departmentRepository.restore(id, actorId);

    if (!restored) {
      throw new AppError(500, "Failed to restore department");
    }

    return restored;
  },
};
