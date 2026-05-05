import { Request, Response } from "express";
import { requireUserId } from "../../../utils/request-user.util";
import { getValidatedBody, getValidatedParams } from "../../../utils/validated-request.util";
import { applyStatusHistoryService } from "./apply_status_history.services";
import { ApplyStatusHistoryApplyParamsInput, ApplyStatusHistoryBodyInput, ApplyStatusHistoryParamsInput, ApplyStatusHistoryUpdateBodyInput } from "./apply_status_history.schemas";

export const applyStatusHistoryController = {
  async getAll(_req: Request, res: Response) {
    const data = await applyStatusHistoryService.getAll();

    res.status(200).json({
      message: "Success",
      data,
    });
  },

  async getById(req: Request, res: Response) {
    const params = getValidatedParams<ApplyStatusHistoryParamsInput>(req);

    const data = await applyStatusHistoryService.getById(params.id);

    res.status(200).json({
      message: "Success",
      data,
    });
  },

  async getByApplyId(req: Request, res: Response) {
    const params = getValidatedParams<ApplyStatusHistoryApplyParamsInput>(req);

    const data = await applyStatusHistoryService.getByApplyId(params.applyId);

    res.status(200).json({
      message: "Success",
      data,
    });
  },

  async create(req: Request, res: Response) {
    const body = getValidatedBody<ApplyStatusHistoryBodyInput>(req);

    const data = await applyStatusHistoryService.create(body, requireUserId(req));

    res.status(201).json({
      message: "Apply status history created successfully",
      data,
    });
  },

  async update(req: Request, res: Response) {
    const params = getValidatedParams<ApplyStatusHistoryParamsInput>(req);
    const body = getValidatedBody<ApplyStatusHistoryUpdateBodyInput>(req);

    const data = await applyStatusHistoryService.update(params.id, body, requireUserId(req));

    res.status(200).json({
      message: "Apply status history updated successfully",
      data,
    });
  },

  async delete(req: Request, res: Response) {
    const params = getValidatedParams<ApplyStatusHistoryParamsInput>(req);

    const data = await applyStatusHistoryService.delete(params.id, requireUserId(req));

    res.status(200).json({
      message: "Apply status history deleted successfully",
      data,
    });
  },
};
