import { Router } from "express";
import { authenticate } from "../../../middlewares/auth.middleware";
import { validate } from "../../../middlewares/validate.middleware";
import { asyncHandler } from "../../../utils/async-handler";
import { managementProfileController } from "./management_profile.controllers";
import { managementProfileBodySchema, managementProfileParamsSchema } from "./management_profile.schemas";

const router: Router = Router();

router.use(authenticate);

router.get("/", asyncHandler(managementProfileController.getAll));
router.get("/:id", validate({ params: managementProfileParamsSchema }), asyncHandler(managementProfileController.getById));
router.post("/", validate({ body: managementProfileBodySchema }), asyncHandler(managementProfileController.create));
router.put("/:id", validate({ params: managementProfileParamsSchema, body: managementProfileBodySchema }), asyncHandler(managementProfileController.update));
router.delete("/:id", validate({ params: managementProfileParamsSchema }), asyncHandler(managementProfileController.delete));

export default router;
