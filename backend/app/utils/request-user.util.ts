import { Request } from "express";
import { AppError } from "../errors/app-error";
import { AuthUser } from "./jwt.util";

export const requireAuthUser = (req: Request): AuthUser => {
  if (!req.user?.userId || !req.user?.email) {
    throw new AppError(401, "Unauthorized");
  }

  return req.user;
};

export const requireUserId = (req: Request): string => {
  return requireAuthUser(req).userId;
};

export const requireUserEmail = (req: Request): string => {
  return requireAuthUser(req).email;
};
