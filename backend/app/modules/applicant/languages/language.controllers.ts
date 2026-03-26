import { Request, Response } from "express";
import { languageService } from "./language.services";

const getUserId = (req: Request) => (req as any).user.userId;

export const languageController = {
  async getAll(req: Request, res: Response) {
    try {
      const data = await languageService.getAll(getUserId(req));
      return res.status(200).json({ message: "Success", data });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  },

  async create(req: Request, res: Response) {
    try {
      const data = await languageService.create(getUserId(req), req.body);
      return res.status(201).json({ message: "Language created", data });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const data = await languageService.update(getUserId(req), req.params.id as string, req.body);
      return res.status(200).json({ message: "Language updated", data });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  },

  async delete(req: Request, res: Response) {
    try {
      await languageService.delete(getUserId(req), req.params.id as string);
      return res.status(200).json({ message: "Language deleted" });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  },
};
