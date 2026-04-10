import { Router } from "express";
import { authenticate } from "../../../middlewares/auth.middleware";
import { validate } from "../../../middlewares/validate.middleware";
import { asyncHandler } from "../../../utils/async-handler";
import { languageController } from "./language.controllers";
import { languageBodySchema, languageParamsSchema } from "./language.schemas";

const router: Router = Router();

router.use(authenticate);

router.get("/", asyncHandler(languageController.getAll));

router.post("/", validate({ body: languageBodySchema }), asyncHandler(languageController.create));

router.put(
  "/:id",
  validate({
    params: languageParamsSchema,
    body: languageBodySchema,
  }),
  asyncHandler(languageController.update),
);

router.delete("/:id", validate({ params: languageParamsSchema }), asyncHandler(languageController.delete));

export default router;
