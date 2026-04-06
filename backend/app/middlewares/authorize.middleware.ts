import { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/app-error";
import type { UserRole } from "../utils/jwt.util";

export const authorize = (...roles: UserRole[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new AppError(401, "Unauthorized"));
      return;
    }

    if (!roles.includes(req.user.role)) {
      next(new AppError(403, "Forbidden: insufficient permissions"));
      return;
    }

    next();
  };
};
