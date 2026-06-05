import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { asyncHandler } from "../../utils/async-handler";
import { authorizePermission } from "../authorization/authorization.middleware";
import { userController } from "./user.controllers";
import { userBodySchema, userParamsSchema, userUpdateBodySchema } from "./user.schemas";

const router: Router = Router();

router.use(authenticate);

router.get("/", authorizePermission("ADMIN_LIST"), asyncHandler(userController.getAll));
router.get("/management", authorizePermission("ADMIN_LIST"), asyncHandler(userController.getAllManagement));
router.get("/deleted", authorizePermission("ADMIN_LIST"), asyncHandler(userController.getAllDeleted));
router.get("/:id", authorizePermission("ADMIN_READ"), validate({ params: userParamsSchema }), asyncHandler(userController.getById));
router.post("/", authorizePermission("ADMIN_CREATE"), validate({ body: userBodySchema }), asyncHandler(userController.create));
router.put("/:id", authorizePermission("ADMIN_UPDATE"), validate({ params: userParamsSchema, body: userUpdateBodySchema }), asyncHandler(userController.update));
router.patch("/:id/restore", authorizePermission("ADMIN_UPDATE"), validate({ params: userParamsSchema }), asyncHandler(userController.restore));
router.delete("/:id", authorizePermission("ADMIN_DELETE"), validate({ params: userParamsSchema }), asyncHandler(userController.softDelete));
router.delete("/:id/permanent", authorizePermission("ADMIN_DELETE"), validate({ params: userParamsSchema }), asyncHandler(userController.hardDelete));

export default router;
