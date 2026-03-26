import { Router } from "express";
import { authenticate } from "../../../middlewares/auth.middleware";
import { languageController } from "./language.controllers";

const router: Router = Router();
router.use(authenticate);

router.get("/languages", languageController.getAll);
router.post("/languages", languageController.create);
router.put("/languages/:id", languageController.update);
router.delete("/languages/:id", languageController.delete);

export default router;