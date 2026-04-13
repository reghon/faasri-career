import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { asyncHandler } from "../../utils/async-handler";
import { applyController } from "./apply.controllers";
import { createApplyBodySchema, updateApplyStatusBodySchema, applyParamsSchema } from "./apply.schemas";

const router: Router = Router();

router.use(authenticate);
router.get("/me", asyncHandler(applyController.getMine));
router.post("/", validate({ body: createApplyBodySchema }), asyncHandler(applyController.create));

router.patch(
  "/:id/status",
  validate({
    params: applyParamsSchema,
    body: updateApplyStatusBodySchema,
  }),
  asyncHandler(applyController.updateStatus),
);

export default router;
