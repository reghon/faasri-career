import { Request, Response } from "express";
import { requireUserId } from "../../../utils/request-user.util";
import { getValidatedBody, getValidatedParams } from "../../../utils/validated-request.util";
import { TechnicalSkillBodyInput, TechnicalSkillParamsInput } from "./technical_skill.schemas";
import { technicalSkillService } from "./technical_skill.services";

export const technicalSkillController = {
  async getAll(req: Request, res: Response) {
    const data = await technicalSkillService.getAll(requireUserId(req));

    res.status(200).json({
      message: "Success",
      data,
    });
  },

  async create(req: Request, res: Response) {
    const body = getValidatedBody<TechnicalSkillBodyInput>(req);

    const data = await technicalSkillService.create(requireUserId(req), body);

    res.status(201).json({
      message: "Technical skill created successfully",
      data,
    });
  },

  async delete(req: Request, res: Response) {
    const params = getValidatedParams<TechnicalSkillParamsInput>(req);

    await technicalSkillService.delete(requireUserId(req), params.id);

    res.status(200).json({
      message: "Technical skill deleted successfully",
    });
  },
};
