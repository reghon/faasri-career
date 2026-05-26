import { z } from "zod";

export const loginBodySchema = z.object({
  email: z.string().trim().min(1, "Email is required").email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

export const registerBodySchema = z.object({
  email: z.string().trim().min(1, "Email is required").email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters").regex(/[A-Z]/, "Password must contain at least one uppercase letter").regex(/[0-9]/, "Password must contain at least one number"),
});

export const verifyOtpBodySchema = z.object({
  email: z.string().trim().min(1, "Email is required").email("Invalid email format"),
  otp: z
    .string()
    .trim()
    .length(6, "OTP must be 6 digits")
    .regex(/^[0-9]{6}$/, "OTP must be 6 digits"),
});

export const changeEmailRequestBodySchema = z.object({
  newEmail: z.string().trim().min(1, "Email is required").email("Invalid email format"),
});

export const changeEmailConfirmBodySchema = z.object({
  newEmail: z.string().trim().min(1, "Email is required").email("Invalid email format"),
  otp: z
    .string()
    .trim()
    .length(6, "OTP must be 6 digits")
    .regex(/^[0-9]{6}$/, "OTP must be 6 digits"),
});

export const changePasswordBodySchema = z
  .object({
    oldPassword: z.string().min(1, "Old password is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters").regex(/[A-Z]/, "Password must contain at least one uppercase letter").regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string().min(1, "Confirm password is required"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const forgotPasswordRequestBodySchema = z.object({
  email: z.string().trim().min(1, "Email is required").email("Invalid email format"),
});

export const forgotPasswordConfirmBodySchema = z
  .object({
    email: z.string().trim().min(1, "Email is required").email("Invalid email format"),
    otp: z
      .string()
      .trim()
      .length(6, "OTP must be 6 digits")
      .regex(/^[0-9]{6}$/, "OTP must be 6 digits"),
    newPassword: z.string().min(8, "Password must be at least 8 characters").regex(/[A-Z]/, "Password must contain at least one uppercase letter").regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string().min(1, "Confirm password is required"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
  
export const verifyForgotPasswordOtpBodySchema = z.object({
  email: z.string().trim().min(1).email(),
  otp: z
    .string()
    .trim()
    .length(6)
    .regex(/^[0-9]{6}$/),
});

export type VerifyForgotPasswordOtpBodyInput = z.infer<typeof verifyForgotPasswordOtpBodySchema>;
export type ChangeEmailRequestBodyInput = z.infer<typeof changeEmailRequestBodySchema>;
export type ChangeEmailConfirmBodyInput = z.infer<typeof changeEmailConfirmBodySchema>;
export type ChangePasswordBodyInput = z.infer<typeof changePasswordBodySchema>;
export type ForgotPasswordRequestBodyInput = z.infer<typeof forgotPasswordRequestBodySchema>;
export type ForgotPasswordConfirmBodyInput = z.infer<typeof forgotPasswordConfirmBodySchema>;
export type LoginBodyInput = z.infer<typeof loginBodySchema>;
export type RegisterBodyInput = z.infer<typeof registerBodySchema>;
export type VerifyOtpBodyInput = z.infer<typeof verifyOtpBodySchema>;
