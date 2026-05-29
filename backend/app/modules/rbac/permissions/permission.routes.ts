import { Router } from "express";
import { authenticate } from "../../../middlewares/auth.middleware";
import { authorizePermission } from "../../authorization/authorization.middleware";
import { validate } from "../../../middlewares/validate.middleware";
import { asyncHandler } from "../../../utils/async-handler";
import { permissionController } from "./permission.controllers";
import { permissionBodySchema, permissionParamsSchema } from "./permission.schemas";

const router: Router = Router();

router.use(authenticate);

router.get("/", authorizePermission("ADMIN_LIST"), asyncHandler(permissionController.getAll));

router.post("/", authorizePermission("ADMIN_CREATE"), validate({ body: permissionBodySchema }), asyncHandler(permissionController.create));

router.put(
  "/:id",
  authorizePermission("ADMIN_UPDATE"),
  validate({
    params: permissionParamsSchema,
    body: permissionBodySchema,
  }),
  asyncHandler(permissionController.update),
);

router.delete("/:id", authorizePermission("ADMIN_DELETE"), validate({ params: permissionParamsSchema }), asyncHandler(permissionController.delete));

export default router;
