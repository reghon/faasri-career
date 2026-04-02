import pool from "../../../configurations/database";
import { queryCamelOne } from "../../../utils/db.util";
import { applicantProfileQueries } from "./applicant_profile.queries";

export const applicantProfileRepository = {
  async getByUserId(userId: string) {
    return queryCamelOne(applicantProfileQueries.getProfileByUserId, [userId]);
  },

  async create(userId: string) {
    const result = await pool.query(applicantProfileQueries.createProfile, [userId]);
    return result.rows[0];
  },

  async update(userId: string, data: any) {
    const result = await pool.query(applicantProfileQueries.updateProfile, [
      data.fullName,
      data.birthPlace,
      data.birthDate,
      data.gender,
      data.phoneCode,
      data.phone,
      data.address,
      data.kelurahan,
      data.kecamatan,
      data.city,
      data.province,
      data.postalCode,
      data.isSameAddress,
      data.linkedinUrl,
      userId,
    ]);
    return result.rows[0];
  },
};
