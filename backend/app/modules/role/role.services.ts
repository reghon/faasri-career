import { AppError } from "../../errors/app-error";
import { roleRepository } from "./role.repositories";
import { RolePayload } from "./role.types";

export const roleService = {
  async getAll() {
    return roleRepository.getAll();
  },

  async getAllDeleted() {
    return roleRepository.getAllDeleted();
  },

  async getById(id: string) {
    const role = await roleRepository.getById(id);

    if (!role) {
      throw new AppError(404, "Role not found");
    }

    return role;
  },

  async create(data: RolePayload, actorId: string) {
    const existingByName = await roleRepository.getByName(data.name);
    if (existingByName) {
      throw new AppError(409, "Role name already exists");
    }

    const existingByCode = await roleRepository.getByCode(data.code);
    if (existingByCode) {
      throw new AppError(409, "Role code already exists");
    }

    const created = await roleRepository.create(data, actorId);

    if (!created) {
      throw new AppError(500, "Failed to create role");
    }

    return created;
  },

  async update(id: string, data: RolePayload, actorId: string) {
    const existing = await roleRepository.getById(id);
    if (!existing) {
      throw new AppError(404, "Role not found");
    }

    const duplicateName = await roleRepository.getByName(data.name);
    if (duplicateName && duplicateName.id !== id) {
      throw new AppError(409, "Role name already exists");
    }

    const duplicateCode = await roleRepository.getByCode(data.code);
    if (duplicateCode && duplicateCode.id !== id) {
      throw new AppError(409, "Role code already exists");
    }

    const updated = await roleRepository.update(id, data, actorId);

    if (!updated) {
      throw new AppError(500, "Failed to update role");
    }

    return updated;
  },

  async restore(id: string, actorId: string) {
    const existing = await roleRepository.getSoftDeletedById(id);
    if (!existing) {
      throw new AppError(404, "Role not found");
    }

    const restoredRole = await roleRepository.restore(id, actorId);
    if (!restoredRole) {
      throw new AppError(500, "Failed to restore role");
    }

    return restoredRole;
  },

  async softDelete(id: string, actorId: string) {
    const existing = await roleRepository.getById(id);
    if (!existing) {
      throw new AppError(404, "Role not found");
    }

    const usageCount = await roleRepository.countRoleUsage(id);
    if (usageCount > 0) {
      throw new AppError(400, "Cannot delete role that is currently in use");
    }

    const deleted = await roleRepository.softDelete(id, actorId);

    if (!deleted) {
      throw new AppError(500, "Failed to delete role");
    }

    return deleted;
  },

  async hardDelete(id: string) {
    const existing = await roleRepository.getSoftDeletedById(id);
    if (!existing) {
      throw new AppError(404, "Role not found");
    }

    const deleted = await roleRepository.hardDelete(id);

    if (!deleted) {
      throw new AppError(500, "Failed to permanent delete role");
    }

    return deleted;
  },
};
