import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { asyncHandler } from "../../utils/async-handler";
import { userController } from "./user.controllers";
import { userBodySchema, userParamsSchema, userUpdateBodySchema } from "./user.schemas";

const router: Router = Router();

router.get("/", authenticate, asyncHandler(userController.getAll));
router.get("/:id", authenticate, validate({ params: userParamsSchema }), asyncHandler(userController.getById));
router.post("/", authenticate, validate({ body: userBodySchema }), asyncHandler(userController.create));
router.put("/:id", authenticate, validate({ params: userParamsSchema, body: userUpdateBodySchema }), asyncHandler(userController.update));
router.delete("/:id", authenticate, validate({ params: userParamsSchema }), asyncHandler(userController.delete));

export default router;
