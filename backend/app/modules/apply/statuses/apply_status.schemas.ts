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

export const applyStatusBodySchema = z.object({
  code: requiredTrimmedString(100, "Code"),
  name: requiredTrimmedString(255, "Name"),
  description: nullableTrimmedString(1000, "Description"),
  sortOrder: z.number().int("Sort order must be an integer"),
  isDefault: z.boolean(),
  isFinal: z.boolean(),
  isActive: z.boolean(),
});

export const applyStatusParamsSchema = z.object({
  id: z.string().uuid("Invalid apply status id"),
});

export type ApplyStatusBodyInput = z.infer<typeof applyStatusBodySchema>;
export type ApplyStatusParamsInput = z.infer<typeof applyStatusParamsSchema>;
