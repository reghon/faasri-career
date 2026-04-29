import { Request, Response } from "express";
import { requireUserId } from "../../../../utils/request-user.util";
import { getValidatedBody, getValidatedParams } from "../../../../utils/validated-request.util";
import { JobApplyStatusBodyInput, JobApplyStatusJobParamsInput, JobApplyStatusParamsInput, JobApplyStatusUpdateBodyInput, JobApplyStatusSyncBodyInput } from "./job_apply_status.schemas";
import { jobApplyStatusService } from "./job_apply_status.services";

export const jobApplyStatusController = {
  async getAll(_req: Request, res: Response) {
    const data = await jobApplyStatusService.getAll();

    res.status(200).json({
      message: "Success",
      data,
    });
  },

  async getByJobId(req: Request, res: Response) {
    const params = getValidatedParams<JobApplyStatusJobParamsInput>(req);

    const data = await jobApplyStatusService.getByJobId(params.jobId);

    res.status(200).json({
      message: "Success",
      data,
    });
  },

  async getById(req: Request, res: Response) {
    const params = getValidatedParams<JobApplyStatusParamsInput>(req);

    const data = await jobApplyStatusService.getById(params.id);

    res.status(200).json({
      message: "Success",
      data,
    });
  },

  async create(req: Request, res: Response) {
    const body = getValidatedBody<JobApplyStatusBodyInput>(req);

    const data = await jobApplyStatusService.create(body, requireUserId(req));

    res.status(201).json({
      message: "Job apply status created successfully",
      data,
    });
  },

  async update(req: Request, res: Response) {
    const params = getValidatedParams<JobApplyStatusParamsInput>(req);
    const body = getValidatedBody<JobApplyStatusUpdateBodyInput>(req);

    const data = await jobApplyStatusService.update(params.id, body, requireUserId(req));

    res.status(200).json({
      message: "Job apply status updated successfully",
      data,
    });
  },

  async delete(req: Request, res: Response) {
    const params = getValidatedParams<JobApplyStatusParamsInput>(req);

    const data = await jobApplyStatusService.delete(params.id, requireUserId(req));

    res.status(200).json({
      message: "Job apply status deleted successfully",
      data,
    });
  },

  async getEditGuardByJobId(req: Request, res: Response) {
    const params = getValidatedParams<JobApplyStatusJobParamsInput>(req);

    const data = await jobApplyStatusService.getEditGuardByJobId(params.jobId);

    res.status(200).json({
      message: "Success",
      data,
    });
  },

  async syncByJobId(req: Request, res: Response) {
    const params = getValidatedParams<JobApplyStatusJobParamsInput>(req);
    const body = getValidatedBody<JobApplyStatusSyncBodyInput>(req);

    const data = await jobApplyStatusService.syncByJobId(params.jobId, body, requireUserId(req));

    res.status(200).json({
      message: "Job apply status flow synced successfully",
      data,
    });
  },
};
