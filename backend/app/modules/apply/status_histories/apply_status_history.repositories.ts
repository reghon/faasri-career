import { PoolClient } from "pg";
import { queryCamel, queryCamelOne } from "../../../utils/db.util";
import { applyStatusHistoryQueries } from "./apply_status_history.queries";
import { ApplyStatusHistory, CreateApplyStatusHistoryPayload } from "./apply_status_history.types";

export const applyStatusHistoryRepository = {
  async getByApplyId(client: PoolClient, applyId: string): Promise<ApplyStatusHistory[]> {
    return queryCamel<ApplyStatusHistory>(client, applyStatusHistoryQueries.getByApplyId, [applyId]);
  },

  async create(client: PoolClient, data: CreateApplyStatusHistoryPayload): Promise<ApplyStatusHistory | null> {
    return queryCamelOne<ApplyStatusHistory>(client, applyStatusHistoryQueries.create, [data.applyId, data.fromStatusId, data.toStatusId, data.notes ?? null, data.actorId]);
  },
};
