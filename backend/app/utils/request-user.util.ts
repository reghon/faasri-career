import { Request } from "express";
import { AppError } from "../errors/app-error";
import { JwtPayloadCustom } from "./jwt.util";

export const requireAuthUser = (req: Request): JwtPayloadCustom => {
  if (!req.user?.userId) {
    throw new AppError(401, "Unauthorized");
  }

  return req.user;
};

export const requireUserId = (req: Request): string => {
  return requireAuthUser(req).userId;
};
