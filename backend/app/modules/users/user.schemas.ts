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

export type LoginBodyInput = z.infer<typeof loginBodySchema>;
export type RegisterBodyInput = z.infer<typeof registerBodySchema>;
export type VerifyOtpBodyInput = z.infer<typeof verifyOtpBodySchema>;
