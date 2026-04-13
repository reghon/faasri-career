import { PoolClient } from "pg";
import { applyEducationRepository } from "./apply_education.repositories";
import { applyEducationListSchema, ApplyEducationListInput } from "./apply_education.schemas";

export const applyEducationService = {
  validateMany(data: unknown): ApplyEducationListInput {
    return applyEducationListSchema.parse(data);
  },

  async createSnapshots(client: PoolClient, applyId: string, data: unknown, actorId: string) {
    const validated = this.validateMany(data);

    return applyEducationRepository.bulkInsert(client, applyId, validated, actorId);
  },
};
