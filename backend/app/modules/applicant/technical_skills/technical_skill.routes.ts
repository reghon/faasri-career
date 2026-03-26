import { Router } from "express";
import { authenticate } from "../../../middlewares/auth.middleware";
import { technicalSkillController } from "./technical_skill.controllers";

const router: Router = Router();
router.use(authenticate);

router.get("/technical-skills", technicalSkillController.getAll);
router.post("/technical-skills", technicalSkillController.create);
router.delete("/technical-skills/:id", technicalSkillController.delete);

export default router;