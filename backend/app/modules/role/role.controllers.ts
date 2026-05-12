import { Request, Response } from "express";
import { requireUserId } from "../../utils/request-user.util";
import { getValidatedBody, getValidatedParams } from "../../utils/validated-request.util";
import { roleService } from "./role.services";
import { RoleBodyInput, RoleParamsInput } from "./role.schemas";

export const roleController = {
  async getAll(_req: Request, res: Response) {
    const data = await roleService.getAll();

    res.status(200).json({
      message: "Success",
      data,
    });
  },


  async getAllDeleted(_req: Request, res: Response) {
    const data = await roleService.getAllDeleted();

    res.status(200).json({
      message: "Success",
      data,
    });
  },

  async getById(req: Request, res: Response) {
    const params = getValidatedParams<RoleParamsInput>(req);

    const data = await roleService.getById(params.id);

    res.status(200).json({
      message: "Success",
      data,
    });
  },

  async create(req: Request, res: Response) {
    const body = getValidatedBody<RoleBodyInput>(req);

    const data = await roleService.create(body, requireUserId(req));

    res.status(201).json({
      message: "Role created successfully",
      data,
    });
  },

  async update(req: Request, res: Response) {
    const params = getValidatedParams<RoleParamsInput>(req);
    const body = getValidatedBody<RoleBodyInput>(req);

    const data = await roleService.update(params.id, body, requireUserId(req));

    res.status(200).json({
      message: "Role updated successfully",
      data,
    });
  },

  async restore(req: Request, res: Response) {
    const params = getValidatedParams<RoleParamsInput>(req);

    const data = await roleService.restore(params.id, requireUserId(req));

    res.status(200).json({
      message: "Role restored successfully",
      data,
    });
  },

  async softDelete(req: Request, res: Response) {
    const params = getValidatedParams<RoleParamsInput>(req);

    const data = await roleService.softDelete(params.id, requireUserId(req));

    res.status(200).json({
      message: "Role deleted successfully",
      data,
    });
  },

  async hardDelete(req: Request, res: Response) {
    const params = getValidatedParams<RoleParamsInput>(req);

    const data = await roleService.hardDelete(params.id);

    res.status(200).json({
      message: "Role deleted successfully",
      data,
    });
  },
};
