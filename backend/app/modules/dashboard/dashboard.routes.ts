import { Router } from "express";
import { dashboardController } from "./dashboard.controllers";
import { authenticate } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { asyncHandler } from "../../utils/async-handler";
import { getDashboardOverviewQuerySchema } from "./dashboard.schemas";

const router: Router = Router();

router.get("/overview", authenticate, validate({ query: getDashboardOverviewQuerySchema }), asyncHandler(dashboardController.getOverview.bind(dashboardController)));

export default router;
