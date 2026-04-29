import { PoolClient } from "pg";
import { queryCamel, queryCamelOne } from "../../../../utils/db.util";
import { jobApplyStatusQueries } from "./job_apply_status.queries";
import { JobApplyStatus, JobApplyStatusDetail, JobApplyStatusPayload, JobApplyStatusUpdatePayload, JobApplyStatusSyncItem, JobFlowEditGuard } from "./job_apply_status.types";
type IdLookup = {
  id: string;
};

export const jobApplyStatusRepository = {
  async getAll(): Promise<JobApplyStatus[]> {
    return queryCamel<JobApplyStatus>(jobApplyStatusQueries.getAll);
  },

  async getByJobId(jobId: string): Promise<JobApplyStatus[]> {
    return queryCamel<JobApplyStatus>(jobApplyStatusQueries.getByJobId, [jobId]);
  },

  async getById(id: string): Promise<JobApplyStatus | null> {
    return queryCamelOne<JobApplyStatus>(jobApplyStatusQueries.getById, [id]);
  },

  async getDetailById(id: string): Promise<JobApplyStatusDetail | null> {
    return queryCamelOne<JobApplyStatusDetail>(jobApplyStatusQueries.getDetailById, [id]);
  },

  async getJobById(jobId: string): Promise<IdLookup | null> {
    return queryCamelOne<IdLookup>(jobApplyStatusQueries.getJobById, [jobId]);
  },

  async getApplyStatusById(applyStatusId: string): Promise<IdLookup | null> {
    return queryCamelOne<IdLookup>(jobApplyStatusQueries.getApplyStatusById, [applyStatusId]);
  },

  async getByJobAndApplyStatus(jobId: string, applyStatusId: string): Promise<IdLookup | null> {
    return queryCamelOne<IdLookup>(jobApplyStatusQueries.getByJobAndApplyStatus, [jobId, applyStatusId]);
  },

  async getByJobAndApplyStatusExceptId(jobId: string, applyStatusId: string, id: string): Promise<IdLookup | null> {
    return queryCamelOne<IdLookup>(jobApplyStatusQueries.getByJobAndApplyStatusExceptId, [jobId, applyStatusId, id]);
  },

  async getByJobAndSortOrder(jobId: string, sortOrder: number): Promise<IdLookup | null> {
    return queryCamelOne<IdLookup>(jobApplyStatusQueries.getByJobAndSortOrder, [jobId, sortOrder]);
  },

  async getByJobAndSortOrderExceptId(jobId: string, sortOrder: number, id: string): Promise<IdLookup | null> {
    return queryCamelOne<IdLookup>(jobApplyStatusQueries.getByJobAndSortOrderExceptId, [jobId, sortOrder, id]);
  },

  async getDefaultByJobId(jobId: string): Promise<IdLookup | null> {
    return queryCamelOne<IdLookup>(jobApplyStatusQueries.getDefaultByJobId, [jobId]);
  },

  async getDefaultByJobIdExceptId(jobId: string, id: string): Promise<IdLookup | null> {
    return queryCamelOne<IdLookup>(jobApplyStatusQueries.getDefaultByJobIdExceptId, [jobId, id]);
  },

  async create(data: JobApplyStatusPayload, actorId: string): Promise<IdLookup | null> {
    return queryCamelOne<IdLookup>(jobApplyStatusQueries.create, [data.jobId, data.applyStatusId, data.sortOrder, data.isDefault, data.isFinal, data.isActive, actorId]);
  },

  async update(id: string, data: JobApplyStatusUpdatePayload, actorId: string): Promise<IdLookup | null> {
    return queryCamelOne<IdLookup>(jobApplyStatusQueries.update, [data.applyStatusId, data.sortOrder, data.isDefault, data.isFinal, data.isActive, actorId, id]);
  },

  async softDelete(id: string, actorId: string): Promise<JobApplyStatusDetail | null> {
    return queryCamelOne<JobApplyStatusDetail>(jobApplyStatusQueries.softDelete, [id, actorId]);
  },

  async getEditGuardByJobId(jobId: string): Promise<JobFlowEditGuard | null> {
    return queryCamelOne<JobFlowEditGuard>(jobApplyStatusQueries.getEditGuardByJobId, [jobId]);
  },

  async softDeleteByJobId(client: PoolClient, jobId: string, actorId: string): Promise<IdLookup[]> {
    return queryCamel<IdLookup>(client, jobApplyStatusQueries.softDeleteByJobId, [jobId, actorId]);
  },

  async createWithClient(client: PoolClient, jobId: string, data: JobApplyStatusSyncItem, actorId: string): Promise<IdLookup | null> {
    return queryCamelOne<IdLookup>(client, jobApplyStatusQueries.createWithClient, [jobId, data.applyStatusId, data.sortOrder, data.isDefault, data.isFinal, data.isActive, actorId]);
  },
};
