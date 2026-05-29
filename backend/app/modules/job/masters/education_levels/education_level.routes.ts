import { Router } from "express";
import { authenticate } from "../../../../middlewares/auth.middleware";
import { validate } from "../../../../middlewares/validate.middleware";
import { asyncHandler } from "../../../../utils/async-handler";
import { authorizePermission } from "../../../authorization/authorization.middleware";
import { educationLevelController } from "./education_level.controllers";
import { educationLevelBodySchema, educationLevelParamsSchema } from "./education_level.schemas";

const router: Router = Router();

router.use(authenticate);

router.get("/", authorizePermission("MASTER_DATA_LIST"), asyncHandler(educationLevelController.getAll));
router.get("/deleted", authorizePermission("MASTER_DATA_LIST"), asyncHandler(educationLevelController.getAllDeleted));
router.get("/:id", authorizePermission("MASTER_DATA_READ"), validate({ params: educationLevelParamsSchema }), asyncHandler(educationLevelController.getById));
router.post("/", authorizePermission("MASTER_DATA_CREATE"), validate({ body: educationLevelBodySchema }), asyncHandler(educationLevelController.create));
router.patch(
  "/:id",
  authorizePermission("MASTER_DATA_UPDATE"),
  validate({
    params: educationLevelParamsSchema,
    body: educationLevelBodySchema,
  }),
  asyncHandler(educationLevelController.update),
);
router.patch("/:id/restore", authorizePermission("MASTER_DATA_UPDATE"), validate({ params: educationLevelParamsSchema }), asyncHandler(educationLevelController.restore));
router.delete("/:id", authorizePermission("MASTER_DATA_DELETE"), validate({ params: educationLevelParamsSchema }), asyncHandler(educationLevelController.softDelete));
router.delete("/:id/permanent", authorizePermission("MASTER_DATA_DELETE"), validate({ params: educationLevelParamsSchema }), asyncHandler(educationLevelController.hardDelete));

export default router;
