import { AppError } from "../../../errors/app-error";
import { applicantProfileRepository } from "../applicant_profile/applicant_profile.repositories";
import { technicalSkillRepository } from "./technical_skill.repositories";
import { TechnicalSkillPayload } from "./technical_skill.types";

const getProfileOrThrow = async (userId: string) => {
  const profile = await applicantProfileRepository.getByUserId(userId);

  if (!profile) {
    throw new AppError(404, "Applicant profile not found");
  }

  return profile;
};

export const technicalSkillService = {
  async getAll(userId: string) {
    const profile = await getProfileOrThrow(userId);
    return technicalSkillRepository.getByProfileId(profile.id);
  },

  async create(userId: string, data: TechnicalSkillPayload) {
    const profile = await getProfileOrThrow(userId);

    const created = await technicalSkillRepository.create(profile.id, data, userId);

    if (!created) {
      throw new AppError(500, "Failed to create technical skill");
    }

    return created;
  },

  async delete(userId: string, technicalSkillId: string) {
    const profile = await getProfileOrThrow(userId);

    const existing = await technicalSkillRepository.getById(technicalSkillId, profile.id);

    if (!existing) {
      throw new AppError(404, "Technical skill not found");
    }

    const deleted = await technicalSkillRepository.softDelete(technicalSkillId, profile.id, userId);

    if (!deleted) {
      throw new AppError(500, "Failed to delete technical skill");
    }
  },
};
