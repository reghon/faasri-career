import { AppError } from "../../../../errors/app-error";
import { jobStatusRepository } from "./job_status.repositories";
import { JobStatusPayload } from "./job_status.types";

export const jobStatusService = {
  async getAll() {
    return jobStatusRepository.getAll();
  },

  async getAllDeleted() {
    return jobStatusRepository.getAllDeleted();
  },

  async getById(id: string) {
    const jobStatus = await jobStatusRepository.getById(id);

    if (!jobStatus) {
      throw new AppError(404, "Status lowongan tidak ditemukan");
    }

    return jobStatus;
  },

  async getDetailById(id: string) {
    const jobStatus = await jobStatusRepository.getDetailById(id);

    if (!jobStatus) {
      throw new AppError(404, "Status lowongan tidak ditemukan");
    }

    return jobStatus;
  },

  async create(data: JobStatusPayload, actorId: string) {
    const existingByCode = await jobStatusRepository.getByCode(data.code);
    if (existingByCode) {
      throw new AppError(409, "Kode status lowongan sudah ada");
    }

    const existingByName = await jobStatusRepository.getByName(data.name);
    if (existingByName) {
      throw new AppError(409, "Nama status lowongan sudah ada");
    }

    const createdJobStatus = await jobStatusRepository.create(data, actorId);

    if (!createdJobStatus) {
      throw new AppError(500, "Gagal membuat status lowongan");
    }

    return createdJobStatus;
  },

  async update(id: string, data: JobStatusPayload, actorId: string) {
    const existingJobStatus = await jobStatusRepository.getById(id);

    if (!existingJobStatus) {
      throw new AppError(404, "Status lowongan tidak ditemukan");
    }

    const duplicateByCode = await jobStatusRepository.getByCode(data.code);
    if (duplicateByCode && duplicateByCode.id !== id) {
      throw new AppError(409, "Kode status lowongan sudah ada");
    }

    const duplicateByName = await jobStatusRepository.getByName(data.name);
    if (duplicateByName && duplicateByName.id !== id) {
      throw new AppError(409, "Nama status lowongan sudah ada");
    }

    const updatedJobStatus = await jobStatusRepository.update(id, data, actorId);

    if (!updatedJobStatus) {
      throw new AppError(500, "Gagal memperbarui status lowongan");
    }

    return updatedJobStatus;
  },

  async softDelete(id: string, actorId: string) {
    const existingJobStatus = await jobStatusRepository.getById(id);
    if (!existingJobStatus) {
      throw new AppError(404, "Status lowongan tidak ditemukan");
    }

    const openJobsUsageCount = await jobStatusRepository.countOpenJobsUsage(id);
    if (openJobsUsageCount > 0) {
      throw new AppError(409, "Status lowongan tidak dapat dihapus karena digunakan oleh lowongan");
    }

    const deletedJobStatus = await jobStatusRepository.softDelete(id, actorId);
    if (!deletedJobStatus) {
      throw new AppError(500, "Gagal menghapus status lowongan");
    }

    return deletedJobStatus;
  },

  async hardDelete(id: string) {
    const existingJobStatus = await jobStatusRepository.getSoftDeletedById(id);
    if (!existingJobStatus) {
      throw new AppError(404, "Status lowongan tidak ditemukan");
    }

    const jobsUsageCount = await jobStatusRepository.countJobsUsage(id);
    if (jobsUsageCount > 0) {
      throw new AppError(409, "Job status cannot be permanently deleted because it is used by jobs");
    }

    const deletedJobStatus = await jobStatusRepository.hardDelete(id);
    if (!deletedJobStatus) {
      throw new AppError(500, "Gagal menghapus permanen status lowongan");
    }

    return deletedJobStatus;
  },

  async restore(id: string, actorId: string) {
    const existingJobStatus = await jobStatusRepository.getSoftDeletedById(id);

    if (!existingJobStatus) {
      throw new AppError(404, "Status lowongan tidak ditemukan");
    }

    const restoredJobStatus = await jobStatusRepository.restore(id, actorId);

    if (!restoredJobStatus) {
      throw new AppError(500, "Gagal memulihkan status lowongan");
    }

    return restoredJobStatus;
  },
};
