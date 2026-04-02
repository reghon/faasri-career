import { Router } from "express";
import { authenticate } from "../../../middlewares/auth.middleware";
import { validate } from "../../../middlewares/validate.middleware";
import { asyncHandler } from "../../../utils/async-handler";
import { educationController } from "./education.controllers";
import { educationBodySchema, educationParamsSchema } from "./education.schemas";

const router: Router = Router();

router.use(authenticate);

router.get("/educations", asyncHandler(educationController.getAll));

router.post("/educations", validate({ body: educationBodySchema }), asyncHandler(educationController.create));

router.put(
  "/educations/:id",
  validate({
    params: educationParamsSchema,
    body: educationBodySchema,
  }),
  asyncHandler(educationController.update),
);

router.delete("/educations/:id", validate({ params: educationParamsSchema }), asyncHandler(educationController.delete));

export default router;
