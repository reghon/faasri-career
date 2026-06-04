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

export const applyQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().trim().optional().default(""),
  jobName: z.string().trim().optional().default(""),
  statusName: z.string().trim().optional().default(""),
  sortBy: z.enum(["full_name", "job_name", "status_name", "applied_at"]).optional().default("applied_at"),
  sortDirection: z.enum(["asc", "desc"]).optional().default("desc"),
});

export type ApplyDetailParamsSchema = z.infer<typeof applyDetailParamsSchema>;
export type ApplyQueryInput = z.infer<typeof applyQuerySchema>;
export type ApplyJobParamsInput = z.infer<typeof applyJobParamsSchema>;
export type CreateApplyBodyInput = z.infer<typeof createApplyBodySchema>;
export type UpdateApplyStatusBodyInput = z.infer<typeof updateApplyStatusBodySchema>;
export type ApplyParamsInput = z.infer<typeof applyParamsSchema>;
