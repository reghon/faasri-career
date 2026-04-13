import { PoolClient } from "pg";
import { applyTechnicalSkillRepository } from "./apply_technical_skill.repositories";
import { applyTechnicalSkillListSchema, ApplyTechnicalSkillListInput } from "./apply_technical_skill.schemas";

export const applyTechnicalSkillService = {
  validateMany(data: unknown): ApplyTechnicalSkillListInput {
    return applyTechnicalSkillListSchema.parse(data);
  },

  async createSnapshots(client: PoolClient, applyId: string, data: unknown, actorId: string) {
    const validated = this.validateMany(data);

    return applyTechnicalSkillRepository.bulkInsert(client, applyId, validated, actorId);
  },
};
