import { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/app-error";
import { authRepository } from "../modules/auth/auth.repositories";
import { verifyAccessToken } from "../utils/jwt.util";

export const authenticate = async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(new AppError(401, "Access token required"));
    }

    const token = authHeader.slice(7).trim();

    if (!token) {
      return next(new AppError(401, "Access token required"));
    }

    const payload = verifyAccessToken(token);

    if (!payload.userId) {
      return next(new AppError(401, "Invalid access token payload"));
    }

    const user = await authRepository.findById(payload.userId);

    if (!user) {
      return next(new AppError(401, "User not found"));
    }

    if (!user.isActive) {
      return next(new AppError(403, "User is inactive"));
    }

    if ((payload.sessionVersion ?? 0) !== user.sessionVersion) {
      return next(new AppError(401, "Session expired"));
    }

    req.user = {
      userId: user.id,
      email: user.email,
    };

    next();
  } catch {
    next(new AppError(401, "Invalid or expired access token"));
  }
};
