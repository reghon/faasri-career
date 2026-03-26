import { Router } from "express";
import { authenticate } from "../../../middlewares/auth.middleware";
import { workExperienceController } from "./work_experience.controllers";

const router: Router = Router();
router.use(authenticate);

router.get("/work-experiences", workExperienceController.getAll);
router.post("/work-experiences", workExperienceController.create);
router.put("/work-experiences/:id", workExperienceController.update);
router.delete("/work-experiences/:id", workExperienceController.delete);

export default router;