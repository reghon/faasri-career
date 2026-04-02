import { Request, Response } from "express";
import { requireUserId } from "../../utils/request-user.util";
import { getValidatedBody } from "../../utils/validated-request.util";
import { LoginBodyInput, RegisterBodyInput, VerifyOtpBodyInput } from "./user.schemas";
import { userService } from "./user.services";

const refreshCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const userController = {
  async register(req: Request, res: Response) {
    const body = getValidatedBody<RegisterBodyInput>(req);

    const user = await userService.register(body.email, body.password, body.role);

    res.status(201).json({
      message: "User registered successfully",
      data: user,
    });
  },

  async verifyOtp(req: Request, res: Response) {
    const body = getValidatedBody<VerifyOtpBodyInput>(req);

    const { accessToken, refreshToken } = await userService.verifyOtp(body.email, body.otp);

    res.cookie("refreshToken", refreshToken, refreshCookieOptions);

    res.status(200).json({
      message: "Account verified successfully",
      data: { accessToken },
    });
  },

  async login(req: Request, res: Response) {
    const body = getValidatedBody<LoginBodyInput>(req);

    const { accessToken, refreshToken } = await userService.login(body.email, body.password);

    res.cookie("refreshToken", refreshToken, refreshCookieOptions);

    res.status(200).json({
      message: "Login successful",
      data: { accessToken },
    });
  },

  async logout(req: Request, res: Response) {
    const refreshToken = req.cookies?.refreshToken as string | undefined;

    if (refreshToken) {
      await userService.logout(refreshToken);
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

    const { accessToken } = await userService.refreshAccessToken(refreshToken);

    res.status(200).json({
      message: "Token refreshed",
      data: { accessToken },
    });
  },

  async me(req: Request, res: Response) {
    const user = await userService.getMe(requireUserId(req));

    res.status(200).json({
      message: "Success",
      data: user,
    });
  },
};
