import { Request, Response } from "express";
import { requireUserId } from "../../../../utils/request-user.util";
import { getValidatedBody, getValidatedParams } from "../../../../utils/validated-request.util";
import { jobStatusService } from "./job_status.services";
import { JobStatusBodyInput, JobStatusParamsInput } from "./job_status.schemas";

export const jobStatusController = {
  async getAll(_req: Request, res: Response) {
    const data = await jobStatusService.getAll();

    res.status(200).json({
      message: "Success",
      data,
    });
  },

  async getById(req: Request, res: Response) {
    const params = getValidatedParams<JobStatusParamsInput>(req);

    const data = await jobStatusService.getById(params.id);

    res.status(200).json({
      message: "Success",
      data,
    });
  },

  async create(req: Request, res: Response) {
    const body = getValidatedBody<JobStatusBodyInput>(req);

    const data = await jobStatusService.create(body, requireUserId(req));

    res.status(201).json({
      message: "Job status created successfully",
      data,
    });
  },

  async update(req: Request, res: Response) {
    const params = getValidatedParams<JobStatusParamsInput>(req);
    const body = getValidatedBody<JobStatusBodyInput>(req);

    const data = await jobStatusService.update(params.id, body, requireUserId(req));

    res.status(200).json({
      message: "Job status updated successfully",
      data,
    });
  },

  async delete(req: Request, res: Response) {
    const params = getValidatedParams<JobStatusParamsInput>(req);

    const data = await jobStatusService.delete(params.id, requireUserId(req));

    res.status(200).json({
      message: "Job status deleted successfully",
      data,
    });
  },
};
