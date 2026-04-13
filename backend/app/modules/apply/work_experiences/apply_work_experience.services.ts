import { PoolClient } from "pg";
import { applyWorkExperienceRepository } from "./apply_work_experience.repositories";
import { applyWorkExperienceListSchema, ApplyWorkExperienceListInput } from "./apply_work_experience.schemas";

export const applyWorkExperienceService = {
  validateMany(data: unknown): ApplyWorkExperienceListInput {
    return applyWorkExperienceListSchema.parse(data);
  },

  async createSnapshots(client: PoolClient, applyId: string, data: unknown, actorId: string) {
    const validated = this.validateMany(data);

    return applyWorkExperienceRepository.bulkInsert(client, applyId, validated, actorId);
  },
};
