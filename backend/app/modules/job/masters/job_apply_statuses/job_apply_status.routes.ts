import { Router } from "express";
import { authenticate } from "../../../../middlewares/auth.middleware";
import { validate } from "../../../../middlewares/validate.middleware";
import { asyncHandler } from "../../../../utils/async-handler";
import { authorizePermission } from "../../../authorization/authorization.middleware";
import { jobApplyStatusController } from "./job_apply_status.controllers";
import { jobApplyStatusBodySchema, jobApplyStatusJobParamsSchema, jobApplyStatusParamsSchema, jobApplyStatusUpdateBodySchema, jobApplyStatusSyncBodySchema } from "./job_apply_status.schemas";

const router: Router = Router();

router.use(authenticate);

router.get("/", authorizePermission("MASTER_DATA_LIST"), asyncHandler(jobApplyStatusController.getAll));

router.get("/job/:jobId", authorizePermission("MASTER_DATA_READ"), validate({ params: jobApplyStatusJobParamsSchema }), asyncHandler(jobApplyStatusController.getByJobId));

router.get("/job/:jobId/edit-guard", authorizePermission("MASTER_DATA_READ"), validate({ params: jobApplyStatusJobParamsSchema }), asyncHandler(jobApplyStatusController.getEditGuardByJobId));

router.put(
  "/job/:jobId/sync",
  authorizePermission("MASTER_DATA_UPDATE"),
  validate({
    params: jobApplyStatusJobParamsSchema,
    body: jobApplyStatusSyncBodySchema,
  }),
  asyncHandler(jobApplyStatusController.syncByJobId),
);

router.get("/:id", authorizePermission("MASTER_DATA_READ"), validate({ params: jobApplyStatusParamsSchema }), asyncHandler(jobApplyStatusController.getById));

router.post("/", authorizePermission("MASTER_DATA_CREATE"), validate({ body: jobApplyStatusBodySchema }), asyncHandler(jobApplyStatusController.create));

router.put(
  "/:id",
  authorizePermission("MASTER_DATA_UPDATE"),
  validate({
    params: jobApplyStatusParamsSchema,
    body: jobApplyStatusUpdateBodySchema,
  }),
  asyncHandler(jobApplyStatusController.update),
);

router.delete("/:id", authorizePermission("MASTER_DATA_DELETE"), validate({ params: jobApplyStatusParamsSchema }), asyncHandler(jobApplyStatusController.delete));

export default router;
