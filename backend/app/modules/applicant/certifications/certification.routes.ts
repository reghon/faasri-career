import { Router } from "express";
import { authenticate } from "../../../middlewares/auth.middleware";
import { validate } from "../../../middlewares/validate.middleware";
import { asyncHandler } from "../../../utils/async-handler";
import { certificationController } from "./certification.controllers";
import { certificationBodySchema, certificationParamsSchema } from "./certification.schemas";

const router: Router = Router();

router.use(authenticate);

router.get("/", asyncHandler(certificationController.getAll));

router.post("/", validate({ body: certificationBodySchema }), asyncHandler(certificationController.create));

router.put(
  "/:id",
  validate({
    params: certificationParamsSchema,
    body: certificationBodySchema,
  }),
  asyncHandler(certificationController.update),
);

router.delete("/:id", validate({ params: certificationParamsSchema }), asyncHandler(certificationController.delete));

export default router;
