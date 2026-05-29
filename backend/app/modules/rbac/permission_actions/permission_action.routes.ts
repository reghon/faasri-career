import { Router } from "express";
import { authenticate } from "../../../middlewares/auth.middleware";
import { authorizePermission } from "../../authorization/authorization.middleware";
import { validate } from "../../../middlewares/validate.middleware";
import { asyncHandler } from "../../../utils/async-handler";
import { permissionActionController } from "./permission_action.controllers";
import { permissionActionBodySchema, permissionActionParamsSchema } from "./permission_action.schemas";

const router: Router = Router();

router.use(authenticate);

router.get("/", authorizePermission("ADMIN_LIST"), asyncHandler(permissionActionController.getAll));

router.post("/", authorizePermission("ADMIN_CREATE"), validate({ body: permissionActionBodySchema }), asyncHandler(permissionActionController.create));

router.put("/:id",
authorizePermission("ADMIN_UPDATE"),
  validate({
    params: permissionActionParamsSchema,
    body: permissionActionBodySchema,
  }),
  asyncHandler(permissionActionController.update),
);

router.delete("/:id", authorizePermission("ADMIN_DELETE"), validate({ params: permissionActionParamsSchema }), asyncHandler(permissionActionController.delete));

export default router;
