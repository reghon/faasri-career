import { Request, Response } from "express";
import { requireUserId } from "../../../utils/request-user.util";
import { getValidatedBody, getValidatedParams } from "../../../utils/validated-request.util";
import { managementProfileService } from "./management_profile.services";
import { UpdateMyManagementProfileInput, ManagementProfileBodyInput, ManagementProfileParamsInput } from "./management_profile.schemas";

export const managementProfileController = {
  async getAll(_req: Request, res: Response) {
    const data = await managementProfileService.getAll();

    res.status(200).json({
      message: "Success",
      data,
    });
  },

  async getMe(req: Request, res: Response) {
    const userId = requireUserId(req);

    const data = await managementProfileService.getMe(userId);

    res.status(200).json({
      message: "Success",
      data,
    });
  },

  async updateMe(req: Request, res: Response) {
    const userId = requireUserId(req);

    const body = getValidatedBody<UpdateMyManagementProfileInput>(req);

    const data = await managementProfileService.updateMe(userId, body.fullName);

    res.status(200).json({
      message: "Profile updated successfully",
      data,
    });
  },

  async getById(req: Request, res: Response) {
    const params = getValidatedParams<ManagementProfileParamsInput>(req);

    const data = await managementProfileService.getById(params.id);

    res.status(200).json({
      message: "Success",
      data,
    });
  },

  async create(req: Request, res: Response) {
    const body = getValidatedBody<ManagementProfileBodyInput>(req);

    const data = await managementProfileService.create(body, requireUserId(req));

    res.status(201).json({
      message: "Management profile created successfully",
      data,
    });
  },

  async update(req: Request, res: Response) {
    const params = getValidatedParams<ManagementProfileParamsInput>(req);
    const body = getValidatedBody<ManagementProfileBodyInput>(req);

    const data = await managementProfileService.update(params.id, body, requireUserId(req));

    res.status(200).json({
      message: "Management profile updated successfully",
      data,
    });
  },

  async delete(req: Request, res: Response) {
    const params = getValidatedParams<ManagementProfileParamsInput>(req);

    const data = await managementProfileService.delete(params.id, requireUserId(req));

    res.status(200).json({
      message: "Management profile deleted successfully",
      data,
    });
  },
};
