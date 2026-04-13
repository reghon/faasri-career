import { PoolClient } from "pg";
import format from "pg-format";
import { queryCamel } from "../../../utils/db.util";
import { applyEducationQueries } from "./apply_education.queries";
import { ApplyEducation, ApplyEducationPayload } from "./apply_education.types";

export const applyEducationRepository = {
  async getByApplyId(client: PoolClient, applyId: string): Promise<ApplyEducation[]> {
    return queryCamel<ApplyEducation>(client, applyEducationQueries.getByApplyId, [applyId]);
  },

  async bulkInsert(client: PoolClient, applyId: string, data: ApplyEducationPayload[], actorId: string): Promise<ApplyEducation[]> {
    if (data.length === 0) {
      return [];
    }

    const now = new Date();

    const values = data.map((item, index) => [
      applyId,
      item.level,
      item.country,
      item.institution,
      item.major,
      item.isStillStudying,
      item.startDay,
      item.startMonth,
      item.startYear,
      item.endDay,
      item.endMonth,
      item.endYear,
      item.gpa,
      item.gpaScale,
      index,
      now,
      actorId,
      now,
      actorId,
    ]);

    const query = format(applyEducationQueries.bulkInsert, values);

    return queryCamel<ApplyEducation>(client, query);
  },
};
