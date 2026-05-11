import { AppError } from "../../../errors/app-error";
import { applyStatusRepository } from "./apply_status.repositories";
import { ApplyStatusPayload } from "./apply_status.types";

export const applyStatusService = {
  async getAll() {
    return applyStatusRepository.getAll();
  },

  async getAllDeleted() {
    return applyStatusRepository.getAllDeleted();
  },

  async getById(id: string) {
    const applyStatus = await applyStatusRepository.getById(id);

    if (!applyStatus) {
      throw new AppError(404, "Apply status not found");
    }

    return applyStatus;
  },

  async getDetailById(id: string) {
    const applyStatus = await applyStatusRepository.getDetailById(id);

    if (!applyStatus) {
      throw new AppError(404, "Apply status not found");
    }

    return applyStatus;
  },

  async create(data: ApplyStatusPayload, actorId: string) {
    const existingByName = await applyStatusRepository.getByName(data.name);
    if (existingByName) {
      throw new AppError(409, "Apply status name already exists");
    }

    const existingByCode = await applyStatusRepository.getByCode(data.code);
    if (existingByCode) {
      throw new AppError(409, "Apply status code already exists");
    }

    const createdApplyStatus = await applyStatusRepository.create(data, actorId);

    if (!createdApplyStatus) {
      throw new AppError(500, "Failed to create apply status");
    }

    return createdApplyStatus;
  },

  async update(id: string, data: ApplyStatusPayload, actorId: string) {
    const existingApplyStatus = await applyStatusRepository.getById(id);

    if (!existingApplyStatus) {
      throw new AppError(404, "Apply status not found");
    }

    const duplicateByName = await applyStatusRepository.getByName(data.name);
    if (duplicateByName && duplicateByName.id !== id) {
      throw new AppError(409, "Apply status name already exists");
    }

    const duplicateByCode = await applyStatusRepository.getByCode(data.code);
    if (duplicateByCode && duplicateByCode.id !== id) {
      throw new AppError(409, "Apply status code already exists");
    }

    const updatedApplyStatus = await applyStatusRepository.update(id, data, actorId);

    if (!updatedApplyStatus) {
      throw new AppError(500, "Failed to update apply status");
    }

    return updatedApplyStatus;
  },

  async delete(id: string, actorId: string) {
    const existingApplyStatus = await applyStatusRepository.getById(id);
    if (!existingApplyStatus) {
      throw new AppError(404, "Apply status not found");
    }

    const activeCountUsage = await applyStatusRepository.countActiveUsage(id);
    if (activeCountUsage > 0) {
      throw new AppError(409, "Apply status cannot be deleted because it is still being used");
    }

    const deletedApplyStatus = await applyStatusRepository.softDelete(id, actorId);
    if (!deletedApplyStatus) {
      throw new AppError(500, "Failed to delete apply status");
    }

    return deletedApplyStatus;
  },

  async permanentDelete(id: string) {
    const existingApplyStatus = await applyStatusRepository.getSoftDeletedById(id);
    if (!existingApplyStatus) {
      throw new AppError(404, "Apply status not found");
    }

    const countUsage = await applyStatusRepository.countUsage(id);
    if (countUsage > 0) {
      throw new AppError(409, "Apply status cannot be permanently deleted because related records still exist");
    }

    const permanentDeletedApplyStatus = await applyStatusRepository.permanentDelete(id);
    if (!permanentDeletedApplyStatus) {
      throw new AppError(500, "Failed to permanently delete apply status");
    }

    return permanentDeletedApplyStatus;
  },

  async restore(id: string, actorId: string) {
    const existingApplyStatus = await applyStatusRepository.getById(id);

    if (!existingApplyStatus) {
      throw new AppError(404, "Apply status not found");
    }

    const restoredApplyStatus = await applyStatusRepository.restore(id, actorId);

    if (!restoredApplyStatus) {
      throw new AppError(500, "Failed to restore apply status");
    }

    return restoredApplyStatus;
  },
};
