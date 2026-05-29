import { Router } from "express";
import { authenticate } from "../../../middlewares/auth.middleware";
import { authorizePermission } from "../../authorization/authorization.middleware";
import { validate } from "../../../middlewares/validate.middleware";
import { asyncHandler } from "../../../utils/async-handler";
import { rolePermissionController } from "./role_permission.controllers";
import { rolePermissionBodySchema, rolePermissionParamsSchema } from "./role_permission.schemas";

const router: Router = Router();

router.use(authenticate);

router.get("/", authorizePermission("ADMIN_LIST"), asyncHandler(rolePermissionController.getAll));

router.post("/", authorizePermission("ADMIN_CREATE"), validate({ body: rolePermissionBodySchema }), asyncHandler(rolePermissionController.create));

router.put(
  "/:id",
  authorizePermission("ADMIN_UPDATE"),
  validate({
    params: rolePermissionParamsSchema,
    body: rolePermissionBodySchema,
  }),
  asyncHandler(rolePermissionController.update),
);

router.delete("/:id", authorizePermission("ADMIN_DELETE"), validate({ params: rolePermissionParamsSchema }), asyncHandler(rolePermissionController.delete));

export default router;
