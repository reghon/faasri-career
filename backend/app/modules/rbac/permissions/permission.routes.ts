import { Router } from "express";
import { authenticate } from "../../../middlewares/auth.middleware";
import { validate } from "../../../middlewares/validate.middleware";
import { asyncHandler } from "../../../utils/async-handler";
import { permissionController } from "./permission.controllers";
import { permissionBodySchema, permissionParamsSchema } from "./permission.schemas";

const router: Router = Router();

router.use(authenticate);

router.get("/", asyncHandler(permissionController.getAll));

router.post("/", validate({ body: permissionBodySchema }), asyncHandler(permissionController.create));

router.put(
  "/:id",
  validate({
    params: permissionParamsSchema,
    body: permissionBodySchema,
  }),
  asyncHandler(permissionController.update),
);

router.delete("/:id", validate({ params: permissionParamsSchema }), asyncHandler(permissionController.delete));

export default router;
