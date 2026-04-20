import { Request, Response } from "express";
import { requireUserId } from "../../utils/request-user.util";
import { getValidatedBody, getValidatedParams } from "../../utils/validated-request.util";
import { UserBodyInput, UserParamsInput, UserUpdateBodyInput } from "./user.schemas";
import { userService } from "./user.services";

export const userController = {
  async getAll(_req: Request, res: Response) {
    const data = await userService.getAll();

    res.status(200).json({
      message: "Success",
      data,
    });
  },

  async getById(req: Request, res: Response) {
    const params = getValidatedParams<UserParamsInput>(req);

    const data = await userService.getById(params.id);

    res.status(200).json({
      message: "Success",
      data,
    });
  },

  async create(req: Request, res: Response) {
    const body = getValidatedBody<UserBodyInput>(req);
    const actorId = requireUserId(req);

    const data = await userService.create(body, actorId);

    res.status(201).json({
      message: "User created successfully",
      data,
    });
  },

  async update(req: Request, res: Response) {
    const params = getValidatedParams<UserParamsInput>(req);
    const body = getValidatedBody<UserUpdateBodyInput>(req);
    const actorId = requireUserId(req);

    const data = await userService.update(params.id, body, actorId);

    res.status(200).json({
      message: "User updated successfully",
      data,
    });
  },

  async delete(req: Request, res: Response) {
    const params = getValidatedParams<UserParamsInput>(req);
    const actorId = requireUserId(req);

    const data = await userService.delete(params.id, actorId);

    res.status(200).json({
      message: "User deleted successfully",
      data,
    });
  },
};
