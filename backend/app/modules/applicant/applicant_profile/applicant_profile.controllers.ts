import { Request, Response } from "express";
import { requireUserId } from "../../../utils/request-user.util";
import { getValidatedBody } from "../../../utils/validated-request.util";
import { ApplicantProfileBodyInput } from "./applicant_profile.schemas";
import { applicantProfileService } from "./applicant_profile.services";

export const applicantProfileController = {
  async getMe(req: Request, res: Response) {
    const profile = await applicantProfileService.getOrCreateProfile(requireUserId(req));

    res.status(200).json({ message: "Success", data: profile });
  },

  async updateMe(req: Request, res: Response) {
    const body = getValidatedBody<ApplicantProfileBodyInput>(req);

    const profile = await applicantProfileService.updateProfile(requireUserId(req), body);

    res.status(200).json({
      message: "Profile updated successfully",
      data: profile,
    });
  },
};
