import { applicantProfileRepository } from "./applicant_profile.repositories";

export const applicantProfileService = {
  async getOrCreateProfile(userId: string) {
    let profile = await applicantProfileRepository.getByUserId(userId);
    if (!profile) {
      await applicantProfileRepository.create(userId);
      profile = await applicantProfileRepository.getByUserId(userId);
    }
    return profile;
  },

  async updateProfile(userId: string, data: any) {
    let profile = await applicantProfileRepository.getByUserId(userId);
    if (!profile) await applicantProfileRepository.create(userId);
    return applicantProfileRepository.update(userId, data);
  },
};
