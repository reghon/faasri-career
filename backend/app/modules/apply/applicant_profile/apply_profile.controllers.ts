import { Request, Response } from "express";
import { getValidatedParams } from "../../../utils/validated-request.util";
import { ApplyProfileParamsInput } from "./apply_profile.schemas";
import { applyProfileService } from "./apply_profile.services";

export const applyProfileController = {
  async getByApplyId(req: Request, res: Response) {
    const params = getValidatedParams<ApplyProfileParamsInput>(req);

    const profile = await applyProfileService.getByApplyId(params.applyId);

    res.status(200).json({
      message: "Success",
      data: profile,
    });
  },
};
