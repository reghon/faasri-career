import { AppError } from "../../../errors/app-error";
import { applicantProfileRepository } from "../applicant_profile/applicant_profile.repositories";
import { workExperienceRepository } from "./work_experience.repositories";
import { WorkExperiencePayload } from "./work_experience.types";

const getProfileOrThrow = async (userId: string) => {
  const profile = await applicantProfileRepository.getByUserId(userId);

  if (!profile) {
    throw new AppError(404, "Applicant profile not found");
  }

  return profile;
};

export const workExperienceService = {
  async getAll(userId: string) {
    const profile = await getProfileOrThrow(userId);
    return workExperienceRepository.getByProfileId(profile.id);
  },

  async create(userId: string, data: WorkExperiencePayload) {
    const profile = await getProfileOrThrow(userId);

    const created = await workExperienceRepository.create(profile.id, data, userId);

    if (!created) {
      throw new AppError(500, "Failed to create work experience");
    }

    return created;
  },

  async update(userId: string, workExperienceId: string, data: WorkExperiencePayload) {
    const profile = await getProfileOrThrow(userId);

    const existing = await workExperienceRepository.getById(workExperienceId, profile.id);

    if (!existing) {
      throw new AppError(404, "Work experience not found");
    }

    const updated = await workExperienceRepository.update(workExperienceId, profile.id, data, userId);

    if (!updated) {
      throw new AppError(500, "Failed to update work experience");
    }

    return updated;
  },

  async delete(userId: string, workExperienceId: string) {
    const profile = await getProfileOrThrow(userId);

    const existing = await workExperienceRepository.getById(workExperienceId, profile.id);

    if (!existing) {
      throw new AppError(404, "Work experience not found");
    }

    const deleted = await workExperienceRepository.softDelete(workExperienceId, profile.id, userId);

    if (!deleted) {
      throw new AppError(500, "Failed to delete work experience");
    }
  },
};
