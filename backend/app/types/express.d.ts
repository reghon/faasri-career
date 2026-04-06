import "express";
import type { JwtPayloadCustom } from "../utils/jwt.util";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayloadCustom;
      validated?: {
        body?: unknown;
        params?: unknown;
        query?: unknown;
      };
    }
  }
}

export {};