import { AppError } from "../../../../errors/app-error";
import { workModeRepository } from "./work_mode.repositories";
import { WorkModePayload } from "./work_mode.types";

export const workModeService = {
  async getAll() {
    return workModeRepository.getAll();
  },

  async getAllDeleted() {
    return workModeRepository.getAllDeleted();
  },

  async getById(id: string) {
    const data = await workModeRepository.getById(id);

    if (!data) {
      throw new AppError(404, "Mode kerja tidak ditemukan");
    }

    return data;
  },

  async create(data: WorkModePayload, actorId: string) {
    const existingByCode = await workModeRepository.getByCode(data.code);
    if (existingByCode) {
      throw new AppError(409, "Kode mode kerja sudah ada");
    }

    const existingByName = await workModeRepository.getByName(data.name);
    if (existingByName) {
      throw new AppError(409, "Nama mode kerja sudah ada");
    }

    const created = await workModeRepository.create(data, actorId);

    if (!created) {
      throw new AppError(500, "Gagal membuat mode kerja");
    }

    return created;
  },

  async update(id: string, data: WorkModePayload, actorId: string) {
    const existing = await workModeRepository.getById(id);

    if (!existing) {
      throw new AppError(404, "Mode kerja tidak ditemukan");
    }

    const duplicateCode = await workModeRepository.getByCode(data.code);
    if (duplicateCode && duplicateCode.id !== id) {
      throw new AppError(409, "Kode mode kerja sudah ada");
    }

    const duplicateName = await workModeRepository.getByName(data.name);
    if (duplicateName && duplicateName.id !== id) {
      throw new AppError(409, "Nama mode kerja sudah ada");
    }

    const updated = await workModeRepository.update(id, data, actorId);

    if (!updated) {
      throw new AppError(500, "Gagal memperbarui mode kerja");
    }

    return updated;
  },

  async softDelete(id: string, actorId: string) {
    const existing = await workModeRepository.getById(id);
    if (!existing) {
      throw new AppError(404, "Mode kerja tidak ditemukan");
    }

    const openJobsUsageCount = await workModeRepository.countOpenJobsUsage(id);
    if (openJobsUsageCount > 0) {
      throw new AppError(409, "Mode kerja tidak dapat dihapus karena digunakan oleh lowongan");
    }

    const deleted = await workModeRepository.softDelete(id, actorId);
    if (!deleted) {
      throw new AppError(500, "Gagal menghapus mode kerja");
    }

    return deleted;
  },

  async hardDelete(id: string) {
    const existing = await workModeRepository.getSoftDeletedById(id);
    if (!existing) {
      throw new AppError(404, "Mode kerja tidak ditemukan");
    }

    const jobsUsageCount = await workModeRepository.countJobsUsage(id);
    if (jobsUsageCount > 0) {
      throw new AppError(409, "Work mode cannot be permanently deleted because it is used by jobs");
    }

    const deleted = await workModeRepository.hardDelete(id);
    if (!deleted) {
      throw new AppError(500, "Gagal menghapus permanen mode kerja");
    }

    return deleted;
  },

  async restore(id: string, actorId: string) {
    const existing = await workModeRepository.getSoftDeletedById(id);

    if (!existing) {
      throw new AppError(404, "Mode kerja tidak ditemukan");
    }

    const updated = await workModeRepository.restore(id, actorId);

    if (!updated) {
      throw new AppError(500, "Gagal memulihkan mode kerja");
    }

    return updated;
  },
};
