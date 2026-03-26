import { applicantProfileRepository } from "../applicant_profile/applicant_profile.repositories";
import { languageRepository } from "./language.repositories";

export const languageService = {
  async getAll(userId: string) {
    const profile = await applicantProfileRepository.getByUserId(userId);
    if (!profile) throw new Error("Profile not found");
    return languageRepository.getByProfileId(profile.id);
  },

  async create(userId: string, data: any) {
    const profile = await applicantProfileRepository.getByUserId(userId);
    if (!profile) throw new Error("Profile not found");
    return languageRepository.create(profile.id, data, userId);
  },

  async update(userId: string, id: string, data: any) {
    const profile = await applicantProfileRepository.getByUserId(userId);
    if (!profile) throw new Error("Profile not found");
    const result = await languageRepository.update(id, profile.id, data);
    if (!result) throw new Error("Language not found");
    return result;
  },

  async delete(userId: string, id: string) {
    const profile = await applicantProfileRepository.getByUserId(userId);
    if (!profile) throw new Error("Profile not found");
    await languageRepository.delete(id, profile.id);
  },
};
