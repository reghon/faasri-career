import { Router } from "express";
import { authenticate } from "../../../../middlewares/auth.middleware";
import { validate } from "../../../../middlewares/validate.middleware";
import { asyncHandler } from "../../../../utils/async-handler";
import { departmentController } from "./department.controllers";
import { departmentBodySchema, departmentParamsSchema } from "./department.schemas";

const router: Router = Router();

router.use(authenticate);

router.get("/", asyncHandler(departmentController.getAll));
router.get("/deleted", asyncHandler(departmentController.getAllDeleted));
router.get("/:id", validate({ params: departmentParamsSchema }), asyncHandler(departmentController.getById));
router.post("/", validate({ body: departmentBodySchema }), asyncHandler(departmentController.create));
router.put("/:id", validate({ params: departmentParamsSchema, body: departmentBodySchema }), asyncHandler(departmentController.update));
router.patch("/:id/restore", validate({ params: departmentParamsSchema}), asyncHandler(departmentController.restore));
router.delete("/:id", validate({ params: departmentParamsSchema }), asyncHandler(departmentController.softDelete));
router.delete("/:id/permanent", validate({ params: departmentParamsSchema }), asyncHandler(departmentController.hardDelete));

export default router;
