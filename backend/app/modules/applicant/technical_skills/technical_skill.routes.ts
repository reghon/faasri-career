import { Router } from "express";
import { authenticate } from "../../../middlewares/auth.middleware";
import { validate } from "../../../middlewares/validate.middleware";
import { asyncHandler } from "../../../utils/async-handler";
import { technicalSkillController } from "./technical_skill.controllers";
import { technicalSkillBodySchema, technicalSkillParamsSchema } from "./technical_skill.schemas";

const router: Router = Router();

router.use(authenticate);

router.get("/technical-skills", asyncHandler(technicalSkillController.getAll));

router.post("/technical-skills", validate({ body: technicalSkillBodySchema }), asyncHandler(technicalSkillController.create));

router.delete("/technical-skills/:id", validate({ params: technicalSkillParamsSchema }), asyncHandler(technicalSkillController.delete));

export default router;
