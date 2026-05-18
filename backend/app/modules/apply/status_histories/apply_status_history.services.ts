import pool from "../../../configurations/database";
import { AppError } from "../../../errors/app-error";
import { applyStatusHistoryRepository } from "./apply_status_history.repositories";
import { ApplyStatusHistoryPayload, ApplyStatusHistoryUpdatePayload, CreateApplyStatusHistoryItem } from "./apply_status_history.types";

export const applyStatusHistoryService = {
  async getAll() {
    return applyStatusHistoryRepository.getAll();
  },

  async getById(id: string) {
    const applyStatusHistory = await applyStatusHistoryRepository.getById(id);

    if (!applyStatusHistory) {
      throw new AppError(404, "Apply status history not found");
    }

    return applyStatusHistory;
  },

  async getDetailById(id: string) {
    const applyStatusHistory = await applyStatusHistoryRepository.getDetailById(id);

    if (!applyStatusHistory) {
      throw new AppError(404, "Apply status history not found");
    }

    return applyStatusHistory;
  },

  async getByApplyId(applyId: string) {
    return applyStatusHistoryRepository.getByApplyId(applyId);
  },

  async create(data: ApplyStatusHistoryPayload, actorId: string) {
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const apply = await applyStatusHistoryRepository.getApplyById(client, data.applyId);

      if (!apply) {
        throw new AppError(404, "Apply not found");
      }

      const targetStatus = await applyStatusHistoryRepository.getApplyStatusById(client, apply.jobId, data.applyStatusId);

      if (!targetStatus) {
        throw new AppError(404, "Apply status not found");
      }

      const currentSortOrder = apply.statusSortOrder;
      const targetSortOrder = targetStatus.sortOrder;

      if (apply.statusIsFinal) {
        throw new AppError(400, "Apply status is final and cannot be changed");
      }

      if (targetSortOrder <= currentSortOrder) {
        throw new AppError(400, "Apply status cannot move backward or stay at the same status");
      }

      const rawStatusesToCreate = await applyStatusHistoryRepository.getStatusesBySortOrderRange(client, apply.jobId, currentSortOrder + 1, targetSortOrder);

      const expectedTotal = targetSortOrder - currentSortOrder;

      if (rawStatusesToCreate.length !== expectedTotal) {
        throw new AppError(400, "Apply status sequence is incomplete");
      }

      const targetStatusText = `${targetStatus.code} ${targetStatus.name}`.toLowerCase();

      const isRejectedOrWithdrawnTarget = targetStatusText.includes("reject") || targetStatusText.includes("withdraw");

      const statusesToCreate = isRejectedOrWithdrawnTarget
        ? rawStatusesToCreate.filter((status) => status.id === targetStatus.id)
        : rawStatusesToCreate.filter((status) => {
            const isTargetStatus = status.id === targetStatus.id;

            if (isTargetStatus) {
              return true;
            }

            return !status.isFinal;
          });

      if (statusesToCreate.length === 0) {
        throw new AppError(400, "Apply target status cannot be processed");
      }

      const createdAt = new Date();
      const createdHistories = [];

      for (const status of statusesToCreate) {
        const item: CreateApplyStatusHistoryItem = {
          applyId: data.applyId,
          applyStatusId: status.id,
          applyStatusName: status.name,
          notes: status.id === targetStatus.id ? data.notes : null,
        };

        const createdHistory = await applyStatusHistoryRepository.create(client, item, actorId, createdAt);

        if (!createdHistory) {
          throw new AppError(500, "Failed to create apply status history");
        }

        createdHistories.push(createdHistory);
      }

      const updatedApply = await applyStatusHistoryRepository.updateApplyStatus(client, data.applyId, targetStatus.id, actorId);

      if (!updatedApply) {
        throw new AppError(500, "Failed to update apply current status");
      }

      await client.query("COMMIT");

      return createdHistories;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  },

  async update(id: string, data: ApplyStatusHistoryUpdatePayload, actorId: string) {
    const existingApplyStatusHistory = await applyStatusHistoryRepository.getById(id);

    if (!existingApplyStatusHistory) {
      throw new AppError(404, "Apply status history not found");
    }

    const updatedApplyStatusHistory = await applyStatusHistoryRepository.update(id, data.notes, actorId);

    if (!updatedApplyStatusHistory) {
      throw new AppError(500, "Failed to update apply status history");
    }

    return updatedApplyStatusHistory;
  },

  async delete(id: string, actorId: string) {
    const existingApplyStatusHistory = await applyStatusHistoryRepository.getById(id);

    if (!existingApplyStatusHistory) {
      throw new AppError(404, "Apply status history not found");
    }

    const deletedApplyStatusHistory = await applyStatusHistoryRepository.softDelete(id, actorId);

    if (!deletedApplyStatusHistory) {
      throw new AppError(500, "Failed to delete apply status history");
    }

    return deletedApplyStatusHistory;
  },
};
