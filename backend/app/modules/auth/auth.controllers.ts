import { Request, Response } from "express";
import { requireUserId } from "../../utils/request-user.util";
import { getValidatedBody } from "../../utils/validated-request.util";
import { ChangeEmailConfirmBodyInput, ChangeEmailRequestBodyInput, ChangePasswordBodyInput, ForgotPasswordConfirmBodyInput, ForgotPasswordRequestBodyInput, LoginBodyInput, RegisterBodyInput, VerifyForgotPasswordOtpBodyInput, VerifyOtpBodyInput } from "./auth.schemas";
import { authService } from "./auth.services";

const refreshCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const authController = {
  async register(req: Request, res: Response) {
    const body = getValidatedBody<RegisterBodyInput>(req);

    const user = await authService.register(body.email, body.password);

    res.status(201).json({
      message: "User registered successfully",
      data: user,
    });
  },

  async verifyOtp(req: Request, res: Response) {
    const body = getValidatedBody<VerifyOtpBodyInput>(req);

    const { accessToken, refreshToken } = await authService.verifyOtp(body.email, body.otp);

    res.cookie("refreshToken", refreshToken, refreshCookieOptions);

    res.status(200).json({
      message: "Account verified successfully",
      data: { accessToken },
    });
  },

  async login(req: Request, res: Response) {
    const body = getValidatedBody<LoginBodyInput>(req);

    const { accessToken, refreshToken } = await authService.login(body.email, body.password);

    res.cookie("refreshToken", refreshToken, refreshCookieOptions);

    res.status(200).json({
      message: "Login successful",
      data: { accessToken },
    });
  },

  async logout(req: Request, res: Response) {
    const refreshToken = req.cookies?.refreshToken as string | undefined;

    if (refreshToken) {
      await authService.logout(refreshToken);
    }

    res.clearCookie("refreshToken");

    res.status(200).json({
      message: "Logout successful",
    });
  },

  async refresh(req: Request, res: Response) {
    const refreshToken = req.cookies?.refreshToken as string | undefined;

    if (!refreshToken) {
      res.status(401).json({ message: "Refresh token not found" });
      return;
    }

    const { accessToken } = await authService.refreshAccessToken(refreshToken);

    res.status(200).json({
      message: "Token refreshed",
      data: { accessToken },
    });
  },

  async me(req: Request, res: Response) {
    const user = await authService.getMe(requireUserId(req));

    res.status(200).json({
      message: "Success",
      data: user,
    });
  },

  async requestChangeEmail(req: Request, res: Response) {
    const body = getValidatedBody<ChangeEmailRequestBodyInput>(req);
    const userId = requireUserId(req);

    const result = await authService.requestChangeEmail(userId, body.newEmail);

    res.status(200).json({ message: result.message });
  },

  async confirmChangeEmail(req: Request, res: Response) {
    const body = getValidatedBody<ChangeEmailConfirmBodyInput>(req);
    const userId = requireUserId(req);
    const refreshToken = req.cookies?.refreshToken as string | undefined;

    const result = await authService.confirmChangeEmail(userId, body.newEmail, body.otp, refreshToken);

    res.status(200).json({ message: result.message, data: { accessToken: result.accessToken } });
  },

  async changePassword(req: Request, res: Response) {
    const body = getValidatedBody<ChangePasswordBodyInput>(req);
    const userId = requireUserId(req);
    const refreshToken = req.cookies?.refreshToken as string | undefined;

    const result = await authService.changePassword(userId, body.oldPassword, body.newPassword, refreshToken);

    res.status(200).json({ message: result.message, data: { accessToken: result.accessToken } });
  },

  async requestForgotPassword(req: Request, res: Response) {
    const body = getValidatedBody<ForgotPasswordRequestBodyInput>(req);

    const result = await authService.requestForgotPassword(body.email);

    res.status(200).json({ message: result.message });
  },

  async confirmForgotPassword(req: Request, res: Response) {
    const body = getValidatedBody<ForgotPasswordConfirmBodyInput>(req);

    const result = await authService.confirmForgotPassword(body.email, body.otp, body.newPassword);

    res.status(200).json({ message: result.message });
  },

  async verifyForgotPasswordOtp(req: Request, res: Response) {
    const body = getValidatedBody<VerifyForgotPasswordOtpBodyInput>(req);
    const result = await authService.verifyForgotPasswordOtp(body.email, body.otp);
    res.status(200).json({ message: result.message });
  },
};
