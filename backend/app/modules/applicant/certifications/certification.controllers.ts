import { Request, Response } from "express";
import { requireUserId } from "../../../utils/request-user.util";
import { getValidatedBody, getValidatedParams } from "../../../utils/validated-request.util";
import { CertificationBodyInput, CertificationParamsInput } from "./certification.schemas";
import { certificationService } from "./certification.services";

export const certificationController = {
  async getAll(req: Request, res: Response) {
    const data = await certificationService.getAll(requireUserId(req));

    res.status(200).json({
      message: "Success",
      data,
    });
  },

  async create(req: Request, res: Response) {
    const body = getValidatedBody<CertificationBodyInput>(req);

    const data = await certificationService.create(requireUserId(req), body);

    res.status(201).json({
      message: "Certification created successfully",
      data,
    });
  },

  async update(req: Request, res: Response) {
    const body = getValidatedBody<CertificationBodyInput>(req);
    const params = getValidatedParams<CertificationParamsInput>(req);

    const data = await certificationService.update(requireUserId(req), params.id, body);

    res.status(200).json({
      message: "Certification updated successfully",
      data,
    });
  },

  async delete(req: Request, res: Response) {
    const params = getValidatedParams<CertificationParamsInput>(req);

    await certificationService.delete(requireUserId(req), params.id);

    res.status(200).json({
      message: "Certification deleted successfully",
    });
  },
};
