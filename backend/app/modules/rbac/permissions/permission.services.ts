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
      throw new AppError(404, "Modul tidak ditemukan");
    }

    const permissionAction = await permissionActionRepository.getById(data.permissionActionId);
    if (!permissionAction) {
      throw new AppError(404, "Aksi permission tidak ditemukan");
    }

    const existingCode = await permissionRepository.getByCode(data.code);
    if (existingCode) {
      throw new AppError(409, "Kode permission sudah ada");
    }

    const existingCombination = await permissionRepository.getByModuleAndAction(data.moduleId, data.permissionActionId);
    if (existingCombination) {
      throw new AppError(409, "Permission dengan modul dan aksi ini sudah ada");
    }

    const created = await permissionRepository.create(data, userId);
    if (!created) {
      throw new AppError(500, "Gagal membuat permission");
    }

    const fullData = await permissionRepository.getById(created.id);
    if (!fullData) {
      throw new AppError(500, "Gagal memuat permission yang dibuat");
    }

    return fullData;
  },

  async update(userId: string, id: string, data: PermissionPayload) {
    const existing = await permissionRepository.getById(id);
    if (!existing) {
      throw new AppError(404, "Permission tidak ditemukan");
    }

    const module = await moduleRepository.getById(data.moduleId);
    if (!module) {
      throw new AppError(404, "Modul tidak ditemukan");
    }

    const permissionAction = await permissionActionRepository.getById(data.permissionActionId);
    if (!permissionAction) {
      throw new AppError(404, "Aksi permission tidak ditemukan");
    }

    const existingCode = await permissionRepository.getByCode(data.code);
    if (existingCode && existingCode.id !== id) {
      throw new AppError(409, "Kode permission sudah ada");
    }

    const existingCombination = await permissionRepository.getByModuleAndAction(data.moduleId, data.permissionActionId);
    if (existingCombination && existingCombination.id !== id) {
      throw new AppError(409, "Permission dengan modul dan aksi ini sudah ada");
    }

    const updated = await permissionRepository.update(id, data, userId);
    if (!updated) {
      throw new AppError(500, "Gagal memperbarui permission");
    }

    const fullData = await permissionRepository.getById(updated.id);
    if (!fullData) {
      throw new AppError(500, "Gagal memuat permission yang diperbarui");
    }

    return fullData;
  },

  async delete(userId: string, id: string) {
    const existing = await permissionRepository.getById(id);
    if (!existing) {
      throw new AppError(404, "Permission tidak ditemukan");
    }

    const deleted = await permissionRepository.softDelete(id, userId);
    if (!deleted) {
      throw new AppError(500, "Gagal menghapus permission");
    }
  },
};
