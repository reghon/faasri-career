import { AppError } from "../../../../errors/app-error";
import { jobLocationRepository } from "./job_location.repositories";
import { JobLocationPayload } from "./job_location.types";

export const jobLocationService = {
  async getAll() {
    return jobLocationRepository.getAll();
  },

  async getAllDeleted() {
    return jobLocationRepository.getAllDeleted();
  },

  async getById(id: string) {
    const data = await jobLocationRepository.getById(id);

    if (!data) {
      throw new AppError(404, "Lokasi lowongan tidak ditemukan");
    }

    return data;
  },

  async create(data: JobLocationPayload, actorId: string) {
    const existingByCode = await jobLocationRepository.getByCode(data.code);
    if (existingByCode) {
      throw new AppError(409, "Kode lokasi lowongan sudah ada");
    }

    const existingByName = await jobLocationRepository.getByName(data.name);
    if (existingByName) {
      throw new AppError(409, "Nama lokasi lowongan sudah ada");
    }

    const created = await jobLocationRepository.create(data, actorId);

    if (!created) {
      throw new AppError(500, "Gagal membuat lokasi lowongan");
    }

    return created;
  },

  async update(id: string, data: JobLocationPayload, actorId: string) {
    const existing = await jobLocationRepository.getById(id);

    if (!existing) {
      throw new AppError(404, "Lokasi lowongan tidak ditemukan");
    }

    const duplicateCode = await jobLocationRepository.getByCode(data.code);
    if (duplicateCode && duplicateCode.id !== id) {
      throw new AppError(409, "Kode lokasi lowongan sudah ada");
    }

    const duplicateName = await jobLocationRepository.getByName(data.name);
    if (duplicateName && duplicateName.id !== id) {
      throw new AppError(409, "Nama lokasi lowongan sudah ada");
    }

    const updated = await jobLocationRepository.update(id, data, actorId);

    if (!updated) {
      throw new AppError(500, "Gagal memperbarui lokasi lowongan");
    }

    return updated;
  },

  async softDelete(id: string, actorId: string) {
    const existing = await jobLocationRepository.getById(id);
    if (!existing) {
      throw new AppError(404, "Lokasi lowongan tidak ditemukan");
    }

    const openJobsUsageCount = await jobLocationRepository.countOpenJobsUsage(id);
    if (openJobsUsageCount > 0) {
      throw new AppError(409, "Lokasi lowongan tidak dapat dihapus karena digunakan oleh lowongan");
    }

    const deleted = await jobLocationRepository.softDelete(id, actorId);
    if (!deleted) {
      throw new AppError(500, "Gagal menghapus lokasi lowongan");
    }

    return deleted;
  },

  async hardDelete(id: string) {
    const existing = await jobLocationRepository.getSoftDeletedById(id);

    if (!existing) {
      throw new AppError(404, "Lokasi lowongan tidak ditemukan");
    }

    const jobsUsageCount = await jobLocationRepository.countJobsUsage(id);
    if (jobsUsageCount > 0) {
      throw new AppError(409, "Job location cannot be permanently deleted because it is used by jobs");
    }

    const deleted = await jobLocationRepository.hardDelete(id);
    if (!deleted) {
      throw new AppError(500, "Gagal menghapus permanen lokasi lowongan");
    }

    return deleted;
  },

  async restore(id: string, actorId: string) {
    const existing = await jobLocationRepository.getSoftDeletedById(id);
    if (!existing) {
      throw new AppError(404, "Lokasi lowongan tidak ditemukan");
    }

    const updated = await jobLocationRepository.restore(id, actorId);
    if (!updated) {
      throw new AppError(500, "Gagal memulihkan lokasi lowongan");
    }

    return updated;
  },
};
