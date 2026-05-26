import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { asyncHandler } from "../../utils/async-handler";
import { authController } from "./auth.controllers";
import {
  changeEmailConfirmBodySchema,
  changeEmailRequestBodySchema,
  changePasswordBodySchema,
  forgotPasswordConfirmBodySchema,
  forgotPasswordRequestBodySchema,
  loginBodySchema,
  registerBodySchema,
  verifyForgotPasswordOtpBodySchema,
  verifyOtpBodySchema,
} from "./auth.schemas";

const router: Router = Router();
router.post("/forgot-password/verify-otp", validate({ body: verifyForgotPasswordOtpBodySchema }), asyncHandler(authController.verifyForgotPasswordOtp));

router.post("/forgot-password/request", validate({ body: forgotPasswordRequestBodySchema }), asyncHandler(authController.requestForgotPassword));

router.post("/forgot-password/confirm", validate({ body: forgotPasswordConfirmBodySchema }), asyncHandler(authController.confirmForgotPassword));

router.post("/register", validate({ body: registerBodySchema }), asyncHandler(authController.register));

router.post("/verify-otp", validate({ body: verifyOtpBodySchema }), asyncHandler(authController.verifyOtp));

router.post("/login", validate({ body: loginBodySchema }), asyncHandler(authController.login));

router.post("/logout", asyncHandler(authController.logout));

router.post("/refresh", asyncHandler(authController.refresh));

router.get("/me", authenticate, asyncHandler(authController.me));

router.post("/change-email/request", authenticate, validate({ body: changeEmailRequestBodySchema }), asyncHandler(authController.requestChangeEmail));

router.post("/change-email/confirm", authenticate, validate({ body: changeEmailConfirmBodySchema }), asyncHandler(authController.confirmChangeEmail));

router.post("/change-password", authenticate, validate({ body: changePasswordBodySchema }), asyncHandler(authController.changePassword));

export default router;
