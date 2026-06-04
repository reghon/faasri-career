import { AppError } from "../../../errors/app-error";
import { savedJobRepository } from "./saved_job.repositories";
import { SavedJobPayload } from "./saved_job.types";

export const savedJobService = {
  async getAll() {
    return savedJobRepository.getAll();
  },

  async getById(id: string) {
    const savedJob = await savedJobRepository.getById(id);

    if (!savedJob) {
      throw new AppError(404, "Lowongan tersimpan tidak ditemukan");
    }

    return savedJob;
  },

  async getDetailById(id: string) {
    const savedJob = await savedJobRepository.getDetailById(id);

    if (!savedJob) {
      throw new AppError(404, "Lowongan tersimpan tidak ditemukan");
    }

    return savedJob;
  },

  async create(data: SavedJobPayload, actorId: string) {
    const existingSavedJob = await savedJobRepository.getByUserAndJob(data.userId, data.jobId);

    if (existingSavedJob && !existingSavedJob.deletedAt) {
      throw new AppError(409, "Lowongan sudah disimpan");
    }

    if (existingSavedJob && existingSavedJob.deletedAt) {
      const restoredSavedJob = await savedJobRepository.restore(data, actorId);

      if (!restoredSavedJob) {
        throw new AppError(500, "Gagal memulihkan lowongan tersimpan");
      }

      return restoredSavedJob;
    }

    const createdSavedJob = await savedJobRepository.create(data, actorId);

    if (!createdSavedJob) {
      throw new AppError(500, "Gagal menyimpan lowongan");
    }

    return createdSavedJob;
  },

  async update(id: string, data: SavedJobPayload, actorId: string) {
    const existingSavedJob = await savedJobRepository.getById(id);

    if (!existingSavedJob) {
      throw new AppError(404, "Lowongan tersimpan tidak ditemukan");
    }

    const duplicateSavedJob = await savedJobRepository.getByUserAndJob(data.userId, data.jobId);

    if (duplicateSavedJob && duplicateSavedJob.id !== id && !duplicateSavedJob.deletedAt) {
      throw new AppError(409, "Lowongan sudah disimpan oleh pengguna ini");
    }

    const updatedSavedJob = await savedJobRepository.update(id, data, actorId);

    if (!updatedSavedJob) {
      throw new AppError(500, "Gagal memperbarui lowongan tersimpan");
    }

    return updatedSavedJob;
  },

  async softDelete(id: string, actorId: string) {
    const existingSavedJob = await savedJobRepository.getById(id);

    if (!existingSavedJob) {
      throw new AppError(404, "Lowongan tersimpan tidak ditemukan");
    }

    const deletedSavedJob = await savedJobRepository.softDelete(id, actorId);

    if (!deletedSavedJob) {
      throw new AppError(500, "Gagal menghapus lowongan tersimpan");
    }

    return deletedSavedJob;
  },
};
