import bcrypt from "bcryptjs";
import { config } from "../../configurations/env";
import { AppError } from "../../errors/app-error";
import { UserBodyInput, UserUpdateBodyInput } from "./user.schemas";
import { userRepository } from "./user.repositories";

export const userService = {
  async getAll() {
    return userRepository.getAll();
  },

  async getAllManagement() {
    return userRepository.getAllManagement();
  },

  async getAllDeleted() {
    return userRepository.getAllDeleted();
  },

  async getById(id: string) {
    const user = await userRepository.getById(id);

    if (!user) {
      throw new AppError(404, "User not found");
    }

    return user;
  },

  async create(data: UserBodyInput, actorId: string) {
    const existingUser = await userRepository.getByEmail(data.email);

    if (existingUser) {
      throw new AppError(409, "Email already registered");
    }

    const role = await userRepository.getRoleByName(data.roleName);

    if (!role) {
      throw new AppError(404, "Role not found");
    }

    const hashedPassword = await bcrypt.hash(data.password, config.bcrypt.saltRounds);

    const created = await userRepository.create({
      email: data.email,
      hashedPassword,
      roleId: role.id,
      isActive: data.isActive,
      actorId,
    });

    if (!created) {
      throw new AppError(500, "Failed to create user");
    }

    return created;
  },

  async update(id: string, data: UserUpdateBodyInput, actorId: string) {
    const existing = await userRepository.getById(id);

    if (!existing) {
      throw new AppError(404, "User not found");
    }

    const duplicateEmail = await userRepository.getByEmail(data.email);

    if (duplicateEmail && duplicateEmail.id !== id) {
      throw new AppError(409, "Email already registered");
    }

    const role = await userRepository.getRoleByName(data.roleName);

    if (!role) {
      throw new AppError(404, "Role not found");
    }

    const hashedPassword = data.password ? await bcrypt.hash(data.password, config.bcrypt.saltRounds) : null;

    const updated = await userRepository.update(id, {
      email: data.email,
      hashedPassword,
      roleId: role.id,
      isActive: data.isActive,
      actorId,
    });

    if (!updated) {
      throw new AppError(500, "Failed to update user");
    }

    return updated;
  },

  async restore(id: string, actorId: string) {
    const existing = await userRepository.getSoftDeletedById(id);
    if (!existing) {
      throw new AppError(404, "User not found");
    }

    const restoredUser = await userRepository.restore(id, actorId);
    if (!restoredUser) {
      throw new AppError(500, "Failed to restore user");
    }

    return restoredUser;
  },

  async softDelete(id: string, actorId: string) {
    const existing = await userRepository.getById(id);

    if (!existing) {
      throw new AppError(404, "User not found");
    }

    const deleted = await userRepository.softDelete(id, actorId);

    if (!deleted) {
      throw new AppError(500, "Failed to delete user");
    }

    return deleted;
  },

  async hardDelete(id: string) {
    const existing = await userRepository.getSoftDeletedById(id);

    if (!existing) {
      throw new AppError(404, "User not found");
    }

    const deleted = await userRepository.hardDelete(id);

    if (!deleted) {
      throw new AppError(500, "Failed to permanently delete user");
    }

    return deleted;
  },
};
