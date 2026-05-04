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

export const applicantProfileBodySchema = z.object({
  fullName: nullableTrimmedString(255, "Full name"),
  email: nullableTrimmedString(255, "Email"),
  birthPlace: nullableTrimmedString(255, "Birth place"),
  birthDate: nullableTrimmedString(255, "Birth date"),
  gender: nullableTrimmedString(255, "Gender"),
  phoneCode: nullableTrimmedString(10, "Phone code"),
  phone: nullableTrimmedString(50, "Phone"),
  address: nullableTrimmedString(255, "Address"),
  kelurahan: nullableTrimmedString(255, "Kelurahan"),
  kecamatan: nullableTrimmedString(255, "Kecamatan"),
  city: nullableTrimmedString(255, "City"),
  province: nullableTrimmedString(255, "Province"),
  postalCode: nullableTrimmedString(10, "Postal code"),
  linkedinUrl: nullableTrimmedString(255, "LinkedIn URL"),
});
export const applicantProfileParamsSchema = z.object({
  id: z.string().uuid("Applicant profile id must be a valid UUID"),
});

export type ApplicantProfileParamsInput = z.infer<typeof applicantProfileParamsSchema>;
export type ApplicantProfileBodyInput = z.infer<typeof applicantProfileBodySchema>;
