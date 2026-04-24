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

export const permissionBodySchema = z.object({
  moduleId: z.string().uuid("Invalid module id"),
  permissionActionId: z.string().uuid("Invalid permission action id"),
  code: requiredTrimmedString(200, "Code"),
  name: requiredTrimmedString(150, "Name"),
  description: nullableTrimmedString(255, "Description"),
  isActive: z.boolean(),
});

export const permissionParamsSchema = z.object({
  id: z.string().uuid("Invalid permission id"),
});

export type PermissionBodyInput = z.infer<typeof permissionBodySchema>;
export type PermissionParamsInput = z.infer<typeof permissionParamsSchema>;
