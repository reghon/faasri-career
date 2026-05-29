import { Router } from "express";
import { authenticate } from "../../../../middlewares/auth.middleware";
import { validate } from "../../../../middlewares/validate.middleware";
import { asyncHandler } from "../../../../utils/async-handler";
import { authorizePermission } from "../../../authorization/authorization.middleware";
import { jobLocationController } from "./job_location.controllers";
import { jobLocationBodySchema, jobLocationParamsSchema } from "./job_location.schemas";

const router: Router = Router();

router.use(authenticate);

router.get("/", authorizePermission("MASTER_DATA_LIST"), asyncHandler(jobLocationController.getAll));
router.get("/deleted", authorizePermission("MASTER_DATA_LIST"), asyncHandler(jobLocationController.getAllDeleted));
router.get("/:id", authorizePermission("MASTER_DATA_READ"), validate({ params: jobLocationParamsSchema }), asyncHandler(jobLocationController.getById));
router.post("/", authorizePermission("MASTER_DATA_CREATE"), validate({ body: jobLocationBodySchema }), asyncHandler(jobLocationController.create));
router.put(
  "/:id",
  authorizePermission("MASTER_DATA_UPDATE"),
  validate({
    params: jobLocationParamsSchema,
    body: jobLocationBodySchema,
  }),
  asyncHandler(jobLocationController.update),
);
router.patch("/:id/restore", authorizePermission("MASTER_DATA_UPDATE"), validate({ params: jobLocationParamsSchema }), asyncHandler(jobLocationController.restore));
router.delete("/:id", authorizePermission("MASTER_DATA_DELETE"), validate({ params: jobLocationParamsSchema }), asyncHandler(jobLocationController.softDelete));
router.delete("/:id/permanent", authorizePermission("MASTER_DATA_DELETE"), validate({ params: jobLocationParamsSchema }), asyncHandler(jobLocationController.hardDelete));

export default router;
