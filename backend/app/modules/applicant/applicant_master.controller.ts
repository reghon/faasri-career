import { Request, Response } from "express";
import { requireUserId } from "../../utils/request-user.util";
import { applicantMasterService } from "./applicant_master.service";

export const applicantMasterController = {
  async getMe(req: Request, res: Response) {
    const data = await applicantMasterService.getApplicantMaster(requireUserId(req));
    res.set("Cache-Control", "no-store");
    res.status(200).json({
      message: "Applicant master fetched successfully",
      data,
    });
  },
};
