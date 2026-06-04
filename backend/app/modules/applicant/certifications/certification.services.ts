import { AppError } from "../../../errors/app-error";
import { applicantProfileRepository } from "../applicant_profile/applicant_profile.repositories";
import { certificationRepository } from "./certification.repositories";
import { CertificationPayload } from "./certification.types";

const getProfileOrThrow = async (userId: string) => {
  const profile = await applicantProfileRepository.getByUserId(userId);

  if (!profile) {
    throw new AppError(404, "Profil pelamar tidak ditemukan");
  }

  return profile;
};

export const certificationService = {
  async getAll(userId: string) {
    const profile = await getProfileOrThrow(userId);
    return certificationRepository.getByProfileId(profile.id);
  },

  async create(userId: string, data: CertificationPayload) {
    const profile = await getProfileOrThrow(userId);

    const created = await certificationRepository.create(profile.id, data, userId);

    if (!created) {
      throw new AppError(500, "Gagal membuat sertifikasi");
    }

    return created;
  },

  async update(userId: string, certificationId: string, data: CertificationPayload) {
    const profile = await getProfileOrThrow(userId);

    const existing = await certificationRepository.getById(certificationId, profile.id);

    if (!existing) {
      throw new AppError(404, "Sertifikasi tidak ditemukan");
    }

    const updated = await certificationRepository.update(certificationId, profile.id, data, userId);

    if (!updated) {
      throw new AppError(500, "Gagal memperbarui sertifikasi");
    }

    return updated;
  },

  async delete(userId: string, certificationId: string) {
    const profile = await getProfileOrThrow(userId);

    const existing = await certificationRepository.getById(certificationId, profile.id);

    if (!existing) {
      throw new AppError(404, "Sertifikasi tidak ditemukan");
    }

    const deleted = await certificationRepository.softDelete(certificationId, profile.id, userId);

    if (!deleted) {
      throw new AppError(500, "Gagal menghapus sertifikasi");
    }
  },
};
