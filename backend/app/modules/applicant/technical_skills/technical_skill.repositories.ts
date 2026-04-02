import { queryCamel, queryCamelOne } from "../../../utils/db.util";
import { technicalSkillQueries } from "./technical_skill.queries";
import { TechnicalSkill, TechnicalSkillPayload } from "./technical_skill.types";

export const technicalSkillRepository = {
  async getByProfileId(profileId: string): Promise<TechnicalSkill[]> {
    return queryCamel<TechnicalSkill>(technicalSkillQueries.getByProfileId, [profileId]);
  },

  async getById(id: string, profileId: string): Promise<TechnicalSkill | null> {
    return queryCamelOne<TechnicalSkill>(technicalSkillQueries.getById, [id, profileId]);
  },

  async create(profileId: string, data: TechnicalSkillPayload, actorId: string): Promise<TechnicalSkill | null> {
    return queryCamelOne<TechnicalSkill>(technicalSkillQueries.create, [profileId, data.skillName, actorId]);
  },

  async softDelete(id: string, profileId: string, actorId: string): Promise<{ id: string } | null> {
    return queryCamelOne<{ id: string }>(technicalSkillQueries.softDelete, [id, profileId, actorId]);
  },
};
