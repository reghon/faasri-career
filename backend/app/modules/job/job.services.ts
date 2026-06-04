import { AppError } from "../../errors/app-error";
import { jobRepository } from "./job.repositories";
import { JobPayload, PaginatedJobs } from "./job.types";

export const jobService = {
  async getAll(page: number, limit: number): Promise<PaginatedJobs> {
    const offset = (page - 1) * limit;

    const [countResult, items] = await Promise.all([jobRepository.countAll(), jobRepository.getAll(limit, offset)]);

    const total = countResult?.total ?? 0;

    return {
      items,
      meta: {
        page,
        limit,
        total,
        totalPages: total === 0 ? 0 : Math.ceil(total / limit),
      },
    };
  },

  async getAllOpenJobs(page: number, limit: number): Promise<PaginatedJobs> {
    const offset = (page - 1) * limit;

    const [countResult, items] = await Promise.all([jobRepository.countAllOpen(), jobRepository.getAllOpen(limit, offset)]);

    const total = countResult?.total ?? 0;

    return {
      items,
      meta: {
        page,
        limit,
        total,
        totalPages: total === 0 ? 0 : Math.ceil(total / limit),
      },
    };
  },

  async getById(id: string) {
    const job = await jobRepository.getById(id);

    if (!job) {
      throw new AppError(404, "Lowongan tidak ditemukan");
    }

    return job;
  },

  async getBySlug(slug: string) {
    const job = await jobRepository.getBySlug(slug);

    if (!job) {
      throw new AppError(404, "Lowongan tidak ditemukan");
    }

    return job;
  },

  async create(data: JobPayload, actorId: string) {
    const existingJob = await jobRepository.getBySlug(data.slug);

    if (existingJob) {
      throw new AppError(409, "Slug lowongan sudah ada");
    }

    const createdJob = await jobRepository.create(data, actorId);

    if (!createdJob) {
      throw new AppError(500, "Gagal membuat lowongan");
    }

    return createdJob;
  },

  async update(id: string, data: JobPayload, actorId: string) {
    const existingJob = await jobRepository.getById(id);

    if (!existingJob) {
      throw new AppError(404, "Lowongan tidak ditemukan");
    }

    const duplicateJob = await jobRepository.getBySlug(data.slug);

    if (duplicateJob && duplicateJob.id !== id) {
      throw new AppError(409, "Slug lowongan sudah ada");
    }

    const updatedJob = await jobRepository.update(id, data, actorId);

    if (!updatedJob) {
      throw new AppError(500, "Gagal memperbarui lowongan");
    }

    return updatedJob;
  },

  async delete(id: string, actorId: string) {
    const existingJob = await jobRepository.getById(id);

    if (!existingJob) {
      throw new AppError(404, "Lowongan tidak ditemukan");
    }

    const deletedJob = await jobRepository.softDelete(id, actorId);

    if (!deletedJob) {
      throw new AppError(500, "Gagal menghapus lowongan");
    }

    return deletedJob;
  },

  async updateStatus(id: string, statusId: string, actorId: string) {
    const existingJob = await jobRepository.getById(id);

    if (!existingJob) {
      throw new AppError(404, "Lowongan tidak ditemukan");
    }

    const updatedJob = await jobRepository.updateStatus(id, statusId, actorId);

    if (!updatedJob) {
      throw new AppError(500, "Gagal memperbarui status lowongan");
    }

    return updatedJob;
  },
};
