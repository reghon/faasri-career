import { Request, Response } from "express";
import { requireUserId } from "../../../utils/request-user.util";
import { getValidatedBody, getValidatedParams } from "../../../utils/validated-request.util";
import { ModuleBodyInput, ModuleParamsInput } from "./module.schemas";
import { moduleService } from "./module.services";

export const moduleController = {
  async getAll(req: Request, res: Response) {
    const data = await moduleService.getAll();

    res.status(200).json({
      message: "Success",
      data,
    });
  },

  async create(req: Request, res: Response) {
    const body = getValidatedBody<ModuleBodyInput>(req);

    const data = await moduleService.create(requireUserId(req), body);

    res.status(201).json({
      message: "Module created successfully",
      data,
    });
  },

  async update(req: Request, res: Response) {
    const body = getValidatedBody<ModuleBodyInput>(req);
    const params = getValidatedParams<ModuleParamsInput>(req);

    const data = await moduleService.update(requireUserId(req), params.id, body);

    res.status(200).json({
      message: "Module updated successfully",
      data,
    });
  },

  async delete(req: Request, res: Response) {
    const params = getValidatedParams<ModuleParamsInput>(req);

    await moduleService.delete(requireUserId(req), params.id);

    res.status(200).json({
      message: "Module deleted successfully",
    });
  },
};
