import { Request } from "express";
import { AppError } from "../errors/app-error";
import { AuthUser } from "./jwt.util";
import pool from "../configurations/database";

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

export const requireRoleId = async (req: Request): Promise<string> => {
  const userId = requireUserId(req);

  const result = await pool.query("SELECT role_id FROM users WHERE id = $1", [userId]);

  const user = result.rows[0];

  if (!user?.role_id) {
    throw new AppError(403, "User role is required");
  }

  return user.role_id;
};
