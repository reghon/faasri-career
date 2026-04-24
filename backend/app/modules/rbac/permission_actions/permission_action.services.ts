import { AppError } from "../../../errors/app-error";
import { permissionActionRepository } from "./permission_action.repositories";
import { PermissionActionPayload } from "./permission_action.types";

export const permissionActionService = {
  async getAll() {
    return permissionActionRepository.getAll();
  },

  async create(userId: string, data: PermissionActionPayload) {
    const existingCode = await permissionActionRepository.getByCode(data.code);

    if (existingCode) {
      throw new AppError(409, "Permission action code already exists");
    }

    const existingName = await permissionActionRepository.getByName(data.name);

    if (existingName) {
      throw new AppError(409, "Permission action name already exists");
    }

    const created = await permissionActionRepository.create(data, userId);

    if (!created) {
      throw new AppError(500, "Failed to create permission action");
    }

    return created;
  },

  async update(userId: string, id: string, data: PermissionActionPayload) {
    const existing = await permissionActionRepository.getById(id);

    if (!existing) {
      throw new AppError(404, "Permission action not found");
    }

    const existingCode = await permissionActionRepository.getByCode(data.code);

    if (existingCode && existingCode.id !== id) {
      throw new AppError(409, "Permission action code already exists");
    }

    const existingName = await permissionActionRepository.getByName(data.name);

    if (existingName && existingName.id !== id) {
      throw new AppError(409, "Permission action name already exists");
    }

    const updated = await permissionActionRepository.update(id, data, userId);

    if (!updated) {
      throw new AppError(500, "Failed to update permission action");
    }

    return updated;
  },

  async delete(userId: string, id: string) {
    const existing = await permissionActionRepository.getById(id);

    if (!existing) {
      throw new AppError(404, "Permission action not found");
    }

    const deleted = await permissionActionRepository.softDelete(id, userId);

    if (!deleted) {
      throw new AppError(500, "Failed to delete permission action");
    }
  },
};
