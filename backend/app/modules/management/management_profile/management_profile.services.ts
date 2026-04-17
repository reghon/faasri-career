import { AppError } from "../../../errors/app-error";
import { managementProfileRepository } from "./management_profile.repositories";
import { ManagementProfilePayload } from "./management_profile.types";

export const managementProfileService = {
  async getAll() {
    return managementProfileRepository.getAll();
  },

  async getById(id: string) {
    const managementProfile = await managementProfileRepository.getById(id);

    if (!managementProfile) {
      throw new AppError(404, "Management profile not found");
    }

    return managementProfile;
  },

  async create(data: ManagementProfilePayload, actorId: string) {
    const existingByUserId = await managementProfileRepository.getByUserId(data.userId);
    if (existingByUserId) {
      throw new AppError(409, "Management profile for this user already exists");
    }

    const created = await managementProfileRepository.create(data, actorId);

    if (!created) {
      throw new AppError(500, "Failed to create management profile");
    }

    return created;
  },

  async update(id: string, data: ManagementProfilePayload, actorId: string) {
    const existing = await managementProfileRepository.getById(id);
    if (!existing) {
      throw new AppError(404, "Management profile not found");
    }

    const duplicateUser = await managementProfileRepository.getByUserId(data.userId);
    if (duplicateUser && duplicateUser.id !== id) {
      throw new AppError(409, "Management profile for this user already exists");
    }

    const updated = await managementProfileRepository.update(id, data, actorId);

    if (!updated) {
      throw new AppError(500, "Failed to update management profile");
    }

    return updated;
  },

  async delete(id: string, actorId: string) {
    const existing = await managementProfileRepository.getById(id);
    if (!existing) {
      throw new AppError(404, "Management profile not found");
    }

    const deleted = await managementProfileRepository.softDelete(id, actorId);

    if (!deleted) {
      throw new AppError(500, "Failed to delete management profile");
    }

    return deleted;
  },
};
