import { Request, Response } from "express";
import { requireUserId } from "../../../utils/request-user.util";
import { getValidatedBody, getValidatedParams } from "../../../utils/validated-request.util";
import { WorkExperienceBodyInput, WorkExperienceParamsInput } from "./work_experience.schemas";
import { workExperienceService } from "./work_experience.services";

export const workExperienceController = {
  async getAll(req: Request, res: Response) {
    const data = await workExperienceService.getAll(requireUserId(req));

    res.status(200).json({
      message: "Success",
      data,
    });
  },

  async create(req: Request, res: Response) {
    const body = getValidatedBody<WorkExperienceBodyInput>(req);

    const data = await workExperienceService.create(requireUserId(req), body);

    res.status(201).json({
      message: "Work experience created successfully",
      data,
    });
  },

  async update(req: Request, res: Response) {
    const body = getValidatedBody<WorkExperienceBodyInput>(req);
    const params = getValidatedParams<WorkExperienceParamsInput>(req);

    const data = await workExperienceService.update(requireUserId(req), params.id, body);

    res.status(200).json({
      message: "Work experience updated successfully",
      data,
    });
  },

  async delete(req: Request, res: Response) {
    const params = getValidatedParams<WorkExperienceParamsInput>(req);

    await workExperienceService.delete(requireUserId(req), params.id);

    res.status(200).json({
      message: "Work experience deleted successfully",
    });
  },
};
