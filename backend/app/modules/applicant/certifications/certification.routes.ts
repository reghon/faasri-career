import { Router } from "express";
import { authenticate } from "../../../middlewares/auth.middleware";
import { certificationController } from "./certification.controllers";

const router: Router = Router();
router.use(authenticate);

router.get("/certifications", certificationController.getAll);
router.post("/certifications", certificationController.create);
router.put("/certifications/:id", certificationController.update);
router.delete("/certifications/:id", certificationController.delete);

export default router;