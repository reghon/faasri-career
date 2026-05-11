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

export const createApplyBodySchema = z.object({
  jobId: z.string().uuid("Invalid job id"),

  personalInfo: z.unknown(),

  educationInfo: z.object({
    educations: z.array(z.unknown()),
  }),

  experienceInfo: z.object({
    hasExperience: z.boolean(),
    currentSalary: nullableTrimmedString(255, "Current salary"),
    technicalSkillsDescription: nullableTrimmedString(10000, "Technical skills description"),
    technicalSkills: z.array(z.unknown()),
    certifications: z.array(z.unknown()),
    languages: z.array(z.unknown()),
    experiences: z.array(z.unknown()),
  }),
});

export const updateApplyStatusBodySchema = z.object({
  statusId: z.string().uuid("Invalid apply status id"),
  notes: nullableTrimmedString(10000, "Notes"),
});

export const applyParamsSchema = z.object({
  id: z.string().uuid("Invalid apply id"),
});

export const applyJobParamsSchema = z.object({
  jobId: z.string().uuid("Invalid job id"),
});

export const applyDetailParamsSchema = z.object({
  applicantProfileId: z.string().uuid(),
  applyId: z.string().uuid(),
});

export type ApplyDetailParamsSchema = z.infer<typeof applyDetailParamsSchema>;
export type ApplyJobParamsInput = z.infer<typeof applyJobParamsSchema>;
export type CreateApplyBodyInput = z.infer<typeof createApplyBodySchema>;
export type UpdateApplyStatusBodyInput = z.infer<typeof updateApplyStatusBodySchema>;
export type ApplyParamsInput = z.infer<typeof applyParamsSchema>;
