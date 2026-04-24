import { AppError } from "../../../errors/app-error";
import { moduleRepository } from "../modules/module.repositories";
import { permissionActionRepository } from "../permission_actions/permission_action.repositories";
import { permissionRepository } from "./permission.repositories";
import { PermissionPayload } from "./permission.types";

export const permissionService = {
  async getAll() {
    return permissionRepository.getAll();
  },

  async create(userId: string, data: PermissionPayload) {
    const module = await moduleRepository.getById(data.moduleId);
    if (!module) {
      throw new AppError(404, "Module not found");
    }

    const permissionAction = await permissionActionRepository.getById(data.permissionActionId);
    if (!permissionAction) {
      throw new AppError(404, "Permission action not found");
    }

    const existingCode = await permissionRepository.getByCode(data.code);
    if (existingCode) {
      throw new AppError(409, "Permission code already exists");
    }

    const existingCombination = await permissionRepository.getByModuleAndAction(data.moduleId, data.permissionActionId);
    if (existingCombination) {
      throw new AppError(409, "Permission with this module and action already exists");
    }

    const created = await permissionRepository.create(data, userId);
    if (!created) {
      throw new AppError(500, "Failed to create permission");
    }

    const fullData = await permissionRepository.getById(created.id);
    if (!fullData) {
      throw new AppError(500, "Failed to load created permission");
    }

    return fullData;
  },

  async update(userId: string, id: string, data: PermissionPayload) {
    const existing = await permissionRepository.getById(id);
    if (!existing) {
      throw new AppError(404, "Permission not found");
    }

    const module = await moduleRepository.getById(data.moduleId);
    if (!module) {
      throw new AppError(404, "Module not found");
    }

    const permissionAction = await permissionActionRepository.getById(data.permissionActionId);
    if (!permissionAction) {
      throw new AppError(404, "Permission action not found");
    }

    const existingCode = await permissionRepository.getByCode(data.code);
    if (existingCode && existingCode.id !== id) {
      throw new AppError(409, "Permission code already exists");
    }

    const existingCombination = await permissionRepository.getByModuleAndAction(data.moduleId, data.permissionActionId);
    if (existingCombination && existingCombination.id !== id) {
      throw new AppError(409, "Permission with this module and action already exists");
    }

    const updated = await permissionRepository.update(id, data, userId);
    if (!updated) {
      throw new AppError(500, "Failed to update permission");
    }

    const fullData = await permissionRepository.getById(updated.id);
    if (!fullData) {
      throw new AppError(500, "Failed to load updated permission");
    }

    return fullData;
  },

  async delete(userId: string, id: string) {
    const existing = await permissionRepository.getById(id);
    if (!existing) {
      throw new AppError(404, "Permission not found");
    }

    const deleted = await permissionRepository.softDelete(id, userId);
    if (!deleted) {
      throw new AppError(500, "Failed to delete permission");
    }
  },
};
