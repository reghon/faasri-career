import { Router } from "express";
import { authenticate } from "../../../../middlewares/auth.middleware";
import { validate } from "../../../../middlewares/validate.middleware";
import { asyncHandler } from "../../../../utils/async-handler";
import { authorizePermission } from "../../../authorization/authorization.middleware";
import { jobCategoryController } from "./job_category.controllers";
import { jobCategoryBodySchema, jobCategoryParamsSchema } from "./job_category.schemas";

const router: Router = Router();

router.use(authenticate);

router.get("/", authorizePermission("MASTER_DATA_LIST"), asyncHandler(jobCategoryController.getAll));

router.get("/deleted", authorizePermission("MASTER_DATA_LIST"), asyncHandler(jobCategoryController.getAllDeleted));

router.get("/:id", authorizePermission("MASTER_DATA_READ"), validate({ params: jobCategoryParamsSchema }), asyncHandler(jobCategoryController.getById));

router.post("/", authorizePermission("MASTER_DATA_CREATE"), validate({ body: jobCategoryBodySchema }), asyncHandler(jobCategoryController.create));

router.put(
  "/:id",
  authorizePermission("MASTER_DATA_UPDATE"),
  validate({
    params: jobCategoryParamsSchema,
    body: jobCategoryBodySchema,
  }),
  asyncHandler(jobCategoryController.update),
);

router.patch("/:id/restore", authorizePermission("MASTER_DATA_UPDATE"), validate({ params: jobCategoryParamsSchema }), asyncHandler(jobCategoryController.restore));

router.delete("/:id", authorizePermission("MASTER_DATA_DELETE"), validate({ params: jobCategoryParamsSchema }), asyncHandler(jobCategoryController.softDelete));

router.delete("/:id/permanent", authorizePermission("MASTER_DATA_DELETE"), validate({ params: jobCategoryParamsSchema }), asyncHandler(jobCategoryController.hardDelete));

export default router;
