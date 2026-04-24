import { Request, Response } from "express";
import { requireUserId } from "../../../utils/request-user.util";
import { getValidatedBody, getValidatedParams } from "../../../utils/validated-request.util";
import { PermissionBodyInput, PermissionParamsInput } from "./permission.schemas";
import { permissionService } from "./permission.services";

export const permissionController = {
  async getAll(req: Request, res: Response) {
    const data = await permissionService.getAll();

    res.status(200).json({
      message: "Success",
      data,
    });
  },

  async create(req: Request, res: Response) {
    const body = getValidatedBody<PermissionBodyInput>(req);

    const data = await permissionService.create(requireUserId(req), body);

    res.status(201).json({
      message: "Permission created successfully",
      data,
    });
  },

  async update(req: Request, res: Response) {
    const body = getValidatedBody<PermissionBodyInput>(req);
    const params = getValidatedParams<PermissionParamsInput>(req);

    const data = await permissionService.update(requireUserId(req), params.id, body);

    res.status(200).json({
      message: "Permission updated successfully",
      data,
    });
  },

  async delete(req: Request, res: Response) {
    const params = getValidatedParams<PermissionParamsInput>(req);

    await permissionService.delete(requireUserId(req), params.id);

    res.status(200).json({
      message: "Permission deleted successfully",
    });
  },
};
