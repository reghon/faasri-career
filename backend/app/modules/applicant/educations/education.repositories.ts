import pool from "../../../configurations/database";
import { educationQueries } from "./education.queries";

export const educationRepository = {
  async getByProfileId(profileId: string) {
    const result = await pool.query(educationQueries.getByProfileId, [profileId]);
    return result.rows;
  },

  async create(profileId: string, data: any, updatedBy: string) {
    const result = await pool.query(educationQueries.create, [
      data.level,
      data.country,
      data.institution,
      data.major,
      data.isStillStudying,
      data.startDay,
      data.startMonth,
      data.startYear,
      data.endDay,
      data.endMonth,
      data.endYear,
      data.gpa,
      data.gpaScale,
      updatedBy,
      profileId,
    ]);
    return result.rows[0];
  },

  async update(id: string, profileId: string, data: any) {
    const result = await pool.query(educationQueries.update, [
      data.level,
      data.country,
      data.institution,
      data.major,
      data.isStillStudying,
      data.startDay,
      data.startMonth,
      data.startYear,
      data.endDay,
      data.endMonth,
      data.endYear,
      data.gpa,
      data.gpaScale,
      id,
      profileId,
    ]);
    return result.rows[0];
  },

  async delete(id: string, profileId: string) {
    await pool.query(educationQueries.delete, [id, profileId]);
  },
};
