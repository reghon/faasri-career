import { Request, Response } from "express";
import { requireUserEmail } from "../../utils/request-user.util";
import { getValidatedBody, getValidatedParams, getValidatedQuery } from "../../utils/validated-request.util";
import { jobService } from "./job.services";
import { JobBodyInput, JobParamsInput, JobQueryInput, JobSlugParamsInput, JobStatusBodyInput } from "./job.schemas";

export const jobController = {
  async getAll(req: Request, res: Response) {
    const query = getValidatedQuery<JobQueryInput>(req);

    const jobs = await jobService.getAll(query.page, query.limit, {
      search: query.search,
      status: query.status,
      department: query.department,
      location: query.location,
    });

    res.status(200).json({
      message: "Success",
      data: jobs,
    });
  },

  async getAllOpenJobs(req: Request, res: Response) {
    const query = getValidatedQuery<JobQueryInput>(req);

    const jobs = await jobService.getAllOpenJobs(query.page, query.limit);

    res.status(200).json({
      message: "Success",
      data: jobs,
    });
  },

  async getById(req: Request, res: Response) {
    const params = getValidatedParams<JobParamsInput>(req);

    const job = await jobService.getById(params.id);

    res.status(200).json({
      message: "Success",
      data: job,
    });
  },

  async getBySlug(req: Request, res: Response) {
    const params = getValidatedParams<JobSlugParamsInput>(req);

    const job = await jobService.getBySlug(params.slug);

    res.status(200).json({
      message: "Success",
      data: job,
    });
  },

  async create(req: Request, res: Response) {
    const body = getValidatedBody<JobBodyInput>(req);

    const job = await jobService.create(body, requireUserEmail(req));

    res.status(201).json({
      message: "Job created successfully",
      data: job,
    });
  },

  async update(req: Request, res: Response) {
    const params = getValidatedParams<JobParamsInput>(req);
    const body = getValidatedBody<JobBodyInput>(req);

    const job = await jobService.update(params.id, body, requireUserEmail(req));

    res.status(200).json({
      message: "Job updated successfully",
      data: job,
    });
  },

  async delete(req: Request, res: Response) {
    const params = getValidatedParams<JobParamsInput>(req);

    const job = await jobService.delete(params.id, requireUserEmail(req));

    res.status(200).json({
      message: "Job deleted successfully",
      data: job,
    });
  },

  async updateStatus(req: Request, res: Response) {
    const params = getValidatedParams<JobParamsInput>(req);
    const body = getValidatedBody<JobStatusBodyInput>(req);

    const job = await jobService.updateStatus(params.id, body.statusId, requireUserEmail(req));

    res.status(200).json({
      message: "Job status updated successfully",
      data: job,
    });
  },
};
