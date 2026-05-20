import { AppError } from "../../../errors/app-error";
import pool from "../../../configurations/database";
import { PoolClient } from "pg";
import { applyProfileRepository } from "./apply_profile.repositories";
import { applyProfileBodySchema, ApplyProfileBodyInput } from "./apply_profile.schemas";

export const applyProfileService = {
  validateOne(data: unknown): ApplyProfileBodyInput {
    return applyProfileBodySchema.parse(data);
  },

  async getByApplyId(applyId: string) {
    const client: PoolClient = await pool.connect();

    try {
      const profile = await applyProfileRepository.getByApplyId(client, applyId);

      if (!profile) {
        throw new AppError(404, "Apply profile not found");
      }

      return profile;
    } finally {
      client.release();
    }
  },

  async createSnapshot(client: PoolClient, applyId: string, data: unknown, actorId: string) {
    const validated = this.validateOne(data);

    return applyProfileRepository.create(client, applyId, validated, actorId);
  },
};
