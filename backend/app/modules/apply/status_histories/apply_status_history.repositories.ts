import { PoolClient } from "pg";
import { queryCamel, queryCamelOne } from "../../../utils/db.util";
import { applyStatusHistoryQueries } from "./apply_status_history.queries";
import { ApplyLookup, ApplyStatusHistory, ApplyStatusHistoryDetail, ApplyStatusWithSortOrder, CreateApplyStatusHistoryItem, LatestApplyStatusHistory } from "./apply_status_history.types";

export const applyStatusHistoryRepository = {
  async getAll(): Promise<ApplyStatusHistory[]> {
    return queryCamel<ApplyStatusHistory>(applyStatusHistoryQueries.getAll);
  },

  async getById(id: string): Promise<ApplyStatusHistory | null> {
    return queryCamelOne<ApplyStatusHistory>(applyStatusHistoryQueries.getById, [id]);
  },

  async getDetailById(id: string): Promise<ApplyStatusHistoryDetail | null> {
    return queryCamelOne<ApplyStatusHistoryDetail>(applyStatusHistoryQueries.getDetailById, [id]);
  },

  async getByApplyId(applyId: string): Promise<ApplyStatusHistory[]> {
    return queryCamel<ApplyStatusHistory>(applyStatusHistoryQueries.getByApplyId, [applyId]);
  },

  async getApplyById(client: PoolClient, applyId: string): Promise<ApplyLookup | null> {
    return queryCamelOne<ApplyLookup>(client, applyStatusHistoryQueries.getApplyById, [applyId]);
  },

  async getLatestByApplyId(client: PoolClient, applyId: string): Promise<LatestApplyStatusHistory | null> {
    return queryCamelOne<LatestApplyStatusHistory>(client, applyStatusHistoryQueries.getLatestByApplyId, [applyId]);
  },

  async getApplyStatusById(client: PoolClient, jobId: string, applyStatusId: string): Promise<ApplyStatusWithSortOrder | null> {
    return queryCamelOne<ApplyStatusWithSortOrder>(client, applyStatusHistoryQueries.getApplyStatusById, [jobId, applyStatusId]);
  },

  async getStatusesBySortOrderRange(client: PoolClient, jobId: string, fromSortOrder: number, toSortOrder: number): Promise<ApplyStatusWithSortOrder[]> {
    return queryCamel<ApplyStatusWithSortOrder>(client, applyStatusHistoryQueries.getStatusesBySortOrderRange, [jobId, fromSortOrder, toSortOrder]);
  },

  async create(client: PoolClient, data: CreateApplyStatusHistoryItem, actorId: string, createdAt: Date): Promise<ApplyStatusHistory | null> {
    return queryCamelOne<ApplyStatusHistory>(client, applyStatusHistoryQueries.create, [data.applyId, data.applyStatusId, data.applyStatusName, data.notes, createdAt, actorId]);
  },

  async update(id: string, notes: string | null, actorId: string): Promise<ApplyStatusHistory | null> {
    return queryCamelOne<ApplyStatusHistory>(applyStatusHistoryQueries.update, [notes, actorId, id]);
  },

  async softDelete(id: string, actorId: string): Promise<ApplyStatusHistoryDetail | null> {
    return queryCamelOne<ApplyStatusHistoryDetail>(applyStatusHistoryQueries.softDelete, [id, actorId]);
  },

  async updateApplyStatus(client: PoolClient, applyId: string, statusId: string, actorId: string): Promise<{ id: string } | null> {
    return queryCamelOne<{ id: string }>(client, applyStatusHistoryQueries.updateApplyStatus, [statusId, actorId, applyId]);
  },
};
