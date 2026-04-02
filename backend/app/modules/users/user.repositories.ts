import { queryCamelOne } from "../../utils/db.util";
import { userQueries } from "./user.queries";
import { RefreshTokenRecord, User, UserMe, UserRegisterResult } from "./user.types";

export const userRepository = {
  async findByEmail(email: string): Promise<User | null> {
    return queryCamelOne<User>(userQueries.findByEmail, [email]);
  },

  async findById(id: string): Promise<UserMe | null> {
    return queryCamelOne<UserMe>(userQueries.findById, [id]);
  },

  async create(email: string, hashedPassword: string, roleId: string, otp: string, otpExpiredAt: Date): Promise<UserRegisterResult | null> {
    return queryCamelOne<UserRegisterResult>(userQueries.create, [roleId, email, hashedPassword, otp, otpExpiredAt]);
  },

  async activateUser(id: string): Promise<void> {
    await queryCamelOne(userQueries.activateUser, [id]);
  },

  async findRoleByName(name: string): Promise<{ id: string; name: string } | null> {
    return queryCamelOne<{ id: string; name: string }>(userQueries.findRoleByName, [name]);
  },

  async storeRefreshToken(userId: string, token: string, expiresAt: Date): Promise<void> {
    await queryCamelOne(userQueries.storeRefreshToken, [userId, token, expiresAt]);
  },

  async findRefreshToken(token: string): Promise<RefreshTokenRecord | null> {
    return queryCamelOne<RefreshTokenRecord>(userQueries.findRefreshToken, [token]);
  },

  async deleteRefreshToken(token: string): Promise<void> {
    await queryCamelOne(userQueries.deleteRefreshToken, [token]);
  },
};
