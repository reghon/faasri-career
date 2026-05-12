import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { asyncHandler } from "../../utils/async-handler";
import { roleController } from "./role.controllers";
import { roleBodySchema, roleParamsSchema } from "./role.schemas";

const router: Router = Router();

router.use(authenticate);

router.get("/", asyncHandler(roleController.getAll));
router.get("/deleted", asyncHandler(roleController.getAllDeleted));
router.get("/:id", validate({ params: roleParamsSchema }), asyncHandler(roleController.getById));
router.post("/", validate({ body: roleBodySchema }), asyncHandler(roleController.create));
router.put("/:id", validate({ params: roleParamsSchema, body: roleBodySchema }), asyncHandler(roleController.update));
router.patch("/:id/restore", validate({ params: roleParamsSchema }), asyncHandler(roleController.restore));
router.delete("/:id", validate({ params: roleParamsSchema }), asyncHandler(roleController.softDelete));
router.delete("/:id/permanent", validate({ params: roleParamsSchema }), asyncHandler(roleController.hardDelete));

export default router;
