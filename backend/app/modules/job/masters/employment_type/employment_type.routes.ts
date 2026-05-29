import { Router } from "express";
import { authenticate } from "../../../../middlewares/auth.middleware";
import { validate } from "../../../../middlewares/validate.middleware";
import { asyncHandler } from "../../../../utils/async-handler";
import { authorizePermission } from "../../../authorization/authorization.middleware";
import { employmentTypeController } from "./employment_type.controllers";
import { employmentTypeBodySchema, employmentTypeParamsSchema } from "./employment_type.schemas";

const router: Router = Router();

router.use(authenticate);

router.get("/", authorizePermission("MASTER_DATA_LIST"), asyncHandler(employmentTypeController.getAll));
router.get("/deleted", authorizePermission("MASTER_DATA_LIST"), asyncHandler(employmentTypeController.getAllDeleted));
router.get("/:id", authorizePermission("MASTER_DATA_READ"), validate({ params: employmentTypeParamsSchema }), asyncHandler(employmentTypeController.getById));
router.post("/", authorizePermission("MASTER_DATA_CREATE"), validate({ body: employmentTypeBodySchema }), asyncHandler(employmentTypeController.create));
router.put(
  "/:id",
  authorizePermission("MASTER_DATA_UPDATE"),
  validate({
    params: employmentTypeParamsSchema,
    body: employmentTypeBodySchema,
  }),
  asyncHandler(employmentTypeController.update),
);
router.patch("/:id/restore", authorizePermission("MASTER_DATA_UPDATE"), validate({ params: employmentTypeParamsSchema }), asyncHandler(employmentTypeController.restore));
router.delete("/:id", authorizePermission("MASTER_DATA_DELETE"), validate({ params: employmentTypeParamsSchema }), asyncHandler(employmentTypeController.softDelete));
router.delete("/:id/permanent", authorizePermission("MASTER_DATA_DELETE"), validate({ params: employmentTypeParamsSchema }), asyncHandler(employmentTypeController.hardDelete));

export default router;
