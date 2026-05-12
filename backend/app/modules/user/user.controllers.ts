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

  async getAllManagement(_req: Request, res: Response) {
    const data = await userService.getAllManagement();

    res.status(200).json({
      message: "Success",
      data,
    });
  },

  async getAllDeleted(_req: Request, res: Response) {
    const data = await userService.getAllDeleted();

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

  async restore(req: Request, res: Response) {
    const params = getValidatedParams<UserParamsInput>(req);
    const actorId = requireUserId(req);

    const data = await userService.restore(params.id, actorId);

    res.status(200).json({
      message: "User restored successfully",
      data,
    });
  },

  async softDelete(req: Request, res: Response) {
    const params = getValidatedParams<UserParamsInput>(req);
    const actorId = requireUserId(req);

    const data = await userService.softDelete(params.id, actorId);

    res.status(200).json({
      message: "User deleted successfully",
      data,
    });
  },

  async hardDelete(req: Request, res: Response) {
    const params = getValidatedParams<UserParamsInput>(req);

    const data = await userService.hardDelete(params.id);

    res.status(200).json({
      message: "User deleted permanently successfully",
      data,
    });
  },
};
