import { Router } from "express";
import { authenticate } from "../../../middlewares/auth.middleware";
import { applicantProfileController } from "./applicant_profile.controllers";

const router: Router = Router();
router.use(authenticate);

router.get("/me", applicantProfileController.getMe);
router.put("/me", applicantProfileController.updateMe);

export default router;
