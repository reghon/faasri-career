import { applicantProfileRepository } from "../applicant_profile/applicant_profile.repositories";
import { technicalSkillRepository } from "./technical_skill.repositories";

export const technicalSkillService = {
  async getAll(userId: string) {
    const profile = await applicantProfileRepository.getByUserId(userId);
    if (!profile) throw new Error("Profile not found");
    return technicalSkillRepository.getByProfileId(profile.id);
  },

  async create(userId: string, data: any) {
    const profile = await applicantProfileRepository.getByUserId(userId);
    if (!profile) throw new Error("Profile not found");
    return technicalSkillRepository.create(profile.id, data, userId);
  },

  async delete(userId: string, id: string) {
    const profile = await applicantProfileRepository.getByUserId(userId);
    if (!profile) throw new Error("Profile not found");
    await technicalSkillRepository.delete(id, profile.id);
  },
};
