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
      if (value === null) {
        return null;
      }

      const trimmed = value.trim();
      return trimmed === "" ? null : trimmed;
    })
    .refine((value) => value === null || value.length <= max, {
      message: `${fieldName} must be at most ${max} characters`,
    });

export const permissionActionBodySchema = z.object({
  code: requiredTrimmedString(100, "Code"),
  name: requiredTrimmedString(100, "Name"),
  description: nullableTrimmedString(255, "Description"),
  isActive: z.boolean(),
});

export const permissionActionParamsSchema = z.object({
  id: z.string().uuid("Invalid permission action id"),
});

export type PermissionActionBodyInput = z.infer<typeof permissionActionBodySchema>;
export type PermissionActionParamsInput = z.infer<typeof permissionActionParamsSchema>;
