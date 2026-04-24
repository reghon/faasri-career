import { Router } from "express";
import { authenticate } from "../../../middlewares/auth.middleware";
import { validate } from "../../../middlewares/validate.middleware";
import { asyncHandler } from "../../../utils/async-handler";
import { permissionActionController } from "./permission_action.controllers";
import { permissionActionBodySchema, permissionActionParamsSchema } from "./permission_action.schemas";

const router: Router = Router();

router.use(authenticate);

router.get("/", asyncHandler(permissionActionController.getAll));

router.post("/", validate({ body: permissionActionBodySchema }), asyncHandler(permissionActionController.create));

router.put(
  "/:id",
  validate({
    params: permissionActionParamsSchema,
    body: permissionActionBodySchema,
  }),
  asyncHandler(permissionActionController.update),
);

router.delete("/:id", validate({ params: permissionActionParamsSchema }), asyncHandler(permissionActionController.delete));

export default router;
