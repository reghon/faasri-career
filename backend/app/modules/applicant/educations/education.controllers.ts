import { Request, Response } from "express";
import { requireUserId } from "../../../utils/request-user.util";
import { getValidatedBody, getValidatedParams } from "../../../utils/validated-request.util";
import { EducationBodyInput, EducationParamsInput } from "./education.schemas";
import { educationService } from "./education.services";

export const educationController = {
  async getAll(req: Request, res: Response) {
    const data = await educationService.getAll(requireUserId(req));

    res.status(200).json({
      message: "Success",
      data,
    });
  },

  async create(req: Request, res: Response) {
    const body = getValidatedBody<EducationBodyInput>(req);

    const data = await educationService.create(requireUserId(req), body);

    res.status(201).json({
      message: "Education created successfully",
      data,
    });
  },

  async update(req: Request, res: Response) {
    const body = getValidatedBody<EducationBodyInput>(req);
    const params = getValidatedParams<EducationParamsInput>(req);

    const data = await educationService.update(requireUserId(req), params.id, body);

    res.status(200).json({
      message: "Education updated successfully",
      data,
    });
  },

  async delete(req: Request, res: Response) {
    const params = getValidatedParams<EducationParamsInput>(req);

    await educationService.delete(requireUserId(req), params.id);

    res.status(200).json({
      message: "Education deleted successfully",
    });
  },
};
