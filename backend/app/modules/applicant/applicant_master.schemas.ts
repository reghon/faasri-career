import { z } from "zod";

export const applicantMasterParamsSchema = z.object({
  id: z.string().uuid("Invalid applicant id"),
});

export type ApplicantMasterParamsInput = z.infer<typeof applicantMasterParamsSchema>;
