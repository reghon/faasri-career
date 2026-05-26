import { queryCamelOne } from "../../utils/db.util";
import { authQueries } from "./auth.queries";
import { RefreshTokenRecord, Auth, AuthMe, AuthRegisterResult } from "./auth.types";

export const authRepository = {
  async findByEmail(email: string): Promise<Auth | null> {
    return queryCamelOne<Auth>(authQueries.findByEmail, [email]);
  },

  async findById(id: string): Promise<AuthMe | null> {
    return queryCamelOne<AuthMe>(authQueries.findById, [id]);
  },

  async create(email: string, hashedPassword: string, roleId: string, otp: string, otpExpiredAt: Date): Promise<AuthRegisterResult | null> {
    return queryCamelOne<AuthRegisterResult>(authQueries.create, [roleId, email, hashedPassword, otp, otpExpiredAt]);
  },

  async activateUser(id: string): Promise<void> {
    await queryCamelOne(authQueries.activateUser, [id]);
  },

  async findRoleByName(name: string): Promise<{ id: string; name: string } | null> {
    return queryCamelOne<{ id: string; name: string }>(authQueries.findRoleByName, [name]);
  },

  async storeRefreshToken(userId: string, token: string, expiresAt: Date): Promise<void> {
    await queryCamelOne(authQueries.storeRefreshToken, [userId, token, expiresAt]);
  },

  async findRefreshToken(token: string): Promise<RefreshTokenRecord | null> {
    return queryCamelOne<RefreshTokenRecord>(authQueries.findRefreshToken, [token]);
  },

  async deleteRefreshToken(token: string): Promise<void> {
    await queryCamelOne(authQueries.deleteRefreshToken, [token]);
  },

  async updateOtp(userId: string, otp: string, otpExpiredAt: Date): Promise<void> {
    await queryCamelOne(authQueries.updateOtp, [otp, otpExpiredAt, userId]);
  },

  async updateEmail(userId: string, newEmail: string): Promise<void> {
    await queryCamelOne(authQueries.updateEmail, [newEmail, userId]);
  },

  async updatePassword(userId: string, hashedPassword: string): Promise<void> {
    await queryCamelOne(authQueries.updatePassword, [hashedPassword, userId]);
  },

  async findByEmailExcludeId(email: string, excludeId: string): Promise<{ id: string } | null> {
    return queryCamelOne<{ id: string }>(authQueries.findByEmailExcludeId, [email, excludeId]);
  },

  async findByIdFull(id: string): Promise<Auth | null> {
    return queryCamelOne<Auth>(authQueries.findByIdFull, [id]);
  },

  async deleteRefreshTokenByUserId(userId: string): Promise<void> {
    await queryCamelOne(authQueries.deleteRefreshTokenByUserId, [userId]);
  },
};
