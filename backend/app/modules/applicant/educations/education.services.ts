import { AppError } from "../../../errors/app-error";
import { applicantProfileRepository } from "../applicant_profile/applicant_profile.repositories";
import { educationRepository } from "./education.repositories";
import { EducationPayload } from "./education.types";

const getProfileOrThrow = async (userId: string) => {
  const profile = await applicantProfileRepository.getByUserId(userId);

  if (!profile) {
    throw new AppError(404, "Applicant profile not found");
  }

  return profile;
};

export const educationService = {
  async getAll(userId: string) {
    const profile = await getProfileOrThrow(userId);
    return educationRepository.getByProfileId(profile.id);
  },

  async create(userId: string, data: EducationPayload) {
    const profile = await getProfileOrThrow(userId);

    const created = await educationRepository.create(profile.id, data, userId);

    if (!created) {
      throw new AppError(500, "Failed to create education");
    }

    return created;
  },

  async update(userId: string, educationId: string, data: EducationPayload) {
    const profile = await getProfileOrThrow(userId);

    const existing = await educationRepository.getById(educationId, profile.id);

    if (!existing) {
      throw new AppError(404, "Education not found");
    }

    const updated = await educationRepository.update(educationId, profile.id, data, userId);

    if (!updated) {
      throw new AppError(500, "Failed to update education");
    }

    return updated;
  },

  async delete(userId: string, educationId: string) {
    const profile = await getProfileOrThrow(userId);

    const existing = await educationRepository.getById(educationId, profile.id);

    if (!existing) {
      throw new AppError(404, "Education not found");
    }

    const deleted = await educationRepository.softDelete(educationId, profile.id, userId);

    if (!deleted) {
      throw new AppError(500, "Failed to delete education");
    }
  },
};
