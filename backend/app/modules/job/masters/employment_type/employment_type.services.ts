import { AppError } from "../../../../errors/app-error";
import { employmentTypeRepository } from "./employment_type.repositories";
import { EmploymentTypePayload } from "./employment_type.types";

export const employmentTypeService = {
  async getAll() {
    return employmentTypeRepository.getAll();
  },

  async getAllDeleted() {
    return employmentTypeRepository.getAllDeleted();
  },

  async getById(id: string) {
    const employmentType = await employmentTypeRepository.getById(id);

    if (!employmentType) {
      throw new AppError(404, "Tipe pekerjaan tidak ditemukan");
    }

    return employmentType;
  },

  async getDetailById(id: string) {
    const employmentType = await employmentTypeRepository.getDetailById(id);

    if (!employmentType) {
      throw new AppError(404, "Tipe pekerjaan tidak ditemukan");
    }

    return employmentType;
  },

  async create(data: EmploymentTypePayload, actorId: string) {
    const existingByName = await employmentTypeRepository.getByName(data.name);
    if (existingByName) {
      throw new AppError(409, "Nama tipe pekerjaan sudah ada");
    }

    const existingByCode = await employmentTypeRepository.getByCode(data.code);
    if (existingByCode) {
      throw new AppError(409, "Kode tipe pekerjaan sudah ada");
    }

    const createdEmploymentType = await employmentTypeRepository.create(data, actorId);

    if (!createdEmploymentType) {
      throw new AppError(500, "Gagal membuat tipe pekerjaan");
    }

    return createdEmploymentType;
  },

  async update(id: string, data: EmploymentTypePayload, actorId: string) {
    const existingEmploymentType = await employmentTypeRepository.getById(id);

    if (!existingEmploymentType) {
      throw new AppError(404, "Tipe pekerjaan tidak ditemukan");
    }

    const duplicateByName = await employmentTypeRepository.getByName(data.name);
    if (duplicateByName && duplicateByName.id !== id) {
      throw new AppError(409, "Nama tipe pekerjaan sudah ada");
    }

    const duplicateByCode = await employmentTypeRepository.getByCode(data.code);
    if (duplicateByCode && duplicateByCode.id !== id) {
      throw new AppError(409, "Kode tipe pekerjaan sudah ada");
    }

    const updatedEmploymentType = await employmentTypeRepository.update(id, data, actorId);

    if (!updatedEmploymentType) {
      throw new AppError(500, "Gagal memperbarui tipe pekerjaan");
    }

    return updatedEmploymentType;
  },

  async softDelete(id: string, actorId: string) {
    const existingEmploymentType = await employmentTypeRepository.getById(id);
    if (!existingEmploymentType) {
      throw new AppError(404, "Tipe pekerjaan tidak ditemukan");
    }

    const openJobsUsageCount = await employmentTypeRepository.countOpenJobsUsage(id);
    if (openJobsUsageCount > 0) {
      throw new AppError(409, "Tipe pekerjaan tidak dapat dihapus karena digunakan oleh lowongan aktif");
    }

    const deletedEmploymentType = await employmentTypeRepository.softDelete(id, actorId);
    if (!deletedEmploymentType) {
      throw new AppError(500, "Gagal menghapus tipe pekerjaan");
    }

    return deletedEmploymentType;
  },

  async hardDelete(id: string) {
    const existingEmploymentType = await employmentTypeRepository.getSoftDeletedById(id);
    if (!existingEmploymentType) {
      throw new AppError(404, "Tipe pekerjaan tidak ditemukan");
    }

    const jobsUsageCount = await employmentTypeRepository.countJobsUsage(id);
    if (jobsUsageCount > 0) {
      throw new AppError(409, "Employment type cannot be permanently deleted because it is used by jobs");
    }

    const deletedEmploymentType = await employmentTypeRepository.hardDelete(id);

    if (!deletedEmploymentType) {
      throw new AppError(500, "Gagal menghapus permanen tipe pekerjaan");
    }

    return deletedEmploymentType;
  },

  async restore(id: string, actorId: string) {
    const existingEmploymentType = await employmentTypeRepository.getSoftDeletedById(id);

    if (!existingEmploymentType) {
      throw new AppError(404, "Tipe pekerjaan tidak ditemukan");
    }

    const restoredEmploymentType = await employmentTypeRepository.restore(id, actorId);

    if (!restoredEmploymentType) {
      throw new AppError(500, "Gagal memulihkan tipe pekerjaan");
    }

    return restoredEmploymentType;
  },
};
