import { Router } from "express";
import { userController } from "./user.controllers";
import { authenticate } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { loginSchema, registerSchema } from "./user.validations";

const router: Router = Router();

router.post("/register", validate(registerSchema), userController.register);
router.post("/login", validate(loginSchema), userController.login);
router.post("/logout", userController.logout);
router.post("/refresh", userController.refresh);
router.get("/me", authenticate, userController.me);

export default router;
