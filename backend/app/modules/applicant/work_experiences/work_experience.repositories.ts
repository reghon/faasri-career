import pool from "../../../configurations/database";
import { workExperienceQueries } from "./work_experience.queries";

export const workExperienceRepository = {
  async getByProfileId(profileId: string) {
    const result = await pool.query(workExperienceQueries.getByProfileId, [profileId]);
    return result.rows;
  },

  async create(profileId: string, data: any, updatedBy: string) {
    const result = await pool.query(workExperienceQueries.create, [
      data.company,
      data.industry,
      data.position,
      data.employmentType,
      data.jobLevel,
      data.teamSize,
      data.startDay,
      data.startMonth,
      data.startYear,
      data.endDay,
      data.endMonth,
      data.endYear,
      data.isCurrentJob,
      data.responsibilities,
      data.leaveReason,
      data.referenceName,
      data.referencePosition,
      data.referencePhoneCode,
      data.referencePhone,
      data.referenceEmail,
      updatedBy,
      profileId,
    ]);
    return result.rows[0];
  },

  async update(id: string, profileId: string, data: any) {
    const result = await pool.query(workExperienceQueries.update, [
      data.company,
      data.industry,
      data.position,
      data.employmentType,
      data.jobLevel,
      data.teamSize,
      data.startDay,
      data.startMonth,
      data.startYear,
      data.endDay,
      data.endMonth,
      data.endYear,
      data.isCurrentJob,
      data.responsibilities,
      data.leaveReason,
      data.referenceName,
      data.referencePosition,
      data.referencePhoneCode,
      data.referencePhone,
      data.referenceEmail,
      id,
      profileId,
    ]);
    return result.rows[0];
  },

  async delete(id: string, profileId: string) {
    await pool.query(workExperienceQueries.delete, [id, profileId]);
  },
};
