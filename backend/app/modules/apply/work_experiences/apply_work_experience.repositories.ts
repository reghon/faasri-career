import { PoolClient } from "pg";
import format from "pg-format";
import { queryCamel } from "../../../utils/db.util";
import { applyWorkExperienceQueries } from "./apply_work_experience.queries";
import { ApplyWorkExperience, ApplyWorkExperiencePayload } from "./apply_work_experience.types";

export const applyWorkExperienceRepository = {
  async getByApplyId(client: PoolClient, applyId: string): Promise<ApplyWorkExperience[]> {
    return queryCamel<ApplyWorkExperience>(client, applyWorkExperienceQueries.getByApplyId, [applyId]);
  },

  async bulkInsert(client: PoolClient, applyId: string, data: ApplyWorkExperiencePayload[], actorId: string): Promise<ApplyWorkExperience[]> {
    if (data.length === 0) {
      return [];
    }

    const now = new Date();

    const values = data.map((item, index) => [
      applyId,
      item.company,
      item.industry,
      item.position,
      item.employmentType,
      item.jobLevel,
      item.teamSize,
      item.startDay,
      item.startMonth,
      item.startYear,
      item.endDay,
      item.endMonth,
      item.endYear,
      item.isCurrentJob,
      item.responsibilities,
      item.leaveReason,
      item.referenceName,
      item.referencePosition,
      item.referencePhoneCode,
      item.referencePhone,
      item.referenceEmail,
      index,
      now,
      actorId,
      now,
      actorId,
    ]);

    const query = format(applyWorkExperienceQueries.bulkInsert, values);

    return queryCamel<ApplyWorkExperience>(client, query);
  },
};
