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

export const applyStatusHistoryBodySchema = z.object({
  applyId: z.string().uuid("Invalid apply id"),
  applyStatusId: z.string().uuid("Invalid apply status id"),
  notes: nullableTrimmedString(2000, "Notes"),
});

export const applyStatusHistoryUpdateBodySchema = z.object({
  notes: nullableTrimmedString(2000, "Notes"),
});

export const applyStatusHistoryParamsSchema = z.object({
  id: z.string().uuid("Invalid apply status history id"),
});

export const applyStatusHistoryApplyParamsSchema = z.object({
  applyId: z.string().uuid("Invalid apply id"),
});

export type ApplyStatusHistoryBodyInput = z.infer<typeof applyStatusHistoryBodySchema>;
export type ApplyStatusHistoryUpdateBodyInput = z.infer<typeof applyStatusHistoryUpdateBodySchema>;
export type ApplyStatusHistoryParamsInput = z.infer<typeof applyStatusHistoryParamsSchema>;
export type ApplyStatusHistoryApplyParamsInput = z.infer<typeof applyStatusHistoryApplyParamsSchema>;
