import { applicantProfileRepository } from "./applicant_profile.repositories";

const getOrCreate = async (userId: string) => {
  const profile = await applicantProfileRepository.getByUserId(userId);
  if (profile) return profile;

  return applicantProfileRepository.create(userId);
};

export const applicantProfileService = {
  async getOrCreateProfile(userId: string) {
    return getOrCreate(userId);
  },

  async updateProfile(userId: string, data: any) {
    await getOrCreate(userId);
    return applicantProfileRepository.update(userId, data);
  },
};
