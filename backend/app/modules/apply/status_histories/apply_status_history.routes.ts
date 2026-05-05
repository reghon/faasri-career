import { Router } from "express";
import { authenticate } from "../../../middlewares/auth.middleware";
import { validate } from "../../../middlewares/validate.middleware";
import { asyncHandler } from "../../../utils/async-handler";
import { applyStatusHistoryController } from "./apply_status_history.controllers";
import { applyStatusHistoryApplyParamsSchema, applyStatusHistoryBodySchema, applyStatusHistoryParamsSchema, applyStatusHistoryUpdateBodySchema } from "./apply_status_history.schemas";

const router: Router = Router();

router.use(authenticate);

router.get("/", asyncHandler(applyStatusHistoryController.getAll));

router.get("/apply/:applyId", validate({ params: applyStatusHistoryApplyParamsSchema }), asyncHandler(applyStatusHistoryController.getByApplyId));

router.get("/:id", validate({ params: applyStatusHistoryParamsSchema }), asyncHandler(applyStatusHistoryController.getById));

router.post("/", validate({ body: applyStatusHistoryBodySchema }), asyncHandler(applyStatusHistoryController.create));

router.put(
  "/:id",
  validate({
    params: applyStatusHistoryParamsSchema,
    body: applyStatusHistoryUpdateBodySchema,
  }),
  asyncHandler(applyStatusHistoryController.update),
);

router.delete("/:id", validate({ params: applyStatusHistoryParamsSchema }), asyncHandler(applyStatusHistoryController.delete));

export default router;
