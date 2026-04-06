import { Request, Response } from "express";
import { requireUserId } from "../../../../utils/request-user.util";
import { getValidatedBody, getValidatedParams } from "../../../../utils/validated-request.util";
import { workModeService } from "./work_mode.services";
import { WorkModeBodyInput, WorkModeParamsInput } from "./work_mode.schemas";

export const workModeController = {
  async getAll(_req: Request, res: Response) {
    const data = await workModeService.getAll();

    res.status(200).json({
      message: "Success",
      data,
    });
  },

  async getById(req: Request, res: Response) {
    const params = getValidatedParams<WorkModeParamsInput>(req);

    const data = await workModeService.getById(params.id);

    res.status(200).json({
      message: "Success",
      data,
    });
  },

  async create(req: Request, res: Response) {
    const body = getValidatedBody<WorkModeBodyInput>(req);

    const data = await workModeService.create(body, requireUserId(req));

    res.status(201).json({
      message: "Work mode created successfully",
      data,
    });
  },

  async update(req: Request, res: Response) {
    const params = getValidatedParams<WorkModeParamsInput>(req);
    const body = getValidatedBody<WorkModeBodyInput>(req);

    const data = await workModeService.update(params.id, body, requireUserId(req));

    res.status(200).json({
      message: "Work mode updated successfully",
      data,
    });
  },

  async delete(req: Request, res: Response) {
    const params = getValidatedParams<WorkModeParamsInput>(req);

    const data = await workModeService.delete(params.id, requireUserId(req));

    res.status(200).json({
      message: "Work mode deleted successfully",
      data,
    });
  },
};
