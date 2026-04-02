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

export const languageBodySchema = z.object({
  language: nullableTrimmedString(255, "Language"),
  proficiency: nullableTrimmedString(255, "Proficiency"),
});

export const languageParamsSchema = z.object({
  id: z.string().uuid("Invalid language id"),
});

export type LanguageBodyInput = z.infer<typeof languageBodySchema>;
export type LanguageParamsInput = z.infer<typeof languageParamsSchema>;
