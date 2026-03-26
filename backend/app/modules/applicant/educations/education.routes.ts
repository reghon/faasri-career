import { Router } from "express";
import { authenticate } from "../../../middlewares/auth.middleware";
import { educationController } from "./education.controllers";

const router: Router = Router();
router.use(authenticate);

router.get("/educations", educationController.getAll);
router.post("/educations", educationController.create);
router.put("/educations/:id", educationController.update);
router.delete("/educations/:id", educationController.delete);

export default router;
