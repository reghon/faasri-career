import { PoolClient } from "pg";
import { applyProfileRepository } from "./apply_profile.repositories";
import { applyProfileBodySchema, ApplyProfileBodyInput } from "./apply_profile.schemas";

export const applyProfileService = {
  validateOne(data: unknown): ApplyProfileBodyInput {
    return applyProfileBodySchema.parse(data);
  },

  async createSnapshot(client: PoolClient, applyId: string, data: unknown, actorId: string) {
    const validated = this.validateOne(data);

    return applyProfileRepository.create(client, applyId, validated, actorId);
  },
};
