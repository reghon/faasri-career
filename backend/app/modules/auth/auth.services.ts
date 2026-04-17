import bcrypt from "bcryptjs";
import { AppError } from "../../errors/app-error";
import { config } from "../../configurations/env";
import { userRepository } from "./auth.repositories";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../../utils/jwt.util";
import { sendOtpEmail } from "../../utils/mailer.util";

const generateOtp = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const DEFAULT_REGISTER_ROLE = "applicant";

export const userService = {
  async register(email: string, password: string) {
    const existingUser = await userRepository.findByEmail(email);

    if (existingUser) {
      throw new AppError(409, "Email already registered");
    }

    const defaultRole = await userRepository.findRoleByName(DEFAULT_REGISTER_ROLE);

    if (!defaultRole) {
      throw new AppError(500, "Default role not found");
    }

    const hashedPassword = await bcrypt.hash(password, config.bcrypt.saltRounds);

    const otp = generateOtp();
    const otpExpiredAt = new Date(Date.now() + 5 * 60 * 1000);

    const user = await userRepository.create(email, hashedPassword, defaultRole.id, otp, otpExpiredAt);

    if (!user) {
      throw new AppError(500, "Failed to register user");
    }

    await sendOtpEmail(email, otp);

    return user;
  },

  async verifyOtp(email: string, otp: string) {
    const user = await userRepository.findByEmail(email);

    if (!user) {
      throw new AppError(404, "User not found");
    }

    if (!user.isActive) {
    } else {
      throw new AppError(400, "Account already verified");
    }

    if (!user.otp || user.otp !== otp) {
      throw new AppError(400, "Invalid OTP");
    }

    if (!user.otpExpiredAt || new Date() > new Date(user.otpExpiredAt)) {
      throw new AppError(400, "OTP expired");
    }

    if (!user.roleId) {
      throw new AppError(500, "User role not found");
    }

    await userRepository.activateUser(user.id);

    const accessToken = signAccessToken({
      userId: user.id,
      roleId: user.roleId,
    });

    const refreshToken = signRefreshToken({
      userId: user.id,
      roleId: user.roleId,
    });

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await userRepository.storeRefreshToken(user.id, refreshToken, expiresAt);

    return { accessToken, refreshToken };
  },

  async login(email: string, password: string) {
    const user = await userRepository.findByEmail(email);

    if (!user) {
      throw new AppError(401, "Invalid email or password");
    }

    if (!user.isActive) {
      throw new AppError(403, "Account is not verified yet, please check your email");
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      throw new AppError(401, "Invalid email or password");
    }

    if (!user.roleId) {
      throw new AppError(500, "User role not found");
    }

    const accessToken = signAccessToken({
      userId: user.id,
      roleId: user.roleId,
    });

    const refreshToken = signRefreshToken({
      userId: user.id,
      roleId: user.roleId,
    });

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await userRepository.storeRefreshToken(user.id, refreshToken, expiresAt);

    return { accessToken, refreshToken };
  },

  async logout(refreshToken: string) {
    await userRepository.deleteRefreshToken(refreshToken);
  },

  async refreshAccessToken(refreshToken: string) {
    const storedRefreshToken = await userRepository.findRefreshToken(refreshToken);

    if (!storedRefreshToken) {
      throw new AppError(401, "Invalid or expired refresh token");
    }

    const payload = verifyRefreshToken(refreshToken);

    const user = await userRepository.findById(payload.userId);

    if (!user) {
      throw new AppError(404, "User not found");
    }

    if (!payload.roleId) {
      throw new AppError(401, "Invalid refresh token payload");
    }

    return {
      accessToken: signAccessToken({
        userId: user.id,
        roleId: payload.roleId,
      }),
    };
  },

  async getMe(userId: string) {
    const user = await userRepository.findById(userId);

    if (!user) {
      throw new AppError(404, "User not found");
    }

    return user;
  },
};
