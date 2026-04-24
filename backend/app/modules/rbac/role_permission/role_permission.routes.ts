import { Router } from "express";
import { authenticate } from "../../../middlewares/auth.middleware";
import { validate } from "../../../middlewares/validate.middleware";
import { asyncHandler } from "../../../utils/async-handler";
import { rolePermissionController } from "./role_permission.controllers";
import { rolePermissionBodySchema, rolePermissionParamsSchema } from "./role_permission.schemas";

const router: Router = Router();

router.use(authenticate);

router.get("/", asyncHandler(rolePermissionController.getAll));

router.post("/", validate({ body: rolePermissionBodySchema }), asyncHandler(rolePermissionController.create));

router.put(
  "/:id",
  validate({
    params: rolePermissionParamsSchema,
    body: rolePermissionBodySchema,
  }),
  asyncHandler(rolePermissionController.update),
);

router.delete("/:id", validate({ params: rolePermissionParamsSchema }), asyncHandler(rolePermissionController.delete));

export default router;
