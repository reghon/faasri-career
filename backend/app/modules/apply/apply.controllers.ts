import { Request, Response } from "express";
import { requireUserId } from "../../utils/request-user.util";
import { getValidatedBody, getValidatedParams } from "../../utils/validated-request.util";
import { applyService } from "./apply.services";
import { ApplyJobParamsInput, ApplyParamsInput, CreateApplyBodyInput, UpdateApplyStatusBodyInput } from "./apply.schemas";

export const applyController = {
  async getAll(req: Request, res: Response) {
    const data = await applyService.getAll();

    res.status(200).json({
      message: "Apply list fetched successfully",
      data,
    });
  },
  
  async getMine(req: Request, res: Response) {
    const data = await applyService.getMine(requireUserId(req));

    res.status(200).json({
      message: "Apply list fetched successfully",
      data,
    });
  },

  async create(req: Request, res: Response) {
    const body = getValidatedBody<CreateApplyBodyInput>(req);

    const data = await applyService.createApply(requireUserId(req), body);

    res.status(201).json({
      message: "Apply submitted successfully",
      data,
    });
  },

  async updateStatus(req: Request, res: Response) {
    const body = getValidatedBody<UpdateApplyStatusBodyInput>(req);
    const params = getValidatedParams<ApplyParamsInput>(req);

    const data = await applyService.updateStatus(requireUserId(req), params.id, body);

    res.status(200).json({
      message: "Apply status updated successfully",
      data,
    });
  },

  async getByJobId(req: Request, res: Response) {
    const params = getValidatedParams<ApplyJobParamsInput>(req);

    const data = await applyService.getByJobId(params.jobId);

    res.status(200).json({
      message: "Apply list by job fetched successfully",
      data,
    });
  },
};
