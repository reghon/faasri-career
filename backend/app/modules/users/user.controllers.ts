import { Request, Response } from "express";
import { userService } from "./user.services";

export const userController = {
  async register(req: Request, res: Response) {
    try {
      const { email, password, role } = req.body;
      const user = await userService.register(email, password, role);
      return res.status(201).json({ message: "User registered successfully", data: user });
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  },

  async verifyOtp(req: Request, res: Response) {
    try {
      const { email, otp } = req.body;
      const { accessToken, refreshToken } = await userService.verifyOtp(email, otp);
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      return res.status(200).json({ message: "Account verified successfully", data: { accessToken } });
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  },

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const { accessToken, refreshToken } = await userService.login(email, password);

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.status(200).json({ message: "Login successful", data: { accessToken } });
    } catch (error: any) {
      return res.status(401).json({ message: error.message });
    }
  },

  async logout(req: Request, res: Response) {
    try {
      const refreshToken = req.cookies?.refreshToken;
      if (refreshToken) await userService.logout(refreshToken);
      res.clearCookie("refreshToken");
      return res.status(200).json({ message: "Logout successful" });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  },

  async refresh(req: Request, res: Response) {
    try {
      const refreshToken = req.cookies?.refreshToken;
      if (!refreshToken) {
        return res.status(401).json({ message: "Refresh token not found" });
      }
      const { accessToken } = await userService.refreshAccessToken(refreshToken);
      return res.status(200).json({ message: "Token refreshed", data: { accessToken } });
    } catch (error: any) {
      return res.status(401).json({ message: error.message });
    }
  },

  async me(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;
      const user = await userService.getMe(userId);
      return res.status(200).json({ message: "Success", data: user });
    } catch (error: any) {
      return res.status(404).json({ message: error.message });
    }
  },
};
