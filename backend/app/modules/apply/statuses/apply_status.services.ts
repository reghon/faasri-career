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
      throw new AppError(404, "Status lamaran tidak ditemukan");
    }

    return applyStatus;
  },

  async getDetailById(id: string) {
    const applyStatus = await applyStatusRepository.getDetailById(id);

    if (!applyStatus) {
      throw new AppError(404, "Status lamaran tidak ditemukan");
    }

    return applyStatus;
  },

  async create(data: ApplyStatusPayload, actorId: string) {
    const existingByName = await applyStatusRepository.getByName(data.name);
    if (existingByName) {
      throw new AppError(409, "Nama status lamaran sudah ada");
    }

    const existingByCode = await applyStatusRepository.getByCode(data.code);
    if (existingByCode) {
      throw new AppError(409, "Kode status lamaran sudah ada");
    }

    const createdApplyStatus = await applyStatusRepository.create(data, actorId);

    if (!createdApplyStatus) {
      throw new AppError(500, "Gagal membuat status lamaran");
    }

    return createdApplyStatus;
  },

  async update(id: string, data: ApplyStatusPayload, actorId: string) {
    const existingApplyStatus = await applyStatusRepository.getById(id);

    if (!existingApplyStatus) {
      throw new AppError(404, "Status lamaran tidak ditemukan");
    }

    const duplicateByName = await applyStatusRepository.getByName(data.name);
    if (duplicateByName && duplicateByName.id !== id) {
      throw new AppError(409, "Nama status lamaran sudah ada");
    }

    const duplicateByCode = await applyStatusRepository.getByCode(data.code);
    if (duplicateByCode && duplicateByCode.id !== id) {
      throw new AppError(409, "Kode status lamaran sudah ada");
    }

    const updatedApplyStatus = await applyStatusRepository.update(id, data, actorId);

    if (!updatedApplyStatus) {
      throw new AppError(500, "Gagal memperbarui status lamaran");
    }

    return updatedApplyStatus;
  },

  async delete(id: string, actorId: string) {
    const existingApplyStatus = await applyStatusRepository.getById(id);
    if (!existingApplyStatus) {
      throw new AppError(404, "Status lamaran tidak ditemukan");
    }

    const activeCountUsage = await applyStatusRepository.countActiveUsage(id);
    if (activeCountUsage > 0) {
      throw new AppError(409, "Status lamaran tidak dapat dihapus karena masih digunakan");
    }

    const deletedApplyStatus = await applyStatusRepository.softDelete(id, actorId);
    if (!deletedApplyStatus) {
      throw new AppError(500, "Gagal menghapus status lamaran");
    }

    return deletedApplyStatus;
  },

  async permanentDelete(id: string) {
    const existingApplyStatus = await applyStatusRepository.getSoftDeletedById(id);
    if (!existingApplyStatus) {
      throw new AppError(404, "Status lamaran tidak ditemukan");
    }

    const countUsage = await applyStatusRepository.countUsage(id);
    if (countUsage > 0) {
      throw new AppError(409, "Status lamaran tidak dapat dihapus permanen karena masih ada data terkait");
    }

    const permanentDeletedApplyStatus = await applyStatusRepository.permanentDelete(id);
    if (!permanentDeletedApplyStatus) {
      throw new AppError(500, "Gagal menghapus permanen status lamaran");
    }

    return permanentDeletedApplyStatus;
  },

  async restore(id: string, actorId: string) {
    const existingApplyStatus = await applyStatusRepository.getById(id);

    if (!existingApplyStatus) {
      throw new AppError(404, "Status lamaran tidak ditemukan");
    }

    const restoredApplyStatus = await applyStatusRepository.restore(id, actorId);

    if (!restoredApplyStatus) {
      throw new AppError(500, "Gagal memulihkan status lamaran");
    }

    return restoredApplyStatus;
  },
};
