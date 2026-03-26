import pool from "../../../configurations/database";
import { languageQueries } from "./language.queries";

export const languageRepository = {
  async getByProfileId(profileId: string) {
    const result = await pool.query(languageQueries.getByProfileId, [profileId]);
    return result.rows;
  },

  async create(profileId: string, data: any, updatedBy: string) {
    const result = await pool.query(languageQueries.create, [data.language, data.proficiency, updatedBy, profileId]);
    return result.rows[0];
  },

  async update(id: string, profileId: string, data: any) {
    const result = await pool.query(languageQueries.update, [data.language, data.proficiency, id, profileId]);
    return result.rows[0];
  },

  async delete(id: string, profileId: string) {
    await pool.query(languageQueries.delete, [id, profileId]);
  },
};
