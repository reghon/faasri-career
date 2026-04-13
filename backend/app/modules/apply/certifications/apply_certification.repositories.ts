import { PoolClient } from "pg";
import format from "pg-format";
import { queryCamel } from "../../../utils/db.util";
import { applyCertificationQueries } from "./apply_certification.queries";
import { ApplyCertification, ApplyCertificationPayload } from "./apply_certification.types";

export const applyCertificationRepository = {
  async getByApplyId(client: PoolClient, applyId: string): Promise<ApplyCertification[]> {
    return queryCamel<ApplyCertification>(client, applyCertificationQueries.getByApplyId, [applyId]);
  },

  async bulkInsert(client: PoolClient, applyId: string, data: ApplyCertificationPayload[], actorId: string): Promise<ApplyCertification[]> {
    if (data.length === 0) {
      return [];
    }

    const now = new Date();

    const values = data.map((item, index) => [applyId, item.name, item.issuer, item.issuedDay, item.issuedMonth, item.issuedYear, item.expiredDay, item.expiredMonth, item.expiredYear, index, now, actorId, now, actorId]);

    const query = format(applyCertificationQueries.bulkInsert, values);

    return queryCamel<ApplyCertification>(client, query);
  },
};
