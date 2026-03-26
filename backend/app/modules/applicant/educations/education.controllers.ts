import { Request, Response } from "express";
import { educationService } from "./education.services";
const getUserId = (req: Request) => (req as any).user.userId;

export const educationController = {
  async getAll(req: Request, res: Response) {
    try {
      const data = await educationService.getAll(getUserId(req));
      return res.status(200).json({ message: "Success", data });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  },

  async create(req: Request, res: Response) {
    try {
      const data = await educationService.create(getUserId(req), req.body);
      return res.status(201).json({ message: "Education created", data });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const data = await educationService.update(getUserId(req), req.params.id as string, req.body);
      return res.status(200).json({ message: "Education updated", data });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  },

  async delete(req: Request, res: Response) {
    try {
      await educationService.delete(getUserId(req), req.params.id as string);
      return res.status(200).json({ message: "Education deleted" });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  },
};
