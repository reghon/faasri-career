import { Request, Response } from "express";
import { requireUserEmail } from "../../../../utils/request-user.util";
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

  async getAllDeleted(_req: Request, res: Response) {
    const data = await workModeService.getAllDeleted();

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

    const data = await workModeService.create(body, requireUserEmail(req));

    res.status(201).json({
      message: "Work mode created successfully",
      data,
    });
  },

  async update(req: Request, res: Response) {
    const params = getValidatedParams<WorkModeParamsInput>(req);
    const body = getValidatedBody<WorkModeBodyInput>(req);

    const data = await workModeService.update(params.id, body, requireUserEmail(req));

    res.status(200).json({
      message: "Work mode updated successfully",
      data,
    });
  },

  async softDelete(req: Request, res: Response) {
    const params = getValidatedParams<WorkModeParamsInput>(req);

    const data = await workModeService.softDelete(params.id, requireUserEmail(req));

    res.status(200).json({
      message: "Work mode deleted successfully",
      data,
    });
  },

  async hardDelete(req: Request, res: Response) {
    const params = getValidatedParams<WorkModeParamsInput>(req);

    const data = await workModeService.hardDelete(params.id, requireUserEmail(req));

    res.status(200).json({
      message: "Work mode permanently deleted successfully",
      data,
    });
  },

  async restore(req: Request, res: Response) {
    const params = getValidatedParams<WorkModeParamsInput>(req);

    const data = await workModeService.restore(params.id, requireUserEmail(req));

    res.status(200).json({
      message: "Work mode restored successfully",
      data,
    });
  },
};
