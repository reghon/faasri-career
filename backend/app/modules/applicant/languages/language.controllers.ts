import { Request, Response } from "express";
import { requireUserId } from "../../../utils/request-user.util";
import { getValidatedBody, getValidatedParams } from "../../../utils/validated-request.util";
import { LanguageBodyInput, LanguageParamsInput } from "./language.schemas";
import { languageService } from "./language.services";

export const languageController = {
  async getAll(req: Request, res: Response) {
    const data = await languageService.getAll(requireUserId(req));

    res.status(200).json({
      message: "Success",
      data,
    });
  },

  async create(req: Request, res: Response) {
    const body = getValidatedBody<LanguageBodyInput>(req);

    const data = await languageService.create(requireUserId(req), body);

    res.status(201).json({
      message: "Language created successfully",
      data,
    });
  },

  async update(req: Request, res: Response) {
    const body = getValidatedBody<LanguageBodyInput>(req);
    const params = getValidatedParams<LanguageParamsInput>(req);

    const data = await languageService.update(requireUserId(req), params.id, body);

    res.status(200).json({
      message: "Language updated successfully",
      data,
    });
  },

  async delete(req: Request, res: Response) {
    const params = getValidatedParams<LanguageParamsInput>(req);

    await languageService.delete(requireUserId(req), params.id);

    res.status(200).json({
      message: "Language deleted successfully",
    });
  },
};
