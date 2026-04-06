import { Router } from "express";
import { authenticate } from "../../../../middlewares/auth.middleware";
import { validate } from "../../../../middlewares/validate.middleware";
import { asyncHandler } from "../../../../utils/async-handler";
import { jobLocationController } from "./job_location.controllers";
import { jobLocationBodySchema, jobLocationParamsSchema } from "./job_location.schemas";

const router: Router = Router();

router.use(authenticate);

router.get("/", asyncHandler(jobLocationController.getAll));
router.get("/:id", validate({ params: jobLocationParamsSchema }), asyncHandler(jobLocationController.getById));
router.post("/", validate({ body: jobLocationBodySchema }), asyncHandler(jobLocationController.create));
router.put("/:id", validate({ params: jobLocationParamsSchema, body: jobLocationBodySchema }), asyncHandler(jobLocationController.update));
router.delete("/:id", validate({ params: jobLocationParamsSchema }), asyncHandler(jobLocationController.delete));

export default router;
