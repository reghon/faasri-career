import { z } from "zod";

const requiredTrimmedString = (max: number, fieldName: string) =>
  z
    .string()
    .transform((value) => value.trim())
    .refine((value) => value.length > 0, {
      message: `${fieldName} is required`,
    })
    .refine((value) => value.length <= max, {
      message: `${fieldName} must be at most ${max} characters`,
    });

export const managementProfileBodySchema = z.object({
  userId: z.string().uuid("Invalid user id"),
  roleId: z.string().uuid("Invalid role id"),
  fullName: requiredTrimmedString(255, "Full name"),
  isActive: z.boolean(),
});

export const updateMyManagementProfileSchema = z.object({
  fullName: requiredTrimmedString(255, "Full name"),
});

export const managementProfileParamsSchema = z.object({
  id: z.string().uuid("Invalid management profile id"),
});

export type ManagementProfileBodyInput = z.infer<typeof managementProfileBodySchema>;

export type UpdateMyManagementProfileInput = z.infer<typeof updateMyManagementProfileSchema>;

export type ManagementProfileParamsInput = z.infer<typeof managementProfileParamsSchema>;
