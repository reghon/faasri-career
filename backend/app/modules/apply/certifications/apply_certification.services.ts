import { PoolClient } from "pg";
import { applyCertificationRepository } from "./apply_certification.repositories";
import { applyCertificationListSchema, ApplyCertificationListInput } from "./apply_certification.schemas";

export const applyCertificationService = {
  validateMany(data: unknown): ApplyCertificationListInput {
    return applyCertificationListSchema.parse(data);
  },

  async createSnapshots(client: PoolClient, applyId: string, data: unknown, actorId: string) {
    const validated = this.validateMany(data);

    return applyCertificationRepository.bulkInsert(client, applyId, validated, actorId);
  },
};
