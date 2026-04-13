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

export const applyEducationBodySchema = z.object({
  level: nullableTrimmedString(255, "Level"),
  country: nullableTrimmedString(255, "Country"),
  institution: nullableTrimmedString(255, "Institution"),
  major: nullableTrimmedString(255, "Major"),
  isStillStudying: z.boolean(),
  startDay: nullableTrimmedString(10, "Start day"),
  startMonth: nullableTrimmedString(10, "Start month"),
  startYear: nullableTrimmedString(10, "Start year"),
  endDay: nullableTrimmedString(10, "End day"),
  endMonth: nullableTrimmedString(10, "End month"),
  endYear: nullableTrimmedString(10, "End year"),
  gpa: nullableTrimmedString(10, "GPA"),
  gpaScale: nullableTrimmedString(10, "GPA scale"),
});

export const applyEducationListSchema = z.array(applyEducationBodySchema);

export type ApplyEducationBodyInput = z.infer<typeof applyEducationBodySchema>;
export type ApplyEducationListInput = z.infer<typeof applyEducationListSchema>;
