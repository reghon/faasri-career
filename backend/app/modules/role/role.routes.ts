import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { asyncHandler } from "../../utils/async-handler";
import { authorizePermission } from "../authorization/authorization.middleware";
import { roleController } from "./role.controllers";
import { roleBodySchema, roleParamsSchema } from "./role.schemas";

const router: Router = Router();

router.use(authenticate);

router.get("/", authorizePermission("ADMIN_LIST"), asyncHandler(roleController.getAll));
router.get("/deleted", authorizePermission("ADMIN_LIST"), asyncHandler(roleController.getAllDeleted));
router.get("/:id", authorizePermission("ADMIN_READ"), validate({ params: roleParamsSchema }), asyncHandler(roleController.getById));
router.post("/", authorizePermission("ADMIN_CREATE"), validate({ body: roleBodySchema }), asyncHandler(roleController.create));
router.put("/:id", authorizePermission("ADMIN_UPDATE"), validate({ params: roleParamsSchema, body: roleBodySchema }), asyncHandler(roleController.update));
router.patch("/:id/restore", authorizePermission("ADMIN_UPDATE"), validate({ params: roleParamsSchema }), asyncHandler(roleController.restore));
router.delete("/:id", authorizePermission("ADMIN_DELETE"), validate({ params: roleParamsSchema }), asyncHandler(roleController.softDelete));
router.delete("/:id/permanent", authorizePermission("ADMIN_DELETE"), validate({ params: roleParamsSchema }), asyncHandler(roleController.hardDelete));

export default router;
