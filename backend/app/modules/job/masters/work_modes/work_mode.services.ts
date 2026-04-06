import { AppError } from "../../../../errors/app-error";
import { workModeRepository } from "./work_mode.repositories";
import { WorkModePayload } from "./work_mode.types";

export const workModeService = {
  async getAll() {
    return workModeRepository.getAll();
  },

  async getById(id: string) {
    const data = await workModeRepository.getById(id);

    if (!data) {
      throw new AppError(404, "Work mode not found");
    }

    return data;
  },

  async create(data: WorkModePayload, actorId: string) {
    const existingByCode = await workModeRepository.getByCode(data.code);
    if (existingByCode) {
      throw new AppError(409, "Work mode code already exists");
    }

    const existingByName = await workModeRepository.getByName(data.name);
    if (existingByName) {
      throw new AppError(409, "Work mode name already exists");
    }

    const created = await workModeRepository.create(data, actorId);

    if (!created) {
      throw new AppError(500, "Failed to create work mode");
    }

    return created;
  },

  async update(id: string, data: WorkModePayload, actorId: string) {
    const existing = await workModeRepository.getById(id);

    if (!existing) {
      throw new AppError(404, "Work mode not found");
    }

    const duplicateCode = await workModeRepository.getByCode(data.code);
    if (duplicateCode && duplicateCode.id !== id) {
      throw new AppError(409, "Work mode code already exists");
    }

    const duplicateName = await workModeRepository.getByName(data.name);
    if (duplicateName && duplicateName.id !== id) {
      throw new AppError(409, "Work mode name already exists");
    }

    const updated = await workModeRepository.update(id, data, actorId);

    if (!updated) {
      throw new AppError(500, "Failed to update work mode");
    }

    return updated;
  },

  async delete(id: string, actorId: string) {
    const existing = await workModeRepository.getById(id);

    if (!existing) {
      throw new AppError(404, "Work mode not found");
    }

    const deleted = await workModeRepository.softDelete(id, actorId);

    if (!deleted) {
      throw new AppError(500, "Failed to delete work mode");
    }

    return deleted;
  },
};
