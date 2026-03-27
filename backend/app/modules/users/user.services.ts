import bcrypt from "bcryptjs";
import { userRepository } from "./user.repositories";
import { config } from "../../configurations/env";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../../utils/jwt.util";
import { sendOtpEmail } from "../../utils/mailer.util";

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

export const userService = {
  async register(email: string, password: string, role = "applicant") {
    const existing = await userRepository.findByEmail(email);
    if (existing) throw new Error("Email already registered");

    const foundRole = await userRepository.findRoleByName(role);
    if (!foundRole) throw new Error("Role not found");

    const hashedPassword = await bcrypt.hash(password, config.bcrypt.saltRounds);

    const otp = generateOtp();
    const otpExpiredAt = new Date(Date.now() + 5 * 60 * 1000); // 5 menit

    const user = await userRepository.create(email, hashedPassword, foundRole.id, otp, otpExpiredAt);
    await sendOtpEmail(email, otp);
    return user;
  },

  async verifyOtp(email: string, otp: string) {
    const user = await userRepository.findByEmail(email);
    if (!user) throw new Error("User not found");
    if (user.isActive) throw new Error("Account already verified");
    if (!user.otp || user.otp !== otp) throw new Error("Invalid OTP");
    if (!user.otpExpiredAt || new Date() > user.otpExpiredAt) throw new Error("OTP expired");
    await userRepository.activateUser(user.id);

    const accessToken = signAccessToken({ userId: user.id, role: user.role_name });
    const refreshToken = signRefreshToken({ userId: user.id });
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    await userRepository.storeRefreshToken(user.id, refreshToken, expiresAt);

    return { accessToken, refreshToken };
  },

  async login(email: string, password: string) {
    const user = await userRepository.findByEmail(email);
    if (!user) throw new Error("Invalid email or password");
    if (!user.isActive) throw new Error("Account is not verified yet, please check your email");
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) throw new Error("Invalid email or password");

    const accessToken = signAccessToken({ userId: user.id, role: user.role_name });
    const refreshToken = signRefreshToken({ userId: user.id });

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    await userRepository.storeRefreshToken(user.id, refreshToken, expiresAt);

    return { accessToken, refreshToken };
  },

  async logout(refreshToken: string) {
    await userRepository.deleteRefreshToken(refreshToken);
  },

  async refreshAccessToken(refreshToken: string) {
    const stored = await userRepository.findRefreshToken(refreshToken);
    if (!stored) throw new Error("Invalid or expired refresh token");

    const payload = verifyRefreshToken(refreshToken);

    const user = await userRepository.findById(payload.userId);
    if (!user) throw new Error("User not found");

    return {
      accessToken: signAccessToken({ userId: user.id, role: user.role_name }),
    };
  },

  async getMe(userId: string) {
    const user = await userRepository.findById(userId);
    if (!user) throw new Error("User not found");
    return user;
  },
};
