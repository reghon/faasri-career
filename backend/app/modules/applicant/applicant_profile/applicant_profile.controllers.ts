import { Request, Response } from "express";
import { applicantProfileService } from "./applicant_profile.services";

const getUserId = (req: Request) => (req as any).user.userId;

export const applicantProfileController = {
  async getMe(req: Request, res: Response) {
    try {
      const profile = await applicantProfileService.getOrCreateProfile(getUserId(req));
      return res.status(200).json({ message: "Success", data: profile });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  },

  async updateMe(req: Request, res: Response) {
    try {
      const profile = await applicantProfileService.updateProfile(getUserId(req), req.body);
      return res.status(200).json({ message: "Profile updated", data: profile });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  },
};
