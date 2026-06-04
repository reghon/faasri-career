import { AppError } from "../../../../errors/app-error";
import { educationLevelRepository } from "./education_level.repositories";
import { EducationLevelPayload } from "./education_level.types";

export const educationLevelService = {
  async getAll() {
    return educationLevelRepository.getAll();
  },

  async getAllDeleted() {
    return educationLevelRepository.getAllDeleted();
  },

  async getById(id: string) {
    const educationLevel = await educationLevelRepository.getById(id);

    if (!educationLevel) {
      throw new AppError(404, "Jenjang pendidikan tidak ditemukan");
    }

    return educationLevel;
  },

  async create(data: EducationLevelPayload, actorId: string) {
    const existingByName = await educationLevelRepository.getByName(data.name);
    if (existingByName) {
      throw new AppError(409, "Nama jenjang pendidikan sudah ada");
    }

    const existingByCode = await educationLevelRepository.getByCode(data.code);
    if (existingByCode) {
      throw new AppError(409, "Kode jenjang pendidikan sudah ada");
    }

    const createdEducationLevel = await educationLevelRepository.create(data, actorId);

    if (!createdEducationLevel) {
      throw new AppError(500, "Gagal membuat jenjang pendidikan");
    }

    return createdEducationLevel;
  },

  async update(id: string, data: EducationLevelPayload, actorId: string) {
    const existingEducationLevel = await educationLevelRepository.getById(id);

    if (!existingEducationLevel) {
      throw new AppError(404, "Jenjang pendidikan tidak ditemukan");
    }

    const duplicateName = await educationLevelRepository.getByName(data.name);
    if (duplicateName && duplicateName.id !== id) {
      throw new AppError(409, "Nama jenjang pendidikan sudah ada");
    }

    const duplicateCode = await educationLevelRepository.getByCode(data.code);
    if (duplicateCode && duplicateCode.id !== id) {
      throw new AppError(409, "Kode jenjang pendidikan sudah ada");
    }

    const updatedEducationLevel = await educationLevelRepository.update(id, data, actorId);

    if (!updatedEducationLevel) {
      throw new AppError(500, "Gagal memperbarui jenjang pendidikan");
    }

    return updatedEducationLevel;
  },

  async softDelete(id: string, actorId: string) {
    const existingEducationLevel = await educationLevelRepository.getById(id);

    if (!existingEducationLevel) {
      throw new AppError(404, "Jenjang pendidikan tidak ditemukan");
    }

    const openJobsUsageCount = await educationLevelRepository.countOpenJobsUsage(id);
    if (openJobsUsageCount > 0) {
      throw new AppError(409, "Jenjang pendidikan tidak dapat dihapus karena digunakan oleh lowongan aktif");
    }

    const deletedEducationLevel = await educationLevelRepository.softDelete(id, actorId);

    if (!deletedEducationLevel) {
      throw new AppError(500, "Gagal menghapus jenjang pendidikan");
    }

    return deletedEducationLevel;
  },

  async hardDelete(id: string) {
    const existingEducationLevel = await educationLevelRepository.getSoftDeletedById(id);
    if (!existingEducationLevel) {
      throw new AppError(404, "Jenjang pendidikan tidak ditemukan");
    }

    const jobsUsageCount = await educationLevelRepository.countJobsUsage(id);
    if (jobsUsageCount > 0) {
      throw new AppError(409, "Jenjang pendidikan tidak dapat dihapus karena digunakan oleh lowongan");
    }

    const deletedEducationLevel = await educationLevelRepository.hardDelete(id);

    if (!deletedEducationLevel) {
      throw new AppError(500, "Gagal menghapus permanen jenjang pendidikan");
    }

    return deletedEducationLevel;
  },

  async restore(id: string, actorId: string) {
    const existingEducationLevel = await educationLevelRepository.getSoftDeletedById(id);

    if (!existingEducationLevel) {
      throw new AppError(404, "Jenjang pendidikan tidak ditemukan");
    }
    const updatedEducationLevel = await educationLevelRepository.restore(id, actorId);

    if (!updatedEducationLevel) {
      throw new AppError(500, "Gagal memulihkan jenjang pendidikan");
    }

    return updatedEducationLevel;
  },
};
