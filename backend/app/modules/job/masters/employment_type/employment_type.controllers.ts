import { Request, Response } from "express";
import { requireUserId } from "../../../../utils/request-user.util";
import { getValidatedBody, getValidatedParams } from "../../../../utils/validated-request.util";
import { employmentTypeService } from "./employment_type.services";
import { EmploymentTypeBodyInput, EmploymentTypeParamsInput } from "./employment_type.schemas";

export const employmentTypeController = {
  async getAll(_req: Request, res: Response) {
    const employmentTypes = await employmentTypeService.getAll();

    res.status(200).json({
      message: "Success",
      data: employmentTypes,
    });
  },

  async getById(req: Request, res: Response) {
    const params = getValidatedParams<EmploymentTypeParamsInput>(req);

    const employmentType = await employmentTypeService.getById(params.id);

    res.status(200).json({
      message: "Success",
      data: employmentType,
    });
  },

  async create(req: Request, res: Response) {
    const body = getValidatedBody<EmploymentTypeBodyInput>(req);

    const employmentType = await employmentTypeService.create(body, requireUserId(req));

    res.status(201).json({
      message: "Employment type created successfully",
      data: employmentType,
    });
  },

  async update(req: Request, res: Response) {
    const params = getValidatedParams<EmploymentTypeParamsInput>(req);
    const body = getValidatedBody<EmploymentTypeBodyInput>(req);

    const employmentType = await employmentTypeService.update(params.id, body, requireUserId(req));

    res.status(200).json({
      message: "Employment type updated successfully",
      data: employmentType,
    });
  },

  async delete(req: Request, res: Response) {
    const params = getValidatedParams<EmploymentTypeParamsInput>(req);

    const employmentType = await employmentTypeService.delete(params.id, requireUserId(req));

    res.status(200).json({
      message: "Employment type deleted successfully",
      data: employmentType,
    });
  },
};
