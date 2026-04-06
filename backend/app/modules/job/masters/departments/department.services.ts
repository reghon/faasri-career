import { AppError } from "../../../../errors/app-error";
import { departmentRepository } from "./department.repositories";
import { DepartmentPayload } from "./department.types";

export const departmentService = {
  async getAll() {
    return departmentRepository.getAll();
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

  async delete(id: string, actorId: string) {
    const existing = await departmentRepository.getById(id);
    if (!existing) {
      throw new AppError(404, "Department not found");
    }

    const deleted = await departmentRepository.softDelete(id, actorId);

    if (!deleted) {
      throw new AppError(500, "Failed to delete department");
    }

    return deleted;
  },
};
