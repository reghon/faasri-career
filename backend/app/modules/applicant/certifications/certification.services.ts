import { applicantProfileRepository } from "../applicant_profile/applicant_profile.repositories";
import { certificationRepository } from "./certification.repositories";

export const certificationService = {
  async getAll(userId: string) {
    const profile = await applicantProfileRepository.getByUserId(userId);
    if (!profile) throw new Error("Profile not found");
    return certificationRepository.getByProfileId(profile.id);
  },

  async create(userId: string, data: any) {
    const profile = await applicantProfileRepository.getByUserId(userId);
    if (!profile) throw new Error("Profile not found");
    return certificationRepository.create(profile.id, data, userId);
  },

  async update(userId: string, id: string, data: any) {
    const profile = await applicantProfileRepository.getByUserId(userId);
    if (!profile) throw new Error("Profile not found");
    const result = await certificationRepository.update(id, profile.id, data);
    if (!result) throw new Error("Certification not found");
    return result;
  },

  async delete(userId: string, id: string) {
    const profile = await applicantProfileRepository.getByUserId(userId);
    if (!profile) throw new Error("Profile not found");
    await certificationRepository.delete(id, profile.id);
  },
};
