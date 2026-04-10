import { Request, Response } from "express";
import { AppError } from "../../../errors/app-error";
import { deleteUploadedFile } from "../../../utils/file.util";
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

  async updateMyAvatar(req: Request, res: Response) {
    if (!req.file) {
      throw new AppError(400, "Avatar file is required");
    }

    const userId = requireUserId(req);
    const newAvatarUrl = `/uploads/avatars/${req.file.filename}`;

    try {
      const existingProfile = await applicantProfileService.getExistingProfile(userId);
      const oldAvatarUrl = existingProfile?.avatarUrl ?? null;

      const profile = await applicantProfileService.updateAvatar(userId, {
        avatarUrl: newAvatarUrl,
      });

      if (oldAvatarUrl && oldAvatarUrl !== profile.avatarUrl) {
        deleteUploadedFile(oldAvatarUrl);
      }

      res.status(200).json({
        message: "Avatar updated successfully",
        data: profile,
      });
    } catch (error) {
      deleteUploadedFile(newAvatarUrl);
      throw error;
    }
  },

  async updateMyCv(req: Request, res: Response) {
    if (!req.file) {
      throw new AppError(400, "CV file is required");
    }

    const userId = requireUserId(req);
    const newCvUrl = `/uploads/cvs/${req.file.filename}`;

    try {
      const existingProfile = await applicantProfileService.getExistingProfile(userId);
      const oldCvUrl = existingProfile?.cvUrl ?? null;

      const profile = await applicantProfileService.updateCv(userId, {
        cvUrl: newCvUrl,
        cvFileName: req.file.originalname,
      });

      if (oldCvUrl && oldCvUrl !== profile.cvUrl) {
        deleteUploadedFile(oldCvUrl);
      }

      res.status(200).json({
        message: "CV updated successfully",
        data: profile,
      });
    } catch (error) {
      deleteUploadedFile(newCvUrl);
      throw error;
    }
  },

  async removeMyAvatar(req: Request, res: Response) {
    const userId = requireUserId(req);
    const existingProfile = await applicantProfileService.getExistingProfile(userId);
    const oldAvatarUrl = existingProfile?.avatarUrl ?? null;

    const profile = await applicantProfileService.removeAvatar(userId);

    if (oldAvatarUrl) {
      deleteUploadedFile(oldAvatarUrl);
    }

    res.status(200).json({
      message: "Avatar removed successfully",
      data: profile,
    });
  },

  async removeMyCv(req: Request, res: Response) {
    const userId = requireUserId(req);
    const existingProfile = await applicantProfileService.getExistingProfile(userId);
    const oldCvUrl = existingProfile?.cvUrl ?? null;

    const profile = await applicantProfileService.removeCv(userId);

    if (oldCvUrl) {
      deleteUploadedFile(oldCvUrl);
    }

    res.status(200).json({
      message: "CV removed successfully",
      data: profile,
    });
  },
};
