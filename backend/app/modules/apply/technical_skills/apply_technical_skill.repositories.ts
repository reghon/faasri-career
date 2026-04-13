import { PoolClient } from "pg";
import format from "pg-format";
import { queryCamel } from "../../../utils/db.util";
import { applyTechnicalSkillQueries } from "./apply_technical_skill.queries";
import { ApplyTechnicalSkill, ApplyTechnicalSkillPayload } from "./apply_technical_skill.types";

export const applyTechnicalSkillRepository = {
  async getByApplyId(client: PoolClient, applyId: string): Promise<ApplyTechnicalSkill[]> {
    return queryCamel<ApplyTechnicalSkill>(client, applyTechnicalSkillQueries.getByApplyId, [applyId]);
  },

  async bulkInsert(client: PoolClient, applyId: string, data: ApplyTechnicalSkillPayload[], actorId: string): Promise<ApplyTechnicalSkill[]> {
    if (data.length === 0) {
      return [];
    }

    const now = new Date();

    const values = data.map((item, index) => [applyId, item.skillName, index, now, actorId, now, actorId]);

    const query = format(applyTechnicalSkillQueries.bulkInsert, values);

    return queryCamel<ApplyTechnicalSkill>(client, query);
  },
};
