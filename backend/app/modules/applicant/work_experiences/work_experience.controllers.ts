import { Request, Response } from "express";
import { workExperienceService } from "./work_experience.services";

const getUserId = (req: Request) => (req as any).user.userId;

export const workExperienceController = {
  async getAll(req: Request, res: Response) {
    try {
      const data = await workExperienceService.getAll(getUserId(req));
      return res.status(200).json({ message: "Success", data });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  },

  async create(req: Request, res: Response) {
    try {
      const data = await workExperienceService.create(getUserId(req), req.body);
      return res.status(201).json({ message: "Work experience created", data });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const data = await workExperienceService.update(getUserId(req), req.params.id as string, req.body);
      return res.status(200).json({ message: "Work experience updated", data });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  },

  async delete(req: Request, res: Response) {
    try {
      await workExperienceService.delete(getUserId(req), req.params.id as string);
      return res.status(200).json({ message: "Work experience deleted" });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  },
};
