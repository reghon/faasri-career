import { Router } from "express";
import { authenticate } from "../../../middlewares/auth.middleware";
import { validate } from "../../../middlewares/validate.middleware";
import { asyncHandler } from "../../../utils/async-handler";
import { certificationController } from "./certification.controllers";
import { certificationBodySchema, certificationParamsSchema } from "./certification.schemas";

const router: Router = Router();

router.use(authenticate);

router.get("/certifications", asyncHandler(certificationController.getAll));

router.post("/certifications", validate({ body: certificationBodySchema }), asyncHandler(certificationController.create));

router.put(
  "/certifications/:id",
  validate({
    params: certificationParamsSchema,
    body: certificationBodySchema,
  }),
  asyncHandler(certificationController.update),
);

router.delete("/certifications/:id", validate({ params: certificationParamsSchema }), asyncHandler(certificationController.delete));

export default router;
