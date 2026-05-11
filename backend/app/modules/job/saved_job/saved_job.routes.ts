import { Router } from "express";
import { authenticate } from "../../../middlewares/auth.middleware";
import { validate } from "../../../middlewares/validate.middleware";
import { asyncHandler } from "../../../utils/async-handler";
import { savedJobController } from "./saved_job.controllers";
import { savedJobBodySchema, savedJobParamsSchema } from "./saved_job.schemas";

const router: Router = Router();

router.use(authenticate);

router.get("/", asyncHandler(savedJobController.getAll));
router.get("/:id", validate({ params: savedJobParamsSchema }), asyncHandler(savedJobController.getById));
router.post("/", validate({ body: savedJobBodySchema }), asyncHandler(savedJobController.create));
router.put("/:id", validate({ params: savedJobParamsSchema, body: savedJobBodySchema }), asyncHandler(savedJobController.update));
router.delete("/:id", validate({ params: savedJobParamsSchema }), asyncHandler(savedJobController.softDelete));


export default router;
