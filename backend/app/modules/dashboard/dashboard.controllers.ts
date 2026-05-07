import { Request, Response } from "express";
import { dashboardService } from "./dashboard.services";

export class DashboardController {
  async getOverview(_req: Request, res: Response): Promise<void> {
    const data = await dashboardService.getOverview();

    res.status(200).json({
      message: "Dashboard overview retrieved successfully",
      data,
    });
  }
}

export const dashboardController = new DashboardController();
