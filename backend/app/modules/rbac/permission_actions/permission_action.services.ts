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
      throw new AppError(409, "Kode aksi permission sudah ada");
    }

    const existingName = await permissionActionRepository.getByName(data.name);

    if (existingName) {
      throw new AppError(409, "Nama aksi permission sudah ada");
    }

    const created = await permissionActionRepository.create(data, userId);

    if (!created) {
      throw new AppError(500, "Gagal membuat aksi permission");
    }

    return created;
  },

  async update(userId: string, id: string, data: PermissionActionPayload) {
    const existing = await permissionActionRepository.getById(id);

    if (!existing) {
      throw new AppError(404, "Aksi permission tidak ditemukan");
    }

    const existingCode = await permissionActionRepository.getByCode(data.code);

    if (existingCode && existingCode.id !== id) {
      throw new AppError(409, "Kode aksi permission sudah ada");
    }

    const existingName = await permissionActionRepository.getByName(data.name);

    if (existingName && existingName.id !== id) {
      throw new AppError(409, "Nama aksi permission sudah ada");
    }

    const updated = await permissionActionRepository.update(id, data, userId);

    if (!updated) {
      throw new AppError(500, "Gagal memperbarui aksi permission");
    }

    return updated;
  },

  async delete(userId: string, id: string) {
    const existing = await permissionActionRepository.getById(id);

    if (!existing) {
      throw new AppError(404, "Aksi permission tidak ditemukan");
    }

    const deleted = await permissionActionRepository.softDelete(id, userId);

    if (!deleted) {
      throw new AppError(500, "Gagal menghapus aksi permission");
    }
  },
};
