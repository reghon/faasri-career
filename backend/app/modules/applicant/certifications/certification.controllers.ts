import { Request, Response } from "express";
import { certificationService } from "./certification.services";
const getUserId = (req: Request) => (req as any).user.userId;


export const certificationController = {
    
  async getAll(req: Request, res: Response) {
    try {
      const data = await certificationService.getAll(getUserId(req));
      return res.status(200).json({ message: "Success", data });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  },

  async create(req: Request, res: Response) {
    try {
      const data = await certificationService.create(getUserId(req), req.body);
      return res.status(201).json({ message: "Certification created", data });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const data = await certificationService.update(getUserId(req), req.params.id as string, req.body);
      return res.status(200).json({ message: "Certification updated", data });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  },

  async delete(req: Request, res: Response) {
    try {
      await certificationService.delete(getUserId(req), req.params.id as string);
      return res.status(200).json({ message: "Certification deleted" });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  },
};
