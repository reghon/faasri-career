import { Router } from "express";
import { authenticate } from "../../../../middlewares/auth.middleware";
import { validate } from "../../../../middlewares/validate.middleware";
import { asyncHandler } from "../../../../utils/async-handler";
import { employmentTypeController } from "./employment_type.controllers";
import { employmentTypeBodySchema, employmentTypeParamsSchema } from "./employment_type.schemas";

const router: Router = Router();

router.use(authenticate);

router.get("/", asyncHandler(employmentTypeController.getAll));
router.get("/deleted", asyncHandler(employmentTypeController.getAllDeleted));
router.get("/:id", validate({ params: employmentTypeParamsSchema }), asyncHandler(employmentTypeController.getById));
router.post("/", validate({ body: employmentTypeBodySchema }), asyncHandler(employmentTypeController.create));
router.put("/:id", validate({ params: employmentTypeParamsSchema, body: employmentTypeBodySchema }), asyncHandler(employmentTypeController.update));
router.patch("/:id/restore", validate({ params: employmentTypeParamsSchema }), asyncHandler(employmentTypeController.restore));
router.delete("/:id", validate({ params: employmentTypeParamsSchema }), asyncHandler(employmentTypeController.softDelete));
router.delete("/:id/permanent", validate({ params: employmentTypeParamsSchema }), asyncHandler(employmentTypeController.hardDelete));

export default router;
