import pool from "../../configurations/database";
import { userQueries } from "./user.queries";

export const userRepository = {
  async findByEmail(email: string) {
    const result = await pool.query(userQueries.findUserByEmail, [email]);
    return result.rows[0] || null;
  },

  async findById(id: string) {
    const result = await pool.query(userQueries.findUserById, [id]);
    return result.rows[0] || null;
  },

  async create(email: string, hashedPassword: string, roleId: string) {
    const result = await pool.query(userQueries.createUser, [
      email,
      hashedPassword,
      roleId,
    ]);
    return result.rows[0];
  },

  async findRoleByName(name: string) {
    const result = await pool.query(userQueries.findRoleByName, [name]);
    return result.rows[0] || null;
  },

  async storeRefreshToken(userId: string, token: string, expiresAt: Date) {
    await pool.query(userQueries.storeRefreshToken, [userId, token, expiresAt]);
  },

  async findRefreshToken(token: string) {
    const result = await pool.query(userQueries.findRefreshToken, [token]);
    return result.rows[0] || null;
  },

  async deleteRefreshToken(token: string) {
    await pool.query(userQueries.deleteRefreshToken, [token]);
  },
};