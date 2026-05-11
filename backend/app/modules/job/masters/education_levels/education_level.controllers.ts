import { Request, Response } from "express";
import { requireUserEmail, requireUserId } from "../../../../utils/request-user.util";
import { getValidatedBody, getValidatedParams } from "../../../../utils/validated-request.util";
import { educationLevelService } from "./education_level.services";
import { EducationLevelBodyInput, EducationLevelParamsInput } from "./education_level.schemas";

export const educationLevelController = {
  async getAll(_req: Request, res: Response) {
    const data = await educationLevelService.getAll();

    res.status(200).json({
      message: "Success",
      data,
    });
  },

  async getAllDeleted(_req: Request, res: Response) {
    const data = await educationLevelService.getAllDeleted();

    res.status(200).json({
      message: "Success",
      data,
    });
  },

  async getById(req: Request, res: Response) {
    const params = getValidatedParams<EducationLevelParamsInput>(req);

    const data = await educationLevelService.getById(params.id);

    res.status(200).json({
      message: "Success",
      data,
    });
  },

  async create(req: Request, res: Response) {
    const body = getValidatedBody<EducationLevelBodyInput>(req);

    const data = await educationLevelService.create(body, requireUserEmail(req));

    res.status(201).json({
      message: "Education level created successfully",
      data,
    });
  },

  async update(req: Request, res: Response) {
    const params = getValidatedParams<EducationLevelParamsInput>(req);
    const body = getValidatedBody<EducationLevelBodyInput>(req);

    const data = await educationLevelService.update(params.id, body, requireUserEmail(req));

    res.status(200).json({
      message: "Education level updated successfully",
      data,
    });
  },

  async softDelete(req: Request, res: Response) {
    const params = getValidatedParams<EducationLevelParamsInput>(req);

    const data = await educationLevelService.softDelete(params.id, requireUserEmail(req));

    res.status(200).json({
      message: "Education level deleted successfully",
      data,
    });
  },

  async hardDelete(req: Request, res: Response) {
    const params = getValidatedParams<EducationLevelParamsInput>(req);

    const data = await educationLevelService.hardDelete(params.id);

    res.status(200).json({
      message: "Education level permanently deleted successfully",
      data,
    });
  },

  async restore(req: Request, res: Response) {
    const params = getValidatedParams<EducationLevelParamsInput>(req);

    const data = await educationLevelService.restore(params.id, requireUserEmail(req));

    res.status(200).json({
      message: "Education level restored successfully",
      data,
    });
  },
};
