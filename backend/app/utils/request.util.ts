import { Request } from "express";
import { requireUserEmail, requireUserId } from "./request-user.util";

export function getAuthenticatedUserId(req: Request): string {
  return requireUserId(req);
}

export function getAuthenticatedUserEmail(req: Request): string {
  return requireUserEmail(req);
}
