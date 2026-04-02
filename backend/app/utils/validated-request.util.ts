import { Request } from "express";
import { AppError } from "../errors/app-error";

export const getValidatedBody = <T>(req: Request): T => {
  if (!req.validated?.body) {
    throw new AppError(400, "Validated body not found");
  }

  return req.validated.body as T;
};

export const getValidatedParams = <T>(req: Request): T => {
  if (!req.validated?.params) {
    throw new AppError(400, "Validated params not found");
  }

  return req.validated.params as T;
};

export const getValidatedQuery = <T>(req: Request): T => {
  if (!req.validated?.query) {
    throw new AppError(400, "Validated query not found");
  }

  return req.validated.query as T;
};
