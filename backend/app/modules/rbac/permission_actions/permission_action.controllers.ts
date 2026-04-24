import { Request, Response } from "express";
import { requireUserId } from "../../../utils/request-user.util";
import { getValidatedBody, getValidatedParams } from "../../../utils/validated-request.util";
import { PermissionActionBodyInput, PermissionActionParamsInput } from "./permission_action.schemas";
import { permissionActionService } from "./permission_action.services";

export const permissionActionController = {
  async getAll(req: Request, res: Response) {
    const data = await permissionActionService.getAll();

    res.status(200).json({
      message: "Success",
      data,
    });
  },

  async create(req: Request, res: Response) {
    const body = getValidatedBody<PermissionActionBodyInput>(req);

    const data = await permissionActionService.create(requireUserId(req), body);

    res.status(201).json({
      message: "Permission action created successfully",
      data,
    });
  },

  async update(req: Request, res: Response) {
    const body = getValidatedBody<PermissionActionBodyInput>(req);
    const params = getValidatedParams<PermissionActionParamsInput>(req);

    const data = await permissionActionService.update(requireUserId(req), params.id, body);

    res.status(200).json({
      message: "Permission action updated successfully",
      data,
    });
  },

  async delete(req: Request, res: Response) {
    const params = getValidatedParams<PermissionActionParamsInput>(req);

    await permissionActionService.delete(requireUserId(req), params.id);

    res.status(200).json({
      message: "Permission action deleted successfully",
    });
  },
};
