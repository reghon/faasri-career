import { z } from "zod";

const requiredTrimmedString = (max: number, fieldName: string) =>
  z
    .string()
    .transform((value) => value.trim())
    .refine((value) => value.length > 0, {
      message: `${fieldName} is required`,
    })
    .refine((value) => value.length <= max, {
      message: `${fieldName} must be at most ${max} characters`,
    });

const nullableTrimmedString = (max: number, fieldName: string) =>
  z
    .union([z.string(), z.null(), z.undefined()])
    .transform((value) => {
      if (value == null) {
        return null;
      }

      const trimmed = value.trim();
      return trimmed === "" ? null : trimmed;
    })
    .refine((value) => value === null || value.length <= max, {
      message: `${fieldName} must be at most ${max} characters`,
    });

export const jobBodySchema = z
  .object({
    categoryId: z.string().uuid("Invalid category id"),
    employmentTypeId: z.string().uuid("Invalid employment type id"),
    statusId: z.string().uuid("Invalid status id"),
    jobLocationId: z.string().uuid("Invalid job location id"),
    educationLevelId: z.string().uuid("Invalid education level id"),
    departmentId: z.string().uuid("Invalid department id"),
    workModeId: z.string().uuid("Invalid work mode id"),

    title: requiredTrimmedString(200, "Title"),
    slug: requiredTrimmedString(220, "Slug"),
    description: requiredTrimmedString(100000, "Description"),
    requirements: requiredTrimmedString(100000, "Requirements"),
    responsibilities: requiredTrimmedString(100000, "Responsibilities"),
    benefits: nullableTrimmedString(100000, "Benefits"),

    minSalary: z.coerce.number().min(0, "Minimum salary must be at least 0"),
    maxSalary: z.coerce.number().min(0, "Maximum salary must be at least 0"),

    currencyCode: requiredTrimmedString(10, "Currency code"),
    salaryType: requiredTrimmedString(20, "Salary type"),

    vacancyCount: z.coerce.number().int("Vacancy count must be an integer").min(1, "Vacancy count must be at least 1"),
    experienceMinYears: z.coerce.number().min(0, "Experience minimum years must be at least 0"),

    publishedAt: z.coerce.date().optional(),
    closeAt: z.coerce.date(),

    isActive: z.boolean().optional().default(true),
  })
  .refine((value) => value.maxSalary >= value.minSalary, {
    message: "Maximum salary must be greater than or equal to minimum salary",
    path: ["maxSalary"],
  });

export const jobParamsSchema = z.object({
  id: z.string().uuid("Invalid job id"),
});

export const jobQuerySchema = z.object({
  page: z.coerce.number().int("Page must be an integer").min(1, "Page must be at least 1").default(1),
  limit: z.coerce.number().int("Limit must be an integer").min(1, "Limit must be at least 1").max(100, "Limit must be at most 100").default(10),
});

export type JobBodyInput = z.infer<typeof jobBodySchema>;
export type JobParamsInput = z.infer<typeof jobParamsSchema>;
export type JobQueryInput = z.infer<typeof jobQuerySchema>;
