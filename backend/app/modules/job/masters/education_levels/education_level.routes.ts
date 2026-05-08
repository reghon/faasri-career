import { Router } from "express";
import { authenticate } from "../../../../middlewares/auth.middleware";
import { validate } from "../../../../middlewares/validate.middleware";
import { asyncHandler } from "../../../../utils/async-handler";
import { educationLevelController } from "./education_level.controllers";
import { educationLevelBodySchema, educationLevelParamsSchema } from "./education_level.schemas";

const router: Router = Router();

router.use(authenticate);

router.get("/", asyncHandler(educationLevelController.getAll));
router.get("/deleted", asyncHandler(educationLevelController.getAllDeleted));
router.get("/:id", validate({ params: educationLevelParamsSchema }), asyncHandler(educationLevelController.getById));
router.post("/", validate({ body: educationLevelBodySchema }), asyncHandler(educationLevelController.create));
router.patch("/:id", validate({ params: educationLevelParamsSchema, body: educationLevelBodySchema }), asyncHandler(educationLevelController.update));
router.patch("/:id/restore", validate({ params: educationLevelParamsSchema }), asyncHandler(educationLevelController.restore));
router.delete("/:id", validate({ params: educationLevelParamsSchema }), asyncHandler(educationLevelController.softDelete));
router.delete("/:id/permanent", validate({ params: educationLevelParamsSchema }), asyncHandler(educationLevelController.hardDelete));
export default router;
