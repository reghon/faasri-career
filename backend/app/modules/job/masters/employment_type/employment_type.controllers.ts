import { Request, Response } from "express";
import { requireUserId } from "../../../../utils/request-user.util";
import { getValidatedBody, getValidatedParams } from "../../../../utils/validated-request.util";
import { employmentTypeService } from "./employment_type.services";
import { EmploymentTypeBodyInput, EmploymentTypeParamsInput } from "./employment_type.schemas";

export const employmentTypeController = {
  async getAll(_req: Request, res: Response) {
    const data = await employmentTypeService.getAll();

    res.status(200).json({
      message: "Success",
      data,
    });
  },

  async getById(req: Request, res: Response) {
    const params = getValidatedParams<EmploymentTypeParamsInput>(req);

    const data = await employmentTypeService.getById(params.id);

    res.status(200).json({
      message: "Success",
      data,
    });
  },

  async create(req: Request, res: Response) {
    const body = getValidatedBody<EmploymentTypeBodyInput>(req);

    const data = await employmentTypeService.create(body, requireUserId(req));

    res.status(201).json({
      message: "Employment type created successfully",
      data,
    });
  },

  async update(req: Request, res: Response) {
    const params = getValidatedParams<EmploymentTypeParamsInput>(req);
    const body = getValidatedBody<EmploymentTypeBodyInput>(req);

    const data = await employmentTypeService.update(params.id, body, requireUserId(req));

    res.status(200).json({
      message: "Employment type updated successfully",
      data,
    });
  },

  async delete(req: Request, res: Response) {
    const params = getValidatedParams<EmploymentTypeParamsInput>(req);

    const data = await employmentTypeService.delete(params.id, requireUserId(req));

    res.status(200).json({
      message: "Employment type deleted successfully",
      data,
    });
  },
};
