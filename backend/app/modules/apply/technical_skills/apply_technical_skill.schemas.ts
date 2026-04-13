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

export const applyTechnicalSkillBodySchema = z.object({
  skillName: nullableTrimmedString(255, "Skill name"),
});

export const applyTechnicalSkillListSchema = z.array(applyTechnicalSkillBodySchema);

export type ApplyTechnicalSkillBodyInput = z.infer<typeof applyTechnicalSkillBodySchema>;
export type ApplyTechnicalSkillListInput = z.infer<typeof applyTechnicalSkillListSchema>;
