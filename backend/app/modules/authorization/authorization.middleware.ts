import { NextFunction, Request, Response } from "express";
import { AppError } from "../../errors/app-error";
import { requireRoleId } from "../../utils/request-user.util";
import { authorizationService } from "./authorization.services";

export const authorizePermission = (permissionCode: string) => {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      const roleId = await requireRoleId(req);

      const hasPermission = await authorizationService.hasPermission(roleId, permissionCode);

      if (!hasPermission) {
        next(new AppError(403, "Forbidden: insufficient permissions"));
        return;
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
