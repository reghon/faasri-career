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
      throw new AppError(409, "Email sudah terdaftar");
    }

    const defaultRole = await authRepository.findRoleByName(DEFAULT_REGISTER_ROLE);

    if (!defaultRole) {
      throw new AppError(500, "Role default tidak ditemukan");
    }

    const hashedPassword = await bcrypt.hash(password, config.bcrypt.saltRounds);

    const otp = generateOtp();
    const otpExpiredAt = new Date(Date.now() + 5 * 60 * 1000);

    if (existingUser) {
      const user = await authRepository.updateUnverifiedRegistration(existingUser.id, hashedPassword, otp, otpExpiredAt);

      if (!user) {
        throw new AppError(500, "Gagal memperbarui registrasi");
      }

      await sendOtpEmail(email, otp);

      return user;
    }

    const user = await authRepository.create(email, hashedPassword, defaultRole.id, otp, otpExpiredAt);

    if (!user) {
      throw new AppError(500, "Gagal mendaftarkan pengguna");
    }

    await sendOtpEmail(email, otp);

    return user;
  },

  async verifyOtp(email: string, otp: string) {
    const user = await authRepository.findByEmail(email);

    if (!user) {
      throw new AppError(404, "Pengguna tidak ditemukan");
    }

    if (user.isActive) {
      throw new AppError(400, "Akun sudah terverifikasi");
    }

    if (!user.otp || user.otp !== otp) {
      throw new AppError(400, "OTP tidak valid");
    }

    if (!user.otpExpiredAt || new Date() > new Date(user.otpExpiredAt)) {
      throw new AppError(400, "OTP sudah kedaluwarsa");
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
      throw new AppError(401, "Email atau password tidak valid");
    }

    if (!user.isActive) {
      throw new AppError(403, "Akun belum diverifikasi, silakan cek email Anda");
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      throw new AppError(401, "Email atau password tidak valid");
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
      throw new AppError(401, "Refresh token tidak valid atau sudah kedaluwarsa");
    }

    const payload = verifyRefreshToken(refreshToken);

    const user = await authRepository.findById(payload.userId);

    if (!user) {
      throw new AppError(404, "Pengguna tidak ditemukan");
    }

    if (!user.isActive) {
      throw new AppError(403, "Pengguna tidak aktif");
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
      throw new AppError(404, "Pengguna tidak ditemukan");
    }

    const rolePermissions = user.roleId ? await authorizationService.getRolePermissions(user.roleId) : [];

    return {
      id: user.id,
      email: user.email,
      roleName: user.roleName,
      isActive: user.isActive,
      sessionVersion: user.sessionVersion,
      permissions: rolePermissions.map((permission) => permission.permissionCode),
    };
  },

  async requestChangeEmail(userId: string, newEmail: string) {
    const existing = await authRepository.findByEmailExcludeId(newEmail, userId);
    if (existing) {
      throw new AppError(409, "Email sudah digunakan");
    }

    const otp = generateOtp();
    const otpExpiredAt = new Date(Date.now() + 5 * 60 * 1000);

    await authRepository.updateOtp(userId, otp, otpExpiredAt);
    await sendOtpEmail(newEmail, otp);

    return { message: "OTP berhasil dikirim ke email baru" };
  },

  async confirmChangeEmail(userId: string, newEmail: string, otp: string, currentRefreshToken?: string) {
    const user = await authRepository.findById(userId);
    if (!user) throw new AppError(404, "Pengguna tidak ditemukan");

    const fullUser = await authRepository.findByIdFull(userId);
    if (!fullUser) throw new AppError(404, "Pengguna tidak ditemukan");

    if (!fullUser.otp || fullUser.otp !== otp) {
      throw new AppError(400, "OTP tidak valid");
    }

    if (!fullUser.otpExpiredAt || new Date() > new Date(fullUser.otpExpiredAt)) {
      throw new AppError(400, "OTP sudah kedaluwarsa");
    }
    const existing = await authRepository.findByEmailExcludeId(newEmail, userId);
    if (existing) throw new AppError(409, "Email sudah digunakan");

    const updatedUser = await authRepository.updateEmail(userId, newEmail);
    await authRepository.updateOtp(userId, "", new Date(0));
    if (currentRefreshToken) {
      await authRepository.deleteOtherRefreshTokensByUserId(userId, currentRefreshToken);
    }

    return {
      message: "Email berhasil diperbarui",
      accessToken: signAccessToken({
        userId,
        sessionVersion: updatedUser?.sessionVersion ?? fullUser.sessionVersion + 1,
      }),
    };
  },

  async changePassword(userId: string, oldPassword: string, newPassword: string, currentRefreshToken?: string) {
    const user = await authRepository.findByIdFull(userId);
    if (!user) throw new AppError(404, "Pengguna tidak ditemukan");

    const isValid = await bcrypt.compare(oldPassword, user.password);
    if (!isValid) throw new AppError(400, "Password lama tidak sesuai");

    const hashed = await bcrypt.hash(newPassword, config.bcrypt.saltRounds);
    const updatedUser = await authRepository.updatePassword(userId, hashed);
    if (currentRefreshToken) {
      await authRepository.deleteOtherRefreshTokensByUserId(userId, currentRefreshToken);
    }

    return {
      message: "Password berhasil diubah",
      accessToken: signAccessToken({
        userId,
        sessionVersion: updatedUser?.sessionVersion ?? user.sessionVersion + 1,
      }),
    };
  },

  async requestForgotPassword(email: string) {
    const user = await authRepository.findByEmail(email);
    if (!user) {
      throw new AppError(404, "Email tidak terdaftar");
    }

    if (!user.isActive) {
      throw new AppError(403, "Akun belum aktif");
    }

    const otp = generateOtp();
    const otpExpiredAt = new Date(Date.now() + 5 * 60 * 1000);

    await authRepository.updateOtp(user.id, otp, otpExpiredAt);
    await sendOtpEmail(email, otp);

    return {
      message: "OTP berhasil dikirim",
    };
  },

  async confirmForgotPassword(email: string, otp: string, newPassword: string) {
    const user = await authRepository.findByEmail(email);
    if (!user) throw new AppError(400, "Permintaan tidak valid");

    if (!user.otp || user.otp !== otp) {
      throw new AppError(400, "OTP tidak valid");
    }

    if (!user.otpExpiredAt || new Date() > new Date(user.otpExpiredAt)) {
      throw new AppError(400, "OTP sudah kedaluwarsa");
    }

    const hashed = await bcrypt.hash(newPassword, config.bcrypt.saltRounds);
    await authRepository.updatePassword(user.id, hashed);
    await authRepository.updateOtp(user.id, "", new Date(0));

    await authRepository.deleteRefreshTokenByUserId(user.id);

    return { message: "Password berhasil direset" };
  },

  async verifyForgotPasswordOtp(email: string, otp: string) {
    const user = await authRepository.findByEmail(email);
    if (!user) throw new AppError(400, "Permintaan tidak valid");

    if (!user.otp || user.otp !== otp) {
      throw new AppError(400, "OTP tidak valid");
    }

    if (!user.otpExpiredAt || new Date() > new Date(user.otpExpiredAt)) {
      throw new AppError(400, "OTP sudah kedaluwarsa");
    }

    return { message: "OTP berhasil diverifikasi" };
  },
};
