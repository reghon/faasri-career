import { AppError } from "../../../errors/app-error";
import { managementProfileRepository } from "./management_profile.repositories";
import { ManagementProfilePayload } from "./management_profile.types";

export const managementProfileService = {
  async getAll() {
    return managementProfileRepository.getAll();
  },

  async getMe(userId: string) {
    const managementProfile = await managementProfileRepository.getByUserId(userId);

    if (!managementProfile) {
      throw new AppError(404, "Profil manajemen tidak ditemukan");
    }

    return managementProfile;
  },
  async updateMe(userId: string, fullName: string) {
    const existing = await managementProfileRepository.getByUserId(userId);

    if (!existing) {
      throw new AppError(404, "Profil manajemen tidak ditemukan");
    }

    const updated = await managementProfileRepository.updateMe(userId, fullName);

    if (!updated) {
      throw new AppError(500, "Gagal memperbarui profil");
    }

    return updated;
  },
  async getById(id: string) {
    const managementProfile = await managementProfileRepository.getById(id);

    if (!managementProfile) {
      throw new AppError(404, "Profil manajemen tidak ditemukan");
    }

    return managementProfile;
  },

  async create(data: ManagementProfilePayload, actorId: string) {
    const existingByUserId = await managementProfileRepository.getByUserId(data.userId);
    if (existingByUserId) {
      throw new AppError(409, "Profil manajemen untuk pengguna ini sudah ada");
    }

    const created = await managementProfileRepository.create(data, actorId);

    if (!created) {
      throw new AppError(500, "Gagal membuat profil manajemen");
    }

    return created;
  },

  async update(id: string, data: ManagementProfilePayload, actorId: string) {
    const existing = await managementProfileRepository.getById(id);
    if (!existing) {
      throw new AppError(404, "Profil manajemen tidak ditemukan");
    }

    const duplicateUser = await managementProfileRepository.getByUserId(data.userId);
    if (duplicateUser && duplicateUser.id !== id) {
      throw new AppError(409, "Profil manajemen untuk pengguna ini sudah ada");
    }

    const updated = await managementProfileRepository.update(id, data, actorId);

    if (!updated) {
      throw new AppError(500, "Gagal memperbarui profil manajemen");
    }

    return updated;
  },

  async delete(id: string, actorId: string) {
    const existing = await managementProfileRepository.getById(id);
    if (!existing) {
      throw new AppError(404, "Profil manajemen tidak ditemukan");
    }

    const deleted = await managementProfileRepository.softDelete(id, actorId);

    if (!deleted) {
      throw new AppError(500, "Gagal menghapus profil manajemen");
    }

    return deleted;
  },
};
