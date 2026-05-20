import { z } from "zod";

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

export const applyProfileBodySchema = z.object({
  fullName: nullableTrimmedString(255, "Full name"),
  email: nullableTrimmedString(255, "Email"),
  birthPlace: nullableTrimmedString(255, "Birth place"),
  birthDate: nullableTrimmedString(255, "Birth date"),
  gender: nullableTrimmedString(20, "Gender"),
  phoneCode: nullableTrimmedString(10, "Phone code"),
  phone: nullableTrimmedString(20, "Phone"),
  address: nullableTrimmedString(255, "Address"),
  kelurahan: nullableTrimmedString(255, "Kelurahan"),
  kecamatan: nullableTrimmedString(255, "Kecamatan"),
  city: nullableTrimmedString(255, "City"),
  province: nullableTrimmedString(255, "Province"),
  postalCode: nullableTrimmedString(10, "Postal code"),
  linkedinUrl: nullableTrimmedString(255, "LinkedIn URL"),
  cvUrl: nullableTrimmedString(255, "CV URL"),
  cvFileName: nullableTrimmedString(255, "CV file name"),
});
export const applyProfileParamsSchema = z.object({
  applyId: z.string().uuid("Apply id must be a valid UUID"),
});
  
export type ApplyProfileParamsInput = z.infer<typeof applyProfileParamsSchema>;
export type ApplyProfileBodyInput = z.infer<typeof applyProfileBodySchema>;
