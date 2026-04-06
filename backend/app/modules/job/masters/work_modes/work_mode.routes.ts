import { Router } from "express";
import { authenticate } from "../../../../middlewares/auth.middleware";
import { validate } from "../../../../middlewares/validate.middleware";
import { asyncHandler } from "../../../../utils/async-handler";
import { workModeController } from "./work_mode.controllers";
import { workModeBodySchema, workModeParamsSchema } from "./work_mode.schemas";

const router: Router = Router();

router.use(authenticate);

router.get("/", asyncHandler(workModeController.getAll));
router.get("/:id", validate({ params: workModeParamsSchema }), asyncHandler(workModeController.getById));
router.post("/", validate({ body: workModeBodySchema }), asyncHandler(workModeController.create));
router.put("/:id", validate({ params: workModeParamsSchema, body: workModeBodySchema }), asyncHandler(workModeController.update));
router.delete("/:id", validate({ params: workModeParamsSchema }), asyncHandler(workModeController.delete));

export default router;
