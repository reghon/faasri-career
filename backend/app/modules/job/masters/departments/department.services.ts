import { AppError } from "../../../../errors/app-error";
import { departmentRepository } from "./department.repositories";
import { DepartmentPayload } from "./department.types";

export const departmentService = {
  async getAll() {
    return departmentRepository.getAll();
  },

  async getAllDeleted() {
    return departmentRepository.getAllDeleted();
  },

  async getById(id: string) {
    const department = await departmentRepository.getById(id);

    if (!department) {
      throw new AppError(404, "Departemen tidak ditemukan");
    }

    return department;
  },

  async create(data: DepartmentPayload, actorId: string) {
    const existingByName = await departmentRepository.getByName(data.name);
    if (existingByName) {
      throw new AppError(409, "Nama departemen sudah ada");
    }

    const existingByCode = await departmentRepository.getByCode(data.code);
    if (existingByCode) {
      throw new AppError(409, "Kode departemen sudah ada");
    }

    const created = await departmentRepository.create(data, actorId);

    if (!created) {
      throw new AppError(500, "Gagal membuat departemen");
    }

    return created;
  },

  async update(id: string, data: DepartmentPayload, actorId: string) {
    const existing = await departmentRepository.getById(id);
    if (!existing) {
      throw new AppError(404, "Departemen tidak ditemukan");
    }

    const duplicateName = await departmentRepository.getByName(data.name);
    if (duplicateName && duplicateName.id !== id) {
      throw new AppError(409, "Nama departemen sudah ada");
    }

    const duplicateCode = await departmentRepository.getByCode(data.code);
    if (duplicateCode && duplicateCode.id !== id) {
      throw new AppError(409, "Kode departemen sudah ada");
    }

    const updated = await departmentRepository.update(id, data, actorId);

    if (!updated) {
      throw new AppError(500, "Gagal memperbarui departemen");
    }

    return updated;
  },

  async softDelete(id: string, actorId: string) {
    const existing = await departmentRepository.getById(id);
    if (!existing) {
      throw new AppError(404, "Departemen tidak ditemukan");
    }

    const openJobsUsageCount = await departmentRepository.countOpenJobsUsage(id);
    if (openJobsUsageCount > 0) {
      throw new AppError(409, "Departemen tidak dapat dihapus karena digunakan oleh lowongan aktif");
    }

    const deleted = await departmentRepository.softDelete(id, actorId);

    if (!deleted) {
      throw new AppError(500, "Gagal menghapus departemen");
    }

    return deleted;
  },

  async hardDelete(id: string) {
    const existing = await departmentRepository.getSoftDeletedById(id);
    if (!existing) {
      throw new AppError(404, "Departemen tidak ditemukan");
    }

    const jobsUsageCount = await departmentRepository.countJobsUsage(id);
    if (jobsUsageCount > 0) {
      throw new AppError(409, "Departemen tidak dapat dihapus karena digunakan oleh lowongan");
    }

    const deleted = await departmentRepository.hardDelete(id);

    if (!deleted) {
      throw new AppError(500, "Gagal menghapus permanen departemen");
    }

    return deleted;
  },

  async restore(id: string, actorId: string) {
    const existing = await departmentRepository.getSoftDeletedById(id);

    if (!existing) {
      throw new AppError(404, "Departemen tidak ditemukan");
    }

    const restored = await departmentRepository.restore(id, actorId);

    if (!restored) {
      throw new AppError(500, "Gagal memulihkan departemen");
    }

    return restored;
  },
};
