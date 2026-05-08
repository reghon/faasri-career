import { Router } from "express";
import { authenticate } from "../../../../middlewares/auth.middleware";
import { validate } from "../../../../middlewares/validate.middleware";
import { asyncHandler } from "../../../../utils/async-handler";
import { jobLocationController } from "./job_location.controllers";
import { jobLocationBodySchema, jobLocationParamsSchema } from "./job_location.schemas";

const router: Router = Router();

router.use(authenticate);

router.get("/", asyncHandler(jobLocationController.getAll));
router.get("/deleted", asyncHandler(jobLocationController.getAllDeleted));
router.get("/:id", validate({ params: jobLocationParamsSchema }), asyncHandler(jobLocationController.getById));
router.post("/", validate({ body: jobLocationBodySchema }), asyncHandler(jobLocationController.create));
router.put("/:id", validate({ params: jobLocationParamsSchema, body: jobLocationBodySchema }), asyncHandler(jobLocationController.update));
router.patch("/:id/restore", validate({ params: jobLocationParamsSchema }), asyncHandler(jobLocationController.restore));
router.delete("/:id", validate({ params: jobLocationParamsSchema }), asyncHandler(jobLocationController.softDelete));
router.delete("/:id/permanent", validate({ params: jobLocationParamsSchema }), asyncHandler(jobLocationController.hardDelete));

export default router;
