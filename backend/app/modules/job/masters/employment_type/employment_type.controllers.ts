import { Request, Response } from "express";
import { requireUserEmail } from "../../../../utils/request-user.util";
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

  async getAllDeleted(_req: Request, res: Response) {
    const data = await employmentTypeService.getAllDeleted();

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

    const data = await employmentTypeService.create(body, requireUserEmail(req));

    res.status(201).json({
      message: "Employment type created successfully",
      data,
    });
  },

  async update(req: Request, res: Response) {
    const params = getValidatedParams<EmploymentTypeParamsInput>(req);
    const body = getValidatedBody<EmploymentTypeBodyInput>(req);

    const data = await employmentTypeService.update(params.id, body, requireUserEmail(req));

    res.status(200).json({
      message: "Employment type updated successfully",
      data,
    });
  },

  async softDelete(req: Request, res: Response) {
    const params = getValidatedParams<EmploymentTypeParamsInput>(req);

    const data = await employmentTypeService.softDelete(params.id, requireUserEmail(req));

    res.status(200).json({
      message: "Employment type deleted successfully",
      data,
    });
  },

  async hardDelete(req: Request, res: Response) {
    const params = getValidatedParams<EmploymentTypeParamsInput>(req);

    const data = await employmentTypeService.hardDelete(params.id, requireUserEmail(req));

    res.status(200).json({
      message: "Employment type permanently deleted successfully",
      data,
    });
  },

  async restore(req: Request, res: Response) {
    const params = getValidatedParams<EmploymentTypeParamsInput>(req);

    const data = await employmentTypeService.restore(params.id, requireUserEmail(req));

    res.status(200).json({
      message: "Employment type restored successfully",
      data,
    });
  },
};
