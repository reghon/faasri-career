import { AppError } from "../../../../errors/app-error";
import pool from "../../../../configurations/database";
import { jobApplyStatusRepository } from "./job_apply_status.repositories";
import { JobApplyStatusPayload, JobApplyStatusUpdatePayload, JobApplyStatusSyncItem, JobApplyStatusSyncPayload } from "./job_apply_status.types";
export const jobApplyStatusService = {
  async getAll() {
    return jobApplyStatusRepository.getAll();
  },

  async getByJobId(jobId: string) {
    const job = await jobApplyStatusRepository.getJobById(jobId);

    if (!job) {
      throw new AppError(404, "Lowongan tidak ditemukan");
    }

    return jobApplyStatusRepository.getByJobId(jobId);
  },

  async getById(id: string) {
    const jobApplyStatus = await jobApplyStatusRepository.getById(id);

    if (!jobApplyStatus) {
      throw new AppError(404, "Status lamaran lowongan tidak ditemukan");
    }

    return jobApplyStatus;
  },

  async getDetailById(id: string) {
    const jobApplyStatus = await jobApplyStatusRepository.getDetailById(id);

    if (!jobApplyStatus) {
      throw new AppError(404, "Status lamaran lowongan tidak ditemukan");
    }

    return jobApplyStatus;
  },

  async create(data: JobApplyStatusPayload, actorId: string) {
    const job = await jobApplyStatusRepository.getJobById(data.jobId);

    if (!job) {
      throw new AppError(404, "Lowongan tidak ditemukan");
    }

    const guard = await this.getEditGuardByJobId(data.jobId);

    if (!guard.canEditJobFlow) {
      throw new AppError(409, "Job flow tidak dapat diubah karena pelamar sudah melewati tahap Submitted");
    }

    const applyStatus = await jobApplyStatusRepository.getApplyStatusById(data.applyStatusId);

    if (!applyStatus) {
      throw new AppError(404, "Status lamaran tidak ditemukan");
    }

    const existingStatus = await jobApplyStatusRepository.getByJobAndApplyStatus(data.jobId, data.applyStatusId);

    if (existingStatus) {
      throw new AppError(409, "Status lamaran sudah ada di lowongan ini");
    }

    const existingSortOrder = await jobApplyStatusRepository.getByJobAndSortOrder(data.jobId, data.sortOrder);

    if (existingSortOrder) {
      throw new AppError(409, "Urutan sudah ada di lowongan ini");
    }

    if (data.isDefault) {
      const existingDefault = await jobApplyStatusRepository.getDefaultByJobId(data.jobId);

      if (existingDefault) {
        throw new AppError(409, "Status default sudah ada di lowongan ini");
      }
    }

    const createdJobApplyStatus = await jobApplyStatusRepository.create(data, actorId);

    if (!createdJobApplyStatus) {
      throw new AppError(500, "Gagal membuat status lamaran lowongan");
    }

    return this.getById(createdJobApplyStatus.id);
  },

  async update(id: string, data: JobApplyStatusUpdatePayload, actorId: string) {
    const existingJobApplyStatus = await jobApplyStatusRepository.getById(id);

    if (!existingJobApplyStatus) {
      throw new AppError(404, "Status lamaran lowongan tidak ditemukan");
    }
    
    const guard = await this.getEditGuardByJobId(existingJobApplyStatus.jobId);

    if (!guard.canEditJobFlow) {
      throw new AppError(409, "Job flow tidak dapat diubah karena pelamar sudah melewati tahap Submitted");
    }
    const applyStatus = await jobApplyStatusRepository.getApplyStatusById(data.applyStatusId);

    if (!applyStatus) {
      throw new AppError(404, "Status lamaran tidak ditemukan");
    }

    const duplicateStatus = await jobApplyStatusRepository.getByJobAndApplyStatusExceptId(existingJobApplyStatus.jobId, data.applyStatusId, id);

    if (duplicateStatus) {
      throw new AppError(409, "Status lamaran sudah ada di lowongan ini");
    }

    const duplicateSortOrder = await jobApplyStatusRepository.getByJobAndSortOrderExceptId(existingJobApplyStatus.jobId, data.sortOrder, id);

    if (duplicateSortOrder) {
      throw new AppError(409, "Urutan sudah ada di lowongan ini");
    }

    if (data.isDefault) {
      const existingDefault = await jobApplyStatusRepository.getDefaultByJobIdExceptId(existingJobApplyStatus.jobId, id);

      if (existingDefault) {
        throw new AppError(409, "Status default sudah ada di lowongan ini");
      }
    }

    const updatedJobApplyStatus = await jobApplyStatusRepository.update(id, data, actorId);

    if (!updatedJobApplyStatus) {
      throw new AppError(500, "Gagal memperbarui status lamaran lowongan");
    }

    return this.getById(updatedJobApplyStatus.id);
  },

  async delete(id: string, actorId: string) {
    const existingJobApplyStatus = await jobApplyStatusRepository.getById(id);

    if (!existingJobApplyStatus) {
      throw new AppError(404, "Status lamaran lowongan tidak ditemukan");
    }

    const deletedJobApplyStatus = await jobApplyStatusRepository.softDelete(id, actorId);

    if (!deletedJobApplyStatus) {
      throw new AppError(500, "Gagal menghapus status lamaran lowongan");
    }

    return deletedJobApplyStatus;
  },

  async getEditGuardByJobId(jobId: string) {
    const job = await jobApplyStatusRepository.getJobById(jobId);

    if (!job) {
      throw new AppError(404, "Lowongan tidak ditemukan");
    }

    const guard = await jobApplyStatusRepository.getEditGuardByJobId(jobId);

    const totalApplies = guard?.totalApplies ?? 0;
    const lockedApplies = guard?.lockedApplies ?? 0;

    return {
      totalApplies,
      lockedApplies,
      canEditJobFlow: lockedApplies === 0,
    };
  },

  validateSyncItems(items: JobApplyStatusSyncItem[]) {
    const applyStatusIds = new Set<string>();
    const sortOrders = new Set<number>();

    let defaultCount = 0;

    for (const item of items) {
      if (applyStatusIds.has(item.applyStatusId)) {
        throw new AppError(400, "Status lamaran duplikat dalam job flow");
      }

      if (sortOrders.has(item.sortOrder)) {
        throw new AppError(400, "Urutan duplikat dalam job flow");
      }

      if (item.isDefault) {
        defaultCount += 1;
      }

      applyStatusIds.add(item.applyStatusId);
      sortOrders.add(item.sortOrder);
    }

    if (defaultCount !== 1) {
      throw new AppError(400, "Job flow harus memiliki tepat satu status default");
    }

    if (!items.some((item) => item.isFinal)) {
      throw new AppError(400, "Job flow harus memiliki minimal satu status final");
    }
  },

  async syncByJobId(jobId: string, data: JobApplyStatusSyncPayload, actorId: string) {
    const job = await jobApplyStatusRepository.getJobById(jobId);

    if (!job) {
      throw new AppError(404, "Lowongan tidak ditemukan");
    }

    this.validateSyncItems(data.items);

    const guard = await this.getEditGuardByJobId(jobId);

    if (!guard.canEditJobFlow) {
      throw new AppError(409, "Job flow tidak dapat diubah karena pelamar sudah melewati tahap Submitted");
    }

    for (const item of data.items) {
      const applyStatus = await jobApplyStatusRepository.getApplyStatusById(item.applyStatusId);

      if (!applyStatus) {
        throw new AppError(404, "Status lamaran tidak ditemukan");
      }
    }

    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      await jobApplyStatusRepository.softDeleteByJobId(client, jobId, actorId);

      for (const item of data.items) {
        const created = await jobApplyStatusRepository.createWithClient(client, jobId, item, actorId);

        if (!created) {
          throw new AppError(500, "Gagal menyinkronkan status lamaran lowongan");
        }
      }

      await client.query("COMMIT");

      return jobApplyStatusRepository.getByJobId(jobId);
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  },
};
