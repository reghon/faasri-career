import { Request, Response } from "express";
import { requireUserEmail } from "../../../utils/request-user.util";
import { getValidatedBody, getValidatedParams } from "../../../utils/validated-request.util";
import { savedJobService } from "./saved_job.services";
import { SavedJobBodyInput, SavedJobParamsInput } from "./saved_job.schemas";

export const savedJobController = {
  async getAll(_req: Request, res: Response) {
    const data = await savedJobService.getAll();

    res.status(200).json({
      message: "Success",
      data,
    });
  },

  async getById(req: Request, res: Response) {
    const params = getValidatedParams<SavedJobParamsInput>(req);

    const data = await savedJobService.getById(params.id);

    res.status(200).json({
      message: "Success",
      data,
    });
  },

  async create(req: Request, res: Response) {
    const body = getValidatedBody<SavedJobBodyInput>(req);

    const data = await savedJobService.create(body, requireUserEmail(req));

    res.status(201).json({
      message: "Saved job created successfully",
      data,
    });
  },

  async update(req: Request, res: Response) {
    const params = getValidatedParams<SavedJobParamsInput>(req);
    const body = getValidatedBody<SavedJobBodyInput>(req);

    const data = await savedJobService.update(params.id, body, requireUserEmail(req));

    res.status(200).json({
      message: "Saved job updated successfully",
      data,
    });
  },

  async softDelete(req: Request, res: Response) {
    const params = getValidatedParams<SavedJobParamsInput>(req);

    const data = await savedJobService.softDelete(params.id, requireUserEmail(req));

    res.status(200).json({
      message: "Saved job deleted successfully",
      data,
    });
  },
};
