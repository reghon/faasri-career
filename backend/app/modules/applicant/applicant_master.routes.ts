import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware";
import { asyncHandler } from "../../utils/async-handler";
import { applicantMasterController } from "./applicant_master.controller";
import { validate } from "../../middlewares/validate.middleware";
import { applicantMasterParamsSchema } from "./applicant_master.schemas";

const router: Router = Router();

router.use(authenticate);

router.get("/me", asyncHandler(applicantMasterController.getMe));

router.get("/:id", validate({ params: applicantMasterParamsSchema }), asyncHandler(applicantMasterController.getByApplicantProfileId));
export default router;
