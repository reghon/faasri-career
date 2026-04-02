import { Request } from "express";
import { AppError } from "../errors/app-error";

export function getAuthenticatedUserId(req: Request): string {
  if (!req.user?.userId) {
    throw new AppError(401, "Unauthorized");
  }

  return req.user.userId;
}
