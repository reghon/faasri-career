import { Router } from "express";
import { authenticate } from "../../../middlewares/auth.middleware";
import { validate } from "../../../middlewares/validate.middleware";
import { asyncHandler } from "../../../utils/async-handler";
import { moduleController } from "./module.controllers";
import { moduleBodySchema, moduleParamsSchema } from "./module.schemas";

const router: Router = Router();

router.use(authenticate);

router.get("/", asyncHandler(moduleController.getAll));

router.post("/", validate({ body: moduleBodySchema }), asyncHandler(moduleController.create));

router.put("/:id", validate({ params: moduleParamsSchema, body: moduleBodySchema }), asyncHandler(moduleController.update));

router.delete("/:id", validate({ params: moduleParamsSchema }), asyncHandler(moduleController.delete));

export default router;
