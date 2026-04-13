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

export const applyLanguageBodySchema = z.object({
  language: nullableTrimmedString(255, "Language"),
  proficiency: nullableTrimmedString(255, "Proficiency"),
});

export const applyLanguageListSchema = z.array(applyLanguageBodySchema);

export type ApplyLanguageBodyInput = z.infer<typeof applyLanguageBodySchema>;
export type ApplyLanguageListInput = z.infer<typeof applyLanguageListSchema>;
