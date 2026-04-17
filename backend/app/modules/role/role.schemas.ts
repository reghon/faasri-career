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

const nullableTrimmedString = (max: number, fieldName: string) =>
  z
    .union([z.string(), z.null()])
    .transform((value) => {
      if (value === null) return null;
      const trimmed = value.trim();
      return trimmed === "" ? null : trimmed;
    })
    .refine((value) => value === null || value.length <= max, {
      message: `${fieldName} must be at most ${max} characters`,
    });

export const roleBodySchema = z.object({
  code: requiredTrimmedString(100, "Code"),
  name: requiredTrimmedString(255, "Name"),
  description: nullableTrimmedString(255, "Description"),
  isSuperadmin: z.boolean(),
  isActive: z.boolean(),
});

export const roleParamsSchema = z.object({
  id: z.string().uuid("Invalid role id"),
});

export type RoleBodyInput = z.infer<typeof roleBodySchema>;
export type RoleParamsInput = z.infer<typeof roleParamsSchema>;
