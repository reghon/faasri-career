import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { asyncHandler } from "../../utils/async-handler";
import { userController } from "./auth.controllers";
import { loginBodySchema, registerBodySchema, verifyOtpBodySchema } from "./auth.schemas";

const router: Router = Router();

router.post("/register", validate({ body: registerBodySchema }), asyncHandler(userController.register));

router.post("/verify-otp", validate({ body: verifyOtpBodySchema }), asyncHandler(userController.verifyOtp));

router.post("/login", validate({ body: loginBodySchema }), asyncHandler(userController.login));

router.post("/logout", asyncHandler(userController.logout));

router.post("/refresh", asyncHandler(userController.refresh));

router.get("/me", authenticate, asyncHandler(userController.me));

export default router;
