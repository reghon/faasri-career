import { AppError } from "../../errors/app-error";
import { applicantMasterRepository } from "./applicant_master.repositories";

export const applicantMasterService = {
  async getApplicantMaster(userId: string) {
    const result = await applicantMasterRepository.getByUserId(userId);

    if (!result) {
      throw new AppError(404, "User not found");
    }

    return result;
  },
};
