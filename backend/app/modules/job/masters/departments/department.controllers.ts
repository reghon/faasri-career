import { Request, Response } from "express";
import { requireUserId } from "../../../../utils/request-user.util";
import { getValidatedBody, getValidatedParams } from "../../../../utils/validated-request.util";
import { departmentService } from "./department.services";
import { DepartmentBodyInput, DepartmentParamsInput } from "./department.schemas";

export const departmentController = {
  async getAll(_req: Request, res: Response) {
    const data = await departmentService.getAll();

    res.status(200).json({
      message: "Success",
      data,
    });
  },

  async getById(req: Request, res: Response) {
    const params = getValidatedParams<DepartmentParamsInput>(req);

    const data = await departmentService.getById(params.id);

    res.status(200).json({
      message: "Success",
      data,
    });
  },

  async create(req: Request, res: Response) {
    const body = getValidatedBody<DepartmentBodyInput>(req);

    const data = await departmentService.create(body, requireUserId(req));

    res.status(201).json({
      message: "Education level created successfully",
      data,
    });
  },

  async update(req: Request, res: Response) {
    const params = getValidatedParams<DepartmentParamsInput>(req);
    const body = getValidatedBody<DepartmentBodyInput>(req);

    const data = await departmentService.update(params.id, body, requireUserId(req));

    res.status(200).json({
      message: "Education level updated successfully",
      data,
    });
  },

  async delete(req: Request, res: Response) {
    const params = getValidatedParams<DepartmentParamsInput>(req);

    const data = await departmentService.delete(params.id, requireUserId(req));

    res.status(200).json({
      message: "Education level deleted successfully",
      data,
    });
  },
};
