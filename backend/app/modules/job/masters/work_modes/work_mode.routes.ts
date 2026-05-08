import { Router } from "express";
import { authenticate } from "../../../../middlewares/auth.middleware";
import { validate } from "../../../../middlewares/validate.middleware";
import { asyncHandler } from "../../../../utils/async-handler";
import { workModeController } from "./work_mode.controllers";
import { workModeBodySchema, workModeParamsSchema } from "./work_mode.schemas";

const router: Router = Router();

router.use(authenticate);

router.get("/", asyncHandler(workModeController.getAll));
router.get("/deleted", asyncHandler(workModeController.getAllDeleted));
router.get("/:id", validate({ params: workModeParamsSchema }), asyncHandler(workModeController.getById));
router.post("/", validate({ body: workModeBodySchema }), asyncHandler(workModeController.create));
router.put("/:id", validate({ params: workModeParamsSchema, body: workModeBodySchema }), asyncHandler(workModeController.update));
router.patch("/:id/restore", validate({ params: workModeParamsSchema }), asyncHandler(workModeController.restore));
router.delete("/:id", validate({ params: workModeParamsSchema }), asyncHandler(workModeController.softDelete));
router.delete("/:id/permanent", validate({ params: workModeParamsSchema }), asyncHandler(workModeController.hardDelete));
export default router;
