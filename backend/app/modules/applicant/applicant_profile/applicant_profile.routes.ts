import { Router } from "express";
import { authenticate } from "../../../middlewares/auth.middleware";
import { validate } from "../../../middlewares/validate.middleware";
import { asyncHandler } from "../../../utils/async-handler";
import { applicantProfileController } from "./applicant_profile.controllers";
import { applicantProfileBodySchema } from "./applicant_profile.schemas";

const router: Router = Router();

router.use(authenticate);

router.get("/me", asyncHandler(applicantProfileController.getMe));

router.put("/me", validate({ body: applicantProfileBodySchema }), asyncHandler(applicantProfileController.updateMe));

export default router;
