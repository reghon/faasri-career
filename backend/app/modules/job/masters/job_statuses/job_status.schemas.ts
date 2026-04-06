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

export const jobStatusBodySchema = z.object({
  code: requiredTrimmedString(50, "Code"),
  name: requiredTrimmedString(100, "Name"),
  description: nullableTrimmedString(1000, "Description"),
  isActive: z.boolean(),
});

export const jobStatusParamsSchema = z.object({
  id: z.string().uuid("Invalid job status id"),
});

export type JobStatusBodyInput = z.infer<typeof jobStatusBodySchema>;
export type JobStatusParamsInput = z.infer<typeof jobStatusParamsSchema>;
