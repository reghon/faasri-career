import { z } from "zod";

export const jobApplyStatusBodySchema = z.object({
  jobId: z.string().uuid("Invalid job id"),
  applyStatusId: z.string().uuid("Invalid apply status id"),
  sortOrder: z.coerce.number().int().min(1),
  isDefault: z.boolean(),
  isFinal: z.boolean(),
  isActive: z.boolean(),
});

export const jobApplyStatusUpdateBodySchema = z.object({
  applyStatusId: z.string().uuid("Invalid apply status id"),
  sortOrder: z.coerce.number().int().min(1),
  isDefault: z.boolean(),
  isFinal: z.boolean(),
  isActive: z.boolean(),
});

export const jobApplyStatusParamsSchema = z.object({
  id: z.string().uuid("Invalid job apply status id"),
});

export const jobApplyStatusJobParamsSchema = z.object({
  jobId: z.string().uuid("Invalid job id"),
});

export const jobApplyStatusSyncBodySchema = z.object({
  items: z
    .array(
      z.object({
        applyStatusId: z.string().uuid("Invalid apply status id"),
        sortOrder: z.coerce.number().int().min(1),
        isDefault: z.boolean(),
        isFinal: z.boolean(),
        isActive: z.boolean(),
      }),
    )
    .min(1, "Job apply status flow is required"),
});

export type JobApplyStatusSyncBodyInput = z.infer<typeof jobApplyStatusSyncBodySchema>;
export type JobApplyStatusBodyInput = z.infer<typeof jobApplyStatusBodySchema>;
export type JobApplyStatusUpdateBodyInput = z.infer<typeof jobApplyStatusUpdateBodySchema>;
export type JobApplyStatusParamsInput = z.infer<typeof jobApplyStatusParamsSchema>;
export type JobApplyStatusJobParamsInput = z.infer<typeof jobApplyStatusJobParamsSchema>;
