import pool from "../../../configurations/database";
import { technicalSkillQueries } from "./technical_skill.queries";

export const technicalSkillRepository = {
  async getByProfileId(profileId: string) {
    const result = await pool.query(technicalSkillQueries.getByProfileId, [profileId]);
    return result.rows;
  },

  async create(profileId: string, data: any, updatedBy: string) {
    const result = await pool.query(technicalSkillQueries.create, [data.skillName, updatedBy, profileId]);
    return result.rows[0];
  },

  async delete(id: string, profileId: string) {
    await pool.query(technicalSkillQueries.delete, [id, profileId]);
  },
};
