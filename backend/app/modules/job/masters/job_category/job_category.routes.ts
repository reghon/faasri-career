import { Router } from "express";
import { authenticate } from "../../../../middlewares/auth.middleware";
import { validate } from "../../../../middlewares/validate.middleware";
import { asyncHandler } from "../../../../utils/async-handler";
import { jobCategoryController } from "./job_category.controllers";
import { jobCategoryBodySchema, jobCategoryParamsSchema } from "./job_category.schemas";

const router: Router = Router();

router.use(authenticate);

router.get("/", asyncHandler(jobCategoryController.getAll));
router.get("/:id", validate({ params: jobCategoryParamsSchema }), asyncHandler(jobCategoryController.getById));
router.post("/", validate({ body: jobCategoryBodySchema }), asyncHandler(jobCategoryController.create));
router.put("/:id", validate({ params: jobCategoryParamsSchema, body: jobCategoryBodySchema }), asyncHandler(jobCategoryController.update));
router.delete("/:id", validate({ params: jobCategoryParamsSchema }), asyncHandler(jobCategoryController.delete));

export default router;
