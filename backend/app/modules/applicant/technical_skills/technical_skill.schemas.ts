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

export const technicalSkillBodySchema = z.object({
  skillName: nullableTrimmedString(255, "Skill name"),
});

export const technicalSkillParamsSchema = z.object({
  id: z.string().uuid("Invalid technical skill id"),
});

export type TechnicalSkillBodyInput = z.infer<typeof technicalSkillBodySchema>;
export type TechnicalSkillParamsInput = z.infer<typeof technicalSkillParamsSchema>;
