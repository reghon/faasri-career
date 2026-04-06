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

export const workModeBodySchema = z.object({
  code: requiredTrimmedString(50, "Code"),
  name: requiredTrimmedString(50, "Name"),
  isActive: z.boolean(),
});

export const workModeParamsSchema = z.object({
  id: z.string().uuid("Invalid work mode id"),
});

export type WorkModeBodyInput = z.infer<typeof workModeBodySchema>;
export type WorkModeParamsInput = z.infer<typeof workModeParamsSchema>;
