import { Request } from "express";
import { requireUserId } from "./request-user.util";

export function getAuthenticatedUserId(req: Request): string {
  return requireUserId(req);
}
