import { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/app-error";
import { verifyAccessToken } from "../utils/jwt.util";

export const authenticate = (req: Request, _res: Response, next: NextFunction): void => {
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
    req.user = {
      userId: payload.userId,
    };

    next();
  } catch {
    next(new AppError(401, "Invalid or expired access token"));
  }
};
