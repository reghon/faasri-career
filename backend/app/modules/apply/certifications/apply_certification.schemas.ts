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

export const applyCertificationBodySchema = z.object({
  name: nullableTrimmedString(255, "Name"),
  issuer: nullableTrimmedString(255, "Issuer"),
  issuedDay: nullableTrimmedString(10, "Issued day"),
  issuedMonth: nullableTrimmedString(10, "Issued month"),
  issuedYear: nullableTrimmedString(10, "Issued year"),
  expiredDay: nullableTrimmedString(10, "Expired day"),
  expiredMonth: nullableTrimmedString(10, "Expired month"),
  expiredYear: nullableTrimmedString(10, "Expired year"),
});

export const applyCertificationListSchema = z.array(applyCertificationBodySchema);

export type ApplyCertificationBodyInput = z.infer<typeof applyCertificationBodySchema>;
export type ApplyCertificationListInput = z.infer<typeof applyCertificationListSchema>;
