import { PoolClient } from "pg";
import { queryCamel, queryCamelOne } from "../../utils/db.util";
import { applyQueries } from "./apply.queries";
import { Apply, CreateApplyPayload, UpdateApplyStatusPayload, ApplyByJobItem, ApplyListItem, ApplyMeDetail, ApplyHistoryList } from "./apply.types";
export const applyRepository = {
  async getAll(client: PoolClient): Promise<ApplyListItem[]> {
    return queryCamel<ApplyListItem>(client, applyQueries.getAll);
  },
  async getMine(client: PoolClient, applicantProfileId: string): Promise<ApplyHistoryList[]> {
    return queryCamel<ApplyHistoryList>(client, applyQueries.getMine, [applicantProfileId]);
  },

  async getById(client: PoolClient, id: string): Promise<Apply | null> {
    return queryCamelOne<Apply>(client, applyQueries.getById, [id]);
  },

  async getByApplicantProfileId(client: PoolClient, applicantProfileId: string): Promise<Apply[]> {
    return queryCamel<Apply>(client, applyQueries.getByApplicantProfileId, [applicantProfileId]);
  },

  async create(client: PoolClient, data: CreateApplyPayload, actorId: string): Promise<Apply | null> {
    return queryCamelOne<Apply>(client, applyQueries.create, [data.applicantProfileId, data.jobId, data.statusId, data.applicationCode, data.notes, actorId]);
  },

  async updateStatus(client: PoolClient, id: string, data: UpdateApplyStatusPayload, actorId: string): Promise<Apply | null> {
    return queryCamelOne<Apply>(client, applyQueries.updateStatus, [data.statusId, data.notes, actorId, id]);
  },
  async getByJobId(client: PoolClient, jobId: string): Promise<ApplyByJobItem[]> {
    return queryCamel<ApplyByJobItem>(client, applyQueries.getByJobId, [jobId]);
  },
  async getMineDetail(client: PoolClient, applyId: string, applicantProfileId: string): Promise<ApplyMeDetail | null> {
    const row = await queryCamelOne<any>(client, applyQueries.getMineDetail, [applyId, applicantProfileId]);

    if (!row) {
      return null;
    }

    return {
      id: row.id,
      applicantProfileId: row.applicantProfileId,
      jobId: row.jobId,
      statusId: row.statusId,
      applicationCode: row.applicationCode,
      notes: row.notes,
      appliedAt: row.appliedAt,
      isActive: row.isActive,
      createdAt: row.createdAt,
      createdBy: row.createdBy,
      updatedAt: row.updatedAt,
      updatedBy: row.updatedBy,
      deletedAt: row.deletedAt,
      deletedBy: row.deletedBy,

      job: row.jobIdDetail
        ? {
            id: row.jobIdDetail,
            title: row.jobTitle,
          }
        : null,

      currentStatus: row.currentStatusId
        ? {
            id: row.currentStatusId,
            code: row.currentStatusCode,
            name: row.currentStatusName,
            sortOrder: row.currentStatusSortOrder,
          }
        : null,

      stages: row.stages ?? [],
      histories: row.histories ?? [],
    };
  },
};
