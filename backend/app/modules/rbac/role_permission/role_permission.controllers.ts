import { Request, Response } from "express";
import { requireUserId } from "../../../utils/request-user.util";
import { getValidatedBody, getValidatedParams } from "../../../utils/validated-request.util";
import { RolePermissionBodyInput, RolePermissionParamsInput } from "./role_permission.schemas";
import { rolePermissionService } from "./role_permission.services";

export const rolePermissionController = {
  async getAll(req: Request, res: Response) {
    const data = await rolePermissionService.getAll();

    res.status(200).json({
      message: "Success",
      data,
    });
  },

  async create(req: Request, res: Response) {
    const body = getValidatedBody<RolePermissionBodyInput>(req);

    const data = await rolePermissionService.create(requireUserId(req), body);

    res.status(201).json({
      message: "Role permission created successfully",
      data,
    });
  },

  async update(req: Request, res: Response) {
    const body = getValidatedBody<RolePermissionBodyInput>(req);
    const params = getValidatedParams<RolePermissionParamsInput>(req);

    const data = await rolePermissionService.update(requireUserId(req), params.id, body);

    res.status(200).json({
      message: "Role permission updated successfully",
      data,
    });
  },

  async delete(req: Request, res: Response) {
    const params = getValidatedParams<RolePermissionParamsInput>(req);

    await rolePermissionService.delete(requireUserId(req), params.id);

    res.status(200).json({
      message: "Role permission deleted successfully",
    });
  },
};
