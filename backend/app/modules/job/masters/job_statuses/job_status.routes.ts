import { Router } from "express";
import { authenticate } from "../../../../middlewares/auth.middleware";
import { validate } from "../../../../middlewares/validate.middleware";
import { asyncHandler } from "../../../../utils/async-handler";
import { authorizePermission } from "../../../authorization/authorization.middleware";
import { jobStatusController } from "./job_status.controllers";
import { jobStatusBodySchema, jobStatusParamsSchema } from "./job_status.schemas";

const router: Router = Router();

router.use(authenticate);
router.get("/", authorizePermission("MASTER_DATA_LIST"), asyncHandler(jobStatusController.getAll));
router.get("/deleted", authorizePermission("MASTER_DATA_LIST"), asyncHandler(jobStatusController.getAllDeleted));
router.get("/:id", authorizePermission("MASTER_DATA_READ"), validate({ params: jobStatusParamsSchema }), asyncHandler(jobStatusController.getById));
router.post("/", authorizePermission("MASTER_DATA_CREATE"), validate({ body: jobStatusBodySchema }), asyncHandler(jobStatusController.create));
router.put(
  "/:id",
  authorizePermission("MASTER_DATA_UPDATE"),
  validate({
    params: jobStatusParamsSchema,
    body: jobStatusBodySchema,
  }),
  asyncHandler(jobStatusController.update),
);
router.patch("/:id/restore", authorizePermission("MASTER_DATA_UPDATE"), validate({ params: jobStatusParamsSchema }), asyncHandler(jobStatusController.restore));
router.delete("/:id", authorizePermission("MASTER_DATA_DELETE"), validate({ params: jobStatusParamsSchema }), asyncHandler(jobStatusController.softDelete));
router.delete("/:id/permanent", authorizePermission("MASTER_DATA_DELETE"), validate({ params: jobStatusParamsSchema }), asyncHandler(jobStatusController.hardDelete));

export default router;
