import { Request, Response } from "express";
import { requireUserEmail } from "../../../utils/request-user.util";
import { getValidatedBody, getValidatedParams } from "../../../utils/validated-request.util";
import { applyStatusService } from "./apply_status.services";
import { ApplyStatusBodyInput, ApplyStatusParamsInput } from "./apply_status.schemas";

export const applyStatusController = {
  async getAll(_req: Request, res: Response) {
    const data = await applyStatusService.getAll();

    res.status(200).json({
      message: "Success",
      data,
    });
  },

  async getAllDeleted(_req: Request, res: Response) {
    const data = await applyStatusService.getAllDeleted();

    res.status(200).json({
      message: "Success",
      data,
    });
  },

  async getById(req: Request, res: Response) {
    const params = getValidatedParams<ApplyStatusParamsInput>(req);

    const data = await applyStatusService.getById(params.id);

    res.status(200).json({
      message: "Success",
      data,
    });
  },

  async create(req: Request, res: Response) {
    const body = getValidatedBody<ApplyStatusBodyInput>(req);

    const data = await applyStatusService.create(body, requireUserEmail(req));

    res.status(201).json({
      message: "Apply status created successfully",
      data,
    });
  },

  async update(req: Request, res: Response) {
    const params = getValidatedParams<ApplyStatusParamsInput>(req);
    const body = getValidatedBody<ApplyStatusBodyInput>(req);

    const data = await applyStatusService.update(params.id, body, requireUserEmail(req));

    res.status(200).json({
      message: "Apply status updated successfully",
      data,
    });
  },

  async delete(req: Request, res: Response) {
    const params = getValidatedParams<ApplyStatusParamsInput>(req);

    const data = await applyStatusService.delete(params.id, requireUserEmail(req));

    res.status(200).json({
      message: "Apply status deleted successfully",
      data,
    });
  },

  async permanentDelete(req: Request, res: Response) {
    const params = getValidatedParams<ApplyStatusParamsInput>(req);

    const data = await applyStatusService.permanentDelete(params.id);

    res.status(200).json({
      message: "Apply status permanently deleted successfully",
      data,
    });
  },

  async restore(req: Request, res: Response) {
    const params = getValidatedParams<ApplyStatusParamsInput>(req);

    const data = await applyStatusService.restore(params.id, requireUserEmail(req));

    res.status(200).json({
      message: "Apply status restored successfully",
      data,
    });
  },
};
