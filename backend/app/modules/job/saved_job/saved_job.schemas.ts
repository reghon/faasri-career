import { z } from "zod";

export const savedJobBodySchema = z.object({
  userId: z.string().uuid("Invalid user id"),
  jobId: z.string().uuid("Invalid job id"),
  isActive: z.boolean(),
});

export const savedJobParamsSchema = z.object({
  id: z.string().uuid("Invalid saved job id"),
});

export type SavedJobBodyInput = z.infer<typeof savedJobBodySchema>;
export type SavedJobParamsInput = z.infer<typeof savedJobParamsSchema>;
