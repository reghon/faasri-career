import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { asyncHandler } from "../../utils/async-handler";
import { authController } from "./auth.controllers";
import { loginBodySchema, registerBodySchema, verifyOtpBodySchema } from "./auth.schemas";

const router: Router = Router();

router.post("/register", validate({ body: registerBodySchema }), asyncHandler(authController.register));

router.post("/verify-otp", validate({ body: verifyOtpBodySchema }), asyncHandler(authController.verifyOtp));

router.post("/login", validate({ body: loginBodySchema }), asyncHandler(authController.login));

router.post("/logout", asyncHandler(authController.logout));

router.post("/refresh", asyncHandler(authController.refresh));

router.get("/me", authenticate, asyncHandler(authController.me));

export default router;
