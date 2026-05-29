import bcrypt from "bcryptjs";
import { AppError } from "../../errors/app-error";
import { config } from "../../configurations/env";
import { authRepository } from "./auth.repositories";
import { authorizationService } from "../authorization/authorization.services";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../../utils/jwt.util";
import { sendOtpEmail } from "../../utils/mailer.util";

const generateOtp = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const DEFAULT_REGISTER_ROLE = "applicant";

export const authService = {
  async register(email: string, password: string) {
    const existingUser = await authRepository.findByEmail(email);

    if (existingUser?.isActive) {
      throw new AppError(409, "Email already registered");
    }

    const defaultRole = await authRepository.findRoleByName(DEFAULT_REGISTER_ROLE);

    if (!defaultRole) {
      throw new AppError(500, "Default role not found");
    }

    const hashedPassword = await bcrypt.hash(password, config.bcrypt.saltRounds);

    const otp = generateOtp();
    const otpExpiredAt = new Date(Date.now() + 5 * 60 * 1000);

    if (existingUser) {
      const user = await authRepository.updateUnverifiedRegistration(existingUser.id, hashedPassword, otp, otpExpiredAt);

      if (!user) {
        throw new AppError(500, "Failed to update registration");
      }

      await sendOtpEmail(email, otp);

      return user;
    }

    const user = await authRepository.create(email, hashedPassword, defaultRole.id, otp, otpExpiredAt);

    if (!user) {
      throw new AppError(500, "Failed to register user");
    }

    await sendOtpEmail(email, otp);

    return user;
  },

  async verifyOtp(email: string, otp: string) {
    const user = await authRepository.findByEmail(email);

    if (!user) {
      throw new AppError(404, "User not found");
    }

    if (user.isActive) {
      throw new AppError(400, "Account already verified");
    }

    if (!user.otp || user.otp !== otp) {
      throw new AppError(400, "Invalid OTP");
    }

    if (!user.otpExpiredAt || new Date() > new Date(user.otpExpiredAt)) {
      throw new AppError(400, "OTP expired");
    }

    await authRepository.activateUser(user.id);

    const accessToken = signAccessToken({
      userId: user.id,
      sessionVersion: user.sessionVersion,
    });

    const refreshToken = signRefreshToken({
      userId: user.id,
    });

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await authRepository.storeRefreshToken(user.id, refreshToken, expiresAt);

    return { accessToken, refreshToken };
  },

  async login(email: string, password: string) {
    const user = await authRepository.findByEmail(email);

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

    const accessToken = signAccessToken({
      userId: user.id,
      sessionVersion: user.sessionVersion,
    });

    const refreshToken = signRefreshToken({
      userId: user.id,
    });

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await authRepository.storeRefreshToken(user.id, refreshToken, expiresAt);

    return { accessToken, refreshToken };
  },

  async logout(refreshToken: string) {
    await authRepository.deleteRefreshToken(refreshToken);
  },

  async refreshAccessToken(refreshToken: string) {
    const storedRefreshToken = await authRepository.findRefreshToken(refreshToken);

    if (!storedRefreshToken) {
      throw new AppError(401, "Invalid or expired refresh token");
    }

    const payload = verifyRefreshToken(refreshToken);

    const user = await authRepository.findById(payload.userId);

    if (!user) {
      throw new AppError(404, "User not found");
    }

    if (!user.isActive) {
      throw new AppError(403, "User is inactive");
    }

    return {
      accessToken: signAccessToken({
        userId: user.id,
        sessionVersion: user.sessionVersion,
      }),
    };
  },

  async getMe(userId: string) {
    const user = await authRepository.findById(userId);

    if (!user) {
      throw new AppError(404, "User not found");
    }

    const rolePermissions = user.roleId ? await authorizationService.getRolePermissions(user.roleId) : [];

    return {
      id: user.id,
      email: user.email,
      isActive: user.isActive,
      sessionVersion: user.sessionVersion,
      permissions: rolePermissions.map((permission) => permission.permissionCode),
    };
  },

  async requestChangeEmail(userId: string, newEmail: string) {
    const existing = await authRepository.findByEmailExcludeId(newEmail, userId);
    if (existing) {
      throw new AppError(409, "Email already in use");
    }

    const otp = generateOtp();
    const otpExpiredAt = new Date(Date.now() + 5 * 60 * 1000);

    await authRepository.updateOtp(userId, otp, otpExpiredAt);
    await sendOtpEmail(newEmail, otp);

    return { message: "OTP sent to new email" };
  },

  async confirmChangeEmail(userId: string, newEmail: string, otp: string, currentRefreshToken?: string) {
    const user = await authRepository.findById(userId);
    if (!user) throw new AppError(404, "User not found");

    const fullUser = await authRepository.findByIdFull(userId);
    if (!fullUser) throw new AppError(404, "User not found");

    if (!fullUser.otp || fullUser.otp !== otp) {
      throw new AppError(400, "Invalid OTP");
    }

    if (!fullUser.otpExpiredAt || new Date() > new Date(fullUser.otpExpiredAt)) {
      throw new AppError(400, "OTP expired");
    }
    const existing = await authRepository.findByEmailExcludeId(newEmail, userId);
    if (existing) throw new AppError(409, "Email already in use");

    const updatedUser = await authRepository.updateEmail(userId, newEmail);
    await authRepository.updateOtp(userId, "", new Date(0));
    if (currentRefreshToken) {
      await authRepository.deleteOtherRefreshTokensByUserId(userId, currentRefreshToken);
    }

    return {
      message: "Email updated successfully",
      accessToken: signAccessToken({
        userId,
        sessionVersion: updatedUser?.sessionVersion ?? fullUser.sessionVersion + 1,
      }),
    };
  },

  async changePassword(userId: string, oldPassword: string, newPassword: string, currentRefreshToken?: string) {
    const user = await authRepository.findByIdFull(userId);
    if (!user) throw new AppError(404, "User not found");

    const isValid = await bcrypt.compare(oldPassword, user.password);
    if (!isValid) throw new AppError(400, "Old password is incorrect");

    const hashed = await bcrypt.hash(newPassword, config.bcrypt.saltRounds);
    const updatedUser = await authRepository.updatePassword(userId, hashed);
    if (currentRefreshToken) {
      await authRepository.deleteOtherRefreshTokensByUserId(userId, currentRefreshToken);
    }

    return {
      message: "Password changed successfully",
      accessToken: signAccessToken({
        userId,
        sessionVersion: updatedUser?.sessionVersion ?? user.sessionVersion + 1,
      }),
    };
  },

  async requestForgotPassword(email: string) {
    const user = await authRepository.findByEmail(email);
    if (!user) return { message: "If the email is registered, an OTP has been sent" };

    if (!user.isActive) throw new AppError(403, "Account is not active");

    const otp = generateOtp();
    const otpExpiredAt = new Date(Date.now() + 5 * 60 * 1000);

    await authRepository.updateOtp(user.id, otp, otpExpiredAt);
    await sendOtpEmail(email, otp);

    return { message: "If the email is registered, an OTP has been sent" };
  },

  async confirmForgotPassword(email: string, otp: string, newPassword: string) {
    const user = await authRepository.findByEmail(email);
    if (!user) throw new AppError(400, "Invalid request");

    if (!user.otp || user.otp !== otp) {
      throw new AppError(400, "Invalid OTP");
    }

    if (!user.otpExpiredAt || new Date() > new Date(user.otpExpiredAt)) {
      throw new AppError(400, "OTP expired");
    }

    const hashed = await bcrypt.hash(newPassword, config.bcrypt.saltRounds);
    await authRepository.updatePassword(user.id, hashed);
    await authRepository.updateOtp(user.id, "", new Date(0));

    await authRepository.deleteRefreshTokenByUserId(user.id);

    return { message: "Password reset successfully" };
  },

  async verifyForgotPasswordOtp(email: string, otp: string) {
    const user = await authRepository.findByEmail(email);
    if (!user) throw new AppError(400, "Invalid request");

    if (!user.otp || user.otp !== otp) {
      throw new AppError(400, "Invalid OTP");
    }

    if (!user.otpExpiredAt || new Date() > new Date(user.otpExpiredAt)) {
      throw new AppError(400, "OTP expired");
    }

    return { message: "OTP verified" };
  },
};
