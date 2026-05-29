import { Router } from "express";
import { authenticate } from "../../../../middlewares/auth.middleware";
import { validate } from "../../../../middlewares/validate.middleware";
import { asyncHandler } from "../../../../utils/async-handler";
import { authorizePermission } from "../../../authorization/authorization.middleware";
import { workModeController } from "./work_mode.controllers";
import { workModeBodySchema, workModeParamsSchema } from "./work_mode.schemas";

const router: Router = Router();

router.use(authenticate);
router.get("/", authorizePermission("MASTER_DATA_LIST"), asyncHandler(workModeController.getAll));
router.get("/deleted", authorizePermission("MASTER_DATA_LIST"), asyncHandler(workModeController.getAllDeleted));
router.get("/:id", authorizePermission("MASTER_DATA_READ"), validate({ params: workModeParamsSchema }), asyncHandler(workModeController.getById));
router.post("/", authorizePermission("MASTER_DATA_CREATE"), validate({ body: workModeBodySchema }), asyncHandler(workModeController.create));
router.put(
  "/:id",
  authorizePermission("MASTER_DATA_UPDATE"),
  validate({
    params: workModeParamsSchema,
    body: workModeBodySchema,
  }),
  asyncHandler(workModeController.update),
);
router.patch("/:id/restore", authorizePermission("MASTER_DATA_UPDATE"), validate({ params: workModeParamsSchema }), asyncHandler(workModeController.restore));
router.delete("/:id", authorizePermission("MASTER_DATA_DELETE"), validate({ params: workModeParamsSchema }), asyncHandler(workModeController.softDelete));
router.delete("/:id/permanent", authorizePermission("MASTER_DATA_DELETE"), validate({ params: workModeParamsSchema }), asyncHandler(workModeController.hardDelete));

export default router;
