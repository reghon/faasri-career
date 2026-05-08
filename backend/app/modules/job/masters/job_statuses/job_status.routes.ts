import { Router } from "express";
import { authenticate } from "../../../../middlewares/auth.middleware";
import { validate } from "../../../../middlewares/validate.middleware";
import { asyncHandler } from "../../../../utils/async-handler";
import { jobStatusController } from "./job_status.controllers";
import { jobStatusBodySchema, jobStatusParamsSchema } from "./job_status.schemas";

const router: Router = Router();

router.use(authenticate);

router.get("/", asyncHandler(jobStatusController.getAll));
router.get("/deleted", asyncHandler(jobStatusController.getAllDeleted));
router.get("/:id", validate({ params: jobStatusParamsSchema }), asyncHandler(jobStatusController.getById));
router.post("/", validate({ body: jobStatusBodySchema }), asyncHandler(jobStatusController.create));
router.put("/:id", validate({ params: jobStatusParamsSchema, body: jobStatusBodySchema }), asyncHandler(jobStatusController.update));
router.patch("/:id/restore", validate({ params: jobStatusParamsSchema }), asyncHandler(jobStatusController.restore));
router.delete("/:id", validate({ params: jobStatusParamsSchema }), asyncHandler(jobStatusController.softDelete));
router.delete("/:id/permanent", validate({ params: jobStatusParamsSchema }), asyncHandler(jobStatusController.hardDelete));

export default router;
