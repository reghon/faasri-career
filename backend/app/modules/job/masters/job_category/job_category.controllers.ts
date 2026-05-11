import { Request, Response } from "express";
import { requireUserEmail } from "../../../../utils/request-user.util";
import { getValidatedBody, getValidatedParams } from "../../../../utils/validated-request.util";
import { jobCategoryService } from "./job_category.services";
import { JobCategoryBodyInput, JobCategoryParamsInput } from "./job_category.schemas";

export const jobCategoryController = {
  async getAll(_req: Request, res: Response) {
    const data = await jobCategoryService.getAll();

    res.status(200).json({
      message: "Success",
      data,
    });
  },

  async getAllDeleted(_req: Request, res: Response) {
    const data = await jobCategoryService.getAllDeleted();

    res.status(200).json({
      message: "Success",
      data,
    });
  },

  async getById(req: Request, res: Response) {
    const params = getValidatedParams<JobCategoryParamsInput>(req);

    const data = await jobCategoryService.getById(params.id);

    res.status(200).json({
      message: "Success",
      data,
    });
  },

  async create(req: Request, res: Response) {
    const body = getValidatedBody<JobCategoryBodyInput>(req);

    const data = await jobCategoryService.create(body, requireUserEmail(req));

    res.status(201).json({
      message: "Job category created successfully",
      data,
    });
  },

  async update(req: Request, res: Response) {
    const params = getValidatedParams<JobCategoryParamsInput>(req);
    const body = getValidatedBody<JobCategoryBodyInput>(req);

    const data = await jobCategoryService.update(params.id, body, requireUserEmail(req));

    res.status(200).json({
      message: "Job category updated successfully",
      data,
    });
  },

  async softDelete(req: Request, res: Response) {
    const params = getValidatedParams<JobCategoryParamsInput>(req);

    const data = await jobCategoryService.softDelete(params.id, requireUserEmail(req));

    res.status(200).json({
      message: "Job category deleted successfully",
      data,
    });
  },

  async hardDelete(req: Request, res: Response) {
    const params = getValidatedParams<JobCategoryParamsInput>(req);

    const data = await jobCategoryService.hardDelete(params.id);

    res.status(200).json({
      message: "Job category permanently deleted successfully",
      data,
    });
  },

  async restore(req: Request, res: Response) {
    const params = getValidatedParams<JobCategoryParamsInput>(req);

    const data = await jobCategoryService.restore(params.id, requireUserEmail(req));

    res.status(200).json({
      message: "Job category restored successfully",
      data,
    });
  },
};
