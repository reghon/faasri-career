import { AppError } from "../../../errors/app-error";
import { applicantProfileRepository } from "./applicant_profile.repositories";
import { ApplicantProfileAvatarPayload, ApplicantProfileCvPayload, ApplicantProfilePayload } from "./applicant_profile.types";

const getOrCreate = async (userId: string) => {
  const existingProfile = await applicantProfileRepository.getByUserId(userId);

  if (existingProfile) {
    return existingProfile;
  }

  const createdProfile = await applicantProfileRepository.create(userId, userId);

  if (!createdProfile) {
    throw new AppError(500, "Gagal membuat profil pelamar");
  }

  return createdProfile;
};

export const applicantProfileService = {
  async getAll() {
    return applicantProfileRepository.getAll();
  },

  async getOrCreateProfile(userId: string) {
    return getOrCreate(userId);
  },

  async getExistingProfile(userId: string) {
    return applicantProfileRepository.getByUserId(userId);
  },

  async getById(id: string) {
    const profile = await applicantProfileRepository.getById(id);

    if (!profile) {
      throw new AppError(404, "Profil pelamar tidak ditemukan");
    }

    return profile;
  },
  
  async updateProfile(userId: string, data: ApplicantProfilePayload) {
    await getOrCreate(userId);

    const updatedProfile = await applicantProfileRepository.update(userId, data, userId);

    if (!updatedProfile) {
      throw new AppError(500, "Gagal memperbarui profil pelamar");
    }

    return updatedProfile;
  },

  async updateAvatar(userId: string, data: ApplicantProfileAvatarPayload) {
    await getOrCreate(userId);

    const updatedProfile = await applicantProfileRepository.updateAvatar(userId, data, userId);

    if (!updatedProfile) {
      throw new AppError(500, "Gagal memperbarui avatar profil pelamar");
    }

    return updatedProfile;
  },

  async updateCv(userId: string, data: ApplicantProfileCvPayload) {
    await getOrCreate(userId);

    const updatedProfile = await applicantProfileRepository.updateCv(userId, data, userId);

    if (!updatedProfile) {
      throw new AppError(500, "Gagal memperbarui CV profil pelamar");
    }

    return updatedProfile;
  },

  async removeAvatar(userId: string) {
    await getOrCreate(userId);

    const updatedProfile = await applicantProfileRepository.removeAvatar(userId, userId);

    if (!updatedProfile) {
      throw new AppError(500, "Gagal menghapus avatar profil pelamar");
    }

    return updatedProfile;
  },

  async removeCv(userId: string) {
    await getOrCreate(userId);

    const updatedProfile = await applicantProfileRepository.removeCv(userId, userId);

    if (!updatedProfile) {
      throw new AppError(500, "Gagal menghapus CV profil pelamar");
    }

    return updatedProfile;
  },
};
