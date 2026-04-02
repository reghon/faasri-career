import { AppError } from "../../../errors/app-error";
import { applicantProfileRepository } from "./applicant_profile.repositories";
import { ApplicantProfilePayload } from "./applicant_profile.types";

const getOrCreate = async (userId: string) => {
  const existingProfile = await applicantProfileRepository.getByUserId(userId);

  if (existingProfile) {
    return existingProfile;
  }

  const createdProfile = await applicantProfileRepository.create(userId, userId);

  if (!createdProfile) {
    throw new AppError(500, "Failed to create applicant profile");
  }

  return createdProfile;
};

export const applicantProfileService = {
  async getOrCreateProfile(userId: string) {
    return getOrCreate(userId);
  },

  async updateProfile(userId: string, data: ApplicantProfilePayload) {
    await getOrCreate(userId);

    const updatedProfile = await applicantProfileRepository.update(userId, data, userId);

    if (!updatedProfile) {
      throw new AppError(500, "Failed to update applicant profile");
    }

    return updatedProfile;
  },
};
