import { Request, Response } from "express";
import { technicalSkillService } from "./technical_skill.services";

const getUserId = (req: Request) => (req as any).user.userId;

export const technicalSkillController = {
  async getAll(req: Request, res: Response) {
    try {
      const data = await technicalSkillService.getAll(getUserId(req));
      return res.status(200).json({ message: "Success", data });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  },

  async create(req: Request, res: Response) {
    try {
      const data = await technicalSkillService.create(getUserId(req), req.body);
      return res.status(201).json({ message: "Skill created", data });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  },

  async delete(req: Request, res: Response) {
    try {
      await technicalSkillService.delete(getUserId(req), req.params.id as string);
      return res.status(200).json({ message: "Skill deleted" });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  },
};
