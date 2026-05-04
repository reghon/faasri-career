import { Router } from "express";
import { authenticate } from "../../../middlewares/auth.middleware";
import { uploadAvatar, uploadCv } from "../../../middlewares/upload.middleware";
import { validate } from "../../../middlewares/validate.middleware";
import { asyncHandler } from "../../../utils/async-handler";
import { applicantProfileController } from "./applicant_profile.controllers";
import { applicantProfileBodySchema, applicantProfileParamsSchema } from "./applicant_profile.schemas";

const router: Router = Router();

router.use(authenticate);

router.get("/", asyncHandler(applicantProfileController.getAll));

router.get("/me", asyncHandler(applicantProfileController.getMe));

router.get("/:id", validate({ params: applicantProfileParamsSchema }), asyncHandler(applicantProfileController.getById));

router.put("/me", validate({ body: applicantProfileBodySchema }), asyncHandler(applicantProfileController.updateMe));

router.put("/me/avatar", uploadAvatar.single("avatar"), asyncHandler(applicantProfileController.updateMyAvatar));

router.put("/me/cv", uploadCv.single("cv"), asyncHandler(applicantProfileController.updateMyCv));

router.delete("/me/avatar", asyncHandler(applicantProfileController.removeMyAvatar));

router.delete("/me/cv", asyncHandler(applicantProfileController.removeMyCv));

export default router;
