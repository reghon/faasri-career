import { applicantProfileRepository } from "../applicant_profile/applicant_profile.repositories";
import { educationRepository } from "./education.repositories";

export const educationService = {
  async getAll(userId: string) {
    const profile = await applicantProfileRepository.getByUserId(userId);
    if (!profile) throw new Error("Profile not found");
    return educationRepository.getByProfileId(profile.id);
  },

  async create(userId: string, data: any) {
    const profile = await applicantProfileRepository.getByUserId(userId);
    if (!profile) throw new Error("Profile not found");
    return educationRepository.create(profile.id, data, userId);
  },

  async update(userId: string, id: string, data: any) {
    const profile = await applicantProfileRepository.getByUserId(userId);
    if (!profile) throw new Error("Profile not found");
    const result = await educationRepository.update(id, profile.id, data);
    if (!result) throw new Error("Education not found");
    return result;
  },

  async delete(userId: string, id: string) {
    const profile = await applicantProfileRepository.getByUserId(userId);
    if (!profile) throw new Error("Profile not found");
    await educationRepository.delete(id, profile.id);
  },
};
