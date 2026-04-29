import { Router } from "express";
import { authenticate } from "../../../../middlewares/auth.middleware";
import { validate } from "../../../../middlewares/validate.middleware";
import { asyncHandler } from "../../../../utils/async-handler";
import { jobApplyStatusController } from "./job_apply_status.controllers";
import { jobApplyStatusBodySchema, jobApplyStatusJobParamsSchema, jobApplyStatusParamsSchema, jobApplyStatusUpdateBodySchema, jobApplyStatusSyncBodySchema } from "./job_apply_status.schemas";
const router: Router = Router();

router.use(authenticate);

router.get("/", asyncHandler(jobApplyStatusController.getAll));

router.get("/job/:jobId", validate({ params: jobApplyStatusJobParamsSchema }), asyncHandler(jobApplyStatusController.getByJobId));

router.get("/job/:jobId/edit-guard", validate({ params: jobApplyStatusJobParamsSchema }), asyncHandler(jobApplyStatusController.getEditGuardByJobId));

router.put(
  "/job/:jobId/sync",
  validate({
    params: jobApplyStatusJobParamsSchema,
    body: jobApplyStatusSyncBodySchema,
  }),
  asyncHandler(jobApplyStatusController.syncByJobId),
);
router.get("/:id", validate({ params: jobApplyStatusParamsSchema }), asyncHandler(jobApplyStatusController.getById));

router.post("/", validate({ body: jobApplyStatusBodySchema }), asyncHandler(jobApplyStatusController.create));

router.put(
  "/:id",
  validate({
    params: jobApplyStatusParamsSchema,
    body: jobApplyStatusUpdateBodySchema,
  }),
  asyncHandler(jobApplyStatusController.update),
);

router.delete("/:id", validate({ params: jobApplyStatusParamsSchema }), asyncHandler(jobApplyStatusController.delete));

export default router;
