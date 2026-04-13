import { PoolClient } from "pg";
import { applyLanguageRepository } from "./apply_language.repositories";
import { applyLanguageListSchema, ApplyLanguageListInput } from "./apply_language.schemas";

export const applyLanguageService = {
  validateMany(data: unknown): ApplyLanguageListInput {
    return applyLanguageListSchema.parse(data);
  },

  async createSnapshots(client: PoolClient, applyId: string, data: unknown, actorId: string) {
    const validated = this.validateMany(data);

    return applyLanguageRepository.bulkInsert(client, applyId, validated, actorId);
  },
};
