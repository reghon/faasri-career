import { PoolClient } from "pg";
import { queryCamel, queryCamelOne } from "../../utils/db.util";
import { applyQueries } from "./apply.queries";
import { Apply, CreateApplyPayload, UpdateApplyStatusPayload, ApplyByJobItem, ApplyListItem, ApplyMeDetail, ApplyHistoryList, ApplyFilterParams, CountResult } from "./apply.types";

const SORT_COLUMN_MAP: Record<string, string> = {
  full_name: "ap.full_name",
  job_name: "j.title",
  status_name: "aps.name",
  applied_at: "a.applied_at",
};

function buildFilterClauses(filters: ApplyFilterParams): { conditions: string; params: unknown[] } {
  const conditions: string[] = [];
  const params: unknown[] = [];

  if (filters.search) {
    params.push(`%${filters.search}%`);
    conditions.push(`(ap.full_name ILIKE $${params.length} OR ap.linkedin_url ILIKE $${params.length} OR j.title ILIKE $${params.length})`);
  }

  if (filters.jobName) {
    params.push(filters.jobName);
    conditions.push(`j.title = $${params.length}`);
  }

  if (filters.statusName) {
    params.push(filters.statusName);
    conditions.push(`aps.name = $${params.length}`);
  }

  return {
    conditions: conditions.length > 0 ? "AND " + conditions.join(" AND ") : "",
    params,
  };
}

export const applyRepository = {
  async countAllFiltered(filters: ApplyFilterParams): Promise<CountResult | null> {
    const { conditions, params } = buildFilterClauses(filters);
    return queryCamelOne<CountResult>(applyQueries.countAllFiltered(conditions), params);
  },

  async getAllFiltered(limit: number, offset: number, filters: ApplyFilterParams): Promise<ApplyListItem[]> {
    const { conditions, params } = buildFilterClauses(filters);
    const limitParam = `$${params.length + 1}`;
    const offsetParam = `$${params.length + 2}`;
    const sortCol = SORT_COLUMN_MAP[filters.sortBy] || "a.applied_at";
    const orderBy = `${sortCol} ${filters.sortDirection} NULLS LAST`;
    return queryCamel<ApplyListItem>(
      applyQueries.getAllFiltered(conditions, orderBy, limitParam, offsetParam),
      [...params, limit, offset],
    );
  },

  async getAll(client: PoolClient): Promise<ApplyListItem[]> {
    return queryCamel<ApplyListItem>(client, applyQueries.getAll);
  },
  async getMine(client: PoolClient, applicantProfileId: string): Promise<ApplyHistoryList[]> {
    return queryCamel<ApplyHistoryList>(client, applyQueries.getMine, [applicantProfileId]);
  },

  async getById(client: PoolClient, id: string): Promise<Apply | null> {
    return queryCamelOne<Apply>(client, applyQueries.getById, [id]);
  },

  async getByApplicantProfileId(client: PoolClient, applicantProfileId: string): Promise<ApplyHistoryList[]> {
    return queryCamel<ApplyHistoryList>(client, applyQueries.getMine, [applicantProfileId]);
  },

  async create(client: PoolClient, data: CreateApplyPayload, actorId: string): Promise<Apply | null> {
    return queryCamelOne<Apply>(client, applyQueries.create, [data.applicantProfileId, data.jobId, data.statusId, data.applicationCode, data.notes, actorId]);
  },

  async hasApplied(client: PoolClient, applicantProfileId: string, jobId: string): Promise<boolean> {
    const result = await queryCamelOne<{ id: string }>(client, applyQueries.hasApplied, [applicantProfileId, jobId]);
    return !!result;
  },
  
  async updateStatus(client: PoolClient, id: string, data: UpdateApplyStatusPayload, actorId: string): Promise<Apply | null> {
    return queryCamelOne<Apply>(client, applyQueries.updateStatus, [data.statusId, data.notes, actorId, id]);
  },
  async getByJobId(client: PoolClient, jobId: string): Promise<ApplyByJobItem[]> {
    return queryCamel<ApplyByJobItem>(client, applyQueries.getByJobId, [jobId]);
  },
  async getApplyDetail(client: PoolClient, applyId: string, applicantProfileId: string): Promise<ApplyMeDetail | null> {
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

  async getApplyDetailById(client: PoolClient, applyId: string, applicantProfileId: string): Promise<ApplyMeDetail | null> {
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
