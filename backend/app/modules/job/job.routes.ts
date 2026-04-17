import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { asyncHandler } from "../../utils/async-handler";
import { jobController } from "./job.controllers";
import { jobBodySchema, jobParamsSchema, jobQuerySchema, jobSlugParamsSchema } from "./job.schemas";

const router: Router = Router();

router.get("/", validate({ query: jobQuerySchema }), asyncHandler(jobController.getAll));
router.get("/:id", validate({ params: jobParamsSchema }), asyncHandler(jobController.getById));
router.get("/slug/:slug", validate({ params: jobSlugParamsSchema }), asyncHandler(jobController.getBySlug));
router.use(authenticate);
router.post("/", validate({ body: jobBodySchema }), asyncHandler(jobController.create));
router.put("/:id", validate({ params: jobParamsSchema, body: jobBodySchema }), asyncHandler(jobController.update));
router.delete("/:id", validate({ params: jobParamsSchema }), asyncHandler(jobController.delete));

export default router;
