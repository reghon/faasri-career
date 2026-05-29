import { Router } from "express";
import { authenticate } from "../../../../middlewares/auth.middleware";
import { validate } from "../../../../middlewares/validate.middleware";
import { asyncHandler } from "../../../../utils/async-handler";
import { authorizePermission } from "../../../authorization/authorization.middleware";
import { departmentController } from "./department.controllers";
import { departmentBodySchema, departmentParamsSchema } from "./department.schemas";

const router: Router = Router();

router.use(authenticate);

router.get("/", authorizePermission("MASTER_DATA_LIST"), asyncHandler(departmentController.getAll));
router.get("/deleted", authorizePermission("MASTER_DATA_LIST"), asyncHandler(departmentController.getAllDeleted));
router.get("/:id", authorizePermission("MASTER_DATA_READ"), validate({ params: departmentParamsSchema }), asyncHandler(departmentController.getById));
router.post("/", authorizePermission("MASTER_DATA_CREATE"), validate({ body: departmentBodySchema }), asyncHandler(departmentController.create));
router.put(
  "/:id",
  authorizePermission("MASTER_DATA_UPDATE"),
  validate({
    params: departmentParamsSchema,
    body: departmentBodySchema,
  }),
  asyncHandler(departmentController.update),
);
router.patch("/:id/restore", authorizePermission("MASTER_DATA_UPDATE"), validate({ params: departmentParamsSchema }), asyncHandler(departmentController.restore));
router.delete("/:id", authorizePermission("MASTER_DATA_DELETE"), validate({ params: departmentParamsSchema }), asyncHandler(departmentController.softDelete));
router.delete("/:id/permanent", authorizePermission("MASTER_DATA_DELETE"), validate({ params: departmentParamsSchema }), asyncHandler(departmentController.hardDelete));

export default router;
