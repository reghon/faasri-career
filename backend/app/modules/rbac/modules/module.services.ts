import { AppError } from "../../../errors/app-error";
import { moduleRepository } from "./module.repositories";
import { ModulePayload } from "./module.types";

export const moduleService = {
  async getAll() {
    return moduleRepository.getAll();
  },

  async create(userId: string, data: ModulePayload) {
    const existingCode = await moduleRepository.getByCode(data.code);
    if (existingCode) {
      throw new AppError(409, "Kode modul sudah ada");
    }

    const existingName = await moduleRepository.getByName(data.name);
    if (existingName) {
      throw new AppError(409, "Nama modul sudah ada");
    }

    const created = await moduleRepository.create(data, userId);
    if (!created) {
      throw new AppError(500, "Gagal membuat modul");
    }

    return created;
  },

  async update(userId: string, id: string, data: ModulePayload) {
    const existing = await moduleRepository.getById(id);
    if (!existing) {
      throw new AppError(404, "Modul tidak ditemukan");
    }

    const existingCode = await moduleRepository.getByCode(data.code);
    if (existingCode && existingCode.id !== id) {
      throw new AppError(409, "Kode modul sudah ada");
    }

    const existingName = await moduleRepository.getByName(data.name);
    if (existingName && existingName.id !== id) {
      throw new AppError(409, "Nama modul sudah ada");
    }

    const updated = await moduleRepository.update(id, data, userId);
    if (!updated) {
      throw new AppError(500, "Gagal memperbarui modul");
    }

    return updated;
  },

  async delete(userId: string, id: string) {
    const existing = await moduleRepository.getById(id);
    if (!existing) {
      throw new AppError(404, "Modul tidak ditemukan");
    }

    const deleted = await moduleRepository.softDelete(id, userId);
    if (!deleted) {
      throw new AppError(500, "Gagal menghapus modul");
    }
  },
};
