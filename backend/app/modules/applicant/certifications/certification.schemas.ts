import { z } from "zod";

const nullableDatePartSchema = z.union([z.string().trim().max(10, "Must be at most 10 characters"), z.null()]).transform((value) => {
  if (value === null) {
    return null;
  }

  return value === "" ? null : value;
});

export const certificationBodySchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(255, "Name must be at most 255 characters"),

  issuer: z.string().trim().min(1, "Issuer is required").max(255, "Issuer must be at most 255 characters"),

  issuedDay: nullableDatePartSchema,
  issuedMonth: nullableDatePartSchema,
  issuedYear: nullableDatePartSchema,
  expiredDay: nullableDatePartSchema,
  expiredMonth: nullableDatePartSchema,
  expiredYear: nullableDatePartSchema,
});

export const certificationParamsSchema = z.object({
  id: z.string().uuid("Invalid certification id"),
});

export type CertificationBodyInput = z.infer<typeof certificationBodySchema>;
export type CertificationParamsInput = z.infer<typeof certificationParamsSchema>;
