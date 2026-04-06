import { Router } from "express";
import { authenticate } from "../../../../middlewares/auth.middleware";
import { validate } from "../../../../middlewares/validate.middleware";
import { asyncHandler } from "../../../../utils/async-handler";
import { employmentTypeController } from "./employment_type.controllers";
import { employmentTypeBodySchema, employmentTypeParamsSchema } from "./employment_type.schemas";

const router: Router = Router();

router.use(authenticate);

router.get("/", asyncHandler(employmentTypeController.getAll));
router.get("/:id", validate({ params: employmentTypeParamsSchema }), asyncHandler(employmentTypeController.getById));
router.post("/", validate({ body: employmentTypeBodySchema }), asyncHandler(employmentTypeController.create));
router.put("/:id", validate({ params: employmentTypeParamsSchema, body: employmentTypeBodySchema }), asyncHandler(employmentTypeController.update));
router.delete("/:id", validate({ params: employmentTypeParamsSchema }), asyncHandler(employmentTypeController.delete));

export default router;
