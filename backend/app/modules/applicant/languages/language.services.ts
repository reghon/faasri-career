import { AppError } from "../../../errors/app-error";
import { applicantProfileRepository } from "../applicant_profile/applicant_profile.repositories";
import { languageRepository } from "./language.repositories";
import { LanguagePayload } from "./language.types";

const getProfileOrThrow = async (userId: string) => {
  const profile = await applicantProfileRepository.getByUserId(userId);

  if (!profile) {
    throw new AppError(404, "Applicant profile not found");
  }

  return profile;
};

export const languageService = {
  async getAll(userId: string) {
    const profile = await getProfileOrThrow(userId);
    return languageRepository.getByProfileId(profile.id);
  },

  async create(userId: string, data: LanguagePayload) {
    const profile = await getProfileOrThrow(userId);

    const created = await languageRepository.create(profile.id, data, userId);

    if (!created) {
      throw new AppError(500, "Failed to create language");
    }

    return created;
  },

  async update(userId: string, languageId: string, data: LanguagePayload) {
    const profile = await getProfileOrThrow(userId);

    const existing = await languageRepository.getById(languageId, profile.id);

    if (!existing) {
      throw new AppError(404, "Language not found");
    }

    const updated = await languageRepository.update(languageId, profile.id, data, userId);

    if (!updated) {
      throw new AppError(500, "Failed to update language");
    }

    return updated;
  },

  async delete(userId: string, languageId: string) {
    const profile = await getProfileOrThrow(userId);

    const existing = await languageRepository.getById(languageId, profile.id);

    if (!existing) {
      throw new AppError(404, "Language not found");
    }

    const deleted = await languageRepository.softDelete(languageId, profile.id, userId);

    if (!deleted) {
      throw new AppError(500, "Failed to delete language");
    }
  },
};
