import { Request, Response } from "express";
import { requireUserId } from "../../../../utils/request-user.util";
import { getValidatedBody, getValidatedParams } from "../../../../utils/validated-request.util";
import { jobLocationService } from "./job_location.services";
import { JobLocationBodyInput, JobLocationParamsInput } from "./job_location.schemas";

export const jobLocationController = {
  async getAll(_req: Request, res: Response) {
    const data = await jobLocationService.getAll();

    res.status(200).json({
      message: "Success",
      data,
    });
  },

  async getById(req: Request, res: Response) {
    const params = getValidatedParams<JobLocationParamsInput>(req);

    const data = await jobLocationService.getById(params.id);

    res.status(200).json({
      message: "Success",
      data,
    });
  },

  async create(req: Request, res: Response) {
    const body = getValidatedBody<JobLocationBodyInput>(req);

    const data = await jobLocationService.create(body, requireUserId(req));

    res.status(201).json({
      message: "Job location created successfully",
      data,
    });
  },

  async update(req: Request, res: Response) {
    const params = getValidatedParams<JobLocationParamsInput>(req);
    const body = getValidatedBody<JobLocationBodyInput>(req);

    const data = await jobLocationService.update(params.id, body, requireUserId(req));

    res.status(200).json({
      message: "Job location updated successfully",
      data,
    });
  },

  async delete(req: Request, res: Response) {
    const params = getValidatedParams<JobLocationParamsInput>(req);

    const data = await jobLocationService.delete(params.id, requireUserId(req));

    res.status(200).json({
      message: "Job location deleted successfully",
      data,
    });
  },
};
