import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { asyncHandler } from "../../utils/async-handler";
import { authorizePermission } from "../authorization/authorization.middleware";
import { jobController } from "./job.controllers";
import { jobBodySchema, jobParamsSchema, jobQuerySchema, jobSlugParamsSchema, jobStatusBodySchema } from "./job.schemas";

const router: Router = Router();

router.get("/open", validate({ query: jobQuerySchema }), asyncHandler(jobController.getAllOpenJobs));
router.get("/slug/:slug", validate({ params: jobSlugParamsSchema }), asyncHandler(jobController.getBySlug));

router.use(authenticate);
router.get("/", authorizePermission("JOB_LIST"), validate({ query: jobQuerySchema }), asyncHandler(jobController.getAll));
router.get("/:id", authorizePermission("JOB_READ"), validate({ params: jobParamsSchema }), asyncHandler(jobController.getById));
router.post("/", authorizePermission("JOB_CREATE"), validate({ body: jobBodySchema }), asyncHandler(jobController.create));
router.put("/:id", authorizePermission("JOB_UPDATE"), validate({ params: jobParamsSchema, body: jobBodySchema }), asyncHandler(jobController.update));
router.delete("/:id", authorizePermission("JOB_DELETE"), validate({ params: jobParamsSchema }), asyncHandler(jobController.delete));
router.patch("/:id/status", authorizePermission("JOB_UPDATE"), validate({ params: jobParamsSchema, body: jobStatusBodySchema }), asyncHandler(jobController.updateStatus));

export default router;
