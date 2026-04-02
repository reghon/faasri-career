import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware";
import { asyncHandler } from "../../utils/async-handler";
import { applicantMasterController } from "./applicant_master.controller";

const router: Router = Router();

router.use(authenticate);

router.get("/me", asyncHandler(applicantMasterController.getMe));

export default router;
