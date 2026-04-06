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

export const jobLocationBodySchema = z.object({
  code: requiredTrimmedString(50, "Code"),
  name: requiredTrimmedString(100, "Name"),
  city: requiredTrimmedString(100, "City"),
  province: requiredTrimmedString(100, "Province"),
  country: requiredTrimmedString(100, "Country"),
  address: requiredTrimmedString(1000, "Address"),
  postalCode: requiredTrimmedString(20, "Postal code"),
  isActive: z.boolean(),
});

export const jobLocationParamsSchema = z.object({
  id: z.string().uuid("Invalid job location id"),
});

export type JobLocationBodyInput = z.infer<typeof jobLocationBodySchema>;
export type JobLocationParamsInput = z.infer<typeof jobLocationParamsSchema>;
