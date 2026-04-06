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

export const jobCategoryBodySchema = z.object({
  name: requiredTrimmedString(100, "Name"),
  code: requiredTrimmedString(50, "Code"),
  description: nullableTrimmedString(1000, "Description"),
  isActive: z.boolean(),
});

export const jobCategoryParamsSchema = z.object({
  id: z.string().uuid("Invalid job category id"),
});

export type JobCategoryBodyInput = z.infer<typeof jobCategoryBodySchema>;
export type JobCategoryParamsInput = z.infer<typeof jobCategoryParamsSchema>;
