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

export const workExperienceBodySchema = z.object({
  company: nullableTrimmedString(255, "Company"),
  industry: nullableTrimmedString(255, "Industry"),
  position: nullableTrimmedString(255, "Position"),
  employmentType: nullableTrimmedString(255, "Employment type"),
  jobLevel: nullableTrimmedString(255, "Job level"),
  teamSize: nullableTrimmedString(50, "Team size"),
  startDay: nullableTrimmedString(10, "Start day"),
  startMonth: nullableTrimmedString(10, "Start month"),
  startYear: nullableTrimmedString(10, "Start year"),
  endDay: nullableTrimmedString(10, "End day"),
  endMonth: nullableTrimmedString(10, "End month"),
  endYear: nullableTrimmedString(10, "End year"),
  isCurrentJob: z.boolean(),
  responsibilities: nullableTrimmedString(10000, "Responsibilities"),
  leaveReason: nullableTrimmedString(255, "Leave reason"),
  referenceName: nullableTrimmedString(255, "Reference name"),
  referencePosition: nullableTrimmedString(255, "Reference position"),
  referencePhoneCode: nullableTrimmedString(10, "Reference phone code"),
  referencePhone: nullableTrimmedString(50, "Reference phone"),
  referenceEmail: nullableTrimmedString(255, "Reference email"),
});

export const workExperienceParamsSchema = z.object({
  id: z.string().uuid("Invalid work experience id"),
});

export type WorkExperienceBodyInput = z.infer<typeof workExperienceBodySchema>;
export type WorkExperienceParamsInput = z.infer<typeof workExperienceParamsSchema>;
