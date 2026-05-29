import { Router } from "express";
import { authenticate } from "../../../middlewares/auth.middleware";
import { authorizePermission } from "../../authorization/authorization.middleware";
import { validate } from "../../../middlewares/validate.middleware";
import { asyncHandler } from "../../../utils/async-handler";
import { moduleController } from "./module.controllers";
import { moduleBodySchema, moduleParamsSchema } from "./module.schemas";

const router: Router = Router();

router.use(authenticate);

router.get("/", authorizePermission("ADMIN_LIST"), asyncHandler(moduleController.getAll));

router.post("/", authorizePermission("ADMIN_CREATE"), validate({ body: moduleBodySchema }), asyncHandler(moduleController.create));

router.put("/:id", authorizePermission("ADMIN_UPDATE"), validate({ params: moduleParamsSchema, body: moduleBodySchema }), asyncHandler(moduleController.update));

router.delete("/:id", authorizePermission("ADMIN_DELETE"), validate({ params: moduleParamsSchema }), asyncHandler(moduleController.delete));

export default router;
