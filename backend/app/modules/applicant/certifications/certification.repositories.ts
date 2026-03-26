import pool from "../../../configurations/database";
import { certificationQueries } from "./certification.queries";

export const certificationRepository = {
  async getByProfileId(profileId: string) {
    const result = await pool.query(certificationQueries.getByProfileId, [profileId]);
    return result.rows;
  },

  async create(profileId: string, data: any, updatedBy: string) {
    const result = await pool.query(certificationQueries.create, [data.name, data.issuer, data.issuedDay, data.issuedMonth, data.issuedYear, data.expiredDay, data.expiredMonth, data.expiredYear, updatedBy, profileId]);
    return result.rows[0];
  },

  async update(id: string, profileId: string, data: any) {
    const result = await pool.query(certificationQueries.update, [data.name, data.issuer, data.issuedDay, data.issuedMonth, data.issuedYear, data.expiredDay, data.expiredMonth, data.expiredYear, id, profileId]);
    return result.rows[0];
  },

  async delete(id: string, profileId: string) {
    await pool.query(certificationQueries.delete, [id, profileId]);
  },
};
