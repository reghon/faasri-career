import { Router } from "express";
import { authenticate } from "../../../middlewares/auth.middleware";
import { validate } from "../../../middlewares/validate.middleware";
import { asyncHandler } from "../../../utils/async-handler";
import { applyProfileController } from "./apply_profile.controllers";
import { applyProfileParamsSchema } from "./apply_profile.schemas";

const router: Router = Router();

router.use(authenticate);

router.get("/:applyId", validate({ params: applyProfileParamsSchema }), asyncHandler(applyProfileController.getByApplyId));

export default router;
