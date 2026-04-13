import { PoolClient } from "pg";
import { queryCamel, queryCamelOne } from "../../../utils/db.util";
import { applyStatusQueries } from "./apply_status.queries";
import { ApplyStatus } from "./apply_status.types";

export const applyStatusRepository = {
  async getDefault(client: PoolClient): Promise<ApplyStatus | null> {
    return queryCamelOne<ApplyStatus>(client, applyStatusQueries.getDefault);
  },

  async getById(client: PoolClient, id: string): Promise<ApplyStatus | null> {
    return queryCamelOne<ApplyStatus>(client, applyStatusQueries.getById, [id]);
  },

  async getAllActive(client: PoolClient): Promise<ApplyStatus[]> {
    return queryCamel<ApplyStatus>(client, applyStatusQueries.getAllActive);
  },
};
