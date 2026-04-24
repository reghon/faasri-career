import { z } from "zod";

const requiredTrimmedString = (max: number, fieldName: string) =>
  z
    .string()
    .transform((val) => val.trim())
    .refine((val) => val.length > 0, {
      message: `${fieldName} is required`,
    })
    .refine((val) => val.length <= max, {
      message: `${fieldName} must be at most ${max} characters`,
    });

const nullableTrimmedString = (max: number, fieldName: string) =>
  z
    .union([z.string(), z.null()])
    .transform((val) => {
      if (val === null) return null;
      const trimmed = val.trim();
      return trimmed === "" ? null : trimmed;
    })
    .refine((val) => val === null || val.length <= max, {
      message: `${fieldName} must be at most ${max} characters`,
    });

export const moduleBodySchema = z.object({
  code: requiredTrimmedString(100, "Code"),
  name: requiredTrimmedString(100, "Name"),
  description: nullableTrimmedString(255, "Description"),
  isActive: z.boolean(),
});

export const moduleParamsSchema = z.object({
  id: z.string().uuid("Invalid module id"),
});

export type ModuleBodyInput = z.infer<typeof moduleBodySchema>;
export type ModuleParamsInput = z.infer<typeof moduleParamsSchema>;
