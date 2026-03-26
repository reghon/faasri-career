import { applicantProfileRepository } from "../applicant_profile/applicant_profile.repositories";
import { workExperienceRepository } from "./work_experience.repositories";

export const workExperienceService = {
  async getAll(userId: string) {
    const profile = await applicantProfileRepository.getByUserId(userId);
    if (!profile) throw new Error("Profile not found");
    return workExperienceRepository.getByProfileId(profile.id);
  },

  async create(userId: string, data: any) {
    const profile = await applicantProfileRepository.getByUserId(userId);
    if (!profile) throw new Error("Profile not found");
    return workExperienceRepository.create(profile.id, data, userId);
  },

  async update(userId: string, id: string, data: any) {
    const profile = await applicantProfileRepository.getByUserId(userId);
    if (!profile) throw new Error("Profile not found");
    const result = await workExperienceRepository.update(id, profile.id, data);
    if (!result) throw new Error("Work experience not found");
    return result;
  },

  async delete(userId: string, id: string) {
    const profile = await applicantProfileRepository.getByUserId(userId);
    if (!profile) throw new Error("Profile not found");
    await workExperienceRepository.delete(id, profile.id);
  },
};
