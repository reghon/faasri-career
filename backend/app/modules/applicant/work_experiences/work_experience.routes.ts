import { Router } from "express";
import { authenticate } from "../../../middlewares/auth.middleware";
import { validate } from "../../../middlewares/validate.middleware";
import { asyncHandler } from "../../../utils/async-handler";
import { workExperienceController } from "./work_experience.controllers";
import { workExperienceBodySchema, workExperienceParamsSchema } from "./work_experience.schemas";

const router: Router = Router();

router.use(authenticate);

router.get("/", asyncHandler(workExperienceController.getAll));

router.post("/", validate({ body: workExperienceBodySchema }), asyncHandler(workExperienceController.create));

router.put(
  "/:id",
  validate({
    params: workExperienceParamsSchema,
    body: workExperienceBodySchema,
  }),
  asyncHandler(workExperienceController.update),
);

router.delete("/:id", validate({ params: workExperienceParamsSchema }), asyncHandler(workExperienceController.delete));

export default router;
