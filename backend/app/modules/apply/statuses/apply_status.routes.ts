import { Router } from "express";
import { authenticate } from "../../../middlewares/auth.middleware";
import { validate } from "../../../middlewares/validate.middleware";
import { asyncHandler } from "../../../utils/async-handler";
import { applyStatusController } from "./apply_status.controllers";
import { applyStatusBodySchema, applyStatusParamsSchema } from "./apply_status.schemas";

const router: Router = Router();

router.use(authenticate);

router.get("/", asyncHandler(applyStatusController.getAll));
router.get("/:id", validate({ params: applyStatusParamsSchema }), asyncHandler(applyStatusController.getById));
router.post("/", validate({ body: applyStatusBodySchema }), asyncHandler(applyStatusController.create));
router.put("/:id", validate({ params: applyStatusParamsSchema, body: applyStatusBodySchema }), asyncHandler(applyStatusController.update));
router.delete("/:id", validate({ params: applyStatusParamsSchema }), asyncHandler(applyStatusController.delete));

export default router;
